"use server"
import { NextResponse } from 'next/server';
import { load } from "cheerio";
import axios from "axios";

interface DiscoveredUrl {
  url: string;
  title?: string;
}

class UrlDiscoverer {
  async discoverUrls(baseUrl: string): Promise<DiscoveredUrl[]> {
    try {
      const html = await this.fetchPage(baseUrl);
      const urls = this.extractUrls(html, baseUrl);
      return urls;
    } catch (error) {
      console.error(`Failed to discover URLs from ${baseUrl}: ${error}`);
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

  private extractUrls(html: string, baseUrl: string): DiscoveredUrl[] {
    const $ = load(html);
    const discoveredUrls: DiscoveredUrl[] = [];
    const seenUrls = new Set<string>();

    // Extract all links
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      const title = $(element).text().trim();
      
      if (href) {
        try {
          // Convert relative URLs to absolute URLs
          const absoluteUrl = new URL(href, baseUrl).href;
          
          // Only include URLs from the same domain
          const baseDomain = new URL(baseUrl).hostname;
          const urlDomain = new URL(absoluteUrl).hostname;
          
          if (urlDomain === baseDomain && !seenUrls.has(absoluteUrl)) {
            seenUrls.add(absoluteUrl);
            discoveredUrls.push({
              url: absoluteUrl,
              title: title || undefined
            });
          }
        } catch (error) {
          // Skip invalid URLs
          console.warn(`Invalid URL: ${href}`);
        }
      }
    });

    // Remove duplicates and limit to reasonable number
    const uniqueUrls = discoveredUrls.filter((item, index, self) => 
      index === self.findIndex(t => t.url === item.url)
    );

    return uniqueUrls.slice(0, 50); // Limit to 50 URLs
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

    const discoverer = new UrlDiscoverer();
    const discoveredUrls = await discoverer.discoverUrls(url);
    
    return NextResponse.json({ 
      success: true, 
      urls: discoveredUrls.map(item => item.url)
    });
    
  } catch (error) {
    console.error("Error discovering URLs:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to discover URLs: ' + (error as Error).message 
    }, { status: 500 });
  }
} 