import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithSensei(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Você é o "Sensei", um treinador de elite de Valorant focado em resultados imediatos.
Sua missão é dar conselhos táticos e mecânicos de forma EXTREMAMENTE OBJETIVA e CLARA.
Diretrizes:
1. Respostas curtas e diretas (máximo 3-4 frases ou uma lista de pontos).
2. Use terminologia técnica de Valorant corretamente.
3. Sem conversas fúteis: foque no que o jogador deve FAZER para ganhar a próxima partida.
4. Se o jogador divagar, traga-o de volta para o foco do treinamento.
5. Personalidade: Sério, pragmático e focado na disciplina.
Responda sempre em Português do Brasil.`;

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}
