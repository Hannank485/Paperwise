import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
import sessionModel from "../Model/sessionModel";
import fileModel from "../Model/fileModel";
import prisma from "../prismaClient";
import getAllEmbedded from "../utils/embedding";
import createChunk from "../utils/chunk";
import credibilityCheck from "../utils/credibilityCheck";
import { AppError } from "../app";
type embeddedChunkType = {
  chunk: string;
  embedding: string;
};

const fileService = {
  async upload(file: Express.Multer.File, userId: number) {
    // Parse PDF
    async function parsePDF(data: Express.Multer.File["buffer"]) {
      const pdf = new PDFParse({ data: data });
      const result = await pdf.getText();
      await pdf.destroy();
      const text = result.text.replace(/\s+/g, " ");
      return text;
    }
    const content = await parsePDF(file.buffer);
    // Create Session
    const session = await sessionModel.create(userId);
    if (!session) {
      throw new AppError("Session does not exist", 404);
    }
    const words = content.split(/\s+/);

    const credible: boolean = credibilityCheck(content);
    let embeddings: embeddedChunkType[] = [];
    if (credible) {
      const chunks = await createChunk(words);
      if (chunks === false) {
        return;
      }
      embeddings = await getAllEmbedded(chunks);
    }
    console.log(credible);
    const document = await prisma.$transaction(
      async (tx) => {
        // STORING DOCUMENT
        const document = await fileModel.createDocument(
          tx,
          content,
          session.id,
          credible,
          file.originalname,
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
        return document;
      },
      { timeout: 30000 },
    );
    return { session, isValid: document.isValid };
  },
};

export default fileService;
