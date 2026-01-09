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
const createSubTopic = (id: string, title: string): SubTopic => ({
  id,
  title,
  description: `Learn about ${title.toLowerCase()} with engaging activities and worksheets`,
  exercises: [
    { id: `${id}-ex1`, title: `${title} - Practice Worksheet`, type: 'worksheet', difficulty: 'easy' },
    { id: `${id}-ex2`, title: `${title} - Activity`, type: 'activity', difficulty: 'medium' },
  ],
  funFacts: [
    { id: `${id}-ff1`, fact: `This concept helps build foundational AI and computational thinking skills!`, category: 'ai' },
  ],
  didYouKnow: [
    { id: `${id}-dyk1`, content: `Real-world AI systems use this concept every day!`, icon: 'lightbulb' },
  ],
});

// Helper to create chapter
const createChapter = (
  classNum: number,
  chapterNum: number,
  title: string,
  subTopicTitles: string[]
): Chapter => ({
  id: `ch-${classNum}-${chapterNum}`,
  number: chapterNum,
  title,
  description: `Explore ${title.toLowerCase()} with hands-on activities and worksheets`,
  learningObjectives: subTopicTitles.slice(0, 3).map(st => `Understand ${st.toLowerCase()}`),
  pageCount: 12 + subTopicTitles.length * 2,
  subTopics: subTopicTitles.map((st, i) => 
    createSubTopic(`st-${classNum}-${chapterNum}-${i + 1}`, st)
  ),
  mindMap: {
    id: `mm-${classNum}-${chapterNum}`,
    title,
    children: subTopicTitles.map((st, i) => ({
      id: `mm-${classNum}-${chapterNum}-${i + 1}`,
      title: st,
    })),
  },
});

// CLASS 3 – THINKING & SMART MACHINES
const class3Chapters: Chapter[] = [
  createChapter(3, 1, "Smart Things Around Us", [
    "Smart things we see every day",
    "How machines help people",
    "Smart machines vs normal machines",
    "AI as a friendly helper"
  ]),
  createChapter(3, 2, "Thinking Skills", [
    "Thinking like a smart brain",
    "Step-by-step thinking",
    "Finding patterns around us",
    "Choosing the best answer",
    "Giving clear instructions"
  ]),
  createChapter(3, 3, "Instructions & Actions", [
    "What are instructions",
    "Following instructions correctly",
    "Order of instructions",
    "Mistakes in instructions",
    "Why machines need clear instructions"
  ]),
  createChapter(3, 4, "Fun with Patterns", [
    "Patterns in shapes and colours",
    "Number patterns",
    "Sound and movement patterns",
    "Guessing what comes next",
    "Making our own patterns"
  ]),
  createChapter(3, 5, "Smart Decisions", [
    "Making choices in daily life",
    "Good choice vs bad choice",
    "Thinking before acting",
    "Simple decision making",
    "Smart choices with examples"
  ]),
  createChapter(3, 6, "AI as Our Friend", [
    "What AI means for us",
    "AI in games and toys",
    "AI in phones and TV",
    "AI helps people",
    "Using AI safely"
  ]),
];

// CLASS 4 – LOGIC & PROBLEM SOLVING
const class4Chapters: Chapter[] = [
  createChapter(4, 1, "Smart Thinking", [
    "Logical thinking explained",
    "Thinking clearly",
    "Solving simple problems",
    "Thinking before acting",
    "Using logic daily"
  ]),
  createChapter(4, 2, "Logical Skills", [
    "Thinking logically",
    "Breaking big problems into parts",
    "Arranging steps in order",
    "Finding and correcting mistakes",
    "Using rules to decide"
  ]),
  createChapter(4, 3, "Patterns & Sequences", [
    "Repeating patterns",
    "Growing patterns",
    "Ordering steps",
    "Patterns in numbers",
    "Patterns in daily life"
  ]),
  createChapter(4, 4, "Instructions & Flow", [
    "Writing clear instructions",
    "Order matters",
    "Following steps correctly",
    "Simple flow ideas",
    "Fixing wrong steps"
  ]),
  createChapter(4, 5, "Decisions & Rules", [
    "What are rules",
    "Following conditions",
    "If-then thinking",
    "Choosing best options",
    "Rules in machines"
  ]),
  createChapter(4, 6, "AI in Daily Life", [
    "AI at home",
    "AI in school",
    "AI in travel",
    "AI helping humans",
    "Safe use of AI"
  ]),
];

