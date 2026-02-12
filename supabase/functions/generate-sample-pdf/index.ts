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

// AI image prompts per class
const classImagePrompts: Record<number, { hero: string; mid: string; small: string }> = {
  3: {
    hero: "A cute friendly cartoon computer with big eyes and a smile, surrounded by happy kids using keyboards and mice, colorful flat illustration style for children's educational book, bright cheerful colors, no text",
    mid: "A colorful cartoon showing labeled computer parts: monitor, keyboard, mouse, CPU box, speakers, in a fun kid-friendly educational illustration style, bright colors, no text",
    small: "A tiny cute cartoon mouse (computer mouse) with eyes and a smile, simple flat icon style for kids, bright colors, no text, white background"
  },
  5: {
    hero: "A cartoon child with colorful gears and lightbulbs floating above their head, thinking pose, puzzle pieces connecting around them, bright educational illustration for kids book, no text",
    mid: "Four colorful pillars labeled with icons: magnifying glass, pattern shapes, funnel filter, numbered steps - representing computational thinking, kid-friendly cartoon style, no text",
    small: "A small cartoon puzzle piece with eyes smiling, simple flat icon for kids educational book, bright colors, no text, white background"
  },
  8: {
    hero: "A cute friendly cartoon robot waving hello with one hand, surrounded by floating circuit patterns and a glowing AI brain, colorful educational illustration for teens, no text",
    mid: "A split cartoon showing human brain on left side and computer circuit brain on right side, connected by colorful data streams, educational illustration, no text",
    small: "A tiny cute robot head icon with antenna and glowing eyes, simple flat cartoon style, bright colors, no text, white background"
  },
  9: {
    hero: "Colorful cartoon data flowing from labeled boxes into a machine that outputs patterns and predictions, with a cute puppy learning tricks nearby, educational illustration for teens, no text",
    mid: "Three cartoon panels showing: 1) teacher showing labeled examples 2) sorting colorful candies 3) puppy getting treat rewards - representing ML types, no text",
    small: "A small cartoon neural network icon with colorful nodes and connections, simple flat style, bright colors, no text, white background"
  },
  10: {
    hero: "A futuristic cartoon city with AI-powered drones, self-driving cars, and diverse students collaborating with holographic screens, bright colorful educational illustration, no text",
    mid: "A cartoon balance scale with AI benefits (efficiency, health, education icons) on one side and challenges (privacy lock, bias warning, job concern) on the other, educational style, no text",
    small: "A small cartoon globe with AI circuit connections around it, simple flat icon style, bright colors, no text, white background"
  }
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
  doc.circle(cx, cy, size, 'F');
}

function drawDecorativeDots(doc: any, x: number, y: number, w: number, count: number, color: number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
  const spacing = w / (count + 1);
  for (let i = 1; i <= count; i++) {
    doc.circle(x + spacing * i, y, 1.2, 'F');
  }
}

// ============= MINI ILLUSTRATIONS (vector-drawn) =============
type IllustrationName = 'computer' | 'robot' | 'brain' | 'lightbulb' | 'rocket' | 'book' | 'gear' | 'star' | 'atom' | 'trophy';

