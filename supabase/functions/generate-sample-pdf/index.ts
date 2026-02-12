import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sample book content data (mirrored from frontend)
interface ContentBlock {
  type: string;
  title?: string;
  content?: string;
  items?: string[];
  columns?: { left: string[]; right: string[]; leftTitle?: string; rightTitle?: string };
  variant?: string;
  icon?: string;
}

interface SampleChapter {
  classNum: number;
  title: string;
  subtitle: string;
  blocks: ContentBlock[];
}

const sampleBookChapters: SampleChapter[] = [
  {
    classNum: 3,
    title: "Meet the Computer",
    subtitle: "Your New Digital Friend!",
    blocks: [
      { type: "text", title: "What is a Computer?", content: "A computer is an electronic machine that helps us do many things — like drawing, writing stories, playing games, watching videos, and even talking to friends far away! Just like how we use our brain to think and solve problems, a computer uses its own 'brain' called a processor to follow instructions and get things done really fast." },
      { type: "callout", variant: "fun_fact", content: "Did you know? The first computer was so big that it filled an entire room — bigger than your classroom! Today, computers are small enough to fit in your pocket (like a smartphone).", icon: "🤯" },
      { type: "key_term", title: "Processor (CPU)", content: "The 'brain' of the computer that thinks and works very fast. CPU stands for Central Processing Unit." },
      { type: "text", title: "Parts of a Computer", content: "Just like our body has different parts — eyes to see, ears to hear, hands to touch — a computer also has different parts that help it work. Let's learn about each one!" },
      { type: "step_by_step", title: "Main Parts of a Computer", items: ["Monitor — The screen where you see everything. It's like the computer's face!", "Keyboard — Has buttons with letters, numbers, and symbols. You type using it, just like writing in a notebook.", "Mouse — A small device you move around to point and click on things on the screen.", "CPU (System Unit) — The box that contains the computer's brain and memory. It does all the thinking!", "Speakers — Let you hear sounds, music, and voices from the computer."] },
      { type: "comparison", title: "Input vs Output Devices", columns: { leftTitle: "Input Devices (We give information)", rightTitle: "Output Devices (Computer gives us results)", left: ["Keyboard — we type letters", "Mouse — we click and point", "Microphone — we speak into it", "Camera — we show our face"], right: ["Monitor — we see pictures and text", "Speakers — we hear sounds", "Printer — we get papers printed", "Headphones — we hear privately"] } },
      { type: "callout", variant: "tip", content: "Easy way to remember: INPUT means 'going IN to the computer' and OUTPUT means 'coming OUT from the computer'!", icon: "💡" },
      { type: "key_term", title: "Hardware", content: "The parts of a computer you can touch and feel — like the keyboard, mouse, and monitor. They are the physical parts." },
      { type: "key_term", title: "Software", content: "The programs and apps inside the computer that you cannot touch — like games, drawing apps, and web browsers. They are the instructions that tell hardware what to do." },
      { type: "activity", title: "Quick Activity: Computer Parts Hunt!", content: "Look around your home or school. Can you find these computer parts? Make a list!", items: ["Monitor/Screen", "Keyboard", "Mouse or Touchpad", "Speakers or Headphones", "Printer (if available)"] },
      { type: "text", title: "Computers Are Everywhere!", content: "Computers are not just desktops and laptops! They are inside many things we use every day — smartphones, tablets, smart TVs, washing machines, and even cars! Any device that follows instructions and processes information has a tiny computer inside it." },
      { type: "summary", title: "Chapter Summary", content: "In this chapter, we learned that a computer is an electronic machine with different parts. Input devices help us send information to the computer, and output devices help the computer show us results. The CPU is the brain, and we can divide computer parts into hardware (things we touch) and software (programs we use)." }
    ]
  },
  {
    classNum: 5,
    title: "Thinking Like a Computer",
    subtitle: "Introduction to Computational Thinking",
    blocks: [
      { type: "text", title: "What is Computational Thinking?", content: "Computational Thinking (CT) is a way of solving problems step by step — just like a computer does! But you don't need a computer to use it. You can use computational thinking to solve everyday problems like organizing your school bag, planning a birthday party, or even making a sandwich!" },
      { type: "callout", variant: "info", content: "Computational Thinking is not about thinking like a robot. It's about breaking big problems into smaller, manageable pieces and finding smart solutions — something humans are naturally great at!", icon: "🧠" },
      { type: "key_term", title: "Computational Thinking", content: "A problem-solving approach that involves breaking problems down, finding patterns, focusing on what's important, and creating step-by-step solutions." },
      { type: "text", title: "The Four Pillars of Computational Thinking", content: "Computational Thinking has four main skills, often called 'pillars.' Think of them as four superpowers that help you solve any problem!" },
      { type: "step_by_step", title: "The Four Pillars", items: ["Decomposition — Breaking a big problem into smaller, easier parts.", "Pattern Recognition — Finding similarities or repeating elements.", "Abstraction — Focusing on what's important and ignoring unnecessary details.", "Algorithm Design — Creating step-by-step instructions to solve the problem."] },
      { type: "comparison", title: "With vs Without Computational Thinking", columns: { leftTitle: "Without CT (Confused!)", rightTitle: "With CT (Organized!)", left: ["\"This project is too big!\"", "\"I don't know where to start\"", "\"Everything seems important\"", "\"I'll just figure it out as I go\""], right: ["\"Let me break it into 5 small tasks\"", "\"I'll start with the easiest part first\"", "\"Let me focus on the key details\"", "\"Here's my step-by-step plan\""] } },
      { type: "callout", variant: "fun_fact", content: "Even making a cup of tea uses computational thinking! You decompose the task, follow a pattern, abstract away unimportant details, and follow an algorithm.", icon: "☕" },
      { type: "key_term", title: "Algorithm", content: "A set of clear, step-by-step instructions to solve a problem or complete a task." },
      { type: "key_term", title: "Decomposition", content: "Breaking a complex problem into smaller, more manageable sub-problems." },
      { type: "activity", title: "Activity: Decompose Your Morning Routine!", content: "Think about everything you do from waking up to reaching school. Break it down into at least 8 steps.", items: ["Write down every single step of your morning", "Circle the steps that repeat every single day (patterns)", "Cross out any steps that aren't absolutely necessary (abstraction)", "Number your final steps in order (algorithm!)"] },
      { type: "text", title: "CT in Real Life", content: "Computational thinking isn't just for computers — doctors use it to diagnose diseases, architects use it to design buildings, chefs use it to create recipes, and detectives use it to solve mysteries!" },
      { type: "summary", title: "Chapter Summary", content: "Computational Thinking is a powerful problem-solving method with four pillars: Decomposition, Pattern Recognition, Abstraction, and Algorithm Design. These skills help in coding, school, and everyday life!" }
    ]
  },
  {
    classNum: 8,
    title: "What is Artificial Intelligence?",
    subtitle: "When Machines Start to Think",
    blocks: [
      { type: "text", title: "Welcome to the World of AI!", content: "Artificial Intelligence, or AI, is the science of making machines that can think, learn, and make decisions — similar to how humans do! AI is one of the most exciting and important technologies of the 21st century." },
      { type: "callout", variant: "info", content: "AI doesn't mean robots walking around like humans. Most AI today is 'narrow AI' — it's really good at ONE specific task, like recognizing faces or translating languages.", icon: "🤖" },
      { type: "key_term", title: "Artificial Intelligence (AI)", content: "The field of computer science focused on creating systems that can perform tasks that normally require human intelligence." },
      { type: "text", title: "AI in Your Daily Life", content: "You might think AI is something futuristic, but you're already using it every day!" },
      { type: "step_by_step", title: "AI Examples You Use Daily", items: ["Voice Assistants — Siri, Alexa, Google Assistant understand your voice.", "Auto-Correct & Predictive Text — Your phone predicts what you're typing.", "YouTube & Netflix Recommendations — AI suggests videos you might like.", "Face Unlock — Your phone recognizes YOUR face.", "Google Search — AI understands your question and finds the best answers.", "Instagram & Snapchat Filters — AI detects your face and adds effects."] },
      { type: "comparison", title: "Human Intelligence vs Artificial Intelligence", columns: { leftTitle: "Human Intelligence", rightTitle: "Artificial Intelligence", left: ["Learns from experience and emotions", "Can be creative and imaginative", "Gets tired and needs rest", "Makes mistakes due to feelings", "Can do many different tasks"], right: ["Learns from data and patterns", "Follows rules and patterns", "Never gets tired, works 24/7", "Consistent but can have data bias", "Usually excels at one specific task"] } },
      { type: "key_term", title: "Machine Learning (ML)", content: "A subset of AI where machines learn from data and improve over time WITHOUT being explicitly programmed for every scenario." },
      { type: "text", title: "The Turing Test", content: "In 1950, Alan Turing asked: 'Can machines think?' He proposed a test: if a human talks to a machine and cannot tell whether they're talking to a human or a machine, then the machine passes the Turing Test." },
      { type: "callout", variant: "fun_fact", content: "Alan Turing is often called the 'Father of Computer Science.' During WWII, he built a machine that cracked the Nazi 'Enigma' code, helping to end the war sooner!", icon: "🏆" },
      { type: "key_term", title: "Turing Test", content: "A test to determine if a machine can exhibit intelligent behavior indistinguishable from a human." },
      { type: "activity", title: "Activity: AI or Not AI?", content: "For each of these, decide: Is it using AI or just regular programming?", items: ["A calculator that adds two numbers (Not AI)", "A spam filter that learns which emails are junk (AI)", "A traffic light that changes every 60 seconds (Not AI)", "A self-driving car that avoids obstacles (AI)", "A chatbot that answers your questions naturally (AI)"] },
      { type: "summary", title: "Chapter Summary", content: "Artificial Intelligence is about making machines that can perform tasks requiring human-like intelligence. AI is already in our daily lives. Machine Learning allows machines to learn from data. The Turing Test helps us think about whether machines can truly 'think.'" }
    ]
  },
  {
    classNum: 9,
    title: "How Machines Learn",
    subtitle: "The Magic Behind Machine Learning",
    blocks: [
      { type: "text", title: "From Rules to Learning", content: "Traditional programming gives the computer exact rules. Machine Learning flips this: instead of giving rules, you give examples (data), and it figures out the rules on its own!" },
      { type: "callout", variant: "info", content: "Traditional Programming = Data + Rules → Answer. Machine Learning = Data + Answers → Rules!", icon: "🔄" },
      { type: "key_term", title: "Machine Learning", content: "A branch of AI where computers learn patterns from data and make predictions without being explicitly programmed." },
      { type: "key_term", title: "Training Data", content: "The collection of examples used to teach a machine learning model." },
      { type: "text", title: "Types of Machine Learning", content: "Just like there are different ways humans learn, machines also have different learning approaches." },
      { type: "step_by_step", title: "Three Types of Machine Learning", items: ["Supervised Learning — The machine learns from labeled examples. Like a teacher showing solved problems.", "Unsupervised Learning — The machine finds hidden patterns WITHOUT labels. Like sorting candies by color.", "Reinforcement Learning — The machine learns by trial and error with rewards and penalties. Like training a puppy."] },
      { type: "comparison", title: "Supervised vs Unsupervised Learning", columns: { leftTitle: "Supervised Learning", rightTitle: "Unsupervised Learning", left: ["Uses labeled data", "Teacher guides learning", "Predicts specific outcomes", "Example: Spam detection"], right: ["Uses unlabeled data", "Machine discovers patterns alone", "Finds hidden structures", "Example: Customer segmentation"] } },
      { type: "text", title: "How a Model Learns", content: "Training a model is like studying for an exam. The model sees many examples, is tested on new ones, adjusts if it makes mistakes, and this cycle repeats thousands of times." },
      { type: "key_term", title: "Model", content: "The mathematical representation built after learning from training data. It makes predictions on new, unseen data." },
      { type: "key_term", title: "Accuracy", content: "How often the model makes correct predictions. 95% accuracy means correct 95 out of 100 times." },
      { type: "callout", variant: "fun_fact", content: "Google Photos uses ML trained on billions of images. It can recognize your face, your pet, and even landmarks!", icon: "📸" },
      { type: "activity", title: "Activity: Train Your Classmate!", content: "Play a 'Human Machine Learning' game!", items: ["Trainer: Draw 10 shapes — some circles, some squares (label each)", "Machine: Look at labeled examples and learn the difference", "Trainer: Draw 5 NEW shapes without labels", "Machine: Predict if each new shape is a circle or square", "Check accuracy: How many did the 'machine' get right?"] },
      { type: "summary", title: "Chapter Summary", content: "Machine Learning allows computers to learn from data. Three main types: Supervised, Unsupervised, and Reinforcement learning. Training data quality is crucial. ML powers many modern applications." }
    ]
  },
  {
    classNum: 10,
    title: "AI in the Real World",
    subtitle: "Applications, Ethics & the Future",
    blocks: [
      { type: "text", title: "AI: Transforming Every Industry", content: "Artificial Intelligence is actively transforming every industry. From healthcare to education, transportation to entertainment, AI is creating solutions to problems we once thought impossible." },
      { type: "callout", variant: "info", content: "By 2030, AI is expected to contribute over $15.7 trillion to the global economy. India alone could see a $957 billion boost from AI adoption.", icon: "🌍" },
      { type: "text", title: "AI in Healthcare", content: "AI is revolutionizing medicine by helping doctors diagnose diseases earlier and more accurately. AI can analyze medical images and detect cancers, sometimes more accurately than experienced doctors!" },
      { type: "step_by_step", title: "AI Applications Across Industries", items: ["Healthcare — Disease diagnosis, drug discovery, personalized treatment, robot-assisted surgery.", "Education — Adaptive learning, automated grading, personalized study paths.", "Transportation — Self-driving cars, traffic optimization, route planning, drone deliveries.", "Finance — Fraud detection, algorithmic trading, credit scoring.", "Agriculture — Crop disease detection, yield prediction, automated irrigation.", "Entertainment — Recommendations, AI-generated art, game development."] },
      { type: "comparison", title: "AI Benefits vs Challenges", columns: { leftTitle: "Benefits of AI", rightTitle: "Challenges & Concerns", left: ["Saves time and increases efficiency", "Reduces human error", "Available 24/7", "Processes huge amounts of data", "Creates new jobs"], right: ["May replace certain jobs", "Bias if training data is biased", "Privacy concerns", "High energy consumption", "Ethical dilemmas"] } },
      { type: "key_term", title: "AI Ethics", content: "The study of moral principles and guidelines for the development and use of AI systems." },
      { type: "key_term", title: "Bias in AI", content: "When an AI system produces unfair results because its training data contains existing societal biases." },
      { type: "text", title: "Responsible AI: The FATE Framework", content: "As AI becomes more powerful, we need to ensure it's developed and used responsibly." },
      { type: "step_by_step", title: "The FATE Framework", items: ["Fairness — AI should treat all people equally, regardless of background.", "Accountability — Someone must be responsible when AI makes mistakes.", "Transparency — People should understand HOW an AI makes decisions.", "Ethics — AI should respect human rights, privacy, and dignity."] },
      { type: "callout", variant: "tip", content: "Remember: AI is a tool created by humans. It reflects our values and biases. The responsibility to make AI fair lies with US.", icon: "⚖️" },
      { type: "activity", title: "Activity: Design an AI Solution!", content: "Choose a real-world problem in your community. Design an AI-powered solution!", items: ["Identify a problem (e.g., food waste, traffic, water wastage)", "What data would your AI need? List at least 5 data points", "What type of ML would you use?", "What ethical concerns should you consider?", "Draw a simple flowchart of how your AI solution would work"] },
      { type: "key_term", title: "Deep Learning", content: "A subset of machine learning inspired by the brain's neural networks. It uses layers of artificial neurons to learn complex patterns." },
      { type: "key_term", title: "Natural Language Processing (NLP)", content: "The branch of AI that helps computers understand, interpret, and generate human language." },
      { type: "summary", title: "Chapter Summary", content: "AI is transforming industries worldwide. India is emerging as a global AI leader. While AI offers tremendous benefits, it also raises challenges. The FATE framework guides responsible AI development. As future AI leaders, we must ensure it benefits all of humanity." }
    ]
  }
];