// CLASS 5 – COMPUTATIONAL THINKING
const class5Chapters: Chapter[] = [
  createChapter(5, 1, "Logical Thinking", [
    "What is logical thinking",
    "Cause and effect",
    "Thinking with reasons",
    "Logic in daily life",
    "Logic in machines"
  ]),
  createChapter(5, 2, "Problem Solving Skills", [
    "Breaking problems into steps",
    "Planning solutions",
    "Arranging steps correctly",
    "Finding errors",
    "Using rules and conditions"
  ]),
  createChapter(5, 3, "Algorithms Basics", [
    "What is an algorithm",
    "Writing simple algorithms",
    "Step-by-step solutions",
    "Algorithms in daily life",
    "Correct vs wrong algorithms"
  ]),
  createChapter(5, 4, "Flow of Steps", [
    "Understanding sequence",
    "Order of instructions",
    "Simple flow ideas",
    "Fixing wrong flows",
    "Planning solutions"
  ]),
  createChapter(5, 5, "Decision Making", [
    "Using conditions",
    "If-else thinking",
    "Logical choices",
    "Machine decisions",
    "Human vs machine thinking"
  ]),
  createChapter(5, 6, "AI Introduction", [
    "What AI is",
    "AI around us",
    "AI in apps",
    "AI helps humans",
    "Responsible use"
  ]),
];

// CLASS 6 – COMPUTATIONAL THINKING CORE
const class6Chapters: Chapter[] = [
  createChapter(6, 1, "Computational Thinking", [
    "What is computational thinking",
    "Thinking like a computer",
    "Problem understanding",
    "Step-wise solutions",
    "Real life examples"
  ]),
  createChapter(6, 2, "Core Thinking Skills", [
    "Decomposition",
    "Pattern recognition",
    "Abstraction",
    "Designing algorithms",
    "Applying logic"
  ]),
  createChapter(6, 3, "Algorithms", [
    "Meaning of algorithms",
    "Writing algorithms",
    "Correct steps",
    "Improving algorithms",
    "Testing logic"
  ]),
  createChapter(6, 4, "Flowcharts", [
    "What is a flowchart",
    "Flowchart symbols",
    "Drawing simple flowcharts",
    "Decision making in flowcharts",
    "Fixing flowchart errors"
  ]),
  createChapter(6, 5, "Problem Solving", [
    "Logical planning",
    "Error checking",
    "Improving solutions",
    "Smart problem solving",
    "Preparing for coding"
  ]),
  createChapter(6, 6, "AI Basics", [
    "AI meaning",
    "AI systems",
    "AI examples",
    "AI limitations",
    "Ethical use"
  ]),
];

// CLASS 7 – ALGORITHMS & FLOWCHARTS
const class7Chapters: Chapter[] = [
  createChapter(7, 1, "Introduction to AI", [
    "What is AI",
    "History of AI",
    "AI vs human intelligence",
    "Examples of AI",
    "Where AI is used"
  ]),
  createChapter(7, 2, "Algorithms & Flowcharts", [
    "What is an algorithm",
    "Writing algorithms",
    "Understanding flowcharts",
    "Creating flowcharts",
    "Improving algorithms"
  ]),
  createChapter(7, 3, "Logical Structures", [
    "Sequence logic",
    "Decision logic",
    "Conditions",
    "Rules in machines",
    "Logical problem solving"
  ]),
  createChapter(7, 4, "Data & Patterns", [
    "Understanding data",
    "Types of data",
    "Pattern recognition",
    "Using patterns",
    "Data in AI"
  ]),
  createChapter(7, 5, "Problem Solving", [
    "Breaking complex problems",
    "Designing solutions",
    "Testing logic",
    "Improving output",
    "Thinking efficiently"
  ]),
  createChapter(7, 6, "AI in Society", [
    "AI benefits",
    "AI challenges",
    "AI ethics",
    "Responsible AI",
    "Future of AI"
  ]),
];

