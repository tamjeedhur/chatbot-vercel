import { OpenAIApi, Configuration } from 'openai-edge';
import { OpenAIEmbeddings } from '@langchain/openai';
import { defaultEmbededDocument } from './utils';

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);

export async function getEmbeddings(input: string) {
  try {
    const embeddings = new OpenAIEmbeddings();

    /* Embed queries */
    const response = await embeddings.embedQuery(input.replace(/\n/g, ' '));

    // const response = await openai.createEmbedding({
    //   model: 'text-embedding-ada-002',
    //   input: input.replace(/\n/g, ' '),
    // });

    // const result = await response.json();
    // console.log(response);

    return response || defaultEmbededDocument as number[];
  } catch (e) {
    console.log('Error calling OpenAI embedding API: ', e);
    return defaultEmbededDocument;
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
