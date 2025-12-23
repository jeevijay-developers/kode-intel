import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Piston API language mappings
const languageConfig: Record<string, { language: string; version: string }> = {
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  javascript: { language: "javascript", version: "18.15.0" },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, code } = await req.json();

    console.log(`Executing ${language} code...`);

    if (!language || !code) {
      return new Response(
        JSON.stringify({ error: "Language and code are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = languageConfig[language];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Piston API
    const pistonResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ content: code }],
      }),
    });

    if (!pistonResponse.ok) {
      const errorText = await pistonResponse.text();
      console.error("Piston API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Code execution service unavailable" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await pistonResponse.json();
    console.log("Execution result:", result);

    const output = result.run?.stdout || "";
    const error = result.run?.stderr || result.compile?.stderr || "";
    const exitCode = result.run?.code ?? 0;

    return new Response(
      JSON.stringify({
        output,
        error,
        exitCode,
        executionTime: result.run?.time || "N/A",
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error("Error executing code:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to execute code";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
