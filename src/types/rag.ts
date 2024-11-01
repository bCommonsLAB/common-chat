export interface Source {
    title: string;
    author: string;
    imageUrl: string;
    excerpt: string;
  }
  
  export interface Message {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
    sources?: Source[];
  }