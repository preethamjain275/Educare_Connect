// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { messages, context } = body;

    if (!messages) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Received chat request with", messages?.length, "messages", "Context:", context);

    const AI_API_KEY = Deno.env.get("AI_API_KEY");

    if (!AI_API_KEY) {
      console.error("AI_API_KEY is missing in environment variables");
      throw new Error("AI_API_KEY is not configured. Please set it to your Google Gemini API Key.");
    }

    let systemPrompt = `You are EduCare Connect AI Assistant - a helpful, friendly assistant for the EduCare Connect education and healthcare management platform.

You help students, parents, teachers, doctors, and administrators with:
- Understanding how to use the platform
- Explaining features like attendance tracking, marks viewing, health records
- Answering questions about school events and activities
- Providing guidance on submitting leave applications
- Explaining health check-in procedures
- Helping with navigation through different dashboards`;

    if (context === 'doctor') {
      systemPrompt += `\n\nSPECIAL ROLE: You are acting as a Virtual Medical Assistant for a School Doctor.
- You can provide general medical information and suggestions for common school-related health issues (headaches, fever, cuts, hygiene).
- If asked about symptoms (e.g., "student has a headache" or "fever"), ALWAYS ask follow-up questions like "How long has it been?" or "What is the temperature?".
- Suggest common remedies (hydration, rest, checking temperature, cooling sponges) and over-the-counter options if appropriate.
- CRITICALLY: ALWAYS advise identifying the student and visiting the school nurse or consulting the parents.
- You can suggest questions to ask the student involved.
- DISCLAIMER: Always remind the user that you are an AI and this is not a formal medical diagnosis.`;
    }

    systemPrompt += `\n\nKeep responses concise, friendly, and helpful. Use simple language.`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const history = messages.slice(0, -1).map((m: any) => {
      if (m.role === 'system') return null;
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      };
    }).filter((m: any) => m !== null);

    // Ensure history starts with user message if it exists
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    const lastMessage = messages[messages.length - 1].content;
    console.log("Sending to Gemini...");

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessageStream(lastMessage);

    // Create a stream to transform Gemini chunks to OpenAI-style SSE events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Format as OpenAI delta for compatibility with existing frontend
              const event = {
                choices: [{ delta: { content: text } }]
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (e) {
          console.error("Stream processing error:", e);
          const errorEvent = { error: "Stream error processing response" };
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
          } catch (inner) {
            // Controller properly closed or error state
          }
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat handler error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
