import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
const openai = new OpenAI();
import sessionModel from "../Model/sessionModel";
import fileModel from "../Model/fileModel";
import prisma from "../prismaClient";
import getAllEmbedded from "../utils/embedding";
import createChunk from "../utils/chunk";
import credibilityCheck from "../utils/credibilityCheck";

type embeddedChunkType = {
  chunk: string;
  embedding: string;
};

const fileService = {
  async upload(file: Express.Multer.File, sessionId: number, userId: number) {
    // verify ownership
    const session = await sessionModel.getSingleSession(sessionId);
    if (!session) {
      throw new Error("Session does not exist");
    }
    if (session?.userId !== userId) {
      throw new Error("UNAUTHORISED");
    }
    // Parse PDF
    async function parsePDF(data: Express.Multer.File["buffer"]) {
      const pdf = new PDFParse({ data: data });
      const result = await pdf.getText();
      await pdf.destroy();
      const text = result.text.replace(/\s+/g, " ");
      return text;
    }
    const content = await parsePDF(file.buffer);

    const words = content.split(/\s+/);
    // CHECK CREDIBILITY OF THE PDF
    const toneKeywords = [
      "kinda",
      "sort of",
      "super",
      "really",
      "stuff",
      "things",
      "basically",
      "literally",
    ];

    const credible: boolean = credibilityCheck(
      toneKeywords,
      words.length,
      content,
    );
    let embeddings: embeddedChunkType[] = [];
    if (credible) {
      const chunks = await createChunk(words);
      embeddings = await getAllEmbedded(chunks);
    }

    await prisma.$transaction(
      async (tx) => {
        // STORING DOCUMENT
        const document = await fileModel.createDocument(
          tx,
          content,
          session.id,
          credible,
        );
        if (credible) {
          for (const item of embeddings) {
            await fileModel.createEmbedding(
              tx,
              item.chunk,
              item.embedding,
              document.id,
            );
          }
        }
      },
      { timeout: 30000 },
    );
  },
};

export default fileService;
