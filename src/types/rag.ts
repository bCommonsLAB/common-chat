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

export const AVAILABLE_RAGS: RAGOption[] = [
  {
    id: 'biodiv',
    name: 'Biodiversität in Südtirol',
    title: 'Biodiversität in Südtirol',
    description: 'Chatbot für Fragen zur Biodiversität in Südtirol',
    titleAvatarSrc: 'https://img.diva-portal.com/innovation/biodiv/Biodiv%20Avatar.png',
    welcomeMessage: 'Wilkommen, ich bin ein Chatbot, trainiert mit verschiedenen Texten zur Biodiversität in Südtirol. Du kannst mich gerne zu diesen Themen befragen.',
    errorMessage: 'Etwas ist schiefgegangen. Versuche es bitte nochmal.',
    url: '/biodiv',
    placeholder: 'Schreibe deine Frage...',
    maxChars: 500,
    maxCharsWarningMessage: 'Deine Frage ist zu lang, bitte kürze sie.',
    footerText: 'Powered by b*commonsLAB',
    companyLink: 'https://www.bcommonslab.org',
    pineconeIndex: 'biodiv-prototyp'
  },
  {
    id: 'freifairlebendig',
    name: 'Frei Fair und Lebendig',
    title: 'Frei Fair und Lebendig',
    description: 'Chatbot für Fragen an das Buch "Frei Fair und Lebendig" von Silke Helfrich und David Bollier',
    titleAvatarSrc: 'https://example.com/avatar.png',
    welcomeMessage: 'Wilkommen, ich bin ein Chatbot, trainiert mit dem Buch "Frei, Fair und Lebendig - Die Macht des Commons" von Silke Helfrich und David Bollier. Du kannst mich gerne zum Inhalt dieses Buches befragen.',
    errorMessage: 'Etwas ist schiefgegangen. Versuche es bitte nochmal.',
    url: '/freifairlebendig',
    placeholder: 'Schreibe deine Frage...',
    maxChars: 500,
    maxCharsWarningMessage: 'Deine Frage ist zu lang, bitte kürze sie.',
    footerText: 'Powered by b*commonsLAB',
    companyLink: 'https://www.bcommonslab.org',
    pineconeIndex: 'freifairlebendig'
  }
];