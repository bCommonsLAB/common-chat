# Common-Chat Technische Dokumentation

## 1. Projektübersicht
Common-Chat ist eine Next.js-basierte Webanwendung, die mit TypeScript entwickelt wurde. Die Anwendung nutzt moderne Webtechnologien und folgt einer modularen, skalierbaren Architektur.

### Technologie-Stack
- Next.js als React Framework
- TypeScript für typsichere Entwicklung
- Tailwind CSS für Styling
- ESLint für Code-Qualität
- PostCSS für CSS-Verarbeitung

## 2. Projektstruktur
Die Anwendung folgt einer klaren Verzeichnisstruktur:

```
common-chat/
├── src/
│   ├── app/          # Next.js App Router und Seitenkomponenten
│   ├── components/   # Wiederverwendbare React-Komponenten
│   ├── context/      # React Context Provider
│   ├── services/     # Service Layer und API-Integration
│   ├── types/        # TypeScript Definitionen
│   └── config.json   # Anwendungskonfiguration
├── public/           # Statische Assets
└── [Konfigurationsdateien]
```

## 3. Konfiguration und Setup
### Umgebungsvariablen
Die Anwendung verwendet eine `.env`-Datei für Umgebungsvariablen.

### Build und Deployment
Die Anwendung nutzt Next.js Standard-Build-Prozesse:
- Development: `npm run dev`
- Production Build: `npm run build`
- Production Start: `npm start`

### Framework-Konfiguration
- `next.config.js/ts`: Next.js-spezifische Konfiguration
- `tailwind.config.ts`: Tailwind CSS Anpassungen
- `tsconfig.json`: TypeScript-Compiler-Einstellungen

## 4. Frontend-Architektur

### 4.1 Routing und Seitenstruktur
Die Anwendung verwendet Next.js App Router mit folgender Struktur:

```
app/
├── api/                 # API-Routen
├── [chatContent]/       # Dynamische Chat-Routen
├── layout.tsx          # Root Layout
├── page.tsx            # Hauptseite
└── globals.css         # Globale Styles
```

### 4.2 Komponenten-Hierarchie
Die Komponenten sind funktional organisiert:

#### Haupt-Komponenten
- `Header.tsx` - Hauptnavigation und App-Header
- `MainFooter.tsx` - Footer-Bereich
- `BreadcrumbPath.tsx` - Navigationspfad-Anzeige
- `RAGInterface.tsx` - RAG (Retrieval-Augmented Generation) Interface
- `RAGList.tsx` - Liste der RAG-Elemente

#### Chat-Komponenten
- `ChatHistory.tsx` - Anzeige des Chat-Verlaufs
- `ChatMessage.tsx` - Einzelne Chat-Nachricht
- `MessageInput.tsx` - Eingabefeld für Nachrichten
- `Sources.tsx` - Quellenangaben im Chat

#### Quellen-Komponenten
- `SourceCard.tsx` - Darstellung einzelner Quellen
- `SourcesView.tsx` - Übersichtsansicht aller Quellen

#### Navigationsfluss
1. Hauptseite (`page.tsx`)
   - Header mit Navigation
   - RAG Interface für Hauptinteraktion
   - Chat-Bereich mit History und Input
   - Footer mit zusätzlichen Informationen

2. Dynamische Chat-Inhalte (`[chatContent]`)
   - Dynamisch geladene Chat-Konversationen
   - Breadcrumb für Navigation
   - Spezifische Chat-Historie

### 4.3 Kern-Implementierungen

#### Layout (layout.tsx)
Das Root-Layout definiert die Grundstruktur der Anwendung:
- Implementiert einen globalen `ChatProvider` für State Management
- Nutzt eine Flex-Box-Struktur für vollständige Bildschirmhöhe
- Besteht aus drei Hauptbereichen:
  1. Header (fixiert)
  2. Main Content (flexibel, overflow-hidden)
  3. Footer (fixiert)

Metadata Konfiguration:
```typescript
export const metadata: Metadata = {
  title: "bCommonsLAB Prototypen",
  description: "powered by bCommonsLAB",
};
```

