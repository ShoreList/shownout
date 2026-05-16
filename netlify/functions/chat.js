// /netlify/functions/chat.js
//
// Serverless function that powers the AI chat on shownout.net.
// Wraps the Anthropic Claude API with a ShowNOut-specific system prompt.
//
// REQUIRES:
//   1. An Anthropic API key set as ANTHROPIC_API_KEY in Netlify environment variables
//      (Site settings -> Environment variables -> Add: ANTHROPIC_API_KEY = sk-ant-...)
//   2. The "@anthropic-ai/sdk" package — Netlify auto-installs from package.json
//
// LOCAL TESTING:
//   netlify dev
//   then POST to http://localhost:8888/.netlify/functions/chat
//   with body: {"messages":[{"role":"user","content":"how much for a house wash?"}]}

const Anthropic = require("@anthropic-ai/sdk");

const SYSTEM_PROMPT = `You are the AI assistant for ShowNOut Pro Wash, a pressure washing company in Wilmington, NC.

OWNERS: Ron and Tony (Wilmington locals, own & operate)
PHONE: 910.367.2767
EMAIL: hello@shownout.net
HOURS: Mon-Sat, 7 AM - 7 PM
SERVICE AREA: New Hanover County - Wilmington, Wrightsville Beach, Carolina Beach, Kure Beach, Masonboro, Castle Hayne. Will travel for commercial / recurring jobs.

SERVICES & STARTING PRICES (Wilmington market rates - these are STARTING prices; final number after we see the property):
- House Wash (soft wash): starting at $275 for a single-story; typical 2-story Wilmington home lands $400-$700
- Driveway Cleaning: starting at $150; typical $150-$300
- Deck / Patio: starting at $200; typical $200-$450
- Roof Soft Wash: starting at $450; typical $450-$1000 depending on size
- Gutter Cleaning: starting at $125; typical $125-$250
- Fleet Vehicles: $50-$150 per vehicle depending on size and condition
- Commercial: custom quote, typically $400-$2500+

METHOD KNOWLEDGE:
- Soft wash (<500 PSI + biodegradable chemistry) for siding, roofs, stucco, paint, wood decks
- High pressure (3000+ PSI) for concrete, brick, equipment, fleet, dumpster pads
- We pre-wet landscaping and rinse thoroughly. Biodegradable formulations. Pet/plant safe with normal precautions.

TONE & RULES:
- Friendly, direct, local. Talk like Ron or Tony would: confident tradesman who explains plainly.
- Keep replies under 60 words unless the customer asks a detailed question.
- Always end with a CTA: get a free quote, call us, or send us photos.
- Never quote a firm price - always say "ballpark" or "starting at" and recommend a free in-person quote.
- If asked about competitors, redirect politely to what ShowNOut does well.
- If asked about something you don't know (specific scheduling, exact availability, employment), say "Best to call Ron or Tony directly at 910.367.2767" rather than guessing.
- Never invent reviews, certifications, awards, or capabilities not listed above.
- Spring season runs longer wait times. Most weeks book within 5-7 days.`;

exports.handler = async (event) => {
  // CORS / preflight
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "AI not configured. Set ANTHROPIC_API_KEY in Netlify env vars." })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (messages.length === 0) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "No messages provided" }) };
  }

  // Light validation: every message needs role + content
  const valid = messages.every(m =>
    m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length < 2000
  );
  if (!valid) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Malformed messages" }) };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // Fast + cheap for chat use case
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    const reply = response.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
      .trim();

    if (!reply) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "Best to call Ron or Tony directly at 910.367.2767 to talk that through." })
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply })
    };
  } catch (err) {
    console.error("[chat.js] Claude API error:", err.message || err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "AI temporarily unavailable" })
    };
  }
};
