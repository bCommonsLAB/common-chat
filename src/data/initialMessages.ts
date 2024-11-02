import { Message } from '@/types/rag';

export const initialMessages: Message[] = [
  {
    id: 1,
    content: "Wie kann ich meine Produktivität steigern?",
    isUser: true,
    timestamp: "10:00"
  },
  {
    id: 2,
    content: "Basierend auf den verfügbaren Quellen gibt es mehrere bewährte Methoden zur Produktivitätssteigerung. Die Pomodoro-Technik und ein strukturierter Tagesablauf haben sich als besonders effektiv erwiesen. Regelmäßige Pausen und die Priorisierung von wichtigen Aufgaben am Morgen sind dabei zentrale Elemente.",
    isUser: false,
    timestamp: "10:01",
    sources: [
      {
        title: "Produktivität im digitalen Zeitalter",
        author: "Dr. Maria Schmidt",
        excerpt: "Die Pomodoro-Technik hat sich als besonders effektiv erwiesen. Studien zeigen, dass regelmäßige Pausen die Konzentration deutlich verbessern können.",
        url: "https://example.com/produktivitaet",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000",
        content: "Die Pomodoro-Technik ist eine Zeitmanagement-Methode, die auf 25-Minuten-Arbeitsintervallen basiert. Nach jedem Intervall folgt eine kurze Pause. Diese Methode nutzt die natürlichen Aufmerksamkeitszyklen des Gehirns und maximiert die Konzentrationsfähigkeit. Studien haben gezeigt, dass regelmäßige Pausen die kognitive Leistungsfähigkeit um bis zu 40% steigern können."
      },
      {
        title: "Zeitmanagement für Profis",
        author: "Thomas Weber",
        excerpt: "Ein gut strukturierter Tagesablauf ist der Schlüssel zum Erfolg. Beginnen Sie mit den wichtigsten Aufgaben am Morgen, wenn Ihre Energie am höchsten ist.",
        url: "https://example.com/zeitmanagement",
        imageUrl: "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?q=80&w=1000",
        content: "Die effektivste Zeit für komplexe Aufgaben liegt in den Morgenstunden zwischen 9 und 11 Uhr. Das Gehirn ist dann am leistungsfähigsten für analytische Aufgaben. Strukturieren Sie Ihren Tag nach der 2-Minuten-Regel: Wenn eine Aufgabe weniger als zwei Minuten benötigt, erledigen Sie sie sofort."
      }
    ]
  },
  {
    id: 3,
    content: "Wie kann ich besser schlafen?",
    isUser: true,
    timestamp: "10:05"
  },
  {
    id: 4,
    content: "Für einen besseren Schlaf empfehlen Experten eine Kombination aus regelmäßigen Schlafenszeiten und einer entspannenden Abendroutine. Vermeiden Sie blaues Licht von elektronischen Geräten vor dem Schlafengehen und sorgen Sie für eine kühle, dunkle und ruhige Schlafumgebung. Regelmäßige Bewegung am Tag kann ebenfalls zu besserem Schlaf beitragen.",
    isUser: false,
    timestamp: "10:06",
    sources: [
      {
        title: "Gesunder Schlaf - Ein Ratgeber",
        author: "Prof. Dr. Anna Müller",
        excerpt: "Die Qualität unseres Schlafes wird maßgeblich von unserer Abendroutine und der Schlafumgebung beeinflusst. Eine Raumtemperatur von 16-18°C und absolute Dunkelheit sind optimal.",
        url: "https://example.com/schlaf-ratgeber",
        imageUrl: "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?q=80&w=1000",
        content: "Die optimale Schlafumgebung ist entscheidend für erholsamen Schlaf. Die ideale Raumtemperatur liegt zwischen 16-18°C, da der Körper während des Schlafes seine Temperatur leicht absenkt. Absolute Dunkelheit stimuliert die Produktion von Melatonin, dem körpereigenen Schlafhormon. Verwenden Sie gegebenenfalls Verdunkelungsvorhänge oder eine Schlafmaske."
      },
      {
        title: "Schlafforschung aktuell",
        author: "Dr. Michael Berg",
        excerpt: "Studien zeigen, dass regelmäßige körperliche Aktivität die Schlafqualität um bis zu 65% verbessern kann. Jedoch sollte intensiver Sport nicht direkt vor dem Schlafengehen stattfinden.",
        url: "https://example.com/schlafforschung",
        imageUrl: "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?q=80&w=1000",
        content: "Neueste Forschungsergebnisse belegen den direkten Zusammenhang zwischen körperlicher Aktivität und Schlafqualität. Moderate Bewegung von mindestens 30 Minuten täglich kann die Einschlafzeit um durchschnittlich 55% verkürzen. Der beste Zeitpunkt für Sport liegt 4-6 Stunden vor der geplanten Schlafenszeit."
      },
      {
        title: "Digitaler Stress und Schlaf",
        author: "Sarah Johnson",
        excerpt: "Die Nutzung von Smartphones und Tablets vor dem Schlafengehen kann den Melatonin-Spiegel um bis zu 50% reduzieren, was das Einschlafen erheblich erschwert.",
        url: "https://example.com/digital-stress",
        imageUrl: "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?q=80&w=1000",
        content: "Das blaue Licht elektronischer Geräte unterdrückt nachweislich die Melatonin-Produktion. Eine Studie der Harvard Medical School zeigt, dass bereits 30 Minuten Smartphone-Nutzung vor dem Schlafengehen die Einschlafzeit um durchschnittlich 60 Minuten verlängern kann. Aktivieren Sie den Nachtmodus Ihrer Geräte oder vermeiden Sie die Nutzung 2 Stunden vor dem Schlafengehen."
      }
    ]
  }
]; 