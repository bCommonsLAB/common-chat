import { Index, Pinecone, PineconeIndex } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from '@langchain/openai';
import { Message, Source, StructuredSource } from '@/types/rag';

export class PineconeService {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;

  private constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log('Pinecone instance created:', this.pinecone);

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "text-embedding-3-large",
    });
    console.log('OpenAIEmbeddings initialized:', this.embeddings);

    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      temperature: 0.1,
      modelName: "gpt-4"
    });
    console.log('ChatOpenAI LLM initialized with temperature:', this.llm.temperature);
  }

  public static async create(): Promise<PineconeService> {
    const service = new PineconeService();
    await service.initPinecone();
    return service;
  }

  private async initPinecone() {
    console.log('Fetching Pinecone index', process.env.PINECONE_INDEX);
    const index = this.pinecone.index(process.env.PINECONE_INDEX!);
    try {
      const indexStats = await index.describeIndexStats();
      console.log('Pinecone Index Statistics:', indexStats);
    } catch (error) {
      console.error('Failed to fetch Pinecone index statistics:', error);
    }
  }

  async query(message: string, chatContent: string): Promise<Message> {
    if (!this.pinecone) {
      await this.initPinecone();
    }
    
    const index: Index = this.pinecone.index(process.env.PINECONE_INDEX!);
    /*
    return {
      id: Date.now(),
      content: `Test`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      sources: []
    };
    */    
    try {
      // Embedding erstellen
      const questionEmbedding = await this.embeddings.embedQuery(message)
        .catch(error => {
          console.error('Fehler beim Erstellen des Embeddings:', error);
          throw new Error('Embedding konnte nicht erstellt werden.');
        });
      console.log('Embedding erfolgreich erstellt:', questionEmbedding);
      
      // Pinecone Abfrage mit der neuen SDK-Syntax
      const queryResponse = await index.query({
        vector: questionEmbedding,
        topK: 7,
        includeMetadata: true
      }).catch(error => {
        console.error('Fehler bei der Pinecone-Abfrage:', error);
        throw new Error('Ähnliche Dokumente konnten nicht gefunden werden.');
      });
      // Extrahiere relevante Texte mit Validierung
      if (!queryResponse.matches || queryResponse.matches.length === 0) {
        console.warn('Keine relevanten Dokumente gefunden');
        throw new Error('Hmm, bin mir nicht sicher. Entweder fehlt mir die notwendige Information oder kannst du bitte die Frage präziser formulieren?');
      }

      const relevantTexts = queryResponse.matches.map(match => match.metadata);
      console.log('relevantTexts:', relevantTexts);

      // Generiere die Antwort
      const prompt = `
Beantworte die folgende Frage basierend auf dem gegebenen Kontext.

Kontext:
${relevantTexts.map(text => text?.pageContent || '').filter(Boolean).join('\n')}

Frage: ${message}

Antwort:`;

      const answer = await this.llm.predict(prompt)
        .catch(error => {
          console.error('Fehler bei der KI-Antwortgenerierung:', error);
          throw new Error('Die Antwort konnte nicht generiert werden.');
        });

      // Konvertiere die Metadaten in Source-Objekte
      const sources: Source[] = relevantTexts.map(metadata => ({
        title: metadata.title || '',
        author: metadata.author || '',
        year: metadata.year || '',
        content: metadata.pageContent || '',
        pageNumber: metadata.pageNumber || 1,
        excerpt: (metadata.pageContent?.substring(0, 200) || '') + '...',
        url: metadata.source || '#',
        imageUrl: metadata.imageUrl || '',
        metainfo: [
          { key: "Zeitschrift", value: metadata.journal || '' },
          { key: "Ausgabe", value: metadata.issue || '' },
          { key: "Status", value: metadata.status || '' }
        ]
      }));

      const restructuredSources = this.restructureDocuments(sources);

      return {
        id: Date.now(),
        content: answer,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sources: restructuredSources
      };

    } catch (error) {
      console.error('Fehler im RAG-Prozess:', error);
      return {
        id: Date.now(),
        content: `Entschuldigung, es ist ein Fehler aufgetreten: ${error.message}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sources: []
      };
    }
    
  }

  private restructureDocuments(sourceDocs: Source[]): StructuredSource[] {
    // Gruppiere die Dokumente nach Quelle (URL)
    const groupedBySource = sourceDocs.reduce((acc: { [key: string]: StructuredSource }, doc) => {
      const source = doc.url;

      if (!acc[source]) {
        acc[source] = {
          title: doc.title,
          author: doc.author,
          year: doc.year,
          url: doc.url,
          imageUrl: doc.imageUrl,
          metainfo: doc.metainfo,
          pages: []
        };
      }

      acc[source].pages.push({
        pageNumber: doc.pageNumber,
        content: doc.content,
        excerpt: doc.excerpt
      });

      return acc;
    }, {});

    // Konvertiere das Ergebnis in ein Array und sortiere die Seiten
    const result = Object.values(groupedBySource).map(doc => {
      doc.pages.sort((a, b) => a.pageNumber - b.pageNumber);
      return doc;
    });

    return result;
  }
}