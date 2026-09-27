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
  protected readonly selectedOptionId = signal<string | null>(null);
  protected readonly revealed = signal(false);
  protected readonly correctCount = signal(0);
  protected readonly finished = signal(false);

  // --- Computed: izvedeno stanje, automatski se ažurira kad se signal promijeni ---
  protected readonly currentQuestion = computed(
    () => this.test()?.questions[this.currentIndex()],
  );

  protected readonly progressPercent = computed(() => {
    const t = this.test();
    if (!t) return 0;
    return Math.round((this.currentIndex() / t.questions.length) * 100);
  });

  protected readonly isLastQuestion = computed(() => {
    const t = this.test();
    return t ? this.currentIndex() === t.questions.length - 1 : false;
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
    if (this.revealed()) return; // već odgovoreno, ignoriši dalje klikove

    this.selectedOptionId.set(optionId);
    this.revealed.set(true);

    if (optionId === this.currentQuestion()?.correctOptionId) {
      this.correctCount.update((c) => c + 1);
    }
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
    this.selectedOptionId.set(null);
    this.revealed.set(false);
  }

  retry(): void {
    this.currentIndex.set(0);
    this.selectedOptionId.set(null);
    this.revealed.set(false);
    this.correctCount.set(0);
    this.finished.set(false);
  }
}
