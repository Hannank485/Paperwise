import OpenAI from "openai";
import fileModel from "../Model/fileModel";
import sessionModel from "../Model/sessionModel";
import { embedChunks } from "../utils/embedding";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { response } from "express";

const openai = new OpenAI();
const sessionService = {
  // async create(userId: number) {
  //   const session = await sessionModel.create(userId);
  //   return session;
  // },

  async delete(userId: number, sessionId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (!session) {
      throw new Error("Session does not exist");
    }
    if (session?.userId !== userId) {
      throw new Error("UNAUTHORISED");
    }
    const result = await sessionModel.deleteSession(sessionId, userId);
    return result;
  },

  async messageQuestion(question: string, sessionId: number, userId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (!session) {
      throw new Error("Session does not exist");
    }
    if (session?.userId !== userId) {
      throw new Error("UNAUTHORISED");
    }
    const document = await fileModel.findDocument(sessionId);
    if (!document) {
      throw new Error("NO DOCUMENT UPLOADED");
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
          content: `You answer questions about a research paper using ONLY the provided context.

Rules:
- Base answers strictly on the context.
- Do NOT invent information.
- If the answer is not explicitly stated, infer cautiously from the context when reasonable. If no relevant information exists, say so clearly.
- If related information exists, explain what the paper discusses instead.
- When answering broad questions (such as summaries, reviews, or experimental results), extract and combine relevant information from multiple parts of the context.
- Be concise and factual.
- Organize answers into short sections or bullet points when possible.
- Prefer clear explanations over long paragraphs.
- Determine whether the paper appears to be an experimental study or a review article based on the context, and answer accordingly.
- When relevant information exists, present it directly. Avoid starting the answer by saying the information is not available unless nothing relevant is found.
If the question is unrelated to the paper, say that the context does not contain relevant information.
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
    console.log(context);
    return response;
  },
  async getAllSessions(userId: number) {
    const sessions = await sessionModel.getAllSessions(userId);

    return sessions;
  },
  async getSingleSession(sessionId: number, userId: number) {
    const session = await sessionModel.getSingleSession(sessionId);
    if (session?.userId !== userId) {
      throw new Error("UNAUTHORISED");
    }

    return session;
  },
};

export default sessionService;
