import config from '../config.json';

export interface SourceDocument {
  metadata: {
    source: string;
    'loc.pageNumber': number;
    imageUrl?: string;
  };
  pageContent: string;
}


export interface StructuredSource {
  title: string;
  author: string;
  year: string;
  url: string;
  imageUrl: string;
  metainfo?: {
    key: string;
    value: string | number | boolean | null;
  }[];
  pages: {
    pageNumber: number;
    content: string;
    excerpt: string;
  }[];
}


export interface Source {
  title: string;
  author: string;
  year: string;
  pageNumber: number;
  content: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  metainfo?: {
    key: string;
    value: string | number | boolean | null;
  }[];
}

export interface ChatMessage {
  id: number;   
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: StructuredSource[];
}

export interface FlowiseResponse {
  text: string;
  sourceDocuments?: {
    pageContent: string;
    metadata: {
      [key: string]: string | number | boolean | null;
    };
  }[];
  question?: string;
  chatId?: string;
  chatMessageId?: string;
  sessionId?: string;
}

export interface RAGOption {
  id: string;
  name: string;
  title: string;
  description: string;
  titleAvatarSrc: string;
  welcomeMessage: string;
  errorMessage: string;
  url: string;
  placeholder: string;
  maxChars: number;
  maxCharsWarningMessage: string;
  footerText: string;
  companyLink: string;
  pineconeIndex: string
}

interface Config {
  availableRags: RAGOption[];
}

export const AVAILABLE_RAGS: RAGOption[] = (config as Config).availableRags;