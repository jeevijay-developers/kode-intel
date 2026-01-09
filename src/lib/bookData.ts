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

// Helper function to create subtopic with exercises
const createSubTopic = (id: string, title: string, description: string): SubTopic => ({
  id,
  title,
  description,
  exercises: [
    { id: `${id}-ex1`, title: `${title} Worksheet`, type: 'worksheet', difficulty: 'easy' },
    { id: `${id}-ex2`, title: `${title} Activity`, type: 'activity', difficulty: 'medium' },
  ],
  funFacts: [
    { id: `${id}-ff1`, fact: `AI systems learn patterns just like you do - through practice and examples!`, category: 'ai' },
  ],
  didYouKnow: [
    { id: `${id}-dyk1`, content: `This concept is used in real-world AI applications every day!`, icon: 'lightbulb' },
  ],
});

// Helper to create mind map
const createMindMap = (id: string, title: string, children: string[]): MindMapNode => ({
  id,
  title,
  children: children.map((child, i) => ({
    id: `${id}-${i}`,
    title: child,
  })),
});

// Real curriculum data - CLASS 3: THINKING & SMART MACHINES
const class3Chapters: Chapter[] = [
  {
    id: "ch-3-1",
    number: 1,
    title: "Smart Things Around Us",
    description: "Exploring smart things we see every day and how machines help people",
    learningObjectives: [
      "Identify smart things in daily life",
      "Understand how machines help people",
      "Differentiate smart machines from normal machines",
      "Recognize AI as a friendly helper"
    ],
    pageCount: 16,
    subTopics: [
      createSubTopic("st-3-1-1", "Smart things we see every day", "Discovering AI-powered devices around us"),
      createSubTopic("st-3-1-2", "How machines help people", "Understanding the role of machines in our lives"),
      createSubTopic("st-3-1-3", "Smart machines vs normal machines", "Learning the difference between smart and regular devices"),
      createSubTopic("st-3-1-4", "AI as a friendly helper", "Introduction to AI as our helpful companion"),
    ],
    mindMap: createMindMap("mm-3-1", "Smart Things", ["Daily Devices", "Helping Humans", "Smart vs Normal", "AI Helper"]),
  },
  {
    id: "ch-3-2",
    number: 2,
    title: "Thinking Skills",
    description: "Developing thinking skills like a smart brain",
    learningObjectives: [
      "Think like a smart brain",
      "Practice step-by-step thinking",
      "Find patterns around us",
      "Choose the best answer",
      "Give clear instructions"
    ],
    pageCount: 18,
    subTopics: [
      createSubTopic("st-3-2-1", "Thinking like a smart brain", "Developing computational thinking skills"),
      createSubTopic("st-3-2-2", "Step-by-step thinking", "Learning sequential problem solving"),
      createSubTopic("st-3-2-3", "Finding patterns around us", "Pattern recognition in nature and daily life"),
      createSubTopic("st-3-2-4", "Choosing the best answer", "Decision making skills"),
      createSubTopic("st-3-2-5", "Giving clear instructions", "Learning to communicate clearly"),
    ],
    mindMap: createMindMap("mm-3-2", "Thinking Skills", ["Smart Brain", "Step-by-Step", "Patterns", "Best Answer", "Instructions"]),
  },
];

// CLASS 4: THINKING & SMART MACHINES
const class4Chapters: Chapter[] = [
  {
    id: "ch-4-1",
    number: 1,
    title: "Recognizing AI",
    description: "Learning to recognize AI in our daily lives",
    learningObjectives: [
      "Spot AI around you",
      "Understand how AI listens and responds",
      "See how AI learns from us",
      "Explore simple AI actions",
      "Learn about AI in games and apps"
    ],
    pageCount: 18,
    subTopics: [
      createSubTopic("st-4-1-1", "Spotting AI around you", "Identifying AI in everyday life"),
      createSubTopic("st-4-1-2", "How AI listens and responds", "Understanding voice assistants"),
      createSubTopic("st-4-1-3", "How AI learns from us", "Introduction to machine learning"),
      createSubTopic("st-4-1-4", "Simple AI actions", "Exploring basic AI behaviors"),
      createSubTopic("st-4-1-5", "AI in games and apps", "AI in entertainment"),
    ],
    mindMap: createMindMap("mm-4-1", "Recognizing AI", ["Spotting AI", "Listen & Respond", "Learning", "Actions", "Games"]),
  },
  {
    id: "ch-4-2",
    number: 2,
    title: "Logical Thinking",
    description: "Building logical thinking and sequencing skills",
    learningObjectives: [
      "Follow sequences in daily tasks",
      "Think in steps",
      "Spot and continue patterns",
      "Solve basic logic puzzles",
      "Sort and group objects logically"
    ],
    pageCount: 20,
    subTopics: [
      createSubTopic("st-4-2-1", "Sequences in daily tasks", "Understanding order and sequences"),
      createSubTopic("st-4-2-2", "Thinking in steps", "Breaking down problems"),
      createSubTopic("st-4-2-3", "Spotting and continuing patterns", "Pattern recognition and extension"),
      createSubTopic("st-4-2-4", "Solving basic logic puzzles", "Introduction to logical reasoning"),
      createSubTopic("st-4-2-5", "Sorting and grouping objects", "Classification skills"),
    ],
    mindMap: createMindMap("mm-4-2", "Logical Thinking", ["Sequences", "Steps", "Patterns", "Puzzles", "Sorting"]),
  },
];

