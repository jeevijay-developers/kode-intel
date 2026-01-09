// Book data with chapters, subtopics, exercises, fun facts, did you know, and mind maps

export interface Exercise {
  id: string;
  title: string;
  type: 'worksheet' | 'activity' | 'project' | 'quiz';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FunFact {
  id: string;
  fact: string;
  category: 'ai' | 'history' | 'technology' | 'nature';
}

export interface DidYouKnow {
  id: string;
  content: string;
  icon: string;
}

export interface MindMapNode {
  id: string;
  title: string;
  children?: MindMapNode[];
}

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  funFacts: FunFact[];
  didYouKnow: DidYouKnow[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  learningObjectives: string[];
  subTopics: SubTopic[];
  mindMap: MindMapNode;
  pageCount: number;
}

export interface BookData {
  id: string;
  class: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  chapters: Chapter[];
  totalPages: number;
  worksheets: number;
  color: string;
  features: string[];
  isbn: string;
  publisher: string;
  edition: string;
  language: string;
}

// Seed data for books
export const booksData: BookData[] = [
  {
    id: "book-3",
    class: "Class 3",
    title: "AI Foundations",
    subtitle: "Worksheet + Theory",
    description: "Introduction to logical thinking and basic AI concepts with hands-on activities",
    longDescription: "Begin your AI journey with fun activities that develop logical thinking, pattern recognition, and problem-solving skills. This workbook introduces young learners to the exciting world of artificial intelligence through age-appropriate concepts and engaging worksheets.",
    price: 999,
    originalPrice: 1299,
    totalPages: 180,
    worksheets: 24,
    color: "from-emerald-500 to-teal-600",
    features: ["Colorful illustrations", "Interactive activities", "Parent guide included", "Sticker rewards"],
    isbn: "978-93-XXXXX-01-3",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: [
      {
        id: "ch-3-1",
        number: 1,
        title: "What is AI? - Our Smart Friends",
        description: "Introduction to Artificial Intelligence through everyday examples",
        learningObjectives: [
          "Understand what makes something 'smart'",
          "Identify AI in daily life",
          "Differentiate between smart and regular devices"
        ],
        pageCount: 14,
        subTopics: [
          {
            id: "st-3-1-1",
            title: "Smart Devices Around Us",
            description: "Exploring AI-powered devices in our homes and schools",
            exercises: [
              { id: "ex-1", title: "Find the Smart Device", type: "worksheet", difficulty: "easy" },
              { id: "ex-2", title: "Draw Your Smart Friend", type: "activity", difficulty: "easy" },
              { id: "ex-3", title: "Match the Device", type: "worksheet", difficulty: "easy" }
            ],
            funFacts: [
              { id: "ff-1", fact: "The first AI program was created in 1956!", category: "history" },
              { id: "ff-2", fact: "Your voice assistant can understand over 100 languages!", category: "technology" }
            ],
            didYouKnow: [
              { id: "dyk-1", content: "Robots can now play chess better than the best human players!", icon: "chess" },
              { id: "dyk-2", content: "AI helps doctors find diseases in X-rays!", icon: "hospital" }
            ]
          },
          {
            id: "st-3-1-2",
            title: "How Do Machines Learn?",
            description: "Simple introduction to machine learning concepts",
            exercises: [
              { id: "ex-4", title: "Teaching a Robot", type: "activity", difficulty: "medium" },
              { id: "ex-5", title: "Pattern Detective", type: "worksheet", difficulty: "easy" }
            ],
            funFacts: [
              { id: "ff-3", fact: "AI learns from millions of examples, just like you learn from practice!", category: "ai" }
            ],
            didYouKnow: [
              { id: "dyk-3", content: "It takes a computer just seconds to learn what takes us years!", icon: "brain" }
            ]
          }
        ],
        mindMap: {
          id: "mm-1",
          title: "What is AI?",
          children: [
            { id: "mm-1-1", title: "Smart Devices", children: [
              { id: "mm-1-1-1", title: "Voice Assistants" },
              { id: "mm-1-1-2", title: "Smart Toys" },
              { id: "mm-1-1-3", title: "Game Characters" }
            ]},
            { id: "mm-1-2", title: "How They Learn", children: [
              { id: "mm-1-2-1", title: "From Examples" },
              { id: "mm-1-2-2", title: "Practice" }
            ]},
            { id: "mm-1-3", title: "Helping Humans", children: [
              { id: "mm-1-3-1", title: "At Home" },
              { id: "mm-1-3-2", title: "At School" }
            ]}
          ]
        }
      },
      {
        id: "ch-3-2",
        number: 2,
        title: "Patterns All Around",
        description: "Learning to recognize and create patterns",
        learningObjectives: [
          "Identify different types of patterns",
          "Create simple patterns",
          "Understand why patterns are important for AI"
        ],
        pageCount: 16,
        subTopics: [
          {
            id: "st-3-2-1",
            title: "Finding Patterns in Nature",
            description: "Discovering patterns in flowers, leaves, and animals",
            exercises: [
              { id: "ex-6", title: "Nature Pattern Hunt", type: "activity", difficulty: "easy" },
              { id: "ex-7", title: "Complete the Pattern", type: "worksheet", difficulty: "easy" },
              { id: "ex-8", title: "Create Your Pattern", type: "activity", difficulty: "medium" }
            ],
            funFacts: [
              { id: "ff-4", fact: "Honeybees build their homes using hexagon patterns!", category: "nature" },
              { id: "ff-5", fact: "Zebra stripes are like fingerprints - no two are the same!", category: "nature" }
            ],
            didYouKnow: [
              { id: "dyk-4", content: "AI uses patterns to recognize your face in photos!", icon: "camera" }
            ]
          },
          {
            id: "st-3-2-2",
            title: "Number Patterns",
            description: "Understanding sequences and number patterns",
            exercises: [
              { id: "ex-9", title: "What Comes Next?", type: "worksheet", difficulty: "easy" },
              { id: "ex-10", title: "Pattern Puzzle", type: "worksheet", difficulty: "medium" }
            ],
            funFacts: [
              { id: "ff-6", fact: "The Fibonacci sequence appears in sunflower seeds!", category: "nature" }
            ],
            didYouKnow: [
              { id: "dyk-5", content: "Computers can find patterns in millions of numbers in seconds!", icon: "calculator" }
            ]
          }
        ],
        mindMap: {
          id: "mm-2",
          title: "Patterns",
          children: [
            { id: "mm-2-1", title: "In Nature", children: [
              { id: "mm-2-1-1", title: "Flowers" },
              { id: "mm-2-1-2", title: "Animals" },
              { id: "mm-2-1-3", title: "Leaves" }
            ]},
            { id: "mm-2-2", title: "In Numbers", children: [
              { id: "mm-2-2-1", title: "Sequences" },
              { id: "mm-2-2-2", title: "Shapes" }
            ]},
            { id: "mm-2-3", title: "Why Important", children: [
              { id: "mm-2-3-1", title: "AI Learning" },
              { id: "mm-2-3-2", title: "Problem Solving" }
            ]}
          ]
        }
      },
      {
        id: "ch-3-3",
        number: 3,
        title: "Thinking Like a Computer",
        description: "Introduction to computational thinking",
        learningObjectives: [
          "Break down problems into smaller steps",
          "Follow simple instructions",
          "Create step-by-step solutions"
        ],
        pageCount: 15,
        subTopics: [
          {
            id: "st-3-3-1",
            title: "Step by Step",
            description: "Learning to give clear instructions",
            exercises: [
              { id: "ex-11", title: "Robot Chef", type: "activity", difficulty: "easy" },
              { id: "ex-12", title: "Instruction Writer", type: "worksheet", difficulty: "medium" }
            ],
            funFacts: [
              { id: "ff-7", fact: "Computers follow instructions exactly - even if they're wrong!", category: "technology" }
            ],
            didYouKnow: [
              { id: "dyk-6", content: "The first computer programmer was a woman named Ada Lovelace!", icon: "female" }
            ]
          }
        ],
        mindMap: {
          id: "mm-3",
          title: "Computational Thinking",
          children: [
            { id: "mm-3-1", title: "Breaking Down", children: [
              { id: "mm-3-1-1", title: "Big to Small" },
              { id: "mm-3-1-2", title: "One Step at a Time" }
            ]},
            { id: "mm-3-2", title: "Instructions", children: [
              { id: "mm-3-2-1", title: "Clear" },
              { id: "mm-3-2-2", title: "In Order" }
            ]}
          ]
        }
      }
    ]
  },
  {
    id: "book-4",
    class: "Class 4",
    title: "AI Foundations",
    subtitle: "Worksheet + Theory",
    description: "Building blocks of computational thinking with interactive exercises",
    longDescription: "Expand your understanding of AI with more complex concepts while maintaining a fun, engaging approach. This workbook builds on foundational knowledge with algorithms, data basics, and creative problem-solving activities.",
    price: 999,
    originalPrice: 1299,
    totalPages: 200,
    worksheets: 28,
    color: "from-blue-500 to-cyan-600",
    features: ["Step-by-step guides", "Coding puzzles", "Real-world projects", "Assessment tests"],
    isbn: "978-93-XXXXX-02-0",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: [
      {
        id: "ch-4-1",
        number: 1,
        title: "Algorithms in Daily Life",
        description: "Understanding step-by-step procedures",
        learningObjectives: [
          "Define what an algorithm is",
          "Identify algorithms in daily routines",
          "Create simple algorithms for tasks"
        ],
        pageCount: 18,
        subTopics: [
          {
            id: "st-4-1-1",
            title: "What is an Algorithm?",
            description: "Introduction to algorithms through everyday examples",
            exercises: [
              { id: "ex-13", title: "Morning Routine Algorithm", type: "worksheet", difficulty: "easy" },
              { id: "ex-14", title: "Recipe Steps", type: "activity", difficulty: "easy" },
              { id: "ex-15", title: "Game Instructions", type: "worksheet", difficulty: "medium" }
            ],
            funFacts: [
              { id: "ff-8", fact: "The word 'algorithm' comes from a mathematician's name - Al-Khwarizmi!", category: "history" }
            ],
            didYouKnow: [
              { id: "dyk-7", content: "Google uses over 200 factors in its search algorithm!", icon: "search" }
            ]
          },
          {
            id: "st-4-1-2",
            title: "Making Better Algorithms",
            description: "Optimizing and improving step-by-step solutions",
            exercises: [
              { id: "ex-16", title: "Shortest Path", type: "worksheet", difficulty: "medium" },
              { id: "ex-17", title: "Faster Way", type: "activity", difficulty: "medium" }
            ],
            funFacts: [
              { id: "ff-9", fact: "Some algorithms can sort millions of items in less than a second!", category: "technology" }
            ],
            didYouKnow: [
              { id: "dyk-8", content: "Netflix uses algorithms to suggest movies you might like!", icon: "tv" }
            ]
          }
        ],
        mindMap: {
          id: "mm-4",
          title: "Algorithms",
          children: [
            { id: "mm-4-1", title: "Definition", children: [
              { id: "mm-4-1-1", title: "Step-by-step" },
              { id: "mm-4-1-2", title: "Instructions" }
            ]},
            { id: "mm-4-2", title: "Examples", children: [
              { id: "mm-4-2-1", title: "Recipes" },
              { id: "mm-4-2-2", title: "Games" },
              { id: "mm-4-2-3", title: "Daily Tasks" }
            ]},
            { id: "mm-4-3", title: "Improvement", children: [
              { id: "mm-4-3-1", title: "Faster" },
              { id: "mm-4-3-2", title: "Simpler" }
            ]}
          ]
        }
      },
      {
        id: "ch-4-2",
        number: 2,
        title: "Data: The Food of AI",
        description: "Understanding what data is and why it matters",
        learningObjectives: [
          "Understand what data means",
          "Identify different types of data",
          "Learn how AI uses data to learn"
        ],
        pageCount: 16,
        subTopics: [
          {
            id: "st-4-2-1",
            title: "Types of Data",
            description: "Numbers, text, images, and sounds as data",
            exercises: [
              { id: "ex-18", title: "Data Collection", type: "activity", difficulty: "easy" },
              { id: "ex-19", title: "Data Types Chart", type: "worksheet", difficulty: "easy" }
            ],
            funFacts: [
              { id: "ff-10", fact: "Every day, we create 2.5 quintillion bytes of data!", category: "technology" }
            ],
            didYouKnow: [
              { id: "dyk-9", content: "Your smartphone collects thousands of data points every day!", icon: "smartphone" }
            ]
          }
        ],
        mindMap: {
          id: "mm-5",
          title: "Data",
          children: [
            { id: "mm-5-1", title: "Types", children: [
              { id: "mm-5-1-1", title: "Numbers" },
              { id: "mm-5-1-2", title: "Text" },
              { id: "mm-5-1-3", title: "Images" },
              { id: "mm-5-1-4", title: "Sounds" }
            ]},
            { id: "mm-5-2", title: "Uses", children: [
              { id: "mm-5-2-1", title: "AI Training" },
              { id: "mm-5-2-2", title: "Predictions" }
            ]}
          ]
        }
      }
    ]
  },
  {
    id: "book-5",
    class: "Class 5",
    title: "AI Explorer",
    subtitle: "Worksheet + Theory",
    description: "Pattern recognition and algorithm basics with real-world examples",
    longDescription: "Dive deeper into AI concepts with advanced pattern recognition, algorithm design, and introduction to coding logic. Students will explore how AI makes decisions and solve increasingly complex problems.",
    price: 999,
    originalPrice: 1299,
    totalPages: 220,
    worksheets: 30,
    color: "from-violet-500 to-purple-600",
    features: ["Coding challenges", "AI project ideas", "Critical thinking exercises", "Online resources"],
    isbn: "978-93-XXXXX-03-7",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: [
      {
        id: "ch-5-1",
        number: 1,
        title: "Decision Making with AI",
        description: "How AI makes choices and decisions",
        learningObjectives: [
          "Understand conditional logic",
          "Create decision trees",
          "Apply if-then-else thinking"
        ],
        pageCount: 20,
        subTopics: [
          {
            id: "st-5-1-1",
            title: "If This, Then That",
            description: "Introduction to conditional statements",
            exercises: [
              { id: "ex-20", title: "Decision Tree Game", type: "activity", difficulty: "medium" },
              { id: "ex-21", title: "If-Then Puzzles", type: "worksheet", difficulty: "medium" },
              { id: "ex-22", title: "Smart Choices", type: "worksheet", difficulty: "hard" }
            ],
            funFacts: [
              { id: "ff-11", fact: "Self-driving cars make thousands of decisions every second!", category: "technology" }
            ],
            didYouKnow: [
              { id: "dyk-10", content: "AI can predict weather more accurately than traditional methods!", icon: "cloud" }
            ]
          }
        ],
        mindMap: {
          id: "mm-6",
          title: "AI Decisions",
          children: [
            { id: "mm-6-1", title: "Conditions", children: [
              { id: "mm-6-1-1", title: "If" },
              { id: "mm-6-1-2", title: "Then" },
              { id: "mm-6-1-3", title: "Else" }
            ]},
            { id: "mm-6-2", title: "Decision Trees" },
            { id: "mm-6-3", title: "Applications" }
          ]
        }
      }
    ]
  },
  {
    id: "book-6",
    class: "Class 6",
    title: "AI Explorer",
    subtitle: "Worksheet + Theory",
    description: "Advanced patterns and logical operators with practice problems",
    longDescription: "Master logical thinking with Boolean operators, advanced algorithms, and introduction to programming concepts. This workbook prepares students for coding while strengthening their analytical skills.",
    price: 999,
    originalPrice: 1299,
    totalPages: 240,
    worksheets: 32,
    color: "from-pink-500 to-rose-600",
    features: ["Boolean logic", "Flowchart design", "Debugging practice", "Mini projects"],
    isbn: "978-93-XXXXX-04-4",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: []
  },
  {
    id: "book-7",
    class: "Class 7",
    title: "AI Builder",
    subtitle: "Worksheet + Theory",
    description: "Data structures and introductory programming with projects",
    longDescription: "Begin your coding journey with Python basics while understanding data structures and how AI stores information. Hands-on projects make learning practical and fun.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 280,
    worksheets: 36,
    color: "from-orange-500 to-amber-600",
    features: ["Python introduction", "Data structure basics", "Real coding projects", "Problem-solving"],
    isbn: "978-93-XXXXX-05-1",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: []
  },
  {
    id: "book-8",
    class: "Class 8",
    title: "AI Builder",
    subtitle: "Worksheet + Theory",
    description: "Machine learning fundamentals with hands-on experiments",
    longDescription: "Discover how machines learn from data with practical experiments and projects. Students will train simple ML models and understand the basics of neural networks.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 300,
    worksheets: 36,
    color: "from-red-500 to-orange-600",
    features: ["ML experiments", "Data analysis", "Model training", "AI ethics"],
    isbn: "978-93-XXXXX-06-8",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: []
  },
  {
    id: "book-9",
    class: "Class 9",
    title: "AI Innovator",
    subtitle: "Worksheet + Theory",
    description: "Real-world AI applications with case studies and projects",
    longDescription: "Explore how AI is transforming industries with real case studies. Build complex projects and understand advanced concepts like computer vision and NLP basics.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 340,
    worksheets: 40,
    color: "from-indigo-500 to-blue-600",
    features: ["Industry case studies", "Computer vision basics", "NLP introduction", "Capstone project"],
    isbn: "978-93-XXXXX-07-5",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: []
  },
  {
    id: "book-10",
    class: "Class 10",
    title: "AI Innovator",
    subtitle: "Worksheet + Theory",
    description: "Building AI projects with comprehensive theory and practice",
    longDescription: "Master AI development with advanced projects, deep learning basics, and career preparation. This comprehensive workbook prepares students for higher studies in AI and computer science.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 380,
    worksheets: 44,
    color: "from-cyan-500 to-teal-600",
    features: ["Deep learning basics", "Full AI projects", "Career guidance", "Portfolio building"],
    isbn: "978-93-XXXXX-08-2",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: []
  }
];

export const getBookById = (id: string): BookData | undefined => {
  return booksData.find(book => book.id === id);
};

export const getBookByClass = (classNum: string): BookData | undefined => {
  return booksData.find(book => book.class === classNum);
};
