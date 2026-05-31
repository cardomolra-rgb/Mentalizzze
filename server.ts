import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const settingsPath = path.join(process.cwd(), "settings.json");

import crypto from "crypto";

interface Settings {
  emails: string[];
  adminPasswordHash?: string;
}

function getHash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readSettings(): Required<Settings> {
  const defaultHash = getHash("K7#mP2@x");
  let settings: Settings = {
    emails: ["cardomolra@gmail.com"],
    adminPasswordHash: defaultHash
  };
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, "utf-8");
      const parsed = JSON.parse(raw);
      settings = { ...settings, ...parsed };
    }
  } catch (e) {
    console.error("Erro ao ler settings.json, usando padrão:", e);
  }
  
  if (!settings.adminPasswordHash) {
    settings.adminPasswordHash = defaultHash;
  }
  
  return settings as Required<Settings>;
}

function writeSettings(settings: Settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao escrever settings.json:", e);
  }
}

// In-memory storage for leads (for demo purposes)
interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
  segmento: string;
  faturamento: string;
  regime: string;
  desafio: string;
  status: 'novo' | 'em_atendimento' | 'concluido' | 'descartado';
  data: string;
}

let leads: Lead[] = [];
const app = express();
app.use(express.json());

// API Routes
app.post("/api/leads", async (req, res) => {
  try {
    const newLeadData = {
      ...req.body,
      status: 'novo'
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    let finalLead = {
      id: Math.random().toString(36).substring(2, 11),
      ...newLeadData,
      data: new Date().toISOString()
    };

    if (supabaseUrl && supabaseKey) {
      // Send to Supabase
      const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(newLeadData)
      });
      if (!response.ok) {
        throw new Error(`Supabase insert error: ${response.statusText}`);
      }
      const result = await response.json();
      if (result && result.length > 0) {
        finalLead = result[0];
      }
    } else {
      // Local memory fallback
      leads.unshift(finalLead);
    }

    // Lead Notification Dispatcher
    await dispatchNotifications(finalLead);

    res.status(201).json({ success: true, lead: finalLead });
  } catch (error) {
    console.error("Erro ao processar lead:", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor" });
  }
});

// Session Token (resets on server restart for security)
const sessionToken = crypto.randomBytes(32).toString('hex');

// Authentication Middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Não autorizado" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== sessionToken) {
    return res.status(401).json({ success: false, error: "Token inválido ou expirado" });
  }
  next();
}

// Auth Routes
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== "mentalizecontabilidade@gmail.com") {
    return res.status(401).json({ success: false, error: "Usuário não autorizado. Apenas o e-mail mentalizecontabilidade@gmail.com possui acesso." });
  }
  const settings = readSettings();
  const hash = getHash(password);
  if (hash === settings.adminPasswordHash) {
    return res.json({ success: true, token: sessionToken });
  }
  return res.status(401).json({ success: false, error: "Senha incorreta" });
});

app.post("/api/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const settings = readSettings();
  const currentHash = getHash(currentPassword);
  if (currentHash !== settings.adminPasswordHash) {
    return res.status(400).json({ success: false, error: "Senha atual incorreta" });
  }
  
  // Save settings with updated hash
  settings.adminPasswordHash = getHash(newPassword);
  writeSettings(settings);
  res.json({ success: true });
});

app.get("/api/leads", requireAuth, async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.json(leads);
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&order=data.desc`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error("Erro ao buscar leads no Supabase:", e);
    res.status(500).json({ success: false, error: "Erro ao buscar leads" });
  }
});

app.patch("/api/leads/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error(`Supabase update error: ${response.statusText}`);
      }
      const result = await response.json();
      if (result && result.length > 0) {
        res.json({ success: true, lead: result[0] });
      } else {
        res.status(404).json({ success: false, error: "Lead não encontrado" });
      }
    } else {
      const leadIndex = leads.findIndex(l => l.id === id);
      if (leadIndex !== -1) {
        leads[leadIndex].status = status;
        res.json({ success: true, lead: leads[leadIndex] });
      } else {
        res.status(404).json({ success: false, error: "Lead não encontrado" });
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ success: false, error: "Erro ao atualizar status" });
  }
});

// Settings Routes
app.get("/api/settings", requireAuth, (req, res) => {
  const settings = readSettings();
  const { adminPasswordHash, ...publicSettings } = settings;
  res.json(publicSettings);
});

app.post("/api/settings", requireAuth, (req, res) => {
  const { emails } = req.body;
  if (!Array.isArray(emails)) {
    return res.status(400).json({ success: false, error: "Dados inválidos" });
  }
  
  const settings = readSettings();
  settings.emails = emails;
  writeSettings(settings);
  res.json({ success: true });
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

async function dispatchNotifications(lead: Lead) {
  const settings = readSettings();
  
  // 1. Email Notifications
  if (settings.emails.length > 0) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || "smtp.gmail.com";

    const subject = `🚀 Novo Lead: ${lead.nome} - ${lead.empresa}`;
    const emailHtml = `
      <h2>Novo Lead Recebido!</h2>
      <p><strong>Nome:</strong> ${lead.nome}</p>
      <p><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
      <p><strong>E-mail:</strong> ${lead.email}</p>
      <p><strong>Empresa:</strong> ${lead.empresa}</p>
      <p><strong>Segmento/Ramo:</strong> ${lead.segmento}</p>
      <p><strong>Faturamento Mensal:</strong> ${lead.faturamento}</p>
      <p><strong>Regime Tributário:</strong> ${lead.regime}</p>
      <p><strong>Principal Desafio:</strong> ${lead.desafio}</p>
      <p><strong>Data de Envio:</strong> ${new Date(lead.data).toLocaleString("pt-BR")}</p>
      <hr>
      <p><a href="http://localhost:3000/admin?search=${encodeURIComponent(lead.nome)}" target="_blank" style="background:#C9A84C;color:#0A1628;padding:10px 20px;text-decoration:none;font-weight:bold;border-radius:5px;display:inline-block;">Visualizar Lead Completo no Sistema</a></p>
    `;

    if (!user || !pass) {
      console.log("-----------------------------------------");
      console.log("NOTIFICAÇÕES DE EMAIL (SIMULADAS)");
      console.log(`Para: ${settings.emails.join(", ")}`);
      console.log(`Assunto: ${subject}`);
      console.log(`Mensagem: ${lead.nome} da empresa ${lead.empresa} solicitou um diagnóstico.`);
      console.log("-----------------------------------------");
    } else {
      const transporter = nodemailer.createTransport({
        host,
        port: 587,
        secure: false,
        auth: { user, pass },
      });

      const mailOptions = {
        from: `"Mentalizze Dashboard" <${user}>`,
        to: settings.emails.join(", "),
        subject,
        html: emailHtml,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de notificação enviado com sucesso para: ${settings.emails.join(", ")}`);
      } catch (error) {
        console.error("Erro ao enviar email de notificação:", error);
      }
    }
  }

}