// CLASS 5: UNDERSTANDING & INTERACTING WITH AI
const class5Chapters: Chapter[] = [
  {
    id: "ch-5-1",
    number: 1,
    title: "How AI Works",
    description: "Understanding the basics of how AI functions",
    learningObjectives: [
      "Understand basics of AI",
      "Learn about data and AI",
      "Explore training and learning in AI",
      "Understand AI predictions"
    ],
    pageCount: 20,
    subTopics: [
      createSubTopic("st-5-1-1", "Basics of AI", "Foundation of artificial intelligence"),
      createSubTopic("st-5-1-2", "Data and AI", "How data powers AI systems"),
      createSubTopic("st-5-1-3", "Training and learning", "How AI learns from examples"),
      createSubTopic("st-5-1-4", "AI predictions", "How AI makes predictions"),
    ],
    mindMap: createMindMap("mm-5-1", "How AI Works", ["Basics", "Data", "Training", "Predictions"]),
  },
  {
    id: "ch-5-2",
    number: 2,
    title: "Simple Coding Logic",
    description: "Introduction to coding concepts and logic",
    learningObjectives: [
      "Understand instructions for computers",
      "Learn order of operations",
      "Explore repeating patterns",
      "Make simple choices with conditions"
    ],
    pageCount: 22,
    subTopics: [
      createSubTopic("st-5-2-1", "Instructions for computers", "Understanding how computers follow commands"),
      createSubTopic("st-5-2-2", "Order of operations", "Learning sequence in programming"),
      createSubTopic("st-5-2-3", "Repeating patterns", "Introduction to loops"),
      createSubTopic("st-5-2-4", "Simple choices", "Basic conditional logic"),
    ],
    mindMap: createMindMap("mm-5-2", "Coding Logic", ["Instructions", "Order", "Repeating", "Choices"]),
  },
];

// CLASS 6: UNDERSTANDING & INTERACTING WITH AI
const class6Chapters: Chapter[] = [
  {
    id: "ch-6-1",
    number: 1,
    title: "AI Capabilities",
    description: "Exploring what AI can and cannot do",
    learningObjectives: [
      "Understand what AI can do",
      "Learn what AI cannot do",
      "Explore speech and vision recognition",
      "Understand AI in translation"
    ],
    pageCount: 22,
    subTopics: [
      createSubTopic("st-6-1-1", "What AI can do", "Exploring AI capabilities"),
      createSubTopic("st-6-1-2", "What AI cannot do", "Understanding AI limitations"),
      createSubTopic("st-6-1-3", "Speech recognition", "How AI understands voice"),
      createSubTopic("st-6-1-4", "Vision recognition", "How AI sees and interprets images"),
      createSubTopic("st-6-1-5", "AI in translation", "Language processing by AI"),
    ],
    mindMap: createMindMap("mm-6-1", "AI Capabilities", ["Can Do", "Cannot Do", "Speech", "Vision", "Translation"]),
  },
  {
    id: "ch-6-2",
    number: 2,
    title: "Coding Basics",
    description: "Foundation of programming with Scratch",
    learningObjectives: [
      "Understand algorithms",
      "Learn variables and data",
      "Explore conditions",
      "Master loops",
      "Get introduced to Scratch"
    ],
    pageCount: 24,
    subTopics: [
      createSubTopic("st-6-2-1", "Algorithms", "Step-by-step problem solving"),
      createSubTopic("st-6-2-2", "Variables and data", "Storing and using information"),
      createSubTopic("st-6-2-3", "Conditions", "Making decisions in code"),
      createSubTopic("st-6-2-4", "Loops", "Repeating actions efficiently"),
      createSubTopic("st-6-2-5", "Introduction to Scratch", "Visual programming platform"),
    ],
    mindMap: createMindMap("mm-6-2", "Coding Basics", ["Algorithms", "Variables", "Conditions", "Loops", "Scratch"]),
  },
];

