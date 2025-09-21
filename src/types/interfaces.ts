export interface User {
  id: string | number;
}
export interface UserEntry {
  username: string;
  id: string;
  email?: string;
  online?: boolean;
  room?: string;
}

export interface Message {
  from: string;
  date: number;
  message: string;
  roomId?: string;
}
export interface Room {
  name: string;
  id: string;
  messages?: Message[];
  connected?: boolean;
  offset?: number;
  forUserId?: null | number | string;
  lastMessage?: Message | null;
}
export interface State {
  currentRoom: string;
  rooms: { [id: string]: Room };
  users: { [id: string]: UserEntry };
}

export interface ButtonLinks {
  heroku?: string;
  google_cloud?: string;
  vercel?: string;
  github?: string;
}
export interface PreloadedRoom {
  name: string;
  id: string;
  messages: Message[];
}

export interface ResponseRoom {
  names: string[];
  id: string;
}

export interface ResponseMessage {
  id: string;
  content: string;
  userId: string;
  timestamp: string;
  upvotes?: number;
  downvotes?: number;
}

export interface AppState {
  currentRoom: string;
  rooms: { [id: string]: Room };
  users: { [id: string]: UserEntry };
}

export interface UserHookResult {
  user: UserEntry | null;
  onLogIn: (
    email?: string,
    password?: string,
    onError?: (val: string | null) => void,
    onLoading?: (loading: boolean) => void
  ) => void;
  onLogOut: () => Promise<void>;
  loading: boolean;
}

export interface Invoice {
  id: string;
  account_name: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  status: string;
}

export interface PaymentRecord {
  priceId: string;
  paymentIntentId: string;
}

export interface FileWithPath extends File {
  path?: string;
}

export interface QAItem {
  id: number;
  question: string;
  answer: string;
  isSaved: boolean;
  isExpanded: boolean;
}

export interface QAPair {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

export interface TextContent {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  wordCount: number;
}
export interface Page {
  url: string;
  content: string;
}

export interface SeedOptions {
  splittingMethod: string;
  chunkSize: number;
  chunkOverlap: number;
}

export interface BillingAddressState {
  companyName: string;
  billingEmail: string;
  taxId: string;
  vatNumber: string;
  phoneNum: string;
  country: string;
  billingAddress: string;
  state: string;
  zipCode: string;
}

export interface StyledPhoneInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  defaultCountry?: string;
  style?: React.CSSProperties;
}

export interface CardItemProps {
  cardType: "mastercard" | "visa";
  cardHolder: string;
  lastFour: string;
  expiry: string;
  isPrimary: boolean;
}

export interface CardData {
  cardType: "mastercard" | "visa";
  cardHolder: string;
  lastFour: string;
  expiry: string;
  isPrimary: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
}
import { type LucideIcon } from "lucide-react";
import { ChangeEvent } from "react";
export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}
export interface NavMainProps {
  items: NavItem[];
}
export interface SignUpFormValues {
  email: string;
  password: string;
}
export interface LinksProps {
  secondary: boolean;
  onOpen: (...args: any[]) => any;
  fixed: boolean;
}

export interface ServersideToolbarProps {
  value?: string;
  clearSearch?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedRows?: any;
  loading?: boolean;
}

export interface SearchBarScProps {
  handleOnSearch: (searchText: any) => void;
  handleClickOnSearch: (searchText: any) => void;
  loading?: boolean;
  searchText: string;
  activeButton: any;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface CustomUser {
  id: string;
  email: string;
  name?: string | null;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  userData?: any;
  user?: any;
}

export interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    tenantId?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  expires: string;
  organization?: any;
  chatbots?: any[];
  selectedChatbot?: any;
  userData?: any;
  tenantId?: string;
  userId?: string;
  tenant?: any;
}
import { JWT } from "next-auth/jwt";

export interface CustomToken extends JWT {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
  organization?: any;
  chatbots?: any[];
  userData?: any;
}
export interface StripeError {
  error: {
    message: string;
  };
}

export interface PaymentMachineContext {
  context: {
    error?: string | null;
    priceId: string | null;
    productId: string | null;
    sessionUrl: string | null;
    recurring: string | null;
  };
}

export interface PaymentCaptureMachineContext {
  cards?: any[];
  products?: any[];
  prices?: any[];
  nonRecurringPrices?: any[];
  selectedCardId?: string | null;
  selectedPackage?: string | null;
  email?: string;
  organizationId?: string;
  paymentIntentId?: string | null;
  error?: string | null;
  toastMessage?: string | null;
  charges?: any[];
  subscriptionId?: string | null;
  isRecurring?: boolean;
}

export interface APIKeyContext {
  key: string;
  owner: string;
  createdAt: Date;
  lastUsed: Date | null;
  usageCount: number;
  dailyUsage: number;
  monthlyUsage: number;
  rateLimit: {
    perSecond: number;
    perMinute: number;
    perHour: number;
  };
  limits: {
    daily: number;
    monthly: number;
  };
  lastResetDate: {
    daily: Date;
    monthly: Date;
  };
  consecutiveErrors: number;
  warningThresholds: {
    daily: number;
    monthly: number;
  };
  plan: "free" | "basic" | "pro" | "enterprise";
  customQuota: number | null;
}
import type { Session } from "next-auth";

export interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
  };
  organization?: any;
  chatbots?: any[];
}

export interface PrinterIconProps {
  width?: string | number;
  height?: string | number;
  strokeColor?: string;
  className?: string;
}

export interface DownloadIconProps {
  width?: string | number;
  height?: string | number;
  strokeColor?: string;
  className?: string;
}

// Lead Form Configuration Types
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface LeadFormConfig {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  fields: FormField[];
  collectCondition: 'keywords' | 'always' | 'after_time';
  timeDelay?: number;
  fieldsDisplay: 'all-at-once' | 'one-by-one';
  createdAt?: Date;
}

// Prompt/Playground interfaces
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  messages: ChatMessage[];
  isLoading: boolean;
  topK: number;
}
