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

  async messageQuestion(user: string, sessionId: number, userId: number) {
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
    if (document.isValid) {
      const embedding = (await embedChunks(user)).join(",");
      const questionString = `[${embedding}]`;
      let context: string = "";
      if (document.isValid) {
        const chunks = (await fileModel.getContext(
          document.id,
          questionString,
        )) as {
          text: string;
        }[];
        context = (chunks as { text: string }[])
          .map((c) => c.text)
          .join("\n\n");
      } else {
        context = document.content.slice(0, 3000);
      }

      const messageHistory = await sessionModel.getMessageHistory(
        sessionId,
        userId,
      );
      const history: ChatCompletionMessageParam[] = (
        messageHistory?.messages ?? []
      )
        .slice(-4)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      // const response = await openai.chat.completions.create({
      //   model: "gpt-5-mini",
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         "You are a Research Assistant, assist the user in understanding the research paper",
      //     },

      //     ...history,

      //     {
      //       role: "user",
      //       content: `the context provided to you is ${context}\n\n and the question is ${user}`,
      //     },
      //   ],
      // });
      const Tempresponse = "YO this is temp response";
      await sessionModel.message(user, Tempresponse, sessionId);

      return Tempresponse;
    }
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
