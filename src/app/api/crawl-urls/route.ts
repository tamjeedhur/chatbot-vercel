import axios, { AxiosResponse } from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const scrapedUrls = [];
  try {
    const { url }: { url: string } = await req.json();

    const sitemapResponse = await axios.get(url);
    const sitemapXML = sitemapResponse.data;
    // Parse the sitemap XML to extract sub-sitemap URLs
    const $ = load(sitemapXML, { xmlMode: true });

    const sitemapUrls = $("sitemap loc")
      .map((index, element) => $(element).text())
      .get();

    const urls = $("url loc")
      .map((index, element) => $(element).text())
      .get();

    if (sitemapUrls.length > 0) {
      for (const sitemapUrl of sitemapUrls) {
        const subSitemapResponse = await axios.get(sitemapUrl);
        const subSitemapXML = subSitemapResponse.data;

        const $ = load(subSitemapXML, { xmlMode: true });
        const urls = $("url loc")
          .map((index, element) => $(element).text())
          .get();

        scrapedUrls.push(...urls);
      }
    }
    return NextResponse.json({ urls: [...urls, ...scrapedUrls] });
  } catch (error) {
    return NextResponse.json({ Error: error });
  }
}