function drawIllustration(doc: any, name: IllustrationName, cx: number, cy: number, size: number, color: number[], opacity = 1) {
  if (opacity < 1) doc.setGState(new doc.GState({ opacity }));
  const s = size;
  switch (name) {
    case 'computer': {
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.6, cy-s*0.5, s*1.2, s*0.8, s*0.1);
      doc.setFillColor(200, 230, 255);
      drawRoundedRect(doc, cx-s*0.45, cy-s*0.35, s*0.9, s*0.5, s*0.05);
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(cx-s*0.1, cy+s*0.3, s*0.2, s*0.15, 'F');
      drawRoundedRect(doc, cx-s*0.3, cy+s*0.45, s*0.6, s*0.08, s*0.03);
      doc.setFillColor(255, 255, 255);
      doc.circle(cx-s*0.25, cy-s*0.15, s*0.06, 'F');
      break;
    }
    case 'robot': {
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.35, cy-s*0.5, s*0.7, s*0.5, s*0.1);
      doc.setFillColor(255, 255, 255);
      doc.circle(cx-s*0.12, cy-s*0.3, s*0.1, 'F');
      doc.circle(cx+s*0.12, cy-s*0.3, s*0.1, 'F');
      doc.setFillColor(40, 40, 40);
      doc.circle(cx-s*0.1, cy-s*0.28, s*0.04, 'F');
      doc.circle(cx+s*0.14, cy-s*0.28, s*0.04, 'F');
      doc.setFillColor(255, 200, 100);
      drawRoundedRect(doc, cx-s*0.15, cy-s*0.1, s*0.3, s*0.06, s*0.02);
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(s*0.04);
      doc.line(cx, cy-s*0.5, cx, cy-s*0.65);
      doc.setFillColor(255, 80, 80);
      doc.circle(cx, cy-s*0.67, s*0.06, 'F');
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.3, cy+s*0.05, s*0.6, s*0.4, s*0.05);
      break;
    }
    case 'brain': {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(cx-s*0.15, cy-s*0.2, s*0.25, 'F');
      doc.circle(cx+s*0.15, cy-s*0.2, s*0.25, 'F');
      doc.circle(cx-s*0.25, cy+s*0.05, s*0.2, 'F');
      doc.circle(cx+s*0.25, cy+s*0.05, s*0.2, 'F');
      doc.circle(cx, cy+s*0.15, s*0.22, 'F');
      doc.circle(cx, cy-s*0.35, s*0.18, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(s*0.04);
      doc.line(cx, cy-s*0.4, cx, cy+s*0.3);
      break;
    }
    case 'lightbulb': {
      doc.setFillColor(255, 235, 59);
      doc.circle(cx, cy-s*0.1, s*0.3, 'F');
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.12, cy+s*0.2, s*0.24, s*0.18, s*0.05);
      doc.setDrawColor(255, 200, 0);
      doc.setLineWidth(s*0.03);
      for (let i = 0; i < 6; i++) {
        const a = (i/6)*Math.PI*2, r1 = s*0.35, r2 = s*0.45;
        doc.line(cx+Math.cos(a)*r1, cy-s*0.1+Math.sin(a)*r1, cx+Math.cos(a)*r2, cy-s*0.1+Math.sin(a)*r2);
      }
      doc.setFillColor(255, 255, 255);
      doc.circle(cx-s*0.08, cy-s*0.2, s*0.06, 'F');
      break;
    }
    case 'rocket': {
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.12, cy-s*0.4, s*0.24, s*0.7, s*0.1);
      doc.setFillColor(255, 80, 80);
      doc.triangle(cx-s*0.12, cy-s*0.4, cx+s*0.12, cy-s*0.4, cx, cy-s*0.6, 'F');
      doc.setFillColor(200, 230, 255);
      doc.circle(cx, cy-s*0.15, s*0.08, 'F');
      doc.setFillColor(255, 150, 50);
      doc.triangle(cx-s*0.12, cy+s*0.25, cx-s*0.3, cy+s*0.4, cx-s*0.12, cy+s*0.15, 'F');
      doc.triangle(cx+s*0.12, cy+s*0.25, cx+s*0.3, cy+s*0.4, cx+s*0.12, cy+s*0.15, 'F');
      doc.setFillColor(255, 200, 50);
      doc.triangle(cx-s*0.08, cy+s*0.3, cx+s*0.08, cy+s*0.3, cx, cy+s*0.5, 'F');
      break;
    }
    case 'book': {
      doc.setFillColor(color[0], color[1], color[2]);
      drawRoundedRect(doc, cx-s*0.35, cy-s*0.3, s*0.65, s*0.7, s*0.05);
      doc.setFillColor(Math.min(255,color[0]+40), Math.min(255,color[1]+40), Math.min(255,color[2]+40));
      drawRoundedRect(doc, cx-s*0.25, cy-s*0.35, s*0.65, s*0.7, s*0.05);
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(cx-s*0.25, cy-s*0.35, s*0.06, s*0.7, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(cx-s*0.05, cy-s*0.15, s*0.3, s*0.04, 'F');
      doc.rect(cx-s*0.05, cy-s*0.05, s*0.2, s*0.04, 'F');
      break;
    }
    case 'gear': {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(cx, cy, s*0.35, 'F');
      for (let i = 0; i < 8; i++) {
        const a = (i/8)*Math.PI*2;
        doc.circle(cx+Math.cos(a)*s*0.35, cy+Math.sin(a)*s*0.35, s*0.08, 'F');
      }
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy, s*0.15, 'F');
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(cx, cy, s*0.06, 'F');
      break;
    }
    case 'star': {
      doc.setFillColor(255, 200, 50);
      doc.circle(cx, cy-s*0.3, s*0.15, 'F');
      doc.circle(cx-s*0.28, cy-s*0.08, s*0.15, 'F');
      doc.circle(cx+s*0.28, cy-s*0.08, s*0.15, 'F');
      doc.circle(cx-s*0.17, cy+s*0.25, s*0.15, 'F');
      doc.circle(cx+s*0.17, cy+s*0.25, s*0.15, 'F');
      doc.circle(cx, cy, s*0.2, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(cx-s*0.06, cy-s*0.1, s*0.05, 'F');
      break;
    }
    case 'atom': {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(cx, cy, s*0.12, 'F');
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(s*0.03);
      doc.circle(cx, cy, s*0.35, 'S');
      doc.setFillColor(255, 100, 100);
      doc.circle(cx+s*0.35, cy, s*0.06, 'F');
      doc.circle(cx-s*0.2, cy-s*0.28, s*0.06, 'F');
      break;
    }
    case 'trophy': {
      doc.setFillColor(255, 200, 50);
      drawRoundedRect(doc, cx-s*0.25, cy-s*0.35, s*0.5, s*0.45, s*0.08);
      doc.setDrawColor(255, 180, 0);
      doc.setLineWidth(s*0.05);
      doc.circle(cx-s*0.35, cy-s*0.15, s*0.12, 'S');
      doc.circle(cx+s*0.35, cy-s*0.15, s*0.12, 'S');
      doc.setFillColor(200, 160, 40);
      doc.rect(cx-s*0.06, cy+s*0.1, s*0.12, s*0.2, 'F');
      doc.setFillColor(255, 180, 0);
      drawRoundedRect(doc, cx-s*0.2, cy+s*0.3, s*0.4, s*0.1, s*0.03);
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy-s*0.15, s*0.08, 'F');
      break;
    }
  }
  if (opacity < 1) doc.setGState(new doc.GState({ opacity: 1 }));
}

const classIllustrations: Record<number, IllustrationName[]> = {
  3: ['computer', 'star', 'lightbulb', 'book', 'trophy'],
  5: ['brain', 'lightbulb', 'gear', 'rocket', 'star'],
  8: ['robot', 'brain', 'atom', 'gear', 'rocket'],
  9: ['atom', 'brain', 'rocket', 'gear', 'book'],
  10: ['robot', 'atom', 'trophy', 'gear', 'brain'],
};

let illustrationIndex = 0;
function getNextIllustration(classNum: number): IllustrationName {
  const pool = classIllustrations[classNum] || classIllustrations[3];
  const ill = pool[illustrationIndex % pool.length];
  illustrationIndex++;
  return ill;
}

// ============= AI IMAGE GENERATION & CACHING =============

