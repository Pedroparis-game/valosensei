import { GoogleGenAI } from "@google/genai";
import { PlayerStats, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const apiService = {
  async getPlayerStats(name: string, tag: string): Promise<PlayerStats> {
    try {
      const response = await fetch(`/api/player/${name.trim()}/${tag.trim()}`);
      
      if (!response.ok) {
        let serverError = "Falha na varredura tática. O perfil pode estar privado ou inacessível.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            serverError = errorData.error;
          }
        } catch (e) {
          // ignore json parse error
        }
        
        if (response.status === 404) {
          throw new Error("Agente não encontrado no banco de dados. Verifique o Nome#Tag.\nDetalhes: " + serverError);
        } else if (response.status === 429) {
          throw new Error("Sistemas sobrecarregados (Rate Limit). Aguarde um ciclo.\nDetalhes: " + serverError);
        } else {
          throw new Error(serverError);
        }
      }

      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido na rede neural");
    }
  }
};

export const geminiService = {
  async analyzeMatch(playerData: PlayerStats): Promise<AnalysisResult> {
    const prompt = `
        # INSTRUÇÃO DE SISTEMA (SYSTEM PROMPT) - VALOSENSEI

        ## 1. Seu Papel e Regra de Ouro
        Você é o ValoSensei, um analista de dados rigoroso e treinador de Valorant.
        **REGRA DE OURO ESTRITA:** Você deve basear 100% da sua análise EXCLUSIVAMENTE nos dados em formato JSON fornecidos na entrada do usuário. É terminantemente proibido inventar, deduzir ou presumir qualquer estatística, partida, arma, mapa ou taxa de vitória que não esteja explicitamente declarada no texto do JSON.

        ## 2. Processamento dos Dados
        - Leia os números fornecidos (KDA, Headshot %, Win Rate, First Bloods, ACS, etc.) exatamente como eles aparecem.
        - Se uma informação não estiver presente no JSON, você NÃO DEVE adivinhar.
        - Não alucine eventos específicos da partida.

        ## 3. Diretrizes de Análise Tática
        - Toda afirmação que você fizer sobre o desempenho do jogador deve ter uma raiz direta nos números fornecidos.
        - **Exemplo de abordagem correta:** "Seu Headshot rate global está em 14% de acordo com os dados, o que está abaixo da média para o seu elo. Isso sugere que..."

        ## 4. Estrutura de Resposta (Mapeada para JSON)
        Apesar de seguir a lógica abaixo, você DEVE retornar o resultado no formato JSON especificado.
        1. **Os Dados Dizem:** Refletido no resumo factual e estatísticas.
        2. **Diagnóstico Tático:** Refletido no campo 'coachVerdict' e 'insights'.
        3. **Plano de Treino:** Refletido no campo 'trainingPlan'.

        ## 5. Tratamento de Falhas e Dados Insuficientes
        Se o JSON recebido estiver vazio, apontar erros da API ou contiver apenas zeros, você deve preencher os campos do JSON com valores neutros e no 'coachVerdict' escrever exatamente:
        "Os dados fornecidos estão incompletos, inacessíveis ou o perfil é privado. Verifique sua conexão com o Tracker para que eu possa gerar uma análise com dados verídicos."

        DADOS DO JOGADOR:
        Riot ID: ${playerData.name}#${playerData.tag}
        Estatísticas das Partidas Recentes: ${JSON.stringify(playerData.recentMatches)}
        Média de Headshot: ${playerData.overallHs}%
        Média de WinRate: ${playerData.overallWinRate}%
        
        REGRAS DE NEGÓCIO DO APP:
        1. Analise KDA, ADR e HS% para determinar a qualidade da mira.
        2. Use o ADR (Average Damage per Round) para julgar o impacto real.
        3. O 'coachVerdict' deve conter o "Diagnóstico Tático" (o que os números significam na prática).
        4. O 'trainingPlan' deve focar na pior métrica identificada.
        5. RESPONDA APENAS UM JSON VÁLIDO.
        
        FORMATO ESPERADO:
        {
          "overallScore": number (0-100),
          "tacticalBreakdown": {
            "mira": { "label": "Mira", "value": 0-100, "average": 0-100, "description": "string" },
            "gameSense": { "label": "Game Sense", "value": 0-100, "average": 0-100, "description": "string" },
            "economia": { "label": "Economia", "value": 0-100, "average": 0-100, "description": "string" },
            "posicionamento": { "label": "Posicionamento", "value": 0-100, "average": 0-100, "description": "string" },
            "utilitarias": { "label": "Utilitárias", "value": 0-100, "average": 0-100, "description": "string" }
          },
          "mapMastery": [
            { "mapName": "string", "winRate": number, "bestAgent": "string", "tendency": "string" }
          ],
          "insights": [
             { "category": "mira" | "posicionamento" | "economia" | "utilitarias", "title": "string", "description": "string", "priority": "low" | "medium" | "high", "actionableStep": "string" }
          ],
          "trainingPlan": {
            "title": "string",
            "duration": "string (ex: 45 min)",
            "exercises": [
              { "name": "string", "mode": "The Range | Deathmatch | AimLabs", "focus": "string", "sets": "string" }
            ]
          },
          "coachVerdict": "string (Os Dados Dizem + Diagnóstico Tático)"
        }
      `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("IA retornou resposta vazia");
      
      const analysis = JSON.parse(responseText);
      return {
        ...analysis,
        id: crypto.randomUUID(),
        userId: "demo-user",
        riotId: `${playerData.name}#${playerData.tag}`,
        createdAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("Gemini Analysis Error:", error);
      throw new Error(error.message || "Falha na análise da IA");
    }
  }
};