#### Hauptseite (page.tsx)
Die Homepage zeigt eine Liste verfügbarer RAG-Optionen:
- Rendert die `RAGList`-Komponente
- Verwendet vordefinierte RAG-Optionen aus der Konfiguration

#### RAG-Komponenten
Die `RAGList`-Komponente:
- Zeigt verfügbare Chatbots in einem Grid-Layout
- Jeder Chatbot wird als klickbare Karte dargestellt
- Responsive Design mit max-w-3xl für optimale Lesbarkeit
- Hover-Effekte für bessere Benutzerinteraktion

Struktur eines RAG-Elements:
```typescript
type RAGOption = {
  id: string;
  title: string;
  description: string;
  url: string;
}
```

#### Chat-Komponenten Implementierung

##### ChatHistory
Die `ChatHistory`-Komponente verwaltet den Chat-Verlauf:
- Nutzt Context für Zugriff auf Nachrichten
- Scrollbare Container für Chat-Verlauf
- Unterstützt Quellen-Toggle für jede Nachricht
- Responsive Design mit flexibler Höhenanpassung

Interface:
```typescript
interface ChatHistoryProps {
  activeMessageId: number | null;
  onToggleSources: (messageId: number) => void;
  onClick?: () => void;
  onSourceClick: (messageId: number) => void;
}
```

##### ChatMessage
Die `ChatMessageItem`-Komponente rendert einzelne Nachrichten:
- Unterschiedliches Styling für Benutzer- und System-Nachrichten
- Markdown-Unterstützung für formatierte Nachrichten
- Integrierte Quellen-Anzeige mit Counter
- Zeitstempel für jede Nachricht
- Responsive Design mit max-w-[90%]

Besondere Features:
- Benutzer-Nachrichten: Blaues Design, rechtsbündig
- System-Nachrichten: Graues Design, linksbündig
- Quellen-Button mit Zähler und Toggle-Funktion
- Integrierte Icons (BookOpen, ChevronDown/Up)

### 4.4 Komponenten-Interaktion
Die Komponenten folgen einem Top-Down Datenflussmuster:
1. Layout definiert die Grundstruktur
2. Seiten-Komponenten steuern den Hauptinhalt
3. Unterkomponenten handeln spezifische Funktionalitäten

## 5. Code-Architektur
Die Anwendung folgt einer modularen Architektur mit klarer Trennung von Zuständigkeiten:

### Verzeichnisstruktur im Detail
1. **app/**
   - Enthält die Routing-Logik und Seitenkomponenten
   - Basiert auf Next.js App Router

2. **components/**
   - Wiederverwendbare UI-Komponenten
   - Modulare Struktur für einfache Wartung

3. **context/**
   - Globales State Management
   - React Context Provider für geteilte Zustände

4. **services/**
   - API-Integrationen
   - Business-Logik-Layer

5. **types/**
   - TypeScript Interface Definitionen
   - Gemeinsam genutzte Typen

## 5. Best Practices und Standards
Die Anwendung folgt modernen Entwicklungsstandards:
- TypeScript für strikte Typisierung
- ESLint für Code-Qualitätssicherung
- Modularisierung für bessere Wartbarkeit
- Komponenten-basierte Architektur

## 6. Entwicklungsrichtlinien
### Code-Stil
- Einhaltung der ESLint-Regeln
- Verwendung von TypeScript-Typen
- Komponentenbasierte Entwicklung

### Komponenten-Entwicklung
- Funktionale Komponenten mit React Hooks
- Strikte Prop-Typisierung
- Wiederverwendbare, modulare Komponenten

### Testing
[Testing-Strategien und -Werkzeuge werden hier dokumentiert, sobald implementiert]

## 7. Deployment
[Deployment-Prozesse und -Umgebungen werden hier dokumentiert]

## 8. API und Integrationen
[API-Dokumentation und externe Integrationen werden hier dokumentiert]

## 9. Sicherheit
[Sicherheitsrichtlinien und -maßnahmen werden hier dokumentiert]

## 10. Wartung und Updates
[Wartungsprozesse und Update-Richtlinien werden hier dokumentiert]