// CLASS 7: CORE AI & PYTHON BASICS
const class7Chapters: Chapter[] = [
  {
    id: "ch-7-1",
    number: 1,
    title: "AI Core Concepts",
    description: "Deep dive into machine learning and AI fundamentals",
    learningObjectives: [
      "Understand machine learning basics",
      "Learn about data sets",
      "Explore AI training process",
      "Understand AI testing"
    ],
    pageCount: 24,
    subTopics: [
      createSubTopic("st-7-1-1", "Machine learning basics", "Foundation of ML"),
      createSubTopic("st-7-1-2", "Data sets", "Understanding training data"),
      createSubTopic("st-7-1-3", "Training AI", "How AI models are trained"),
      createSubTopic("st-7-1-4", "Testing AI", "Evaluating AI performance"),
    ],
    mindMap: createMindMap("mm-7-1", "AI Core", ["ML Basics", "Data Sets", "Training", "Testing"]),
  },
  {
    id: "ch-7-2",
    number: 2,
    title: "Python Basics",
    description: "Introduction to Python programming language",
    learningObjectives: [
      "Learn what Python is",
      "Write first program",
      "Understand input/output",
      "Work with variables and types"
    ],
    pageCount: 26,
    subTopics: [
      createSubTopic("st-7-2-1", "What is Python", "Introduction to Python language"),
      createSubTopic("st-7-2-2", "First program", "Writing Hello World"),
      createSubTopic("st-7-2-3", "Input/Output", "Reading and displaying data"),
      createSubTopic("st-7-2-4", "Variables & types", "Data storage in Python"),
    ],
    mindMap: createMindMap("mm-7-2", "Python Basics", ["What is Python", "First Program", "I/O", "Variables"]),
  },
];

// CLASS 8: CORE AI & PYTHON BASICS
const class8Chapters: Chapter[] = [
  {
    id: "ch-8-1",
    number: 1,
    title: "AI Applications",
    description: "Exploring real-world AI applications",
    learningObjectives: [
      "Understand AI in healthcare",
      "Learn about AI in transport",
      "Explore AI in entertainment",
      "Discuss AI safety and ethics"
    ],
    pageCount: 26,
    subTopics: [
      createSubTopic("st-8-1-1", "AI in healthcare", "Medical AI applications"),
      createSubTopic("st-8-1-2", "AI in transport", "Autonomous vehicles and logistics"),
      createSubTopic("st-8-1-3", "AI in entertainment", "AI in games and media"),
      createSubTopic("st-8-1-4", "AI safety and ethics", "Responsible AI use"),
    ],
    mindMap: createMindMap("mm-8-1", "AI Applications", ["Healthcare", "Transport", "Entertainment", "Ethics"]),
  },
  {
    id: "ch-8-2",
    number: 2,
    title: "Python Intermediate",
    description: "Building on Python fundamentals",
    learningObjectives: [
      "Master operators",
      "Learn conditionals",
      "Work with loops",
      "Create simple functions"
    ],
    pageCount: 28,
    subTopics: [
      createSubTopic("st-8-2-1", "Operators", "Mathematical and logical operators"),
      createSubTopic("st-8-2-2", "Conditionals", "If-else statements"),
      createSubTopic("st-8-2-3", "Loops", "For and while loops"),
      createSubTopic("st-8-2-4", "Simple functions", "Creating reusable code"),
    ],
    mindMap: createMindMap("mm-8-2", "Python Intermediate", ["Operators", "Conditionals", "Loops", "Functions"]),
  },
];

