import { Source, Message } from '@/types/rag';
import { initialMessages } from '@/data/initialMessages';

export async function sendMessageToRAG(message: string, system: string): Promise<Message> {
  console.log(process.env.DEBUG_MODE);
  console.log(system);

  if (process.env.DEBUG_MODE?.toLowerCase() === 'true') {
    return getMockResponse(message, system);
  }
  //var flowiseUrl = `${process.env.FLOWISE_URL}/api/v1/prediction/${process.env.FLOWISE_ID}`;
  console.log(message);

  const flowiseUrl= "https://flowiseai.bcommonslab.org/api/v1/prediction/fd2b9e43-db17-4274-a0da-014d5b87426c"
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
  console.log(data);

  return {
    id: Date.now(),
    content: data.text || "Entschuldigung, es gab einen Fehler bei der Verarbeitung der Anfrage.",
    isUser: false,
    timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    sources:  analyseSourceDocuments(data.sourceDocuments)
  };
}

function analyseSourceDocuments(sourceDocuments: any[]): Source[] {
  return sourceDocuments?.map((doc: any) => {
    const filename = doc.metadata.source.split('\\').pop();
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

    return {
      title,
      author: authorPart,
      year,
      content: doc.pageContent,
      page: doc.metadata["loc.pageNumber"],
      excerpt: doc.pageContent.substring(0, 200) + '...',
      url: doc.metadata.source || '#',
      imageUrl: doc.metadata.imageUrl,
      metainfo: [
        {key: "Zeitschrift", value: journal},
        {key: "Ausgabe", value: "Ausgabe " + issue},
        {key: "Status", value: getStatusText(commercialStatus)}
      ]
    }

  });
}

function getMockResponse(message: string, system: string): Message {
  const lowerMessage = message.toLowerCase();
  console.log(system);
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

export async function getInitialGreeting() {
  return {
    content: "Hello! How can I help you today?",
    sources: []
  };
} 

