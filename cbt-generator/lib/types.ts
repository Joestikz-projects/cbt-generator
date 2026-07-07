export type Option = "A" | "B" | "C" | "D";

export interface Question {
  question: string;
  options: Record<Option, string>;
  correct: Option;
  explanation: string;
}

export interface SavedQuiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  answers: Record<number, Option>;
  score: number;
}
