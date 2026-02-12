import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore - jsPDF from esm.sh
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContentBlock {
  type: string;
  title?: string;
  content?: string;
  items?: string[];
  columns?: { left: string[]; right: string[]; leftTitle?: string; rightTitle?: string };
  variant?: string;
  icon?: string;
  // Worksheet fields
  questions?: WorksheetQuestion[];
}

interface WorksheetQuestion {
  type: "fill_blank" | "true_false" | "match_column" | "short_answer";
  question?: string;
  options?: string[];
  leftColumn?: string[];
  rightColumn?: string[];
}

interface SampleChapter {
  classNum: number;
  title: string;
  subtitle: string;
  blocks: ContentBlock[];
}

// Color themes per class
const classThemes: Record<number, { primary: number[]; secondary: number[]; accent: number[]; light: number[]; dark: number[]; bgTint: number[] }> = {
  3: { primary: [76, 175, 80], secondary: [255, 193, 7], accent: [255, 87, 34], light: [232, 245, 233], dark: [27, 94, 32], bgTint: [245, 255, 245] },
  5: { primary: [33, 150, 243], secondary: [255, 152, 0], accent: [156, 39, 176], light: [227, 242, 253], dark: [13, 71, 161], bgTint: [240, 248, 255] },
  8: { primary: [123, 31, 162], secondary: [0, 150, 136], accent: [233, 30, 99], light: [243, 229, 245], dark: [74, 20, 140], bgTint: [248, 240, 255] },
  9: { primary: [21, 101, 192], secondary: [255, 82, 82], accent: [0, 137, 123], light: [227, 242, 253], dark: [13, 71, 161], bgTint: [240, 245, 255] },
  10: { primary: [48, 63, 159], secondary: [255, 179, 0], accent: [0, 121, 107], light: [232, 234, 246], dark: [26, 35, 126], bgTint: [242, 243, 255] },
};