async function getOrGenerateAiImage(
  supabase: any,
  classNum: number,
  imageType: 'hero' | 'mid' | 'small'
): Promise<string | null> {
  const imagePath = `images/class-${classNum}-${imageType}.png`;

  // Check cache first
  try {
    const { data: existingFile } = await supabase.storage
      .from("sample-books")
      .download(imagePath);
    if (existingFile) {
      // Convert blob to base64
      const arrayBuf = await existingFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      return `data:image/png;base64,${b64}`;
    }
  } catch { /* not cached yet */ }

  // Generate with AI
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not set, skipping AI image generation");
    return null;
  }

  const prompts = classImagePrompts[classNum];
  if (!prompts) return null;
  const prompt = prompts[imageType];

  try {
    console.log(`Generating AI image for class ${classNum} (${imageType})...`);
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          { role: "user", content: prompt }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      console.error(`AI image generation failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl || !imageUrl.startsWith('data:image')) {
      console.error("No image data in AI response");
      return null;
    }

    // Cache to storage
    try {
      const base64Data = imageUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const binaryArr = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) binaryArr[i] = binaryStr.charCodeAt(i);

      await supabase.storage
        .from("sample-books")
        .upload(imagePath, binaryArr, {
          contentType: "image/png",
          upsert: true,
        });
      console.log(`Cached AI image: ${imagePath}`);
    } catch (cacheErr) {
      console.error("Failed to cache image:", cacheErr);
    }

    return imageUrl;
  } catch (err) {
    console.error("AI image generation error:", err);
    return null;
  }
}

// ============= TEXT HELPERS =============

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

// Updated left margin for better alignment
const LEFT_MARGIN = 17;

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
  drawPageBackground(doc, theme, classNum, pageNum.value);
  drawHeader(doc, theme, classNum, title);
  drawFooter(doc, theme, pageNum.value);
}

function drawPageBackground(doc: any, theme: any, classNum: number, pageNum: number) {
  doc.setFillColor(theme.bgTint[0], theme.bgTint[1], theme.bgTint[2]);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(0, 0, 5, 297, 'F');
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.rect(5, 0, 205, 3, 'F');
  doc.rect(5, 294, 205, 3, 'F');
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.circle(200, 10, 25, 'F');
  doc.circle(195, 280, 18, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));
  const pool = classIllustrations[classNum] || classIllustrations[3];
  const illName = pool[(pageNum - 1) % pool.length];
  drawIllustration(doc, illName, 185, 265, 12, theme.primary, 0.06);
  const illName2 = pool[pageNum % pool.length];
  drawIllustration(doc, illName2, 190, 35, 8, theme.secondary, 0.07);
}

function drawHeader(doc: any, theme: any, classNum: number, title: string) {
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 10, 5, 190, 18, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`KODEINTEL`, 16, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Class ${classNum} | ${title}`, 48, 14);
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.circle(42, 13.5, 2.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(5);
  doc.text("K", 40.8, 15);
}

function drawFooter(doc: any, theme: any, pageNum: number) {
  doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 287, 195, 287);
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.circle(105, 292, 5, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`${pageNum}`, 105, 293.5, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(130, 130, 130);
  doc.text("KodeIntel Learning Platform | Sample Preview", 15, 292);
  doc.text("kodeintel.com", 175, 292);
}

// ============= TOC PAGE =============

function renderTocPage(doc: any, chapter: SampleChapter, theme: any, pageNum: { value: number }) {
  addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);

  // TOC Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  doc.text("Table of Contents", 105, 40, { align: 'center' });

  // Accent bar under title
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(50, 44, 50, 2.5, 'F');
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.rect(100, 44, 30, 2.5, 'F');
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.rect(130, 44, 20, 2.5, 'F');

  // Themed border around TOC area
  doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setLineWidth(1);
  drawRoundedRect(doc, 20, 52, 170, 200, 8, 'S');

  // Inner decorative corners
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.circle(30, 62, 6, 'F');
  doc.circle(180, 62, 6, 'F');
  doc.circle(30, 242, 6, 'F');
  doc.circle(180, 242, 6, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Build TOC entries from blocks
  interface TocEntry { icon: string; label: string; color: number[]; page: number }
  const entries: TocEntry[] = [];
  let estimatedPage = 3; // content starts on page 3 (title=1, TOC=2)
  let blockCount = 0;

  for (const block of chapter.blocks) {
    let icon = '§';
    let label = '';
    let color = theme.primary;

    switch (block.type) {
      case 'text':
        icon = '¶';
        label = block.title || 'Content';
        color = theme.dark;
        break;
      case 'callout':
        if (block.variant === 'fun_fact') { icon = '★'; label = 'Fun Fact!'; color = [255, 179, 0]; }
        else if (block.variant === 'tip') { icon = '!'; label = 'Tip'; color = [76, 175, 80]; }
        else { icon = 'i'; label = 'Did You Know?'; color = [33, 150, 243]; }
        break;
      case 'key_term':
        icon = '◆';
        label = `Key Term: ${block.title || ''}`;
        color = [156, 39, 176];
        break;
      case 'step_by_step':
        icon = '▸';
        label = block.title || 'Steps';
        color = theme.primary;
        break;
      case 'comparison':
        icon = '⇄';
        label = block.title || 'Comparison';
        color = theme.secondary;
        break;
      case 'activity':
        icon = '✎';
        label = block.title || 'Activity';
        color = [76, 175, 80];
        break;
      case 'worksheet':
        icon = '✓';
        label = block.title || 'Worksheet';
        color = theme.accent;
        break;
      case 'summary':
        icon = '◎';
        label = block.title || 'Summary';
        color = theme.dark;
        break;
      default:
        continue;
    }

    // Only show major sections in TOC (skip individual callouts & key terms after first)
    if (block.type === 'callout' && entries.filter(e => e.icon === icon).length >= 1) continue;
    if (block.type === 'key_term' && entries.filter(e => e.icon === '◆').length >= 2) continue;

    blockCount++;
    if (blockCount % 4 === 0) estimatedPage++;
    entries.push({ icon, label, color, page: estimatedPage });
  }

  // Add special pages
  entries.push({ icon: '📝', label: 'My Notes', color: theme.secondary, page: estimatedPage + 1 });
  entries.push({ icon: '🎨', label: 'Color Me! Activity', color: theme.accent, page: estimatedPage + 2 });

  // Render TOC entries
  let ty = 68;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (ty > 240) break;

    // Icon circle
    doc.setFillColor(e.color[0], e.color[1], e.color[2]);
    doc.circle(35, ty, 4, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(e.icon, 35, ty + 1.5, { align: 'center' });

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(e.label.substring(0, 45), 44, ty + 1.5);

    // Dotted leader line
    const labelWidth = doc.getTextWidth(e.label.substring(0, 45));
    const dotStart = 44 + labelWidth + 2;
    const dotEnd = 170;
    if (dotStart < dotEnd) {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1, 2], 0);
      doc.line(dotStart, ty + 2, dotEnd, ty + 2);
      doc.setLineDashPattern([], 0);
    }

    // Page number
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(e.color[0], e.color[1], e.color[2]);
    doc.text(`${e.page}`, 177, ty + 1.5, { align: 'center' });

    ty += 14;
  }

  // Bottom decoration
  drawIllustration(doc, classIllustrations[chapter.classNum]?.[0] || 'star', 105, 260, 14, theme.primary, 0.12);
}

