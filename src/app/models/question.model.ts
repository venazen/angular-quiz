export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  hint?: string;
}

export interface QuizTest {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}
