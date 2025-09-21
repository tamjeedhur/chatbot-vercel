import { DataSourceDocument } from '@/redux/slices/scrapSlice';

export interface CrawlOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  maxDepth?: number;
  timeout?: number;
}

export interface CrawlPayload {
  urls: string[];
  options: CrawlOptions;
}

export interface CrawlResponse {
  data: any;
  message: string;
  success: boolean;
}

export interface ParseSitemapPayload {
  sitemapUrl: string;
}
export interface ProcessUrlsForDataSourcePayload {
  urls: string[];
  options?: CrawlOptions;
  chatbotId: string;
}

export interface GetDataSourceDocumentPayload {
  documentId: string;
  chatbotId: string;
}
export interface UpdateDataSourceDocumentPayload {
  documentId: string;
  chatbotId: string;
  content: string;
}
export interface PostToPineconePayload {
  chatbotId: string;
  title: string;
  content: string;
  metadata: {
    lastUpdated: string;
  };
}
export interface ScrapingProgressData {
  jobId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  progress: number;
  currentUrl?: string;
  errorMessages?: string[];
  estimatedTimeRemaining?: number;
}

export interface AddQuestionsAnswersPayload {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  chatbotId: string;
}

export interface UpdateQuestionsAnswersPayload {
  documentId: string;
  chatbotId: string;
  question?: string;
  answer?: string;
  category?: string;
  tags?: string[];
  metadata?: object;
}

export interface CrawlerContext {
  error: string | null;
  crawlerResponse: any;
  isLoading: boolean;
  paseSitemapUrls: string[];
  currentDocumentId: string | null;
  // SSE Progress tracking
  currentJobId: string | null;
  currentJobUrls: string[];
  scrapingProgress: ScrapingProgressData | null;
  sseConnected: boolean;
  sseError: string | null;
  // Cancel functionality
  currentJobAbortController: AbortController | null;
  // Scraped URLs and status management
  scrapedUrls: DataSourceDocument[];
  currentUrlStatus: 'idle' | 'pending' | 'error';
}

export type CrawlerEvents =
  | { type: 'CRAWL_URL'; payload: CrawlPayload }
  | { type: 'PARSE_SITMAP'; payload: ParseSitemapPayload }
  | { type: 'PROCESS_URLS_FOR_DATA_SOURCE'; payload: ProcessUrlsForDataSourcePayload }
  | { type: 'PROCESS_SINGLE_URL_FOR_DATA_SOURCE'; payload: ProcessUrlsForDataSourcePayload }
  | { type: 'GET_DATA_SOURCE_DOCUMENT'; payload: GetDataSourceDocumentPayload }
  | { type: 'UPDATE_DATA_SOURCE_DOCUMENT'; payload: UpdateDataSourceDocumentPayload }
  | { type: 'DELETE_SCRAPED_DOCUMENT'; payload: { documentId: string; chatbotId: string } }
  | { type: 'POST_TO_PINECONE'; payload: PostToPineconePayload }
  | { type: 'ADD_QUESTIONS_ANSWERS_DOCUMENT'; payload: AddQuestionsAnswersPayload }
  | { type: 'DELETE_QUESTIONS_ANSWERS_DOCUMENT'; payload: { documentId: string; chatbotId: string } }
  | { type: 'UPDATE_QUESTIONS_ANSWERS_DOCUMENT'; payload: UpdateQuestionsAnswersPayload }
  // SSE Events
  | { type: 'SSE_CONNECT'; payload: { jobId: string; accessToken: string; tenantId: string } }
  | { type: 'SSE_DISCONNECT' }
  | { type: 'SSE_CONNECTED' }
  | { type: 'SSE_DISCONNECTED' }
  | { type: 'SSE_ERROR'; error: string }
  | { type: 'SSE_PROGRESS'; data: ScrapingProgressData }
  | { type: 'SSE_JOB_COMPLETED'; data: ScrapingProgressData }
  | { type: 'CANCEL_CURRENT_JOB' }
  | { type: 'INITIALIZE_SCRAPED_URLS'; urls: DataSourceDocument[] }
  | { type: 'REMOVE_SITEMAP_URL'; payload: { url: string } };

export interface CrawlerInput {
  // No initial input required for this machine
}
