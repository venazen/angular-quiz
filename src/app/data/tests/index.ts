import { QuizTest } from '../../models/question.model';
import { test1StandaloneBasics } from './test-1-standalone-basics';
import { test2SignalsFundamentals } from './test-2-signals-fundamentals';
import { test3AdvancedSignals } from './test-3-advanced-signals';
import { test4InterviewTricky } from './test-4-interview-tricky';

// Dodaj svaki novi test ovdje kad ga napravimo (Test 2: Signals, Test 3: itd.)
export const ALL_TESTS: QuizTest[] = [test1StandaloneBasics, test2SignalsFundamentals, test3AdvancedSignals, test4InterviewTricky];
