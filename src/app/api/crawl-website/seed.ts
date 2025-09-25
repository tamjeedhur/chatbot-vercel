import { Document, MarkdownTextSplitter, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import crypto from 'crypto';
import { getPineconeClient } from '../../utils/pinecone';
import { Crawler, Page } from './crawler';
import { truncateStringByBytes } from '../../utils/truncateString';
import { SeedOptions } from '@/types/interfaces';




type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter;

    async function seed(selectedUrls: string[], indexName: string, options: SeedOptions) {

try {
    // Initialize the Pinecone client
    const pinecone = await getPineconeClient();

    const splitter: DocumentSplitter = new MarkdownTextSplitter({});

    const documents = await new Crawler().crawl(selectedUrls).then((pages: Page[]) => 
    Promise.all(pages.map((page) => prepareDocument(page, splitter)))
  );

    // Pinecone index
    const index = pinecone && pinecone.Index(indexName);

    const records = documents.flat().map(doc => ({
      _id: doc.metadata.hash as string, // Placeholder vector, will be replaced by Pinecone's embedding
      chunk_text: doc.pageContent,
      text: doc.pageContent,
    }));

    await index.upsertRecords(records);

    return documents.flat();

} catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
}

async function prepareDocument(page: Page, splitter: DocumentSplitter): Promise<Document[]> {
  // Get the content of the page
  const pageContent = page.content;

  // Split the documents using the provided splitter
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        url: page.url,
        // Truncate the text to a maximum byte length
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  // Map over the documents and add a hash to their metadata
  return docs.map((doc: Document) => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        // Create a hash of the document content
        hash: crypto.createHash('md5').update(doc.pageContent).digest('hex'),
      },
    };
  });
}

export default seed;













// import { getEmbeddings } from '../../utils/embeddings';
// import { Document, MarkdownTextSplitter, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
// import { utils as PineconeUtils, Vector } from '@pinecone-database/pinecone';
// import crypto from 'crypto';
// import { getPineconeClient } from '../../utils/pinecone';
// import { Crawler, Page } from './crawler';
// import { truncateStringByBytes } from '../../utils/truncateString';

// const { chunkedUpsert, createIndexIfNotExists } = PineconeUtils;

// interface SeedOptions {
//   splittingMethod: string; 
//   chunkSize: number;
//   chunkOverlap: number;
// }

// type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter;

// async function seed(url: string, limit: number, indexName: string, options: SeedOptions) {
//   try {
//     // Initialize the Pinecone client
//     const pinecone = await getPineconeClient();

//     // Destructure the options object
//     const { chunkSize, chunkOverlap } = options;

//     // Create a new Crawler with depth 1 and maximum pages as limit
//     const crawler = new Crawler(1, limit || 1);

//     // Crawl the given URL and get the pages
//     const pages = (await crawler.crawl(url)) as Page[];

//     // console.log('this is console from pages >>>>>>>', pages);

//     // Choose the appropriate document splitter based on the splitting method
//     const splitter: DocumentSplitter = new MarkdownTextSplitter({});

//     // Prepare documents by splitting the pages
//     const documents = await Promise.all(pages.map((page) => prepareDocument(page, splitter)));

//     // Create Pinecone index if it does not exist
//     await createIndexIfNotExists(pinecone!, indexName, 1536);

//     // Pinecone index
//     const index = pinecone && pinecone.Index(indexName);

//     // Get the vector embeddings for the documents
//     const vectors = await Promise.all(documents.flat().map(embedDocument));

//     // Upsert vectors into the Pinecone index
//     await chunkedUpsert(index!, vectors, '', 10);

//     // Return the first document
//     return documents[0];
//   } catch (error) {
//     console.error('Error seeding:', error);
//     throw error;
//   }
// }

// async function embedDocument(doc: Document): Promise<Vector> {
//   try {
//     // Generate OpenAI embeddings for the document content
//     const embedding = await getEmbeddings(doc.pageContent);

//     // Create a hash of the document content
//     const hash = md5(doc.pageContent);

//     // Return the vector embedding object
//     return {
//       id: hash, // The ID of the vector is the hash of the document content
//       values: embedding, // The vector values are the OpenAI embeddings
//       metadata: {
//         // The metadata includes details about the document
//         chunk: doc.pageContent, // The chunk of text that the vector represents
//         text: doc.metadata.text as string, // The text of the document
//         url: doc.metadata.url as string, // The URL where the document was found
//         hash: doc.metadata.hash as string, // The hash of the document content
//       },
//     } as Vector;
//   } catch (error) {
//     console.log('Error embedding document: ', error);
//     throw error;
//   }
// }

// async function prepareDocument(page: Page, splitter: DocumentSplitter): Promise<Document[]> {
//   // Get the content of the page
//   const pageContent = page.content;

//   // Split the documents using the provided splitter
//   const docs = await splitter.splitDocuments([
//     new Document({
//       pageContent,
//       metadata: {
//         url: page.url,
//         // Truncate the text to a maximum byte length
//         text: truncateStringByBytes(pageContent, 36000),
//       },
//     }),
//   ]);

//   // Map over the documents and add a hash to their metadata
//   return docs.map((doc: Document) => {
//     return {
//       pageContent: doc.pageContent,
//       metadata: {
//         ...doc.metadata,
//         // Create a hash of the document content
//         hash: crypto.createHash('md5').update(doc.pageContent).digest('hex'),
//       },
//     };
//   });
// }

// export default seed;
