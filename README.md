# Common-Chat: RAG-basierte Chatanwendung

Diese Anwendung ist eine moderne Chatanwendung, die auf dem RAG (Retrieval-Augmented Generation) Prinzip basiert. Sie ermöglicht es Benutzern, mit einem KI-Assistenten zu interagieren, der Zugriff auf spezifische Dokumentationen und Wissensdatenbanken hat.

## Funktionen

- 🤖 KI-gestützte Chatinteraktion
- 📚 Dokumentenbasierte Antworten (RAG)
- 🔍 Semantische Suche über Pinecone
- 💾 Persistente Chatspeicherung
- 📱 Responsive Design

## Installation

1. Klonen Sie das Repository:
```bash
git clone [repository-url]
cd common-chat
```

2. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

## Konfiguration

Die Anwendung benötigt verschiedene Umgebungsvariablen für die Funktionalität. Erstellen Sie eine `.env` Datei im Hauptverzeichnis mit folgenden Variablen:

```env
# OpenAI Konfiguration
OPENAI_API_KEY=Ihr-OpenAI-API-Schlüssel
OPENAI_CHAT_MODEL_NAME=gpt-4
OPENAI_EMBEDDINGS_MODEL_NAME=text-embedding-3-large
OPENAI_CHAT_TEMPERATURE=0.5

# Pinecone Konfiguration
PINECONE_API_KEY=Ihr-Pinecone-API-Schlüssel
PINECONE_INDEX=Ihr-Pinecone-Index-Name
```

## Chatbot-Konfiguration

Die verfügbaren Chatbots werden in der Datei `src/config.json` konfiguriert. Jeder Chatbot wird als Objekt im `availableRags`-Array definiert mit folgenden Eigenschaften:

```json
{
  "id": "unique-id",                    // Eindeutige ID des Chatbots
  "name": "Name des Chatbots",         // Anzeigename
  "title": "Titel des Chatbots",       // Titel für die UI
  "description": "Beschreibung",       // Kurze Beschreibung des Chatbots
  "titleAvatarSrc": "URL",            // URL zum Avatar-Bild
  "welcomeMessage": "Willkommen...",   // Begrüßungsnachricht
  "errorMessage": "Fehlermeldung",     // Nachricht bei Fehlern
  "url": "/chatbot-path",             // URL-Pfad des Chatbots
  "placeholder": "Eingabetext...",     // Platzhaltertext für Eingabefeld
  "maxChars": 500,                     // Maximale Zeichenanzahl pro Nachricht
  "maxCharsWarningMessage": "...",     // Warnung bei Überschreitung
  "footerText": "Footer Text",         // Text im Footer
  "companyLink": "https://...",        // Link zur Firma/Organisation
  "pineconeIndex": "index-name"        // Name des Pinecone Index für diesen Bot
}
```

Jeder Chatbot greift auf seinen eigenen Pinecone-Index zu, der die spezifischen Dokumenten-Embeddings für seinen Wissensbereich enthält.

## Entwicklung

Starten Sie den Entwicklungsserver:

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Funktionsweise

Die Anwendung verwendet einen RAG-basierten Ansatz für die Verarbeitung von Benutzeranfragen:

1. **Dokumentenverarbeitung**: 
   - Dokumente werden in Chunks aufgeteilt
   - Für jeden Chunk werden Embeddings erstellt
   - Die Embeddings werden in Pinecone gespeichert

2. **Chatinteraktion**:
   - Benutzereingaben werden analysiert
   - Relevante Dokumente werden über Pinecone abgerufen
   - OpenAI generiert kontextbezogene Antworten

3. **Speicherung**:
   - Chatverlauf wird persistent gespeichert
   - Quellendokumente werden referenziert

## Technologie-Stack

- Next.js 14 (React Framework)
- OpenAI API (GPT-4, Embeddings)
- Pinecone (Vektorendatenbank)
- TypeScript
- Tailwind CSS
