"use server"
import { NextResponse } from 'next/server';
import { load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import axios from "axios";
import md5 from 'md5';

interface Page {
  url: string;
  content: string;
}

function cleanText(text: string) {
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/[^\w\s:.$-•/]+/gi, ' ').replace(/\s+/g, ' ');
  text = text.trim();
  return text;
}

class SingleUrlCrawler {
  async crawl(url: string): Promise<Page> {
    try {
      const html = await this.fetchPage(url);
      return { url, content: this.parseHtml(html) };
    } catch (error) {
      console.error(`Failed to crawl ${url}: ${error}`);
      throw error;
    }
  }

  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${url}: HTTP status ${response.status}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${url}: ${error}`);
      throw error;
    }
  }

  private parseHtml(html: string): string {
    const $ = load(html);
    
    // Remove unwanted elements
    $("header").remove();
    $("footer").remove();
    $("nav").remove();
    $("script").remove();
    $("style").remove();
    $("noscript").remove();
    $("iframe").remove();
    $("img").remove();
    $("video").remove();
    $("audio").remove();
    
    // Remove links but keep text
    $("a").removeAttr("href");
    
    // Convert to markdown
    const markdown = NodeHtmlMarkdown.translate($.html());
    
    return markdown;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL is required' 
      }, { status: 400 });
    }

    const crawler = new SingleUrlCrawler();
    const page = await crawler.crawl(url);
    
    // Create document structure similar to the main crawler
    const document = {
      pageContent: cleanText(page.content),
      metadata: {
        url: page.url,
        text: cleanText(page.content),
        hash: md5(cleanText(page.content)),
        loc: {
          lines: {
            from: 1,
            to: 1
          }
        }
      }
    };

    return NextResponse.json({ 
      success: true, 
      documents: [document] 
    });
    
  } catch (error) {
    console.error("Error scraping single URL:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to scrape URL: ' + (error as Error).message 
    }, { status: 500 });
  }
} 