// CLASS 8 – PROGRAMMING FOUNDATIONS
const class8Chapters: Chapter[] = [
  createChapter(8, 1, "Programming Basics", [
    "What is programming",
    "Why programming is needed",
    "Programming languages",
    "Coding vs thinking",
    "Real world programs"
  ]),
  createChapter(8, 2, "Programming Concepts", [
    "Variables",
    "Data types",
    "Conditions",
    "Loops",
    "Program flow"
  ]),
  createChapter(8, 3, "Python Introduction", [
    "What is Python",
    "Python syntax basics",
    "Writing first program",
    "Input and output",
    "Simple logic"
  ]),
  createChapter(8, 4, "Control Structures", [
    "If conditions",
    "If-else",
    "Nested conditions",
    "Loops concept",
    "Repeating tasks"
  ]),
  createChapter(8, 5, "AI & Data", [
    "Data and AI",
    "Patterns in data",
    "Decisions using data",
    "AI examples",
    "Limitations"
  ]),
  createChapter(8, 6, "Problem Solving with Code", [
    "Logical coding",
    "Debugging basics",
    "Improving code",
    "Practice problems",
    "Mini projects"
  ]),
];

// CLASS 9 – AI & PYTHON
const class9Chapters: Chapter[] = [
  createChapter(9, 1, "Artificial Intelligence", [
    "AI definition",
    "Types of AI",
    "AI applications",
    "AI advantages",
    "AI risks"
  ]),
  createChapter(9, 2, "Python Programming", [
    "Python basics",
    "Variables and data",
    "Conditions",
    "Loops",
    "Functions"
  ]),
  createChapter(9, 3, "Data Handling", [
    "Data types",
    "Lists and dictionaries",
    "Data processing",
    "Patterns in data",
    "Real examples"
  ]),
  createChapter(9, 4, "AI Logic", [
    "Decision making",
    "Rules based systems",
    "Simple AI logic",
    "Human vs AI thinking",
    "Ethical AI"
  ]),
  createChapter(9, 5, "Problem Solving", [
    "Algorithm design",
    "Flowchart logic",
    "Debugging",
    "Code optimization",
    "Practice projects"
  ]),
  createChapter(9, 6, "AI Applications", [
    "AI in health",
    "AI in education",
    "AI in business",
    "AI in daily life",
    "Future careers"
  ]),
];

// CLASS 10 – ADVANCED AI & CODING
const class10Chapters: Chapter[] = [
  createChapter(10, 1, "AI Systems", [
    "What are AI systems",
    "How AI systems work",
    "Data driven decisions",
    "Learning from data",
    "AI limitations"
  ]),
  createChapter(10, 2, "Python Advanced", [
    "Functions",
    "Loops & conditions",
    "Lists and dictionaries",
    "File basics",
    "Error handling"
  ]),
  createChapter(10, 3, "Introduction to Java", [
    "What is Java",
    "Java basics",
    "Variables",
    "Conditions",
    "Simple programs"
  ]),
  createChapter(10, 4, "AI & Machine Learning", [
    "What is machine learning",
    "Learning from examples",
    "AI models",
    "Real world examples",
    "Responsible AI"
  ]),
  createChapter(10, 5, "Projects & Practice", [
    "Problem identification",
    "Solution planning",
    "Coding projects",
    "Testing solutions",
    "Improving output"
  ]),
  createChapter(10, 6, "Future Readiness", [
    "AI careers",
    "Skill roadmap",
    "Coding pathways",
    "Ethics & safety",
    "Lifelong learning"
  ]),
];

