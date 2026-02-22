// CHUNKING
async function createChunk(word: string[], chunkLength: number = 500) {
  let chunks: string[] = [];
  for (let i = 0; i <= word.length; i += chunkLength) {
    const chunk = word.slice(i, i + chunkLength).join(" ");
    chunks.push(chunk);
  }
  return chunks;
}
export default createChunk;
