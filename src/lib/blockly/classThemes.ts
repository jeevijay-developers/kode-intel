// Class-specific themes for CodeLab with unique colors, mascot moods, and messages

export interface ClassTheme {
  classLevel: number;
  name: string;
  tagline: string;
  gradient: string;
  accentColor: string;
  bgPattern: string;
  mascotMood: 'excited' | 'curious' | 'focused' | 'expert';
  mascotMessage: string;
  emoji: string;
  icon: string;
  welcomeTitle: string;
  features: string[];
}

export const classThemes: Record<number, ClassTheme> = {
  3: {
    classLevel: 3,
    name: "Explorer's Lab",
    tagline: "Start your coding adventure!",
    gradient: "from-lime/20 via-teal/10 to-sky/20",
    accentColor: "lime",
    bgPattern: "bg-[radial-gradient(circle_at_20%_80%,hsl(var(--lime)/0.15)_0%,transparent_50%)]",
    mascotMood: 'excited',
    mascotMessage: "Let's explore together! 🌟",
    emoji: "🌟",
    icon: "Rocket",
    welcomeTitle: "Welcome, Young Explorer!",
    features: ["Drag & Drop", "Colorful Blocks", "Fun Animations"]
  },
  4: {
    classLevel: 4,
    name: "Creator's Studio",
    tagline: "Create and imagine!",
    gradient: "from-sunny/20 via-coral/10 to-primary/20",
    accentColor: "sunny",
    bgPattern: "bg-[radial-gradient(circle_at_80%_20%,hsl(var(--sunny)/0.15)_0%,transparent_50%)]",
    mascotMood: 'curious',
    mascotMessage: "What will you create today? 🎨",
    emoji: "🎨",
    icon: "Palette",
    welcomeTitle: "Welcome, Creative Mind!",
    features: ["Art & Motion", "Sound Effects", "Story Blocks"]
  },
  5: {
    classLevel: 5,
    name: "Inventor's Workshop",
    tagline: "Build amazing things!",
    gradient: "from-teal/20 via-primary/10 to-lime/20",
    accentColor: "teal",
    bgPattern: "bg-[radial-gradient(circle_at_50%_0%,hsl(var(--teal)/0.15)_0%,transparent_50%)]",
    mascotMood: 'curious',
    mascotMessage: "Ready to invent? ⚡",
    emoji: "⚡",
    icon: "Lightbulb",
    welcomeTitle: "Welcome, Inventor!",
    features: ["Variables", "Logic Gates", "Math Magic"]
  },
  6: {
    classLevel: 6,
    name: "Logic Lab",
    tagline: "Think like a programmer!",
    gradient: "from-primary/20 via-secondary/10 to-teal/20",
    accentColor: "primary",
    bgPattern: "bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.15)_0%,transparent_50%)]",
    mascotMood: 'focused',
    mascotMessage: "Let's solve puzzles! 🧩",
    emoji: "🧩",
    icon: "Puzzle",
    welcomeTitle: "Welcome, Problem Solver!",
    features: ["Conditionals", "Loops", "Debugging"]
  },
  7: {
    classLevel: 7,
    name: "Coder's Dojo",
    tagline: "Master the fundamentals!",
    gradient: "from-secondary/20 via-primary/10 to-coral/20",
    accentColor: "secondary",
    bgPattern: "bg-[radial-gradient(circle_at_70%_30%,hsl(var(--secondary)/0.15)_0%,transparent_50%)]",
    mascotMood: 'focused',
    mascotMessage: "Train like a coder ninja! 🥷",
    emoji: "🥷",
    icon: "Swords",
    welcomeTitle: "Welcome to the Dojo!",
    features: ["Algorithms", "Console Output", "Functions"]
  },
  8: {
    classLevel: 8,
    name: "Algorithm Arena",
    tagline: "Challenge your skills!",
    gradient: "from-coral/20 via-sunny/10 to-primary/20",
    accentColor: "coral",
    bgPattern: "bg-[radial-gradient(circle_at_0%_50%,hsl(var(--coral)/0.15)_0%,transparent_50%)]",
    mascotMood: 'expert',
    mascotMessage: "Ready for the challenge? 🏆",
    emoji: "🏆",
    icon: "Trophy",
    welcomeTitle: "Welcome, Challenger!",
    features: ["Complex Logic", "Data Handling", "Optimization"]
  },
  9: {
    classLevel: 9,
    name: "Developer's Den",
    tagline: "Code like a pro!",
    gradient: "from-sky/20 via-teal/10 to-primary/20",
    accentColor: "sky",
    bgPattern: "bg-[radial-gradient(circle_at_100%_100%,hsl(var(--sky)/0.15)_0%,transparent_50%)]",
    mascotMood: 'expert',
    mascotMessage: "Welcome to the pro league! 🚀",
    emoji: "🚀",
    icon: "Code",
    welcomeTitle: "Welcome, Developer!",
    features: ["Advanced Algorithms", "Debugging Pro", "Project Building"]
  },
  10: {
    classLevel: 10,
    name: "Master's Terminal",
    tagline: "Think. Build. Innovate.",
    gradient: "from-primary/20 via-secondary/10 to-accent/20",
    accentColor: "primary",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.2)_0%,transparent_60%)]",
    mascotMood: 'expert',
    mascotMessage: "You've got this, Master! 👑",
    emoji: "👑",
    icon: "Crown",
    welcomeTitle: "Welcome, Master Coder!",
    features: ["System Design", "Advanced Data", "Real-World Apps"]
  }
};

export function getClassTheme(classLevel: number): ClassTheme {
  return classThemes[classLevel] || classThemes[5];
}

// Get mascot animation based on mood
export function getMascotAnimation(mood: ClassTheme['mascotMood']): string {
  switch (mood) {
    case 'excited':
      return 'animate-bounce';
    case 'curious':
      return 'animate-pulse';
    case 'focused':
      return 'animate-none hover:scale-105 transition-transform';
    case 'expert':
      return 'animate-none hover:rotate-3 transition-transform';
    default:
      return 'animate-bounce';
  }
}
