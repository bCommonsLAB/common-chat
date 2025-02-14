import { Index, Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatMessage, Source, StructuredSource, SourceDocument } from '@/types/rag';
import { analyseSourceDocuments, restructureDocuments } from './ragService';

export class PineconeService {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;
  private pineconeIndex: string;

  private constructor(pineconeIndex: string) {
    this.pineconeIndex = pineconeIndex;
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log('Pinecone instance created:', this.pinecone);

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: process.env.OPENAI_EMBEDDINGS_MODEL_NAME!,
    });
    //console.log('OpenAIEmbeddings initialized:', this.embeddings);

    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      temperature: parseFloat(process.env.OPENAI_CHAT_TEMPERATURE!),
      modelName: process.env.OPENAI_CHAT_MODEL_NAME!
    });
    //console.log('ChatOpenAI LLM initialized with temperature:', this.llm.temperature);
  }

  public static async create(pineconeIndex: string): Promise<PineconeService> {
    const service = new PineconeService(pineconeIndex);
    return service;
  }

  async query(question: string, chatContent: string): Promise<ChatMessage> {
    console.log('Pinecone index:', this.pineconeIndex);
    const index: Index = this.pinecone.index(this.pineconeIndex);
    
    try {
      // Embedding erstellen
      const questionEmbedding = await this.embeddings.embedQuery(question)
        .catch(error => {
          console.error('Fehler beim Erstellen des Embeddings:', error);
          throw new Error('Embedding konnte nicht erstellt werden.');
        });
      // console.log('Embedding erfolgreich erstellt:', questionEmbedding);
      
      // Pinecone Abfrage mit der neuen SDK-Syntax
      const queryResponse = await index.query({
        vector: questionEmbedding,
        topK: 10,
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
      // console.log('relevantTexts:', relevantTexts);
      // Generiere die Antwort

      /*
      const chatHistoryPrompt = `
        Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

        Chat History: ${chatHistory}
        Follow Up Input: ${question}
      `;
      */

      const prompt = `
        Sie sind ein hilfreicher Assistent. Beantworten Sie die Frage des Benutzers anhand des bereitgestellten Dokumenten so gut wie möglich, versuchen sie dabei die bereitgestellten Ressourcen zusammenzufassen.
        Wenn sie lateinischen Bezeichnungen vorkommen bitte, diese nur in Klammer hinter denen im Volksmund geläufige Namen erklärend angeben. Versuchen sie auch den Ortsbezug zu erklären. Formatieren sie den Text übersichtlich, vermeiden sie lange aufzählungslisten, dann besser beistrich getrennt aufzählen.
        Versuchen Sie nicht, sich eine Antwort auszudenken.

        Kontext:
        ${relevantTexts.map((doc, index) => `<doc id='${index}'>${doc?.text || ''}</doc>`).join('\n')}

        Frage: ${question}

        Antwort:`;

      const answer = await this.llm.predict(prompt)
        .catch(error => {
          console.error('Fehler bei der KI-Antwortgenerierung:', error);
          throw new Error('Die Antwort konnte nicht generiert werden.');
        });
      console.log('Antwort:', answer);
      /*  
      if(answer.includes("Hmm, bin mir nicht sicher.")) {
        relevantTexts = []
      }
        */
      const sourceDocuments=relevantTexts.map(doc => ({
        pageContent: doc?.text || '',
        metadata: {
          "loc.lines.from": doc?.["loc.lines.from"],
          "loc.lines.to": doc?.["loc.lines.to"],
          "loc.pageNumber": doc?.["loc.pageNumber"],
          "pdf.info.CreationDate": doc?.["pdf.info.CreationDate"],
          "pdf.info.Creator": doc?.["pdf.info.Creator"],
          "pdf.info.IsAcroFormPresent": doc?.["pdf.info.IsAcroFormPresent"],
          "pdf.info.IsXFAPresent": doc?.["pdf.info.IsXFAPresent"],
          "pdf.info.ModDate": doc?.["pdf.info.ModDate"],
          "pdf.info.PDFFormatVersion": doc?.["pdf.info.PDFFormatVersion"],
          "pdf.info.Producer": doc?.["pdf.info.Producer"],
          "pdf.info.Title": doc?.["pdf.info.Title"],
          "pdf.info.Trapped.name": doc?.["pdf.info.Trapped.name"],
          "pdf.totalPages": doc?.["pdf.totalPages"],
          "pdf.version": doc?.["pdf.version"],
          source: doc?.source
        }
      }));
      

      const sources: Source[] = analyseSourceDocuments(sourceDocuments as SourceDocument[], chatContent)
      const restructuredDocuments: StructuredSource[] = restructureDocuments(sources);

      return {
        id: Date.now(),
        content: answer || "Es gab einen Fehler bei der Verarbeitung der Anfrage.",
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        sources:  restructuredDocuments
      };

    } catch (error: unknown) {
      console.error('Fehler im RAG-Prozess:', error);
      return {
        id: Date.now(),
        content: `Es ist ein Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sources: []
      };
    }
  }
  /*
  async queryPinecone(query: string, pineconeIndex: string) {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          index: pineconeIndex
        }),
      });
      // ... rest of the function
    }catch (error) {
      console.error('Fehler bei der Pinecone-Abfrage:', error);
      throw error;
    }
  }
  */
}