import { Source, ChatMessage, StructuredSource, SourceDocument } from '@/types/rag';


export async function sendMessageToFlowise(message: string, chatContent: string): Promise<ChatMessage> {
  let flowiseUrl: string | undefined = undefined;
  switch (chatContent) {
    case 'biodiv':
      flowiseUrl="https://flowiseai.bcommonslab.org/api/v1/prediction/fd2b9e43-db17-4274-a0da-014d5b87426c"
      break;
    case 'freifairlebendig':
      flowiseUrl="https://flowiseai.bcommonslab.org/api/v1/prediction/d42ace0e-b334-478a-b2b8-5b1ac32b55f4"
      break;
  }

  if (!flowiseUrl) {
    throw new Error(`Flowise URL for ${chatContent} is not configured`);
  }

  const response = await fetch(flowiseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: message }),
  });

  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`);
  }

  const data = await response.json();
  const docs: Source[] = analyseSourceDocuments(data.sourceDocuments, chatContent)
  const restructuredDocuments: StructuredSource[] = restructureDocuments(docs);

  return {
    id: Date.now(),
    content: data.text || "Entschuldigung, es gab einen Fehler bei der Verarbeitung der Anfrage.",
    role: 'assistant',
    timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    sources:  restructuredDocuments
  };
}

export function analyseSourceDocuments(sourceDocuments: SourceDocument[], chatContent: string): Source[] {
  return (sourceDocuments ?? []).map((doc: SourceDocument) => {
    if(!doc.metadata.source) return undefined;
    const filename = doc.metadata.source.split('\\').pop() || '';
    if(chatContent === "biodiv") {
      //Glaser_2005_SiedlungsdichteHabitatwahl&GefährdungssituationVonAmeisenInPraderSand&SchludernserAu_Gredleriana_5_p.pdf
      
      // Parse filename components
      const [authorPart, year, ...restParts] = filename.split('_');
      const lastPart = restParts[restParts.length - 1];
      const commercialStatus = lastPart.split('.')[0]; // p (public domain), c (commons), und k (kommerziell)
      const issue = restParts[restParts.length - 2];
      const journal = restParts[restParts.length - 3];
      
      // Combine remaining parts for title (excluding author, year, journal, issue, and status)
      const titleParts = restParts.slice(0, -3);
      const title = titleParts.join('_')
        .replace(/([A-Z])/g, ' $1')  // Add space before capitals
        .trim();                      // Remove potential leading space
      
      const getStatusText = (code: string): string => {
          switch(code) {
              case 'p': return 'Public Domain';
              case 'c': return 'Commons';
              case 'k': return 'Kommerziell';
              default: return code;
          }
      };

      const item: Source = {
        title,
        author: authorPart,
        year,
        content: doc.pageContent,
        pageNumber: Number(doc.metadata["loc.pageNumber"]),
        excerpt: doc.pageContent.substring(0, 200) + '...',
        url: doc.metadata.source || '',
        imageUrl: doc.metadata.imageUrl || '',
        metainfo: [
          {key: "Zeitschrift", value: journal},
          {key: "Ausgabe", value: "Ausgabe " + issue},
          {key: "Status", value: getStatusText(commercialStatus)}
        ]
      }
      return item;
    }
    if(chatContent === "freifairlebendig") {
      const item1: Source = {
        title: "Frei Fair & Lebendig",
        author: "",
        year: "",
        content: doc.pageContent,
        pageNumber: Number(doc.metadata["loc.pageNumber"]),
        excerpt: doc.pageContent.substring(0, 200) + '...',
        url: '',
        imageUrl: "",
        metainfo: []
      }
      return item1;
    };

  }).filter((doc): doc is Source => doc !== undefined);
}


// Funktion zum Umstrukturieren der Dokumente
export function restructureDocuments(sourceDocs: Source[]): StructuredSource[] {
    // Extrahiere die sourceDocuments aus dem Text-Feld
    
    // Erstelle ein Objekt zur Gruppierung nach Quellen
    const groupedBySource = sourceDocs.reduce((acc: { [key: string]: StructuredSource }, doc) => {
        const source = doc.url;
        
        // Wenn die Quelle noch nicht existiert, erstelle einen neuen Eintrag
        if (!acc[source]) {
            // Extrahiere die PDF-Metadaten für den Dokument-Header
            const pdfInfo: StructuredSource = {
              title: doc.title,
              author: doc.author,
              year: doc.year,
              url: doc.url,
              imageUrl: doc.imageUrl,
              metainfo: doc.metainfo,
              pages: []
            };
            acc[source] = pdfInfo;
        }
        
        // Füge die Textpassage zum entsprechenden Dokument hinzu
        acc[source].pages.push({
          pageNumber: doc.pageNumber,
          content: doc.content,
          excerpt: doc.excerpt
        });
        
        return acc;
    }, {});
    
    // Konvertiere das Objekt in ein Array und sortiere die Passagen nach Seitenzahl
    const result = Object.values(groupedBySource).map(doc => {
        doc.pages.sort((a, b) => a.pageNumber - b.pageNumber);
        return doc;
    });
    
    return result;
}

/*
function getMockResponse(message: string, chatContent: string): Message {
  const lowerMessage = message.toLowerCase();
  // console.log(chatContent);
  if (lowerMessage.includes('produktivität')) {
    return {
      ...initialMessages[1],
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };
  }
  
  if (lowerMessage.includes('schlaf')) {
    return {
      ...initialMessages[3],
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };
  }

  return {
    id: Date.now(),
    content: "Entschuldigung, ich habe dazu leider keine passende Information in meiner Wissensbasis gefunden.",
    isUser: false,
    timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  };
}
*/

