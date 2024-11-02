export interface Source {
  title: string;
  author: string;
  year: string;
  page: string;
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
  sources?: Source[];
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