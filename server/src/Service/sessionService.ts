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
      .map((m) => ({
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
          content: `Answer questions using only the provided research paper context.

Rules:
- Base answers on the context.
- Do not invent information.
- If the answer is not stated, infer cautiously when reasonable.
- If no relevant information exists, say so clearly.
- If related information exists, explain what the paper discusses instead.
- When referring to context say "the research paper" instead of "context".
- Read the user's intent. If they seem satisfied or are just reacting rather than asking a question, acknowledge briefly and wait for their next question. Don't continue explaining unprompted.

Guidelines:
- Be conversational but accurate. Explain like you're helping a fellow student understand the paper.
- Use short sections or bullet points.
- Prefer clear explanations over long paragraphs.

For broad questions:
- Combine relevant information from multiple parts of the context.

Paper Type:
- Identify whether the paper is an experimental study or a review article when possible.

Scope:
- If the question is unrelated to the topics discussed in context, state that it is not related.
- If the answer is not in context but is closely related to topics discussed in context, answer using general knowledge.
`,
        },

        ...history,

        {
          role: "user",
          content: `the context provided to you is ${context}\n\n and the question is ${question}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.2,
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