// CLASS 9: APPLIED AI & CODING
const class9Chapters: Chapter[] = [
  {
    id: "ch-9-1",
    number: 1,
    title: "AI Techniques",
    description: "Understanding supervised and unsupervised learning",
    learningObjectives: [
      "Understand supervised learning",
      "Learn unsupervised learning",
      "Explore classification",
      "Study clustering techniques"
    ],
    pageCount: 28,
    subTopics: [
      createSubTopic("st-9-1-1", "Supervised learning", "Learning with labeled data"),
      createSubTopic("st-9-1-2", "Unsupervised learning", "Finding patterns in unlabeled data"),
      createSubTopic("st-9-1-3", "Classification", "Categorizing data"),
      createSubTopic("st-9-1-4", "Clustering", "Grouping similar items"),
    ],
    mindMap: createMindMap("mm-9-1", "AI Techniques", ["Supervised", "Unsupervised", "Classification", "Clustering"]),
  },
  {
    id: "ch-9-2",
    number: 2,
    title: "Python Projects",
    description: "Practical Python programming projects",
    learningObjectives: [
      "Work with strings",
      "Master lists",
      "Understand dictionaries",
      "Complete mini projects"
    ],
    pageCount: 30,
    subTopics: [
      createSubTopic("st-9-2-1", "Strings", "Text manipulation in Python"),
      createSubTopic("st-9-2-2", "Lists", "Working with collections"),
      createSubTopic("st-9-2-3", "Dictionaries", "Key-value data structures"),
      createSubTopic("st-9-2-4", "Mini projects", "Hands-on coding projects"),
    ],
    mindMap: createMindMap("mm-9-2", "Python Projects", ["Strings", "Lists", "Dictionaries", "Projects"]),
  },
];

// CLASS 10: ADVANCED AI & CODING
const class10Chapters: Chapter[] = [
  {
    id: "ch-10-1",
    number: 1,
    title: "AI Systems",
    description: "Understanding complex AI systems and their limitations",
    learningObjectives: [
      "Understand what AI systems are",
      "Learn how AI systems work",
      "Explore data-driven decisions",
      "Study learning from data",
      "Understand AI limitations"
    ],
    pageCount: 30,
    subTopics: [
      createSubTopic("st-10-1-1", "What are AI systems", "Complex AI architectures"),
      createSubTopic("st-10-1-2", "How AI systems work", "System integration and flow"),
      createSubTopic("st-10-1-3", "Data driven decisions", "Decision-making with data"),
      createSubTopic("st-10-1-4", "Learning from data", "Advanced ML concepts"),
      createSubTopic("st-10-1-5", "AI limitations", "Current constraints of AI"),
    ],
    mindMap: createMindMap("mm-10-1", "AI Systems", ["What", "How", "Decisions", "Learning", "Limitations"]),
  },
  {
    id: "ch-10-2",
    number: 2,
    title: "Python Advanced",
    description: "Advanced Python programming concepts",
    learningObjectives: [
      "Master functions",
      "Advanced loops and conditions",
      "Work with lists and dictionaries",
      "Learn file basics",
      "Handle errors"
    ],
    pageCount: 32,
    subTopics: [
      createSubTopic("st-10-2-1", "Functions", "Advanced function concepts"),
      createSubTopic("st-10-2-2", "Loops & conditions", "Complex control flow"),
      createSubTopic("st-10-2-3", "Lists and dictionaries", "Advanced data structures"),
      createSubTopic("st-10-2-4", "File basics", "Reading and writing files"),
      createSubTopic("st-10-2-5", "Error handling", "Try-except blocks"),
    ],
    mindMap: createMindMap("mm-10-2", "Python Advanced", ["Functions", "Control Flow", "Data Structures", "Files", "Errors"]),
  },
];

