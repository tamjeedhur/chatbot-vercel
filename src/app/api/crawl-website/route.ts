// import { NextResponse } from "next/server";
// import { Crawler } from "./crawler";

// // export const runtime = "edge";

// export async function POST(req: Request) {
//   const { url } = await req.json();

//   try {
//     const crawler = new Crawler();
//     const scrapedData = await crawler.crawl(url);

//     return NextResponse.json({ success: true, scrapedData });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: "Failed crawling" });
//   }
// }
"use server"
import seed from './seed';
import { NextResponse } from 'next/server';
import fs from 'fs';

function cleanText(text:string) {
  // text = text.replace(/\\\[ \\\]/g, '.');

  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<\/?[^>]+(>|$)/g, '');

  // text = text.replace(/\\\[ \\\\ \\\]/g, ' […]') + '.';

  // Remove special characters and multiple spaces
  text = text.replace(/[^\w\s:.$-•/]+/gi, ' ').replace(/\s+/g, ' ');

   
  text = text.trim();

  return text;
}
// export const runtime = 'edge';

export async function POST(req: Request) {
  const { urls, options } = await req.json();

  try {
    // const documents = await seed(urls, 1, process.env.PINECONE_INDEX!, options);
    const documents = await seed(urls, process.env.PINECONE_INDEX!, options);
    
    const cleanedDocuments = documents.map((doc) => ({
      ...doc,
      pageContent: cleanText(doc.pageContent),
      metadata: {
        ...doc.metadata,
        url: cleanText(doc.metadata.url as string),
        text: cleanText(doc.metadata.text as string),
      },
    }));
    // const cleanedDocuments = documents.map((doc) => ({
    //   ...doc,
      
    //   pageContent: cleanText(doc.pageContent),
    //   metadata: {
    //     ...doc.metadata,
    //     text: cleanText(doc.metadata.text as string),
    //   },
      
    // }));
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const outputPath = 'src/app/api/scraped_data';
    
    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      console.log("outputPath: create directory", outputPath);
      fs.mkdirSync(outputPath, { recursive: true });
    }
    
    const filename = `${outputPath}/scraped_data_${timestamp}.json`;

    // const filename = `scraped_data_${timestamp}.json`;

    // Write the data to the JSON file
    fs.writeFileSync(filename, JSON.stringify(cleanedDocuments, null, 2));


    return NextResponse.json({ success: true, documents: cleanedDocuments });
    // return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json({ success: false, error: 'Failed crawling: ' + error });
  }
}