// Simple PDF builder using text formatting (no external PDF lib needed)
// We'll build a structured text-based PDF content and use a minimal PDF generator

function buildPdfBytes(chapter: SampleChapter): Uint8Array {
  // Build a minimal valid PDF manually
  const lines: string[] = [];
  const pageWidth = 595; // A4 width in points
  const pageHeight = 842; // A4 height in points
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;
  
  // We'll collect all text content and create a simple multi-page PDF
  const textContent: string[] = [];
  
  // Title page
  textContent.push(`KODEINTEL LEARNING PLATFORM`);
  textContent.push(``);
  textContent.push(`Class ${chapter.classNum}`);
  textContent.push(``);
  textContent.push(chapter.title);
  textContent.push(chapter.subtitle);
  textContent.push(``);
  textContent.push(`Chapter 1 - Sample Preview`);
  textContent.push(`(C) KodeIntel - AI & Computational Thinking for Young Learners`);
  textContent.push(``);
  textContent.push(`---`);
  textContent.push(``);
  
  // Content blocks
  for (const block of chapter.blocks) {
    if (block.title) {
      textContent.push(``);
      textContent.push(`[${block.type.toUpperCase()}] ${block.title}`);
      textContent.push(`${"=".repeat(Math.min(60, block.title.length + block.type.length + 3))}`);
    }
    
    if (block.content) {
      // Word wrap at ~80 chars
      const words = block.content.split(" ");
      let line = "";
      for (const word of words) {
        if ((line + " " + word).length > 80) {
          textContent.push(line.trim());
          line = word;
        } else {
          line += " " + word;
        }
      }
      if (line.trim()) textContent.push(line.trim());
    }
    
    if (block.items) {
      textContent.push(``);
      block.items.forEach((item, i) => {
        const prefix = `  ${i + 1}. `;
        const words = item.split(" ");
        let line = prefix;
        for (const word of words) {
          if ((line + " " + word).length > 78) {
            textContent.push(line.trimEnd());
            line = "     " + word;
          } else {
            line += " " + word;
          }
        }
        if (line.trim()) textContent.push(line.trimEnd());
      });
    }
    
    if (block.columns) {
      textContent.push(``);
      const lt = block.columns.leftTitle || "Left";
      const rt = block.columns.rightTitle || "Right";
      textContent.push(`  ${lt}`);
      block.columns.left.forEach(item => textContent.push(`    - ${item}`));
      textContent.push(``);
      textContent.push(`  ${rt}`);
      block.columns.right.forEach(item => textContent.push(`    - ${item}`));
    }
    
    textContent.push(``);
  }
  
  // Footer
  textContent.push(`---`);
  textContent.push(`Sample Preview - For full content, visit kodeintel.com`);
  textContent.push(`(C) KodeIntel Learning Platform`);
  
  // Now build actual PDF bytes
  // We'll use a simple PDF structure with text streams
  const fontSize = 11;
  const lineHeight = 14;
  const linesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);
  
  // Split text into pages
  const pages: string[][] = [];
  let currentPage: string[] = [];
  
  for (const line of textContent) {
    currentPage.push(line);
    if (currentPage.length >= linesPerPage) {
      pages.push(currentPage);
      currentPage = [];
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  // Build PDF structure
  const objects: string[] = [];
  let objCount = 0;
  
  const addObj = (content: string): number => {
    objCount++;
    objects.push(content);
    return objCount;
  };
  
  // Obj 1: Catalog
  addObj(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);
  
  // Obj 2: Pages (placeholder - will be updated)
  const pagesObjIndex = addObj(`PLACEHOLDER`);
  
  // Obj 3: Font
  addObj(`3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj`);
  
  // Bold font
  addObj(`4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj`);
  
  // Create page objects and content streams
  const pageObjIds: number[] = [];
  let nextId = 5;
  
  for (let p = 0; p < pages.length; p++) {
    const pageLines = pages[p];
    const contentId = nextId++;
    const pageId = nextId++;
    
    // Build content stream - escape special PDF chars
    let stream = `BT\n/F1 ${fontSize} Tf\n`;
    let y = pageHeight - margin;
    
    // Header
    stream += `1 0 0 1 ${margin} ${y} Tm\n`;
    stream += `/F2 8 Tf\n`;
    stream += `(KodeIntel -- Class ${chapter.classNum} | ${chapter.title} | Page ${p + 1}) Tj\n`;
    y -= 20;
    
    // Content
    stream += `/F1 ${fontSize} Tf\n`;
    
    for (const line of pageLines) {
      if (y < margin + 30) break;
      
      // Check if it's a heading (starts with [ or has === )
      if (line.startsWith("[") || line.startsWith("KODEINTEL")) {
        stream += `/F2 ${fontSize} Tf\n`;
      } else {
        stream += `/F1 ${fontSize} Tf\n`;
      }
      
      stream += `1 0 0 1 ${margin} ${y} Tm\n`;
      // Escape PDF special characters
      const escaped = line
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        // Remove non-ASCII chars for basic PDF compatibility
        .replace(/[^\x20-\x7E]/g, "");
      stream += `(${escaped}) Tj\n`;
      y -= lineHeight;
    }
    
    // Footer
    y = margin;
    stream += `/F1 7 Tf\n`;
    stream += `1 0 0 1 ${margin} ${y} Tm\n`;
    stream += `((C) KodeIntel Learning Platform | Sample Preview | Page ${p + 1} of ${pages.length}) Tj\n`;
    
    stream += `ET`;
    
    const streamBytes = new TextEncoder().encode(stream);
    
    // Content stream object
    objects.push(`${contentId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj`);
    
    // Page object
    objects.push(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>\nendobj`);
    
    pageObjIds.push(pageId);
    objCount = nextId - 1;
  }
  
  // Update Pages object
  const kidRefs = pageObjIds.map(id => `${id} 0 R`).join(" ");
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kidRefs}] /Count ${pageObjIds.length} >>\nendobj`;
  
  // Build final PDF
  let pdf = `%PDF-1.4\n`;
  const offsets: number[] = [];
  
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  }
  
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;
  
  return new TextEncoder().encode(pdf);
}

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
      
      // Check if already exists
      const { data: existing } = await supabase.storage
        .from("sample-books")
        .list("", { search: fileName });
      
      if (existing && existing.length > 0 && !generateAll) {
        const { data: urlData } = supabase.storage
          .from("sample-books")
          .getPublicUrl(fileName);
        results.push({ classNum: cn, url: urlData.publicUrl, status: "exists" });
        continue;
      }
      
      // Generate PDF
      const pdfBytes = buildPdfBytes(chapter);
      
      // Upload to storage
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
