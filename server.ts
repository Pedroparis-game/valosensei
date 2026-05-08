import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // HENRIK DEV API ENGINE (Unofficial but powerful)
  app.get("/api/player/:name/:tag", async (req, res) => {
    const { name, tag } = req.params;
    const apiKey = process.env.HENRIK_API_KEY;

    if (!apiKey || apiKey === "" || apiKey.includes("MY_") || apiKey === "undefined") {
      return res.status(400).json({ 
        error: "HENRIK_API_KEY não detectada nos Secrets. Por favor, certifique-se de que o nome da sua Secret é exatamente HENRIK_API_KEY." 
      });
    }

    try {
      // 1. Get Account Data (to get PUUID and region)
      const accountRes = await axios.get(
        `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        { headers: { "Authorization": apiKey } }
      );

      const { puuid, name: formalName, tag: formalTag, region } = accountRes.data.data;

      // 2. Get Match History (V3 filtered for Competitive)
      const matchRes = await axios.get(
        `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?filter=competitive&size=3`,
        { headers: { "Authorization": apiKey } }
      );

      const matches = matchRes.data.data;

      // 3. Format data for Frontend
      const recentMatches = matches.map((match: any) => {
        const player = match.players.all_players.find((p: any) => p.puuid === puuid);
        const stats = player.stats;
        
        return {
          id: match.metadata.matchid,
          map: match.metadata.map,
          agent: player.character,
          score: `${match.teams.red.rounds_won}-${match.teams.blue.rounds_won}`,
          outcome: player.team.toLowerCase() === (match.teams.red.has_won ? "red" : "blue") ? "Victory" : "Defeat",
          kda: `${stats.kills}/${stats.deaths}/${stats.assists}`,
          kdRatio: stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills,
          hsPercentage: Math.round((stats.headshots / (stats.headshots + stats.bodyshots + stats.legshots)) * 100),
          adr: Math.round(stats.damage / match.metadata.rounds_played),
          timestamp: new Date(match.metadata.game_start * 1000).toISOString()
        };
      });

      // Calculate overall stats from these matches
      const avgHs = recentMatches.reduce((acc: number, m: any) => acc + m.hsPercentage, 0) / recentMatches.length;

      res.json({
        name: formalName || name,
        tag: formalTag || tag,
        rank: matches[0]?.players.all_players.find((p: any) => p.puuid === puuid)?.currenttier_patched || "Sem Rank",
        overallHs: parseFloat(avgHs.toFixed(1)) || 0,
        overallWinRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m: any) => m.outcome === "Victory").length / recentMatches.length) * 100) : 0,
        recentMatches
      });

    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Henrik API Error JSON:", JSON.stringify(errorData || error.message, null, 2));
      
      const status = error.response?.status || 500;
      let message = "Erro ao conectar com a API do Henrik.";
      
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        message = errorData.errors.map((e: any) => e.message || JSON.stringify(e)).join(" | ");
      } else if (errorData?.message) {
        message = errorData.message;
      }
      
      res.status(status).json({ error: `Henrik API: ${message}` });
    }
  });

  // VITE MIDDLEWARE
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
