import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an exam question setter who writes CBT (Computer-Based Test) style multiple-choice questions, in the tradition of exams like JAMB and WAEC, but usable for ANY subject or field the person gives you notes on.

Rules:
- Read the notes provided and write clear, fair multiple-choice questions that test real understanding of the material, not trivia about wording.
- Each question has exactly 4 options labeled A, B, C, D, with exactly one correct answer.
- Distractors (wrong options) must be plausible, not silly or obviously wrong.
- Keep question and option text concise.
- Include a one-sentence explanation for why the correct answer is correct.
- Respond ONLY with valid JSON, no markdown fences, no commentary, matching this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
      "correct": "A" | "B" | "C" | "D",
      "explanation": "string"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { notes, numQuestions } = await req.json();

    if (!notes || typeof notes !== "string" || notes.trim().length < 20) {
      return NextResponse.json(
        { error: "Please paste in more complete notes (at least a few sentences)." },
        { status: 400 }
      );
    }

    const count = Math.min(Math.max(Number(numQuestions) || 5, 1), 20);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate ${count} CBT-style multiple-choice questions from these notes:\n\n${notes}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";

    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json(
        { error: "The question generator returned something unexpected. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Something went wrong while generating questions. Please try again." },
      { status: 500 }
    );
  }
}
