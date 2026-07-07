"use client";

import { Option, Question } from "@/lib/types";

interface Props {
  questions: Question[];
  answers: Record<number, Option>;
  submitted: boolean;
  onSelect?: (qIndex: number, opt: Option) => void;
}

export default function QuizView({ questions, answers, submitted, onSelect }: Props) {
  function bubbleClass(qIndex: number, opt: Option) {
    const base = "omr-bubble";
    if (!submitted) {
      return answers[qIndex] === opt ? `${base} selected` : base;
    }
    const q = questions[qIndex];
    if (opt === q.correct) return `${base} correct`;
    if (answers[qIndex] === opt && opt !== q.correct) return `${base} incorrect`;
    return base;
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="paper-card rounded-sm p-5">
          <p className="font-mono text-xs text-muted mb-1">Question {qIndex + 1}</p>
          <p className="text-base font-medium mb-4">{q.question}</p>
          <div className="space-y-2.5">
            {(Object.keys(q.options) as Option[]).map((opt) => (
              <div
                key={opt}
                onClick={() => onSelect && onSelect(qIndex, opt)}
                className={`flex items-center gap-3 ${onSelect && !submitted ? "cursor-pointer" : ""}`}
              >
                <div className={bubbleClass(qIndex, opt)}>{opt}</div>
                <span className="text-sm">{q.options[opt]}</span>
              </div>
            ))}
          </div>
          {submitted && (
            <p className="text-sm text-muted mt-4 border-t border-paperLine pt-3">
              <span className="font-semibold text-textPaper">Why: </span>
              {q.explanation}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
