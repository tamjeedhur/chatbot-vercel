/**
 * API functions for URL crawling with SSE progress tracking
 */

interface CrawlOptions {
  maxDepth?: number;
  chunkSize?: number;
  chunkOverlap?: number;
}

interface CrawlResponse {
  jobId: string;
  progressUrl: string;
  streamUrl: string;
}

export async function startCrawlJob(
  urls: string[],
  chatbotId: string,
  options: CrawlOptions,
  serverUrl: string,
  accessToken: string
): Promise<CrawlResponse> {
  console.log('🌐 crawlApi - Starting crawl job:', {
    urls,
    chatbotId,
    options,
    serverUrl: `${serverUrl}/api/v1/datasources/scraping/crawl`,
  });

  const response = await fetch(`${serverUrl}/api/v1/datasources/scraping/crawl`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      chatbotId,
      options: {
        maxDepth: options.maxDepth || 2,
        chunkSize: options.chunkSize || 500,
        chunkOverlap: options.chunkOverlap || 50,
      },
    }),
  });

  console.log('🌐 crawlApi - Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ crawlApi - API error:', response.status, errorText);
    throw new Error(`Failed to start crawl job: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ crawlApi - API response:', result);
  return result.data;
}

export async function cancelCrawlJob(jobId: string, chatbotId: string, serverUrl: string, accessToken: string): Promise<void> {
  const response = await fetch(`${serverUrl}/api/v1/datasources/scraping/cancel/${jobId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatbotId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to cancel crawl job: ${response.status} ${errorText}`);
  }
}
