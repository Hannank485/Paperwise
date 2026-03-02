import OpenAI from "openai";
import fileModel from "../Model/fileModel";
import sessionModel from "../Model/sessionModel";
import { embedChunks } from "../utils/embedding";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { AppError } from "../app";
const openai = new OpenAI();
const sessionService = {
  // async create(userId: number) {
  //   const session = await sessionModel.create(userId);
  //   return session;
  // },

  async delete(userId: number, sessionId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (!session) {
      throw new AppError("Session does not exist", 404);
    }
    if (session?.userId !== userId) {
      throw new AppError("UNAUTHORISED", 403);
    }
    const result = await sessionModel.deleteSession(sessionId, userId);
    return result;
  },

  async messageQuestion(question: string, sessionId: number, userId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (!session) {
      throw new AppError("Session does not exist", 404);
    }
    if (session?.userId !== userId) {
      throw new AppError("UNAUTHORISED", 403);
    }
    const document = await fileModel.findDocument(sessionId);
    if (!document) {
      throw new AppError("NO DOCUMENT EXISTS", 500);
    }
    let context: string = "";

    if (document.isValid) {
      const embedding = (await embedChunks(question)).data[0].embedding.join(
        ",",
      );
      const questionString = `[${embedding}]`;
      const chunks = (await fileModel.getContext(
        document.id,
        questionString,
      )) as {
        text: string;
      }[];
      context = (chunks as { text: string }[]).map((c) => c.text).join("\n\n");
    } else {
      context = document.content.slice(0, 3000);
    }

    const messageHistory = await sessionModel.getMessageHistory(
      sessionId,
      userId,
    );
    await sessionModel.storeUserMessage(question, sessionId);
    const history: ChatCompletionMessageParam[] = (
      messageHistory?.messages ?? []
    )
      .slice(-4)
      .map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
    const keywords = [
      "review",
      "summary",
      "summarize",
      "overall",
      "main findings",
      "experiments",
      "paper about",
    ];
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Answer questions primarily using the provided research paper.

Core Rules:
- Base answers on the research paper whenever relevant.
- Do not invent findings or results that are not supported by the research paper.
- If the answer is partially covered, explain what the research paper says and fill small gaps with basic general knowledge when helpful.
- If the answer is not directly stated but can be reasonably inferred, explain the inference clearly.
- When referring to the source, say "the research paper".

Student-Friendly Style:
- Be conversational, clear, and helpful, like explaining the paper to a fellow student.
- Use short sections or bullet points.
- Prefer clear explanations over long paragraphs.
- Briefly define technical terms in simple language when needed.
- You have a warm, encouraging personality , you genuinely enjoy helping students understand complex research.

Personality & Short Messages:
- If the user sends a short acknowledgment such as "ok", "thanks", "good", "great", or similar short responses, reply briefly and warmly in a natural way.
- Keep these responses short and varied.
- Do not repeat the same acknowledgment response every time.

For broad questions:
- Combine relevant information from multiple parts of the research paper.

Paper Type:
- Identify whether the research paper appears to be an experimental study or a review article when possible.

Scope:
- If a question is slightly outside the research paper but closely related to its topic, provide a short general explanation and connect it back to the research paper when possible.
- If a question is completely unrelated to the research paper, state that it is not related.
`,
        },

        ...history,

        {
          role: "user",
          content: `the context provided to you is ${context}\n\n and the question is ${question}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.5,
    });

    const response = await sessionModel.storeAiMessage(
      aiResponse.choices[0].message.content ?? "No response Generated",
      sessionId,
    );
    return response;
  },
  async getAllSessions(userId: number) {
    const sessions = await sessionModel.getAllSessions(userId);

    return sessions;
  },
  async getSingleSession(sessionId: number, userId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (session?.userId !== userId) {
      throw new AppError("UNAUTHORISED", 403);
    }

    return session;
  },
};

export default sessionService;
