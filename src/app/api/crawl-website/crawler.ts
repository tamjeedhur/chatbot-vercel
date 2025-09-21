// import cheerio from "cheerio";
// import { NodeHtmlMarkdown } from "node-html-markdown";

// interface Page {
//   url: string;
//   content: string;
// }

// class Crawler {
//   private seen = new Set<string>();
//   private pages: Page[] = [];
//   private queue: { url: string; depth: number }[] = [];

//   constructor(
//     private maxDepth = 2,
//     private maxPages = 1
//   ) {}

//   async crawl(startUrl: string): Promise<Page[]> {
//     // Add the start URL to the queue
//     this.addToQueue(startUrl);

//     // While there are URLs in the queue and we haven't reached the maximum number of pages...
//     while (this.shouldContinueCrawling()) {
//       // Dequeue the next URL and depth
//       const { url, depth } = this.queue.shift()!;

//       // If the depth is too great or we've already seen this URL, skip it
//       if (this.isTooDeep(depth) || this.isAlreadySeen(url)) continue;

//       // Add the URL to the set of seen URLs
//       this.seen.add(url);

//       // Fetch the page HTML
//       const html = await this.fetchPage(url);

//       // Parse the HTML and add the page to the list of crawled pages
//       this.pages.push({ url, content: this.parseHtml(html) });

//       // Extract new URLs from the page HTML and add them to the queue
//       // this.addNewUrlsToQueue(this.extractUrls(html, url), depth);
//     }

//     // Return the list of crawled pages
//     return this.pages;
//   }

//   private isTooDeep(depth: number) {
//     return depth > this.maxDepth;
//   }

//   private isAlreadySeen(url: string) {
//     return this.seen.has(url);
//   }

//   private shouldContinueCrawling() {
//     return this.queue.length > 0 && this.pages.length < this.maxPages;
//   }

//   private addToQueue(url: string, depth = 0) {
//     this.queue.push({ url, depth });
//   }

//   // private addNewUrlsToQueue(urls: string[], depth: number) {
//   //    this.queue.push(...urls.map((url) => ({ url, depth: depth + 1 })));
//   // }

//   private async fetchPage(url: string): Promise<string> {
//     try {
//       const response = await fetch(url);
//       return await response.text();
//     } catch (error) {
//       console.error(`Failed to fetch ${url}: ${error}`);
//       return "";
//     }
//   }

//   private parseHtml(html: string): string {
//     const $ = cheerio.load(html);
//     $("header").remove();
//     $("footer").remove();
//     $("a").removeAttr("href");
//     return NodeHtmlMarkdown.translate($.html());
//   }

//   private extractUrls(html: string, baseUrl: string): string[] {
//     const $ = cheerio.load(html);
//     const relativeUrls = $("a")
//       .map((_, link) => $(link).attr("href"))
//       .get() as string[];
//     return relativeUrls.map(
//       (relativeUrl) => new URL(relativeUrl, baseUrl).href
//     );
//   }
// }
// // module.exports = Crawler;
// export { Crawler };
// export type { Page };

// // import cheerio from "cheerio";
// // import { NodeHtmlMarkdown } from "node-html-markdown";

// // interface Page {
// //   url: string;
// //   content: string;
// // }

// // export class Crawler {
// //   constructor(
// //     private maxDepth = 2,
// //     private maxPages = 1
// //   ) {}

// //   async crawl(selectedUrls: string[]): Promise<Page[]> {
// //     const pages: Page[] = [];

// //     for (const url of selectedUrls) {
// //       const html = await this.fetchPage(url);
// //       pages.push({ url, content: this.parseHtml(html) });
// //     }

// //     return pages;
// //   }

// //   private async fetchPage(url: string): Promise<string> {
// //     try {
// //       const response = await fetch(url);
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch ${url}: HTTP status ${response.status}`);
// //       }
// //       return await response.text();
// //     } catch (error) {
// //       console.error(`Failed to fetch ${url}: ${error}`);
// //       return "";
// //     }
// //   }

// //   private parseHtml(html: string): string {
// //     const $ = cheerio.load(html);
// //     $("header").remove();
// //     $("footer").remove();
// //     $("a").removeAttr("href");
// //     return NodeHtmlMarkdown.translate($.html());
// //   }
// // }

import { load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import axios from "axios";
import { Page } from "@/types/interfaces";


class Crawler {
  // async crawl(selectedUrls: string[]): Promise<Page[]> {
  //   const pages: Page[] = [];

  //   for (const url of selectedUrls) {
  //     const html = await this.fetchPage(url);
  //     pages.push({ url, content: this.parseHtml(html) });
  //   }

  //   return pages;
  // }
  async crawl(selectedUrls: string[]): Promise<Page[]> {
    const pages: Page[] = [];

    for (const url of selectedUrls) {
      try {
        const html = await this.fetchPage(url);
        pages.push({ url, content: this.parseHtml(html) });
      } catch (error) {
        // Handle errors for individual URLs
        console.error(`Failed to crawl ${url}: ${error}`);
      }
    }

    return pages;
  }

  // private async fetchPage(url: string): Promise<string> {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch ${url}: HTTP status ${response.status}`);
  //     }
  //     return await response.text();
  //   } catch (error) {
  //     console.error(`Failed to fetch ${url}: ${error}`);
  //     return "";
  //   }
  // }

  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url); // Use Axios to make the GET request
      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch ${url}: HTTP status ${response.status}`
        );
      }
      return response.data; // Axios automatically parses response data as a string
    } catch (error: any) {
      console.error(`Failed to fetch ${url}: ${error.message}`);
      return "";
    }
  }

  private parseHtml(html: string): string {
    const $ = load(html);
    $("header").remove();
    $("footer").remove();
    $("a").removeAttr("href");
    return NodeHtmlMarkdown.translate($.html());
  }
}

export { Crawler };
export type { Page };