// ============= COLOR ME PAGE =============

const classColorMeDrawings: Record<number, (doc: any, theme: any) => void> = {
  3: (doc, theme) => {
    // Computer outline
    doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setLineWidth(1.2);
    drawRoundedRect(doc, 30, 70, 70, 50, 5, 'S'); // monitor
    doc.setFillColor(255, 255, 255);
    drawRoundedRect(doc, 35, 75, 60, 35, 3, 'S'); // screen
    doc.rect(60, 120, 10, 10, 'S'); // stand
    drawRoundedRect(doc, 45, 130, 30, 5, 2, 'S'); // base
    // Keyboard
    drawRoundedRect(doc, 110, 100, 70, 25, 3, 'S');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
      doc.rect(115 + c * 8, 105 + r * 7, 6, 5, 'S');
    }
    // Labels
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Monitor", 65, 68, { align: 'center' });
    doc.text("Keyboard", 145, 98, { align: 'center' });
    // Mouse outline
    drawRoundedRect(doc, 135, 140, 20, 30, 8, 'S');
    doc.line(145, 140, 145, 155);
    doc.text("Mouse", 145, 175, { align: 'center' });
  },
  5: (doc, theme) => {
    // Brain outline with pillars
    doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setLineWidth(1.2);
    doc.circle(105, 90, 30, 'S');
    doc.setLineWidth(0.8);
    doc.line(105, 60, 105, 120);
    // Four labeled pillars
    const pillars = ['Decompose', 'Patterns', 'Abstract', 'Algorithm'];
    const px = [40, 80, 130, 170];
    for (let i = 0; i < 4; i++) {
      drawRoundedRect(doc, px[i] - 15, 140, 30, 45, 3, 'S');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(pillars[i], px[i], 190, { align: 'center' });
    }
    // Puzzle pieces
    doc.circle(50, 100, 12, 'S');
    doc.circle(160, 100, 12, 'S');
    doc.rect(44, 94, 12, 12, 'S');
    doc.rect(154, 94, 12, 12, 'S');
  },
  8: (doc, theme) => {
    // Robot figure
    doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setLineWidth(1.2);
    drawRoundedRect(doc, 70, 60, 40, 35, 5, 'S'); // head
    doc.circle(82, 75, 6, 'S'); // left eye
    doc.circle(98, 75, 6, 'S'); // right eye
    drawRoundedRect(doc, 80, 85, 20, 5, 2, 'S'); // mouth
    doc.line(90, 55, 90, 45); // antenna
    doc.circle(90, 43, 4, 'S'); // antenna ball
    drawRoundedRect(doc, 65, 100, 50, 50, 5, 'S'); // body
    doc.rect(50, 105, 12, 35, 'S'); // left arm
    doc.rect(118, 105, 12, 35, 'S'); // right arm
    doc.rect(72, 155, 14, 25, 'S'); // left leg
    doc.rect(94, 155, 14, 25, 'S'); // right leg
    // Circuit board pattern on right
    doc.setLineWidth(0.6);
    for (let i = 0; i < 5; i++) {
      doc.line(145, 70 + i * 20, 190, 70 + i * 20);
      doc.circle(145 + i * 10, 70 + (i % 3) * 20, 2, 'S');
    }
  },
  9: (doc, theme) => {
    // Data flow diagram
    doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setLineWidth(1.2);
    // Input boxes
    for (let i = 0; i < 3; i++) {
      drawRoundedRect(doc, 25, 65 + i * 25, 35, 18, 3, 'S');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(['Data A', 'Data B', 'Data C'][i], 42, 76 + i * 25, { align: 'center' });
    }
    // Arrows
    for (let i = 0; i < 3; i++) {
      doc.line(62, 74 + i * 25, 80, 100);
    }
    // ML box
    drawRoundedRect(doc, 75, 85, 40, 30, 5, 'S');
    doc.setFontSize(8);
    doc.text('ML Model', 95, 103, { align: 'center' });
    // Output
    doc.line(115, 100, 135, 100);
    drawRoundedRect(doc, 135, 85, 40, 30, 5, 'S');
    doc.text('Prediction', 155, 103, { align: 'center' });
    // Neural network below
    const layers = [[50, 160], [50, 180], [50, 200]];
    const layer2 = [[100, 165], [100, 185], [100, 195]];
    const layer3 = [[150, 175], [150, 195]];
    for (const n of layers) doc.circle(n[0], n[1], 5, 'S');
    for (const n of layer2) doc.circle(n[0], n[1], 5, 'S');
    for (const n of layer3) doc.circle(n[0], n[1], 5, 'S');
    for (const n1 of layers) for (const n2 of layer2) doc.line(n1[0]+5, n1[1], n2[0]-5, n2[1]);
    for (const n2 of layer2) for (const n3 of layer3) doc.line(n2[0]+5, n2[1], n3[0]-5, n3[1]);
  },
  10: (doc, theme) => {
    // Globe with AI connections
    doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setLineWidth(1.2);
    doc.circle(90, 100, 35, 'S'); // globe
    // Longitude/latitude lines
    doc.setLineWidth(0.5);
    doc.circle(90, 100, 35, 'S');
    doc.line(55, 100, 125, 100);
    doc.line(90, 65, 90, 135);
    // AI connection nodes around
    const nodes = [[40, 70], [140, 70], [30, 130], [150, 130], [90, 50], [90, 150]];
    for (const n of nodes) {
      doc.circle(n[0], n[1], 6, 'S');
      doc.setLineWidth(0.4);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(n[0], n[1], 90, 100);
      doc.setLineDashPattern([], 0);
    }
    // Ethics balance scale
    doc.setLineWidth(1);
    doc.line(90, 175, 90, 195); // pillar
    doc.line(60, 195, 120, 195); // beam
    // Left pan
    doc.line(60, 195, 50, 210);
    doc.line(60, 195, 70, 210);
    doc.line(50, 210, 70, 210);
    // Right pan
    doc.line(120, 195, 110, 210);
    doc.line(120, 195, 130, 210);
    doc.line(110, 210, 130, 210);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("Benefits", 60, 218, { align: 'center' });
    doc.text("Ethics", 120, 218, { align: 'center' });
  }
};

