import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_TESTS } from '../../data/tests';
import { QuizQuestion, QuizTest } from '../../models/question.model';
import { ProgressService } from '../../services/progress.service';
import { shuffleArray } from './utils/shuffle';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly progressService = inject(ProgressService);

  // --- Signals: cijelo stanje komponente ---
  protected readonly test = signal<QuizTest | undefined>(undefined);

  // Pitanja u IZMIJEŠANOM redoslijedu za TRENUTNI pokušaj — različit svaki put
  // kad se test učita ili ponovi (retry()).
  protected readonly shuffledQuestions = signal<QuizQuestion[]>([]);

  protected readonly currentIndex = signal(0);

  // Bilježi izabran odgovor po pitanju (questionId -> optionId), ne otkriva tačnost.
  protected readonly answers = signal<Record<string, string>>({});

  protected readonly finished = signal(false);

  // --- Computed: izvedeno stanje ---
  protected readonly currentQuestion = computed(
    () => this.shuffledQuestions()[this.currentIndex()],
  );

  protected readonly currentSelectedOptionId = computed(() => {
    const q = this.currentQuestion();
    if (!q) return null;
    return this.answers()[q.id] ?? null;
  });

  protected readonly hasAnsweredCurrent = computed(() => this.currentSelectedOptionId() !== null);

  protected readonly progressPercent = computed(() => {
    const total = this.shuffledQuestions().length;
    if (!total) return 0;
    return Math.round((this.currentIndex() / total) * 100);
  });

  protected readonly isLastQuestion = computed(
    () => this.currentIndex() === this.shuffledQuestions().length - 1,
  );

  // Rezultat se računa TEK kad je test završen, poređenjem answers sa correctOptionId.
  protected readonly correctCount = computed(() => {
    const given = this.answers();
    return this.shuffledQuestions().filter((q) => given[q.id] === q.correctOptionId).length;
  });

  protected readonly finalScorePercent = computed(() => {
    const total = this.shuffledQuestions().length;
    if (!total) return 0;
    return Math.round((this.correctCount() / total) * 100);
  });

  constructor() {
    const testId = this.route.snapshot.paramMap.get('id');
    const found = ALL_TESTS.find((t) => t.id === testId);
    this.test.set(found);
    this.shuffledQuestions.set(shuffleArray(found?.questions ?? []));
  }

  selectOption(optionId: string): void {
    const q = this.currentQuestion();
    if (!q || this.finished()) return;

    // Dozvoljava promjenu odgovora dok god si na istom pitanju (prije "Sljedeće").
    this.answers.update((prev) => ({ ...prev, [q.id]: optionId }));
  }

  next(): void {
    if (this.isLastQuestion()) {
      this.finished.set(true);
      const t = this.test();
      if (t) {
        this.progressService.recordAttempt(
          t.id,
          this.correctCount(),
          this.shuffledQuestions().length,
        );
      }
      return;
    }
    this.currentIndex.update((i) => i + 1);
  }

  previous(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  retry(): void {
    // Novo miješanje pri svakom ponavljanju — drugi redoslijed nego prošli put.
    this.shuffledQuestions.set(shuffleArray(this.test()?.questions ?? []));
    this.currentIndex.set(0);
    this.answers.set({});
    this.finished.set(false);
  }

  isCorrectAnswer(questionId: string, correctOptionId: string): boolean {
    return this.answers()[questionId] === correctOptionId;
  }

  givenAnswerFor(questionId: string): string | undefined {
    return this.answers()[questionId];
  }
}