// Seed data for books
export const booksData: BookData[] = [
  {
    id: "book-3",
    class: "Class 3",
    title: "Thinking & Smart Machines",
    subtitle: "Worksheet + Theory",
    description: "Smart things around us, how machines help people, and developing thinking skills",
    longDescription: "Begin your AI journey with fun activities exploring smart things around us. This workbook introduces young learners to the exciting world of artificial intelligence through age-appropriate concepts, step-by-step thinking, and engaging worksheets.",
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
    chapters: class3Chapters,
  },
  {
    id: "book-4",
    class: "Class 4",
    title: "Thinking & Smart Machines",
    subtitle: "Worksheet + Theory",
    description: "Recognizing AI in daily life, logical thinking, and sequencing skills",
    longDescription: "Expand your understanding of AI by learning to recognize it around you. This workbook builds on foundational knowledge with logical thinking, pattern recognition, and problem-solving activities.",
    price: 999,
    originalPrice: 1299,
    totalPages: 200,
    worksheets: 28,
    color: "from-blue-500 to-cyan-600",
    features: ["Step-by-step guides", "Logic puzzles", "Real-world examples", "Assessment tests"],
    isbn: "978-93-XXXXX-02-0",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class4Chapters,
  },
  {
    id: "book-5",
    class: "Class 5",
    title: "Understanding & Interacting with AI",
    subtitle: "Worksheet + Theory",
    description: "How AI works, data and predictions, simple coding logic with conditions",
    longDescription: "Dive deeper into AI concepts understanding how it works, learns, and makes predictions. Students begin their coding journey with simple logic concepts and algorithms.",
    price: 999,
    originalPrice: 1299,
    totalPages: 220,
    worksheets: 30,
    color: "from-violet-500 to-purple-600",
    features: ["Coding challenges", "AI concept maps", "Critical thinking exercises", "Online resources"],
    isbn: "978-93-XXXXX-03-7",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class5Chapters,
  },
  {
    id: "book-6",
    class: "Class 6",
    title: "Understanding & Interacting with AI",
    subtitle: "Worksheet + Theory",
    description: "AI capabilities, speech & vision recognition, coding basics with Scratch",
    longDescription: "Master AI capabilities and limitations while exploring speech and vision recognition. Begin hands-on programming with Scratch and learn fundamental coding concepts.",
    price: 999,
    originalPrice: 1299,
    totalPages: 240,
    worksheets: 32,
    color: "from-pink-500 to-rose-600",
    features: ["Scratch projects", "AI exploration", "Hands-on coding", "Video tutorials"],
    isbn: "978-93-XXXXX-04-4",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class6Chapters,
  },
  {
    id: "book-7",
    class: "Class 7",
    title: "Core AI & Python Basics",
    subtitle: "Worksheet + Theory",
    description: "Machine learning basics, data sets, Python introduction and first programs",
    longDescription: "Deep dive into core AI concepts including machine learning and data sets. Begin your Python programming journey with variables, input/output, and your first programs.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 260,
    worksheets: 36,
    color: "from-orange-500 to-amber-600",
    features: ["Python exercises", "ML concepts", "Hands-on projects", "Code examples"],
    isbn: "978-93-XXXXX-05-1",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class7Chapters,
  },
  {
    id: "book-8",
    class: "Class 8",
    title: "Core AI & Python Basics",
    subtitle: "Worksheet + Theory",
    description: "AI in healthcare, transport & entertainment, Python operators, loops, and functions",
    longDescription: "Explore real-world AI applications in healthcare, transport, and entertainment. Advance your Python skills with operators, conditionals, loops, and functions.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 280,
    worksheets: 36,
    color: "from-red-500 to-orange-600",
    features: ["Real-world AI cases", "Ethics discussions", "Python projects", "Assessment tests"],
    isbn: "978-93-XXXXX-06-8",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class8Chapters,
  },
  {
    id: "book-9",
    class: "Class 9",
    title: "Applied AI & Coding",
    subtitle: "Worksheet + Theory",
    description: "Supervised & unsupervised learning, classification, Python strings, lists & projects",
    longDescription: "Master AI techniques including supervised and unsupervised learning. Work with Python strings, lists, dictionaries and complete hands-on mini projects.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 300,
    worksheets: 40,
    color: "from-indigo-500 to-blue-600",
    features: ["AI techniques", "Mini projects", "Data structures", "Practical applications"],
    isbn: "978-93-XXXXX-07-5",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class9Chapters,
  },
  {
    id: "book-10",
    class: "Class 10",
    title: "Advanced AI & Coding",
    subtitle: "Worksheet + Theory",
    description: "AI systems, data-driven decisions, advanced Python with files and error handling",
    longDescription: "Understand complex AI systems and data-driven decision making. Master advanced Python with functions, file handling, and error management for real-world applications.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 320,
    worksheets: 44,
    color: "from-cyan-500 to-teal-600",
    features: ["Advanced AI", "File handling", "Error management", "Capstone project"],
    isbn: "978-93-XXXXX-08-2",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class10Chapters,
  },
];

// Utility functions
export const getBookById = (id: string): BookData | undefined => {
  return booksData.find(book => book.id === id);
};

export const getBookByClass = (classNum: string): BookData | undefined => {
  return booksData.find(book => book.class === classNum);
};

// Get total subtopics count for a book
export const getTotalSubTopics = (book: BookData): number => {
  return book.chapters.reduce((sum, chapter) => sum + chapter.subTopics.length, 0);
};

// Get total exercises count for a book
export const getTotalExercises = (book: BookData): number => {
  return book.chapters.reduce((sum, chapter) => 
    sum + chapter.subTopics.reduce((subSum, subTopic) => subSum + subTopic.exercises.length, 0), 0);
};