// ============= BLOCK RENDERERS =============

function renderTitlePage(doc: any, chapter: SampleChapter, theme: any) {
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.12 }));
  doc.circle(160, 60, 80, 'F');
  doc.circle(50, 240, 60, 'F');
  doc.circle(180, 220, 40, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // White center card
  doc.setFillColor(255, 255, 255);
  drawRoundedRect(doc, 20, 55, 170, 140, 10);
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

  doc.setFontSize(10);
  doc.setTextColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.text("CHAPTER 1", 105, 78, { align: 'center' });
  drawDecorativeDots(doc, 50, 83, 110, 7, theme.secondary);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  const titleLines = wrapText(doc, chapter.title, 150, 28);
  let ty = 98;
  for (const line of titleLines) {
    doc.text(line, 105, ty, { align: 'center' });
    ty += 14;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  const subLines = wrapText(doc, chapter.subtitle, 150, 14);
  ty += 4;
  for (const line of subLines) {
    doc.text(line, 105, ty, { align: 'center' });
    ty += 8;
  }

  // Sample Preview badge
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 55, 165, 100, 12, 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("SAMPLE PREVIEW", 105, 173, { align: 'center' });

  // Themed illustrations on title page
  const pool = classIllustrations[chapter.classNum] || classIllustrations[3];
  drawIllustration(doc, pool[0], 40, 210, 22, [255, 255, 255], 0.25);
  drawIllustration(doc, pool[1], 170, 210, 20, [255, 255, 255], 0.2);
  drawIllustration(doc, pool[2], 105, 245, 18, [255, 255, 255], 0.18);
  drawIllustration(doc, pool[3], 30, 270, 10, [255, 255, 255], 0.12);
  drawIllustration(doc, pool[4 % pool.length], 180, 265, 11, [255, 255, 255], 0.12);

  // Bottom branding
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("KODEINTEL", 105, 220, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 220);
  doc.text("AI & Computational Thinking for Young Learners", 105, 230, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text("(c) KodeIntel Learning Platform | kodeintel.com", 105, 280, { align: 'center' });
}

function renderTextBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  if (block.title) {
    y = checkPageBreak(doc, y, 22, theme, classNum, chapterTitle, pageNum);
    
    // Decorative accent bar (4mm)
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.rect(LEFT_MARGIN - 5, y - 6, 4, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, LEFT_MARGIN, y);

    // Wider colorful underline
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.rect(LEFT_MARGIN, y + 3, 50, 2, 'F');
    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.rect(LEFT_MARGIN + 50, y + 3, 25, 2, 'F');
    y += 12;
  }

  if (block.content) {
    y = checkPageBreak(doc, y, 10, theme, classNum, chapterTitle, pageNum);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const lines = wrapText(doc, block.content, 173, 11);
    for (const line of lines) {
      y = checkPageBreak(doc, y, 7, theme, classNum, chapterTitle, pageNum);
      doc.text(line, LEFT_MARGIN, y);
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
      bgColor = [255, 248, 225]; borderColor = [255, 179, 0]; iconText = '*'; labelText = 'FUN FACT!'; break;
    case 'tip':
      bgColor = [232, 245, 233]; borderColor = [76, 175, 80]; iconText = '!'; labelText = 'TIP'; break;
    default:
      bgColor = [227, 242, 253]; borderColor = [33, 150, 243]; iconText = 'i'; labelText = 'DID YOU KNOW?';
  }

  const lines = wrapText(doc, block.content || '', 153, 11);
  const boxHeight = Math.max(28, lines.length * 6 + 22);
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 4, 186, boxHeight, 5);
  doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 4, 4, boxHeight, 2);

  doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.circle(LEFT_MARGIN + 8, y + 5, 6, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(iconText, LEFT_MARGIN + 8, 7 + y, { align: 'center' });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.text(labelText, LEFT_MARGIN + 17, y + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  let cy = y + 12;
  for (const line of lines) {
    doc.text(line, LEFT_MARGIN + 17, cy);
    cy += 6;
  }
  return y + boxHeight + 6;
}

function renderKeyTermBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const lines = wrapText(doc, block.content || '', 145, 11);
  const boxHeight = lines.length * 6 + 20;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  doc.setFillColor(237, 231, 246);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 4, 186, boxHeight, 5);
  doc.setFillColor(156, 39, 176);
  drawRoundedRect(doc, LEFT_MARGIN + 177, y - 4, 4, boxHeight, 2);

  doc.setFillColor(156, 39, 176);
  drawRoundedRect(doc, LEFT_MARGIN, y, 24, 10, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("KEY TERM", LEFT_MARGIN + 2.5, y + 6.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(74, 20, 140);
  doc.text(block.title || '', LEFT_MARGIN + 28, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 50, 70);
  let ky = y + 15;
  for (const line of lines) {
    doc.text(line, LEFT_MARGIN + 2, ky);
    ky += 6;
  }
  return y + boxHeight + 6;
}

function renderStepByStepBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  if (block.title) {
    y = checkPageBreak(doc, y, 16, theme, classNum, chapterTitle, pageNum);
    // Accent bar
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.rect(LEFT_MARGIN - 5, y - 5, 4, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, LEFT_MARGIN, y);
    y += 10;
  }

  const items = block.items || [];
  for (let i = 0; i < items.length; i++) {
    const itemLines = wrapText(doc, items[i], 153, 10);
    const itemHeight = itemLines.length * 5.5 + 8;
    y = checkPageBreak(doc, y, itemHeight + 2, theme, classNum, chapterTitle, pageNum);

    doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
    drawRoundedRect(doc, LEFT_MARGIN, y - 4, 178, itemHeight, 4);
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.circle(LEFT_MARGIN + 7, y + 2, 5.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, LEFT_MARGIN + 7, y + 4.5, { align: 'center' });

    if (i < items.length - 1) {
      doc.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(LEFT_MARGIN + 7, y + 8, LEFT_MARGIN + 7, y + itemHeight + 2);
      doc.setLineDashPattern([], 0);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    let sy = y + 1;
    for (const line of itemLines) {
      doc.text(line, LEFT_MARGIN + 17, sy);
      sy += 5.5;
    }
    y += itemHeight + 3;
  }
  return y + 4;
}

function renderComparisonBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  if (!block.columns) return y;
  if (block.title) {
    y = checkPageBreak(doc, y, 16, theme, classNum, chapterTitle, pageNum);
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.rect(LEFT_MARGIN - 5, y - 5, 4, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
    doc.text(block.title, LEFT_MARGIN, y);
    y += 10;
  }

  const left = block.columns.left || [];
  const right = block.columns.right || [];
  const maxRows = Math.max(left.length, right.length);
  const rowHeight = 10;
  const tableHeight = (maxRows + 1) * rowHeight + 6;
  y = checkPageBreak(doc, y, tableHeight + 4, theme, classNum, chapterTitle, pageNum);

  const colW = 87;
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 3, y - 2, colW, rowHeight + 2, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text((block.columns.leftTitle || "Left").substring(0, 35), LEFT_MARGIN + 1, y + 5);

  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, LEFT_MARGIN + colW + 1, y - 2, colW, rowHeight + 2, 3);
  doc.setTextColor(255, 255, 255);
  doc.text((block.columns.rightTitle || "Right").substring(0, 35), LEFT_MARGIN + colW + 5, y + 5);

  y += rowHeight + 4;

  for (let r = 0; r < maxRows; r++) {
    y = checkPageBreak(doc, y, rowHeight + 2, theme, classNum, chapterTitle, pageNum);
    const bgAlpha = r % 2 === 0 ? 0.05 : 0.1;
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.setGState(new doc.GState({ opacity: bgAlpha }));
    doc.rect(LEFT_MARGIN - 3, y - 3, colW, rowHeight, 'F');
    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.rect(LEFT_MARGIN + colW + 1, y - 3, colW, rowHeight, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    doc.circle(LEFT_MARGIN + 1, y + 1, 1.5, 'F');
    if (left[r]) doc.text(left[r].substring(0, 38), LEFT_MARGIN + 5, y + 3);
    doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
    doc.circle(LEFT_MARGIN + colW + 5, y + 1, 1.5, 'F');
    if (right[r]) doc.text(right[r].substring(0, 38), LEFT_MARGIN + colW + 9, y + 3);
    y += rowHeight;
  }
  return y + 8;
}

function renderActivityBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const items = block.items || [];
  const contentLines = block.content ? wrapText(doc, block.content, 158, 10) : [];
  const boxHeight = contentLines.length * 5.5 + items.length * 9 + 28;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  doc.setFillColor(232, 245, 233);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 4, 186, boxHeight, 5);
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(0.8);
  doc.setLineDashPattern([3, 2], 0);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 4, 186, boxHeight, 5, 'S');
  doc.setLineDashPattern([], 0);

  doc.setFillColor(76, 175, 80);
  drawRoundedRect(doc, LEFT_MARGIN - 1, y - 1, 26, 10, 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("ACTIVITY", LEFT_MARGIN + 1.5, y + 5.5);

  doc.setFillColor(255, 193, 7);
  doc.circle(LEFT_MARGIN + 31, y + 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(120, 85, 0);
  doc.text("P", LEFT_MARGIN + 29.5, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(27, 94, 32);
  doc.text(block.title || 'Activity', LEFT_MARGIN + 39, y + 7);

  let ay = y + 16;
  if (contentLines.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 50);
    for (const line of contentLines) {
      doc.text(line, LEFT_MARGIN + 2, ay);
      ay += 5.5;
    }
    ay += 3;
  }

  for (const item of items) {
    ay = checkPageBreak(doc, ay, 9, theme, classNum, chapterTitle, pageNum);
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(0.5);
    doc.rect(LEFT_MARGIN + 2, ay - 3, 4, 4, 'S');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text(item.substring(0, 60), LEFT_MARGIN + 9, ay);
    ay += 8;
  }
  return y + boxHeight + 6;
}

function renderWorksheetBlock(doc: any, block: ContentBlock, y: number, theme: any, pageNum: { value: number }, classNum: number, chapterTitle: string): number {
  const questions = block.questions || [];
  y = checkPageBreak(doc, y, 22, theme, classNum, chapterTitle, pageNum);

  // Taller worksheet header with bigger text
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 6, 186, 20, 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(block.title || 'Worksheet', LEFT_MARGIN + 3, y + 6);
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.3 }));
  doc.circle(185, y + 4, 7, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  y += 22;
  let qNum = 1;

  for (const q of questions) {
    switch (q.type) {
      case 'fill_blank': {
        y = checkPageBreak(doc, y, 22, theme, classNum, chapterTitle, pageNum);
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(LEFT_MARGIN + 2, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, LEFT_MARGIN + 2, y + 4, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const qLines = wrapText(doc, q.question || '', 158, 10);
        let qy = y + 1;
        for (const line of qLines) { doc.text(line, LEFT_MARGIN + 10, qy); qy += 5.5; }
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.4);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(LEFT_MARGIN + 10, qy + 3, 180, qy + 3);
        doc.setLineDashPattern([], 0);
        y = qy + 10;
        qNum++;
        break;
      }
      case 'true_false': {
        y = checkPageBreak(doc, y, 20, theme, classNum, chapterTitle, pageNum);
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(LEFT_MARGIN + 2, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, LEFT_MARGIN + 2, y + 4, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text((q.question || '').substring(0, 70), LEFT_MARGIN + 10, y + 3);
        const tfY = y + 10;
        doc.setDrawColor(76, 175, 80);
        doc.setLineWidth(0.6);
        doc.circle(LEFT_MARGIN + 23, tfY, 3.5, 'S');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(76, 175, 80);
        doc.text("T", LEFT_MARGIN + 23, tfY + 1.5, { align: 'center' });
        doc.setDrawColor(244, 67, 54);
        doc.circle(LEFT_MARGIN + 43, tfY, 3.5, 'S');
        doc.setTextColor(244, 67, 54);
        doc.text("F", LEFT_MARGIN + 43, tfY + 1.5, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("True", LEFT_MARGIN + 28, tfY + 1);
        doc.text("False", LEFT_MARGIN + 48, tfY + 1);
        y = tfY + 10;
        qNum++;
        break;
      }
      case 'match_column': {
        const leftCol = q.leftColumn || [];
        const rightCol = q.rightColumn || [];
        const matchHeight = Math.max(leftCol.length, rightCol.length) * 10 + 18;
        y = checkPageBreak(doc, y, matchHeight + 8, theme, classNum, chapterTitle, pageNum);
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(LEFT_MARGIN + 2, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, LEFT_MARGIN + 2, y + 4, { align: 'center' });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Match the following:", LEFT_MARGIN + 10, y + 3);
        y += 12;

        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        drawRoundedRect(doc, LEFT_MARGIN + 3, y - 3, 70, 8, 2);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("Column A", LEFT_MARGIN + 8, y + 2);

        doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
        drawRoundedRect(doc, LEFT_MARGIN + 103, y - 3, 70, 8, 2);
        doc.setTextColor(255, 255, 255);
        doc.text("Column B", LEFT_MARGIN + 108, y + 2);
        y += 10;

        const maxItems = Math.max(leftCol.length, rightCol.length);
        for (let i = 0; i < maxItems; i++) {
          y = checkPageBreak(doc, y, 10, theme, classNum, chapterTitle, pageNum);
          doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
          drawRoundedRect(doc, LEFT_MARGIN + 3, y - 3, 70, 9, 2);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          if (leftCol[i]) {
            doc.setFont("helvetica", "bold");
            doc.text(`${String.fromCharCode(65 + i)}.`, LEFT_MARGIN + 6, y + 2.5);
            doc.setFont("helvetica", "normal");
            doc.text(leftCol[i].substring(0, 25), LEFT_MARGIN + 14, y + 2.5);
          }
          doc.setFillColor(255, 248, 225);
          drawRoundedRect(doc, LEFT_MARGIN + 103, y - 3, 70, 9, 2);
          if (rightCol[i]) {
            doc.setFont("helvetica", "bold");
            doc.text(`${i + 1}.`, LEFT_MARGIN + 106, y + 2.5);
            doc.setFont("helvetica", "normal");
            doc.text(rightCol[i].substring(0, 25), LEFT_MARGIN + 114, y + 2.5);
          }
          y += 10;
        }
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Write your answers: A-___, B-___, C-___, D-___", LEFT_MARGIN + 3, y + 2);
        y += 10;
        qNum++;
        break;
      }
      case 'short_answer': {
        y = checkPageBreak(doc, y, 30, theme, classNum, chapterTitle, pageNum);
        doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
        doc.circle(LEFT_MARGIN + 2, y + 2, 4, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(`${qNum}`, LEFT_MARGIN + 2, y + 4, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const saLines = wrapText(doc, q.question || '', 158, 10);
        let say = y + 1;
        for (const line of saLines) { doc.text(line, LEFT_MARGIN + 10, say); say += 5.5; }
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.setLineDashPattern([1, 1], 0);
        for (let l = 0; l < 3; l++) doc.line(LEFT_MARGIN + 10, say + 5 + l * 8, 190, say + 5 + l * 8);
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
  const lines = wrapText(doc, block.content || '', 158, 10);
  const boxHeight = lines.length * 5.5 + 22;
  y = checkPageBreak(doc, y, boxHeight + 4, theme, classNum, chapterTitle, pageNum);

  doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 6, 186, boxHeight, 5);
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, LEFT_MARGIN - 5, y - 6, 186, 4, 3);

  doc.setFillColor(76, 175, 80);
  doc.circle(LEFT_MARGIN + 5, y + 5, 5, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("v", LEFT_MARGIN + 3.5, y + 7.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  doc.text(block.title || 'Summary', LEFT_MARGIN + 15, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  let sy = y + 15;
  for (const line of lines) { doc.text(line, LEFT_MARGIN + 2, sy); sy += 5.5; }
  return y + boxHeight + 6;
}

// ============= COLOR ME PAGE RENDERER =============

function renderColorMePage(doc: any, chapter: SampleChapter, theme: any, pageNum: { value: number }) {
  addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);

  // Title banner
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  drawRoundedRect(doc, 25, 28, 160, 22, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("Color Me!", 105, 40, { align: 'center' });
  doc.setFontSize(9);
  doc.text("Make It Your Own", 105, 47, { align: 'center' });

  // Instructions
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Use crayons, colored pencils, or markers to color these illustrations!", 105, 58, { align: 'center' });

  // Draw class-specific outlined illustrations
  const drawFn = classColorMeDrawings[chapter.classNum];
  if (drawFn) {
    drawFn(doc, theme);
  }

  // Bottom encouragement
  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 40, 265, 130, 14, 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("You're an artist AND a scientist! Great job!", 105, 273, { align: 'center' });
}

// ============= MAIN PDF BUILDER =============

async function buildColorfulPdf(chapter: SampleChapter, supabase: any): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const theme = classThemes[chapter.classNum] || classThemes[3];
  const pageNum = { value: 1 };
  illustrationIndex = 0;

  // Generate/fetch AI images in parallel
  let heroImage: string | null = null;
  let midImage: string | null = null;
  let smallImage: string | null = null;
  try {
    const [h, m, s] = await Promise.all([
      getOrGenerateAiImage(supabase, chapter.classNum, 'hero'),
      getOrGenerateAiImage(supabase, chapter.classNum, 'mid'),
      getOrGenerateAiImage(supabase, chapter.classNum, 'small'),
    ]);
    heroImage = h;
    midImage = m;
    smallImage = s;
  } catch (err) {
    console.error("AI image generation failed, continuing without images:", err);
  }

  // ===== PAGE 1: TITLE PAGE =====
  renderTitlePage(doc, chapter, theme);

  // ===== PAGE 2: TABLE OF CONTENTS =====
  renderTocPage(doc, chapter, theme, pageNum);

  // ===== HERO IMAGE PAGE (if available) =====
  if (heroImage) {
    addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
    try {
      doc.addImage(heroImage, 'PNG', 15, 35, 180, 80);
    } catch (e) {
      console.error("Failed to add hero image:", e);
    }
    // Caption
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Illustration: ${chapter.title}`, 105, 122, { align: 'center' });

    // Start content below image
    let y = 132;
    // Render first few blocks on this page
    let blockIdx = 0;
    for (const block of chapter.blocks) {
      if (blockIdx >= 2) break; // only 2 blocks on image page
      switch (block.type) {
        case 'text': y = renderTextBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'callout': y = renderCalloutBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'key_term': y = renderKeyTermBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
      }
      blockIdx++;
    }

    // Continue remaining blocks on new pages
    addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
    y = 32;
    let midImagePlaced = false;
    let smallImagePlaced = false;

    for (let i = 2; i < chapter.blocks.length; i++) {
      const block = chapter.blocks[i];
      switch (block.type) {
        case 'text': y = renderTextBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'callout': y = renderCalloutBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'key_term': y = renderKeyTermBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'step_by_step': y = renderStepByStepBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'comparison': y = renderComparisonBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'activity': y = renderActivityBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'worksheet': y = renderWorksheetBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'summary': y = renderSummaryBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
      }

      // Insert mid image after comparison or step_by_step block
      if (!midImagePlaced && midImage && (block.type === 'comparison' || block.type === 'step_by_step')) {
        if (y < 200) {
          y = checkPageBreak(doc, y, 75, theme, chapter.classNum, chapter.title, pageNum);
          try {
            // Centered mid image
            doc.addImage(midImage, 'PNG', 45, y, 120, 60);
            y += 68;
          } catch (e) { console.error("Failed to add mid image:", e); }
          midImagePlaced = true;
        }
      }

      // Insert small image near worksheet
      if (!smallImagePlaced && smallImage && block.type === 'activity') {
        if (y < 240) {
          try {
            doc.addImage(smallImage, 'PNG', 155, y - 20, 30, 30);
          } catch (e) { console.error("Failed to add small image:", e); }
          smallImagePlaced = true;
        }
      }

      // Larger inline illustrations between blocks
      if (i % 3 === 0 && block.type !== 'worksheet' && block.type !== 'summary') {
        if (y < 235) {
          const illName = getNextIllustration(chapter.classNum);
          const centerX = 105;
          // Light circular background
          doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
          doc.setGState(new doc.GState({ opacity: 0.3 }));
          doc.circle(centerX, y + 12, 16, 'F');
          doc.setGState(new doc.GState({ opacity: 1 }));
          drawIllustration(doc, illName, centerX, y + 12, 22, theme.secondary, 0.25);
          y += 32; // 8mm spacing around
        }
      }
    }
  } else {
    // No AI images - standard content flow
    addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
    let y = 32;

    for (let i = 0; i < chapter.blocks.length; i++) {
      const block = chapter.blocks[i];
      switch (block.type) {
        case 'text': y = renderTextBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'callout': y = renderCalloutBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'key_term': y = renderKeyTermBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'step_by_step': y = renderStepByStepBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'comparison': y = renderComparisonBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'activity': y = renderActivityBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'worksheet': y = renderWorksheetBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
        case 'summary': y = renderSummaryBlock(doc, block, y, theme, pageNum, chapter.classNum, chapter.title); break;
      }

      // Larger inline illustrations
      if (i % 2 === 0 && block.type !== 'worksheet' && block.type !== 'summary' && i > 0) {
        if (y < 235) {
          const illName = getNextIllustration(chapter.classNum);
          const centerX = 105;
          doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
          doc.setGState(new doc.GState({ opacity: 0.3 }));
          doc.circle(centerX, y + 12, 16, 'F');
          doc.setGState(new doc.GState({ opacity: 1 }));
          drawIllustration(doc, illName, centerX, y + 12, 22, theme.secondary, 0.25);
          y += 32;
        }
      }
    }
  }

  // ===== NOTES PAGE =====
  addNewPage(doc, theme, chapter.classNum, chapter.title, pageNum);
  doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
  drawRoundedRect(doc, 15, 28, 180, 22, 6);
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  drawRoundedRect(doc, 15, 28, 6, 22, 3);

  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.rect(25, 33, 3, 12, 'F');
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.triangle(25, 45, 28, 45, 26.5, 49, 'F');
  doc.setFillColor(255, 220, 180);
  doc.rect(25, 31, 3, 3, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  doc.text("My Notes", 36, 43);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Write down your thoughts, ideas, and questions here!", 80, 43);

  let noteY = 58;
  const lineSpacing = 10;
  const leftMargin = 20;
  const rightEnd = 195;
  let lineCount = 0;
  doc.setDrawColor(255, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(leftMargin + 5, 55, leftMargin + 5, 270);

  while (noteY < 268) {
    if (lineCount % 2 === 0) {
      doc.setFillColor(theme.bgTint[0], theme.bgTint[1], theme.bgTint[2]);
      doc.rect(leftMargin, noteY - 4, rightEnd - leftMargin, lineSpacing, 'F');
    }
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(leftMargin, noteY, rightEnd, noteY);
    doc.setLineDashPattern([], 0);
    if (lineCount % 3 === 0) {
      doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
      doc.circle(leftMargin + 2, noteY - 2, 1, 'F');
    }
    noteY += lineSpacing;
    lineCount++;
  }

  doc.setFillColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  drawRoundedRect(doc, 50, 274, 110, 10, 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Keep learning, keep exploring! You're doing great!", 105, 280, { align: 'center' });

  // ===== COLOR ME PAGE =====
  renderColorMePage(doc, chapter, theme, pageNum);

  // ===== END OF SAMPLE PAGE =====
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

      // Generate PDF (now async for AI images)
      const pdfBytes = await buildColorfulPdf(chapter, supabase);

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