// ============= SAMPLE CONTENT =============
const sampleBookChapters: SampleChapter[] = [
  {
    classNum: 3,
    title: "Meet the Computer",
    subtitle: "Your New Digital Friend!",
    blocks: [
      { type: "text", title: "What is a Computer?", content: "A computer is an electronic machine that helps us do many things — like drawing, writing stories, playing games, watching videos, and even talking to friends far away! Just like how we use our brain to think and solve problems, a computer uses its own 'brain' called a processor to follow instructions and get things done really fast." },
      { type: "callout", variant: "fun_fact", content: "Did you know? The first computer was so big that it filled an entire room — bigger than your classroom! Today, computers are small enough to fit in your pocket (like a smartphone).", icon: "star" },
      { type: "key_term", title: "Processor (CPU)", content: "The 'brain' of the computer that thinks and works very fast. CPU stands for Central Processing Unit." },
      { type: "text", title: "Parts of a Computer", content: "Just like our body has different parts — eyes to see, ears to hear, hands to touch — a computer also has different parts that help it work. Let's learn about each one!" },
      { type: "step_by_step", title: "Main Parts of a Computer", items: ["Monitor — The screen where you see everything. It's like the computer's face!", "Keyboard — Has buttons with letters, numbers, and symbols. You type using it, just like writing in a notebook.", "Mouse — A small device you move around to point and click on things on the screen.", "CPU (System Unit) — The box that contains the computer's brain and memory. It does all the thinking!", "Speakers — Let you hear sounds, music, and voices from the computer."] },
      { type: "comparison", title: "Input vs Output Devices", columns: { leftTitle: "Input Devices (We give info)", rightTitle: "Output Devices (Computer gives results)", left: ["Keyboard — we type letters", "Mouse — we click and point", "Microphone — we speak into it", "Camera — we show our face"], right: ["Monitor — we see pictures & text", "Speakers — we hear sounds", "Printer — we get papers printed", "Headphones — we hear privately"] } },
      { type: "callout", variant: "tip", content: "Easy way to remember: INPUT means 'going IN to the computer' and OUTPUT means 'coming OUT from the computer'!", icon: "lightbulb" },
      { type: "key_term", title: "Hardware", content: "The parts of a computer you can touch and feel — like the keyboard, mouse, and monitor. They are the physical parts." },
      { type: "key_term", title: "Software", content: "The programs and apps inside the computer that you cannot touch — like games, drawing apps, and web browsers." },
      { type: "activity", title: "Quick Activity: Computer Parts Hunt!", content: "Look around your home or school. Can you find these computer parts? Make a list!", items: ["Monitor/Screen", "Keyboard", "Mouse or Touchpad", "Speakers or Headphones", "Printer (if available)"] },
      { type: "worksheet", title: "Worksheet: Test Your Knowledge!", questions: [
        { type: "fill_blank", question: "The _______ is the brain of the computer." },
        { type: "fill_blank", question: "A _______ is used to type letters and numbers." },
        { type: "true_false", question: "A mouse is an output device.", options: ["True", "False"] },
        { type: "true_false", question: "Software are programs we cannot touch.", options: ["True", "False"] },
        { type: "match_column", leftColumn: ["Keyboard", "Monitor", "Mouse", "Speakers"], rightColumn: ["Screen display", "Typing device", "Pointing device", "Sound output"] },
        { type: "short_answer", question: "Name two input devices and two output devices." },
      ]},
      { type: "summary", title: "Chapter Summary", content: "In this chapter, we learned that a computer is an electronic machine with different parts. Input devices help us send information to the computer, and output devices help the computer show us results. The CPU is the brain, and we can divide computer parts into hardware (things we touch) and software (programs we use)." }
    ]
  },
  {
    classNum: 5,
    title: "Thinking Like a Computer",
    subtitle: "Introduction to Computational Thinking",
    blocks: [
      { type: "text", title: "What is Computational Thinking?", content: "Computational Thinking (CT) is a way of solving problems step by step — just like a computer does! But you don't need a computer to use it. You can use computational thinking to solve everyday problems like organizing your school bag, planning a birthday party, or even making a sandwich!" },
      { type: "callout", variant: "info", content: "Computational Thinking is not about thinking like a robot. It's about breaking big problems into smaller, manageable pieces and finding smart solutions!", icon: "brain" },
      { type: "key_term", title: "Computational Thinking", content: "A problem-solving approach that involves breaking problems down, finding patterns, focusing on what's important, and creating step-by-step solutions." },
      { type: "text", title: "The Four Pillars of CT", content: "Computational Thinking has four main skills, often called 'pillars.' Think of them as four superpowers that help you solve any problem!" },
      { type: "step_by_step", title: "The Four Pillars", items: ["Decomposition — Breaking a big problem into smaller, easier parts.", "Pattern Recognition — Finding similarities or repeating elements.", "Abstraction — Focusing on what's important and ignoring unnecessary details.", "Algorithm Design — Creating step-by-step instructions to solve the problem."] },
      { type: "comparison", title: "With vs Without CT", columns: { leftTitle: "Without CT (Confused!)", rightTitle: "With CT (Organized!)", left: ["\"This project is too big!\"", "\"I don't know where to start\"", "\"Everything seems important\"", "\"I'll figure it out as I go\""], right: ["\"Let me break it into small tasks\"", "\"I'll start with the easiest part\"", "\"Let me focus on key details\"", "\"Here's my step-by-step plan\""] } },
      { type: "callout", variant: "fun_fact", content: "Even making a cup of tea uses computational thinking! You decompose the task, follow a pattern, abstract away unimportant details, and follow an algorithm.", icon: "star" },
      { type: "key_term", title: "Algorithm", content: "A set of clear, step-by-step instructions to solve a problem or complete a task." },
      { type: "key_term", title: "Decomposition", content: "Breaking a complex problem into smaller, more manageable sub-problems." },
      { type: "activity", title: "Activity: Decompose Your Morning Routine!", content: "Think about everything you do from waking up to reaching school. Break it down into at least 8 steps.", items: ["Write down every single step of your morning", "Circle the steps that repeat every day (patterns)", "Cross out any steps that aren't necessary (abstraction)", "Number your final steps in order (algorithm!)"] },
      { type: "worksheet", title: "Worksheet: Think Like a Computer!", questions: [
        { type: "fill_blank", question: "The four pillars of CT are Decomposition, _______, Abstraction, and _______." },
        { type: "true_false", question: "Decomposition means combining small problems into big ones.", options: ["True", "False"] },
        { type: "true_false", question: "An algorithm is a set of step-by-step instructions.", options: ["True", "False"] },
        { type: "short_answer", question: "Write a simple algorithm for brushing your teeth (at least 5 steps)." },
        { type: "short_answer", question: "Give an example of pattern recognition from your daily life." },
      ]},
      { type: "summary", title: "Chapter Summary", content: "Computational Thinking is a powerful problem-solving method with four pillars: Decomposition, Pattern Recognition, Abstraction, and Algorithm Design. These skills help in coding, school, and everyday life!" }
    ]
  },
  {
    classNum: 8,
    title: "What is Artificial Intelligence?",
    subtitle: "When Machines Start to Think",
    blocks: [
      { type: "text", title: "Welcome to the World of AI!", content: "Artificial Intelligence, or AI, is the science of making machines that can think, learn, and make decisions — similar to how humans do! AI is one of the most exciting and important technologies of the 21st century." },
      { type: "callout", variant: "info", content: "AI doesn't mean robots walking around like humans. Most AI today is 'narrow AI' — it's really good at ONE specific task, like recognizing faces or translating languages.", icon: "robot" },
      { type: "key_term", title: "Artificial Intelligence (AI)", content: "The field of computer science focused on creating systems that can perform tasks that normally require human intelligence." },
      { type: "text", title: "AI in Your Daily Life", content: "You might think AI is something futuristic, but you're already using it every day! From voice assistants to recommendations on YouTube." },
      { type: "step_by_step", title: "AI Examples You Use Daily", items: ["Voice Assistants — Siri, Alexa, Google Assistant understand your voice.", "Auto-Correct & Predictive Text — Your phone predicts what you're typing.", "YouTube & Netflix — AI suggests videos you might like.", "Face Unlock — Your phone recognizes YOUR face.", "Google Search — AI understands your question and finds answers.", "Instagram Filters — AI detects your face and adds effects."] },
      { type: "comparison", title: "Human vs Artificial Intelligence", columns: { leftTitle: "Human Intelligence", rightTitle: "Artificial Intelligence", left: ["Learns from experience & emotions", "Can be creative and imaginative", "Gets tired and needs rest", "Can do many different tasks"], right: ["Learns from data and patterns", "Follows rules and patterns", "Never gets tired, works 24/7", "Usually excels at one specific task"] } },
      { type: "key_term", title: "Machine Learning (ML)", content: "A subset of AI where machines learn from data and improve over time WITHOUT being explicitly programmed for every scenario." },
      { type: "callout", variant: "fun_fact", content: "Alan Turing is often called the 'Father of Computer Science.' During WWII, he built a machine that cracked the Nazi 'Enigma' code!", icon: "star" },
      { type: "key_term", title: "Turing Test", content: "A test to determine if a machine can exhibit intelligent behavior indistinguishable from a human." },
      { type: "activity", title: "Activity: AI or Not AI?", content: "For each of these, decide: Is it using AI or just regular programming?", items: ["A calculator that adds two numbers", "A spam filter that learns which emails are junk", "A traffic light that changes every 60 seconds", "A self-driving car that avoids obstacles", "A chatbot that answers questions naturally"] },
      { type: "worksheet", title: "Worksheet: AI Explorer!", questions: [
        { type: "fill_blank", question: "AI stands for _______  _______." },
        { type: "fill_blank", question: "_______ Learning is a subset of AI where machines learn from data." },
        { type: "true_false", question: "Most AI today can do everything a human can do.", options: ["True", "False"] },
        { type: "true_false", question: "The Turing Test checks if a machine can think like a human.", options: ["True", "False"] },
        { type: "match_column", leftColumn: ["Siri", "Netflix", "Face Unlock", "Spam Filter"], rightColumn: ["Recommendations", "Voice Recognition", "Image Recognition", "Email Sorting"] },
        { type: "short_answer", question: "Name three AI applications you use in your daily life and explain how they work." },
      ]},
      { type: "summary", title: "Chapter Summary", content: "Artificial Intelligence is about making machines that can perform tasks requiring human-like intelligence. AI is already in our daily lives. Machine Learning allows machines to learn from data. The Turing Test helps us think about whether machines can truly 'think.'" }
    ]
  },
  {
    classNum: 9,
    title: "How Machines Learn",
    subtitle: "The Magic Behind Machine Learning",
    blocks: [
      { type: "text", title: "From Rules to Learning", content: "Traditional programming gives the computer exact rules. Machine Learning flips this: instead of giving rules, you give examples (data), and it figures out the rules on its own!" },
      { type: "callout", variant: "info", content: "Traditional Programming = Data + Rules -> Answer. Machine Learning = Data + Answers -> Rules!", icon: "brain" },
      { type: "key_term", title: "Machine Learning", content: "A branch of AI where computers learn patterns from data and make predictions without being explicitly programmed." },
      { type: "key_term", title: "Training Data", content: "The collection of examples used to teach a machine learning model." },
      { type: "text", title: "Types of Machine Learning", content: "Just like there are different ways humans learn, machines also have different learning approaches." },
      { type: "step_by_step", title: "Three Types of Machine Learning", items: ["Supervised Learning — The machine learns from labeled examples. Like a teacher showing solved problems.", "Unsupervised Learning — The machine finds hidden patterns WITHOUT labels. Like sorting candies by color.", "Reinforcement Learning — The machine learns by trial and error with rewards and penalties. Like training a puppy."] },
      { type: "comparison", title: "Supervised vs Unsupervised", columns: { leftTitle: "Supervised Learning", rightTitle: "Unsupervised Learning", left: ["Uses labeled data", "Teacher guides learning", "Predicts specific outcomes", "Example: Spam detection"], right: ["Uses unlabeled data", "Discovers patterns alone", "Finds hidden structures", "Example: Customer groups"] } },
      { type: "key_term", title: "Model", content: "The mathematical representation built after learning from training data. It makes predictions on new, unseen data." },
      { type: "callout", variant: "fun_fact", content: "Google Photos uses ML trained on billions of images. It can recognize your face, your pet, and even landmarks!", icon: "star" },
      { type: "activity", title: "Activity: Train Your Classmate!", content: "Play a 'Human Machine Learning' game!", items: ["Trainer: Draw 10 shapes — some circles, some squares (label each)", "Machine: Look at labeled examples and learn the difference", "Trainer: Draw 5 NEW shapes without labels", "Machine: Predict if each new shape is a circle or square", "Check accuracy: How many did the 'machine' get right?"] },
      { type: "worksheet", title: "Worksheet: ML Master!", questions: [
        { type: "fill_blank", question: "In Supervised Learning, the data is _______." },
        { type: "fill_blank", question: "_______ Learning uses rewards and penalties." },
        { type: "true_false", question: "Unsupervised learning uses labeled data.", options: ["True", "False"] },
        { type: "true_false", question: "Training data quality affects model accuracy.", options: ["True", "False"] },
        { type: "match_column", leftColumn: ["Supervised", "Unsupervised", "Reinforcement", "Training Data"], rightColumn: ["Trial and error", "Labeled examples", "Finding patterns", "Input examples"] },
        { type: "short_answer", question: "Explain the difference between supervised and unsupervised learning with a real-world example." },
      ]},
      { type: "summary", title: "Chapter Summary", content: "Machine Learning allows computers to learn from data. Three main types: Supervised, Unsupervised, and Reinforcement learning. Training data quality is crucial. ML powers many modern applications." }
    ]
  },
  {
    classNum: 10,
    title: "AI in the Real World",
    subtitle: "Applications, Ethics & the Future",
    blocks: [
      { type: "text", title: "AI: Transforming Every Industry", content: "Artificial Intelligence is actively transforming every industry. From healthcare to education, transportation to entertainment, AI is creating solutions to problems we once thought impossible." },
      { type: "callout", variant: "info", content: "By 2030, AI is expected to contribute over $15.7 trillion to the global economy. India alone could see a $957 billion boost from AI adoption.", icon: "globe" },
      { type: "text", title: "AI in Healthcare", content: "AI is revolutionizing medicine by helping doctors diagnose diseases earlier and more accurately. AI can analyze medical images and detect cancers, sometimes more accurately than experienced doctors!" },
      { type: "step_by_step", title: "AI Applications Across Industries", items: ["Healthcare — Disease diagnosis, drug discovery, personalized treatment.", "Education — Adaptive learning, automated grading, personalized study paths.", "Transportation — Self-driving cars, traffic optimization, drone deliveries.", "Finance — Fraud detection, algorithmic trading, credit scoring.", "Agriculture — Crop disease detection, yield prediction, automated irrigation.", "Entertainment — Recommendations, AI-generated art, game development."] },
      { type: "comparison", title: "AI Benefits vs Challenges", columns: { leftTitle: "Benefits of AI", rightTitle: "Challenges & Concerns", left: ["Saves time and increases efficiency", "Reduces human error", "Available 24/7", "Processes huge data", "Creates new jobs"], right: ["May replace certain jobs", "Bias if training data is biased", "Privacy concerns", "High energy consumption", "Ethical dilemmas"] } },
      { type: "key_term", title: "AI Ethics", content: "The study of moral principles and guidelines for the development and use of AI systems." },
      { type: "key_term", title: "Bias in AI", content: "When an AI system produces unfair results because its training data contains existing societal biases." },
      { type: "step_by_step", title: "The FATE Framework", items: ["Fairness — AI should treat all people equally.", "Accountability — Someone must be responsible when AI makes mistakes.", "Transparency — People should understand HOW an AI decides.", "Ethics — AI should respect human rights, privacy, and dignity."] },
      { type: "callout", variant: "tip", content: "Remember: AI is a tool created by humans. It reflects our values and biases. The responsibility to make AI fair lies with US.", icon: "lightbulb" },
      { type: "activity", title: "Activity: Design an AI Solution!", content: "Choose a real-world problem in your community. Design an AI-powered solution!", items: ["Identify a problem (e.g., food waste, traffic, water wastage)", "What data would your AI need?", "What type of ML would you use?", "What ethical concerns should you consider?", "Draw a simple flowchart of your AI solution"] },
      { type: "worksheet", title: "Worksheet: AI Ethics & Applications!", questions: [
        { type: "fill_blank", question: "FATE stands for Fairness, _______, Transparency, and _______." },
        { type: "fill_blank", question: "AI _______ occurs when training data contains societal biases." },
        { type: "true_false", question: "AI can completely replace doctors in healthcare.", options: ["True", "False"] },
        { type: "true_false", question: "Transparency means people should understand how AI decides.", options: ["True", "False"] },
        { type: "match_column", leftColumn: ["Healthcare", "Finance", "Agriculture", "Education"], rightColumn: ["Fraud detection", "Disease diagnosis", "Crop prediction", "Adaptive learning"] },
        { type: "short_answer", question: "Describe one ethical concern with AI and suggest a solution for it." },
      ]},
      { type: "summary", title: "Chapter Summary", content: "AI is transforming industries worldwide. While AI offers tremendous benefits, it also raises challenges. The FATE framework guides responsible AI development. As future AI leaders, we must ensure it benefits all of humanity." }
    ]
  }
];

