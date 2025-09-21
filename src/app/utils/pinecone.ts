import { Pinecone, RecordMetadata, ScoredPineconeRecord } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY environment variable is not set');
    }
    
    pinecone = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY 
    });

    try {
      // Try to create the index
      await pinecone.createIndexForModel({
        name: process.env.PINECONE_INDEX!,
        cloud: 'aws',
        region: 'us-east-1',
        embed: {
          model: 'llama-text-embed-v2',
          fieldMap: { text: 'chunk_text' },
        },
        waitUntilReady: true,
      });
    } catch (error: any) {
      // If the error is that the index already exists, that's fine
      if (error.message && error.message.includes('ALREADY_EXISTS')) {
        console.log(`Index ${process.env.PINECONE_INDEX} already exists, continuing...`);
      } else {
        // For any other error, rethrow it
        throw error;
      }
    }
  }
  return pinecone;
}

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async ( message: string, topK: number, namespace: string,): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = await getPineconeClient();

  if (!process.env.PINECONE_INDEX) {
    throw new Error('PINECONE_INDEX environment variable is not set');
  }

  // Get the Pinecone index and namespace
  const index = pinecone.index(process.env.PINECONE_INDEX).namespace(namespace);

  try {
    const response = await index.searchRecords({
      query: {
        topK,
        inputs: {
          text: message
        }
      }
    })

    return response.result.hits.map(item => ({ ...item, id: item._id })) || [];

  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
}

export { getMatchesFromEmbeddings }