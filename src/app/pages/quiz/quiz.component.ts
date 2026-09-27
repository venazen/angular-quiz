import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_TESTS } from '../../data/tests';
import { QuizTest } from '../../models/question.model';
import { ProgressService } from '../../services/progress.service';

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
  protected readonly currentIndex = signal(0);

  // Bilježi izabran odgovor po pitanju (questionId -> optionId), ali NE otkriva tačnost.
  protected readonly answers = signal<Record<string, string>>({});

  protected readonly finished = signal(false);

  // --- Computed: izvedeno stanje ---
  protected readonly currentQuestion = computed(() => this.test()?.questions[this.currentIndex()]);

  // Izabran odgovor za TRENUTNO pitanje (ako postoji) — koristi se samo da se
  // vidi koje dugme je selektovano, ne da li je tačno.
  protected readonly currentSelectedOptionId = computed(() => {
    const q = this.currentQuestion();
    if (!q) return null;
    return this.answers()[q.id] ?? null;
  });

  protected readonly hasAnsweredCurrent = computed(() => this.currentSelectedOptionId() !== null);

  protected readonly progressPercent = computed(() => {
    const t = this.test();
    if (!t) return 0;
    return Math.round((this.currentIndex() / t.questions.length) * 100);
  });

  protected readonly isLastQuestion = computed(() => {
    const t = this.test();
    return t ? this.currentIndex() === t.questions.length - 1 : false;
  });

  // Rezultat se računa TEK kad je test završen, poređenjem answers sa correctOptionId.
  protected readonly correctCount = computed(() => {
    const t = this.test();
    if (!t) return 0;
    const given = this.answers();
    return t.questions.filter((q) => given[q.id] === q.correctOptionId).length;
  });

  protected readonly finalScorePercent = computed(() => {
    const t = this.test();
    if (!t) return 0;
    return Math.round((this.correctCount() / t.questions.length) * 100);
  });

  constructor() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.test.set(ALL_TESTS.find((t) => t.id === testId));
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
        this.progressService.recordAttempt(t.id, this.correctCount(), t.questions.length);
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
    this.currentIndex.set(0);
    this.answers.set({});
    this.finished.set(false);
  }

  // Za review ekran na kraju — da li je dati odgovor za pitanje q tačan.
  isCorrectAnswer(questionId: string, correctOptionId: string): boolean {
    return this.answers()[questionId] === correctOptionId;
  }

  givenAnswerFor(questionId: string): string | undefined {
    return this.answers()[questionId];
  }
}
