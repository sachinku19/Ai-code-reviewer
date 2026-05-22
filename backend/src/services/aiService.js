const SYSTEM_PROMPT = `You are AI Code Reviewer Pro, a senior staff engineer. Return ONLY strict JSON with this shape:
{
  "summary": "short executive summary",
  "bugs": ["specific bug or risk"],
  "suggestions": ["specific improvement"],
  "optimizedCode": "complete improved code when useful",
  "explanation": "plain-English explanation",
  "timeComplexity": "Big-O and short reason",
  "spaceComplexity": "Big-O and short reason",
  "bestPractices": ["practice"],
  "security": ["security finding"],
  "score": 0
}`;

const cleanJson = (text) => text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/g, "").trim();

const fallbackReview = ({ code, language, action }) => {
  const lines = code.split("\n").length;
  const hasNestedLoops = /for\s*\([^)]*\)\s*{[\s\S]*for\s*\(/.test(code) || /while\s*\([^)]*\)\s*{[\s\S]*while\s*\(/.test(code);
  const usesEval = /\beval\s*\(/.test(code);
  const hasConsole = /\bconsole\.log\s*\(/.test(code);
  const score = Math.max(52, 92 - (usesEval ? 18 : 0) - (hasNestedLoops ? 10 : 0) - (hasConsole ? 4 : 0));

  return {
    summary: `${action === "explain" ? "Explained" : action === "optimize" ? "Optimized" : "Reviewed"} ${language} code with ${lines} line${lines === 1 ? "" : "s"}.`,
    bugs: [
      ...(usesEval ? ["Avoid eval-style execution because it can execute untrusted input."] : []),
      ...(code.trim().length < 12 ? ["The snippet is very small, so functional correctness cannot be fully assessed."] : []),
      ...(hasNestedLoops ? ["Nested iteration may become slow on large inputs."] : [])
    ],
    suggestions: [
      "Use clear function names and keep side effects explicit.",
      "Add focused tests around edge cases and invalid inputs.",
      ...(hasConsole ? ["Replace console logging with structured logging or remove it before production."] : [])
    ],
  optimizedCode:
  action === "optimize"
    ? `function findDuplicates(items) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates];
}`
    : code,
    explanation: "This analysis was generated locally because no AI API key is configured. Add GEMINI_API_KEY or OPENAI_API_KEY for model-powered reviews.",
    timeComplexity: hasNestedLoops ? "O(n^2) likely, because nested loops are present." : "O(n) or better likely, based on visible control flow.",
    spaceComplexity: "O(1) to O(n), depending on input-sized temporary data created by the snippet.",
    bestPractices: ["Validate inputs.", "Prefer pure helpers for reusable logic.", "Keep functions small and testable."],
    security: usesEval ? ["Remove eval and never execute user-controlled strings."] : ["No obvious high-risk security issue detected in the visible snippet."],
    score,
    rawMarkdown: ""
  };
};

const callGemini = async (prompt) => {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
        generationConfig: { temperature: 0.25, responseMimeType: "application/json" }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Gemini request failed");
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
};

const callOpenAI = async (prompt) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenAI request failed");
  return data.choices?.[0]?.message?.content || "{}";
};

export const analyzeCode = async ({ code, language, action }) => {
  const prompt = `Action: ${action}
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Review for correctness, readability, performance, complexity, security, comments, and provide a better version when appropriate.`;

  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    return fallbackReview({ code, language, action });
  }

  const provider = process.env.AI_PROVIDER || (
  process.env.GEMINI_API_KEY ? "gemini" : "openai"
);

let text;

try {
  text = provider === "openai"
    ? await callOpenAI(prompt)
    : await callGemini(prompt);
} catch (err) {
  console.log("AI ERROR:", err.message);

  return {
    ...fallbackReview({ code, language, action }),
    explanation: `AI provider failed: ${err.message}`
  };
}

const parsed = JSON.parse(cleanJson(text));
  return {
    summary: parsed.summary || "Review completed.",
    bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    optimizedCode: parsed.optimizedCode || "",
    explanation: parsed.explanation || "",
    timeComplexity: parsed.timeComplexity || "Not enough information.",
    spaceComplexity: parsed.spaceComplexity || "Not enough information.",
    bestPractices: Array.isArray(parsed.bestPractices) ? parsed.bestPractices : [],
    security: Array.isArray(parsed.security) ? parsed.security : [],
    score: Number.isFinite(parsed.score) ? Math.min(100, Math.max(0, parsed.score)) : 80,
    rawMarkdown: parsed.rawMarkdown || ""
  };
};