// Seed data for books
export const booksData: BookData[] = [
  {
    id: "book-3",
    class: "Class 3",
    title: "Thinking & Smart Machines",
    subtitle: "Worksheet + Theory",
    description: "Smart things around us, thinking skills, patterns, and AI as our friend",
    longDescription: "Begin your AI journey with fun activities exploring smart things around us. This workbook introduces young learners to the exciting world of artificial intelligence through patterns, instructions, smart decisions, and understanding AI as a friendly helper.",
    price: 999,
    originalPrice: 1299,
    totalPages: 180,
    worksheets: 48,
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
    title: "Logic & Problem Solving",
    subtitle: "Worksheet + Theory",
    description: "Smart thinking, logical skills, patterns, decisions, and AI in daily life",
    longDescription: "Develop logical thinking and problem-solving skills through engaging activities. Learn to break problems into parts, recognize patterns, follow instructions, and understand how AI is used in our daily lives.",
    price: 999,
    originalPrice: 1299,
    totalPages: 200,
    worksheets: 52,
    color: "from-blue-500 to-cyan-600",
    features: ["Logic puzzles", "Problem-solving activities", "Real-world examples", "Assessment tests"],
    isbn: "978-93-XXXXX-02-0",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class4Chapters,
  },
  {
    id: "book-5",
    class: "Class 5",
    title: "Computational Thinking",
    subtitle: "Worksheet + Theory",
    description: "Logical thinking, algorithms basics, decision making, and AI introduction",
    longDescription: "Master computational thinking skills with hands-on activities. Learn logical reasoning, problem-solving steps, algorithm basics, decision making, and get introduced to AI concepts and responsible use.",
    price: 999,
    originalPrice: 1299,
    totalPages: 220,
    worksheets: 56,
    color: "from-violet-500 to-purple-600",
    features: ["Algorithm exercises", "Critical thinking", "Step-by-step guides", "Online resources"],
    isbn: "978-93-XXXXX-03-7",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class5Chapters,
  },
  {
    id: "book-6",
    class: "Class 6",
    title: "Computational Thinking Core",
    subtitle: "Worksheet + Theory",
    description: "Core thinking skills, algorithms, flowcharts, problem solving, and AI basics",
    longDescription: "Deep dive into computational thinking core concepts including decomposition, pattern recognition, abstraction, algorithms, flowcharts, and AI fundamentals with ethical considerations.",
    price: 999,
    originalPrice: 1299,
    totalPages: 240,
    worksheets: 60,
    color: "from-pink-500 to-rose-600",
    features: ["Flowchart activities", "Decomposition exercises", "AI exploration", "Video tutorials"],
    isbn: "978-93-XXXXX-04-4",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class6Chapters,
  },
  {
    id: "book-7",
    class: "Class 7",
    title: "Algorithms & Flowcharts",
    subtitle: "Worksheet + Theory",
    description: "AI introduction, algorithms, logical structures, data patterns, and AI in society",
    longDescription: "Explore the world of algorithms and flowcharts while understanding AI history and its role in society. Learn logical structures, data patterns, problem-solving techniques, and responsible AI use.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 260,
    worksheets: 64,
    color: "from-orange-500 to-amber-600",
    features: ["Algorithm design", "Flowchart creation", "AI history", "Ethics discussions"],
    isbn: "978-93-XXXXX-05-1",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class7Chapters,
  },
  {
    id: "book-8",
    class: "Class 8",
    title: "Programming Foundations",
    subtitle: "Worksheet + Theory",
    description: "Programming basics, Python introduction, control structures, AI & data",
    longDescription: "Begin your programming journey with foundational concepts. Learn variables, data types, conditions, loops, Python basics, and understand the relationship between AI and data through hands-on coding exercises.",
    price: 1099,
    originalPrice: 1399,
    totalPages: 280,
    worksheets: 68,
    color: "from-red-500 to-orange-600",
    features: ["Python exercises", "Coding activities", "Mini projects", "Debugging practice"],
    isbn: "978-93-XXXXX-06-8",
    publisher: "KodeIntel Publications",
    edition: "2024 Edition",
    language: "English",
    chapters: class8Chapters,
  },
  {
    id: "book-9",
    class: "Class 9",
    title: "AI & Python",
    subtitle: "Worksheet + Theory",
    description: "Artificial Intelligence, Python programming, data handling, AI applications",
    longDescription: "Master AI concepts and Python programming together. Learn about different types of AI, data handling with lists and dictionaries, AI logic systems, and explore real-world AI applications in health, education, and business.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 300,
    worksheets: 72,
    color: "from-indigo-500 to-blue-600",
    features: ["AI projects", "Python coding", "Data structures", "Career guidance"],
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
    description: "AI systems, advanced Python, Java introduction, machine learning, future readiness",
    longDescription: "Prepare for the future with advanced AI and coding skills. Learn about AI systems, advanced Python with file handling, Java introduction, machine learning concepts, and develop skills for future AI careers.",
    price: 1199,
    originalPrice: 1499,
    totalPages: 320,
    worksheets: 76,
    color: "from-cyan-500 to-teal-600",
    features: ["Java basics", "ML introduction", "Capstone projects", "Career roadmap"],
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