// ============= PDF DRAWING HELPERS =============

function drawRoundedRect(doc: any, x: number, y: number, w: number, h: number, r: number, style: string = 'F') {
  doc.roundedRect(x, y, w, h, r, r, style);
}

function drawStar(doc: any, cx: number, cy: number, size: number, color: number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
  // Simplified star as a filled circle with rays
  doc.circle(cx, cy, size, 'F');
}

function drawDecorativeDots(doc: any, x: number, y: number, w: number, count: number, color: number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
  const spacing = w / (count + 1);
  for (let i = 1; i <= count; i++) {
    doc.circle(x + spacing * i, y, 1.2, 'F');
  }
}

function wrapText(doc: any, text: string, maxWidth: number, fontSize: number): string[] {
  doc.setFontSize(fontSize);
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function checkPageBreak(doc: any, y: number, needed: number, theme: any, classNum: number, title: string, pageNum: { value: number }): number {
  if (y + needed > 275) {
    addNewPage(doc, theme, classNum, title, pageNum);
    return 32;
  }
  return y;
}

function addNewPage(doc: any, theme: any, classNum: number, title: string, pageNum: { value: number }) {
  doc.addPage();
  pageNum.value++;
  drawPageBackground(doc, theme);
  drawHeader(doc, theme, classNum, title);
  drawFooter(doc, theme, pageNum.value);
}

function drawPageBackground(doc: any, theme: any) {
  // Subtle tinted background
  doc.setFillColor(theme.bgTint[0], theme.bgTint[1], theme.bgTint[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Decorative side border
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(0, 0, 5, 297, 'F');

  // Top accent bar
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.rect(5, 0, 205, 3, 'F');

  // Bottom accent bar
  doc.rect(5, 294, 205, 3, 'F');

  // Decorative corner circles (top-right)
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.circle(200, 10, 25, 'F');
  doc.circle(195, 280, 18, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));
}

function drawHeader(doc: any, theme: any, classNum: number, title: string) {
  // Header bar
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 10, 5, 190, 18, 3);

  // Header text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`KODEINTEL`, 16, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Class ${classNum} | ${title}`, 48, 14);

  // Small decorative star
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.circle(42, 13.5, 2.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(5);
  doc.text("K", 40.8, 15);
}

function drawFooter(doc: any, theme: any, pageNum: number) {
  // Footer line
  doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 287, 195, 287);

  // Page number in colored circle
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.circle(105, 292, 5, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`${pageNum}`, 105, 293.5, { align: 'center' });

  // Footer text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(130, 130, 130);
  doc.text("KodeIntel Learning Platform | Sample Preview", 15, 292);
  doc.text("kodeintel.com", 175, 292);
}

// ============= BLOCK RENDERERS =============

function renderTitlePage(doc: any, chapter: SampleChapter, theme: any) {
  // Full background with gradient effect
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Lighter overlay top section
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.12 }));
  doc.circle(160, 60, 80, 'F');
  doc.circle(50, 240, 60, 'F');
  doc.circle(180, 220, 40, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // White center card
  doc.setFillColor(255, 255, 255);
  drawRoundedRect(doc, 20, 55, 170, 140, 10);

  // Colored accent bar on card
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 20, 55, 170, 8, 3);

  // Class badge
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.circle(105, 50, 22, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(105, 50, 19, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.text("CLASS", 105, 46, { align: 'center' });
  doc.setFontSize(18);
  doc.text(`${chapter.classNum}`, 105, 56, { align: 'center' });

  // Title
  doc.setFontSize(10);
  doc.setTextColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.text("CHAPTER 1", 105, 78, { align: 'center' });

  // Decorative dots
  drawDecorativeDots(doc, 50, 83, 110, 7, theme.secondary);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  const titleLines = wrapText(doc, chapter.title, 150, 26);
  let ty = 98;
  for (const line of titleLines) {
    doc.text(line, 105, ty, { align: 'center' });
    ty += 14;
  }

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  const subLines = wrapText(doc, chapter.subtitle, 150, 14);
  ty += 4;
  for (const line of subLines) {
    doc.text(line, 105, ty, { align: 'center' });
    ty += 8;
  }

  // Decorative icons row
  const icons = ['*', '+', '~', '*', '+'];
  doc.setFontSize(16);
  doc.setTextColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  for (let i = 0; i < icons.length; i++) {
    doc.text(icons[i], 55 + i * 25, ty + 15, { align: 'center' });
  }

  // Bottom section - "Sample Preview" badge
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 55, 165, 100, 12, 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("SAMPLE PREVIEW", 105, 173, { align: 'center' });

  // Bottom branding
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("KODEINTEL", 105, 220, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 220);
  doc.text("AI & Computational Thinking for Young Learners", 105, 230, { align: 'center' });

  // Copyright
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text("(c) KodeIntel Learning Platform | kodeintel.com", 105, 280, { align: 'center' });
}

function renderTextBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  // Title with decorative underline
  if (block.title) {
    y = checkPageBreak(doc, y, 20, theme, classNum, chapterTitle, pageNum);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, 15, y);

    // Colorful underline
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.rect(15, y + 2, 40, 1.5, 'F');
    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.rect(55, y + 2, 20, 1.5, 'F');
    y += 10;
  }

  if (block.content) {
    y = checkPageBreak(doc, y, 10, theme, classNum, chapterTitle, pageNum);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const lines = wrapText(doc, block.content, 175, 11);
    for (const line of lines) {
      y = checkPageBreak(doc, y, 7, theme, classNum, chapterTitle, pageNum);
      doc.text(line, 15, y);
      y += 6;
    }
  }
  return y + 4;
}

function renderCalloutBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const variant = block.variant || 'info';
  let bgColor: number[], borderColor: number[], iconText: string, labelText: string;

  switch (variant) {
    case 'fun_fact':
      bgColor = [255, 248, 225];
      borderColor = [255, 179, 0];
      iconText = '*';
      labelText = 'FUN FACT!';
      break;
    case 'tip':
      bgColor = [232, 245, 233];
      borderColor = [76, 175, 80];
      iconText = '!';
      labelText = 'TIP';
      break;
    default:
      bgColor = [227, 242, 253];
      borderColor = [33, 150, 243];
      iconText = 'i';
      labelText = 'DID YOU KNOW?';
  }

  const lines = wrapText(doc, block.content || '', 155, 10);
  const boxHeight = Math.max(28, lines.length * 5.5 + 22);
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  // Background
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  drawRoundedRect(doc, 12, y - 4, 186, boxHeight, 5);

  // Left accent bar
  doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
  drawRoundedRect(doc, 12, y - 4, 4, boxHeight, 2);

  // Icon circle
  doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.circle(25, y + 5, 6, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(iconText, 25, 7 + y, { align: 'center' });

  // Label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.text(labelText, 34, y + 4);

  // Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  let cy = y + 12;
  for (const line of lines) {
    doc.text(line, 34, cy);
    cy += 5.5;
  }

  return y + boxHeight + 6;
}

function renderKeyTermBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const lines = wrapText(doc, block.content || '', 145, 10);
  const boxHeight = lines.length * 5.5 + 20;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  // Purple/indigo background
  doc.setFillColor(237, 231, 246);
  drawRoundedRect(doc, 12, y - 4, 186, boxHeight, 5);

  // Right accent
  doc.setFillColor(156, 39, 176);
  drawRoundedRect(doc, 194, y - 4, 4, boxHeight, 2);

  // Book icon
  doc.setFillColor(156, 39, 176);
  drawRoundedRect(doc, 17, y, 24, 10, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("KEY TERM", 19.5, y + 6.5);

  // Term name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(74, 20, 140);
  doc.text(block.title || '', 45, y + 7);

  // Definition
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 50, 70);
  let ky = y + 15;
  for (const line of lines) {
    doc.text(line, 19, ky);
    ky += 5.5;
  }

  return y + boxHeight + 6;
}

function renderStepByStepBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  if (block.title) {
    y = checkPageBreak(doc, y, 14, theme, classNum, chapterTitle, pageNum);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, 15, y);
    y += 10;
  }

  const items = block.items || [];
  for (let i = 0; i < items.length; i++) {
    const itemLines = wrapText(doc, items[i], 155, 10);
    const itemHeight = itemLines.length * 5.5 + 8;
    y = checkPageBreak(doc, y, itemHeight + 2, theme, classNum, chapterTitle, pageNum);

    // Step card background
    doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
    drawRoundedRect(doc, 15, y - 4, 180, itemHeight, 4);

    // Number circle
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.circle(24, y + 2, 5.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, 24, y + 4.5, { align: 'center' });

    // Connecting line between steps
    if (i < items.length - 1) {
      doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(24, y + 8, 24, y + itemHeight + 2);
      doc.setLineDashPattern([], 0);
    }

    // Step text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    let sy = y + 1;
    for (const line of itemLines) {
      doc.text(line, 34, sy);
      sy += 5.5;
    }

    y += itemHeight + 3;
  }
  return y + 4;
}

function renderComparisonBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  if (!block.columns) return y;

  if (block.title) {
    y = checkPageBreak(doc, y, 14, theme, classNum, chapterTitle, pageNum);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, 15, y);
    y += 10;
  }

  const left = block.columns.left || [];
  const right = block.columns.right || [];
  const maxRows = Math.max(left.length, right.length);
  const rowHeight = 10;
  const tableHeight = (maxRows + 1) * rowHeight + 6;
  y = checkPageBreak(doc, y, tableHeight + 4, theme, classNum, chapterTitle, pageNum);

  const colW = 88;

  // Left header
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 14, y - 2, colW, rowHeight + 2, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const lt = block.columns.leftTitle || "Left";
  doc.text(lt.substring(0, 35), 18, y + 5);

  // Right header
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 106, y - 2, colW, rowHeight + 2, 3);
  doc.setTextColor(255, 255, 255);
  const rt = block.columns.rightTitle || "Right";
  doc.text(rt.substring(0, 35), 110, y + 5);

  y += rowHeight + 4;

  // Rows
  for (let r = 0; r < maxRows; r++) {
    y = checkPageBreak(doc, y, rowHeight + 2, theme, classNum, chapterTitle, pageNum);

    const bgAlpha = r % 2 === 0 ? 0.05 : 0.1;
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setGState(new doc.GState({ opacity: bgAlpha }));
    doc.rect(14, y - 3, colW, rowHeight, 'F');
    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.rect(106, y - 3, colW, rowHeight, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    // Bullet
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.circle(18, y + 1, 1.5, 'F');
    if (left[r]) doc.text(left[r].substring(0, 38), 22, y + 3);

    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.circle(110, y + 1, 1.5, 'F');
    if (right[r]) doc.text(right[r].substring(0, 38), 114, y + 3);

    y += rowHeight;
  }

  return y + 8;
}

function renderActivityBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const items = block.items || [];
  const contentLines = block.content ? wrapText(doc, block.content, 160, 10) : [];
  const boxHeight = contentLines.length * 5.5 + items.length * 9 + 28;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  // Green dashed border box
  doc.setFillColor(232, 245, 233);
  drawRoundedRect(doc, 12, y - 4, 186, boxHeight, 5);
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(0.8);
  doc.setLineDashPattern([3, 2], 0);
  drawRoundedRect(doc, 12, y - 4, 186, boxHeight, 5, 'S');
  doc.setLineDashPattern([], 0);

  // Activity badge
  doc.setFillColor(76, 175, 80);
  drawRoundedRect(doc, 16, y - 1, 26, 10, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("ACTIVITY", 18.5, y + 5.5);

  // Pencil icon
  doc.setFillColor(255, 193, 7);
  doc.circle(48, y + 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(120, 85, 0);
  doc.text("P", 46.5, y + 6);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(27, 94, 32);
  doc.text(block.title || 'Activity', 56, y + 7);

  let ay = y + 16;

  // Description
  if (contentLines.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 50);
    for (const line of contentLines) {
      doc.text(line, 19, ay);
      ay += 5.5;
    }
    ay += 3;
  }

  // Checklist items
  for (const item of items) {
    ay = checkPageBreak(doc, ay, 9, theme, classNum, chapterTitle, pageNum);
    // Checkbox
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(0.5);
    doc.rect(19, ay - 3, 4, 4, 'S');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text(item.substring(0, 60), 26, ay);
    ay += 8;
  }

  return y + boxHeight + 6;
}

function renderWorksheetBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const questions = block.questions || [];
  
  // Title section
  y = checkPageBreak(doc, y, 20, theme, classNum, chapterTitle, pageNum);
  
  // Worksheet header
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  drawRoundedRect(doc, 12, y - 6, 186, 16, 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(block.title || 'Worksheet', 20, y + 4);

  // Pencil decoration
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.3 }));
  doc.circle(185, y + 2, 6, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  y += 18;

  let qNum = 1;

  for (const q of questions) {
    switch (q.type) {
      case 'fill_blank': {
        y = checkPageBreak(doc, y, 22, theme, classNum, chapterTitle, pageNum);
        // Question number badge
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(19, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, 19, y + 4, { align: 'center' });

        // Question text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const qLines = wrapText(doc, q.question || '', 160, 10);
        let qy = y + 1;
        for (const line of qLines) {
          doc.text(line, 27, qy);
          qy += 5.5;
        }

        // Dashed answer line
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.4);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(27, qy + 3, 180, qy + 3);
        doc.setLineDashPattern([], 0);

        y = qy + 10;
        qNum++;
        break;
      }

      case 'true_false': {
        y = checkPageBreak(doc, y, 20, theme, classNum, chapterTitle, pageNum);
        // Question number
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(19, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, 19, y + 4, { align: 'center' });

        // Question
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text((q.question || '').substring(0, 70), 27, y + 3);

        // True/False circles
        const tfY = y + 10;
        doc.setDrawColor(76, 175, 80);
        doc.setLineWidth(0.6);
        doc.circle(40, tfY, 3.5, 'S');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(76, 175, 80);
        doc.text("T", 40, tfY + 1.5, { align: 'center' });

        doc.setDrawColor(244, 67, 54);
        doc.circle(60, tfY, 3.5, 'S');
        doc.setTextColor(244, 67, 54);
        doc.text("F", 60, tfY + 1.5, { align: 'center' });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("True", 45, tfY + 1);
        doc.text("False", 65, tfY + 1);

        y = tfY + 10;
        qNum++;
        break;
      }

      case 'match_column': {
        const leftCol = q.leftColumn || [];
        const rightCol = q.rightColumn || [];
        const matchHeight = Math.max(leftCol.length, rightCol.length) * 10 + 18;
        y = checkPageBreak(doc, y, matchHeight + 8, theme, classNum, chapterTitle, pageNum);

        // Question number
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(19, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, 19, y + 4, { align: 'center' });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Match the following:", 27, y + 3);

        y += 12;

        // Column A header
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        drawRoundedRect(doc, 20, y - 3, 70, 8, 2);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("Column A", 25, y + 2);

        // Column B header
        doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
        drawRoundedRect(doc, 120, y - 3, 70, 8, 2);
        doc.setTextColor(255, 255, 255);
        doc.text("Column B", 125, y + 2);

        y += 10;

        const maxItems = Math.max(leftCol.length, rightCol.length);
        for (let i = 0; i < maxItems; i++) {
          y = checkPageBreak(doc, y, 10, theme, classNum, chapterTitle, pageNum);
          
          // Left item with letter
          doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
          drawRoundedRect(doc, 20, y - 3, 70, 9, 2);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          if (leftCol[i]) {
            doc.setFont("helvetica", "bold");
            doc.text(`${String.fromCharCode(65 + i)}.`, 23, y + 2.5);
            doc.setFont("helvetica", "normal");
            doc.text(leftCol[i].substring(0, 25), 31, y + 2.5);
          }

          // Right item with number
          doc.setFillColor(255, 248, 225);
          drawRoundedRect(doc, 120, y - 3, 70, 9, 2);
          if (rightCol[i]) {
            doc.setFont("helvetica", "bold");
            doc.text(`${i + 1}.`, 123, y + 2.5);
            doc.setFont("helvetica", "normal");
            doc.text(rightCol[i].substring(0, 25), 131, y + 2.5);
          }

          y += 10;
        }

        // Answer line
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Write your answers: A-___, B-___, C-___, D-___", 20, y + 2);
        y += 10;
        qNum++;
        break;
      }

      case 'short_answer': {
        y = checkPageBreak(doc, y, 30, theme, classNum, chapterTitle, pageNum);
        // Question number
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(19, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, 19, y + 4, { align: 'center' });

        // Question
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const saLines = wrapText(doc, q.question || '', 160, 10);
        let say = y + 1;
        for (const line of saLines) {
          doc.text(line, 27, say);
          say += 5.5;
        }

        // Multiple writing lines
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.setLineDashPattern([1, 1], 0);
        for (let l = 0; l < 3; l++) {
          doc.line(27, say + 5 + l * 8, 190, say + 5 + l * 8);
        }
        doc.setLineDashPattern([], 0);

        y = say + 30;
        qNum++;
        break;
      }
    }
  }

  return y + 4;
}

function renderSummaryBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const lines = wrapText(doc, block.content || '', 160, 10);
  const boxHeight = lines.length * 5.5 + 22;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  // Gradient-like background (two-tone)
  doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
  drawRoundedRect(doc, 12, y - 6, 186, boxHeight, 5);

  // Top accent
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 12, y - 6, 186, 4, 3);

  // Checkmark icon
  doc.setFillColor(76, 175, 80);
  doc.circle(22, y + 5, 5, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("v", 20.5, y + 7.5);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  doc.text(block.title || 'Summary', 32, y + 7);

  // Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  let sy = y + 15;
  for (const line of lines) {
    doc.text(line, 19, sy);
    sy += 5.5;
  }

  return y + boxHeight + 6;
}

// ============= MAIN PDF BUILDER =============

function buildColorfulPdf(chapter: SampleChapter): Uint8Array {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = classThemes[chapter.classNum] || classThemes[3];
  const pageNum = { value: 1 };

  // ===== TITLE PAGE =====
  renderTitlePage(doc, chapter, theme);

  // ===== CONTENT PAGES =====
  addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
  let y = 32;

  for (const block of chapter.blocks) {
    switch (block.type) {
      case 'text':
        y = renderTextBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'callout':
        y = renderCalloutBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'key_term':
        y = renderKeyTermBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'step_by_step':
        y = renderStepByStepBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'comparison':
        y = renderComparisonBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'activity':
        y = renderActivityBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'worksheet':
        y = renderWorksheetBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
      case 'summary':
        y = renderSummaryBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title);
        break;
    }
  }

  // Final page - "End of Sample" page
  addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
  
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 25, 80, 160, 90, 10);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("End of Sample Preview", 105, 110, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Want the full chapter?", 105, 125, { align: 'center' });
  
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 55, 135, 100, 16, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Visit kodeintel.com", 105, 145, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(200, 200, 220);
  doc.text("AI & Computational Thinking for Young Learners", 105, 160, { align: 'center' });

  // Output
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}

// ============= SERVER =============

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { classNum, generateAll } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const classesToGenerate = generateAll
      ? [3, 5, 8, 9, 10]
      : classNum ? [classNum] : [];

    if (classesToGenerate.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide classNum or generateAll: true" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { classNum: number; url: string; status: string }[] = [];

    for (const cn of classesToGenerate) {
      const chapter = sampleBookChapters.find(c => c.classNum === cn);
      if (!chapter) {
        results.push({ classNum: cn, url: "", status: "no_content" });
        continue;
      }

      const fileName = `class-${cn}-chapter-1.pdf`;

      // Generate PDF
      const pdfBytes = buildColorfulPdf(chapter);

      // Upload to storage (upsert to overwrite old plain ones)
      const { error: uploadError } = await supabase.storage
        .from("sample-books")
        .upload(fileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        results.push({ classNum: cn, url: "", status: `error: ${uploadError.message}` });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("sample-books")
        .getPublicUrl(fileName);

      results.push({ classNum: cn, url: urlData.publicUrl, status: "generated" });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
