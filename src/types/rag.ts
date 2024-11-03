
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

export interface Message {
  id: number;
  content: string;
  isUser: boolean;
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