//   EMBEDDING
type embeddedChunkType = {
  chunk: string;
  embedding: string;
};
export async function embedChunks(chunk: string) {
  // TEST EMBEDDING
  const embedding = new Array(1536).fill(0);

  // OPEN AI EMBEDDING
  // const embedding = await openai.embeddings.create({
  //   model: "text-embedding-3-small",
  //   input: chunk,
  // });
  return embedding;
}
async function getAllEmbedded(chunks: string[]) {
  const embeddings: embeddedChunkType[] = [];
  for (const chunk of chunks) {
    const embedding = await embedChunks(chunk);
    // const vectorString = `[${embedding.data[0].embedding.join(",")}]`;
    const vectorString = `[${embedding.join(",")}]`;
    embeddings.push({
      chunk: chunk,
      embedding: vectorString,
    });
  }
  return embeddings;
}
export default getAllEmbedded;
