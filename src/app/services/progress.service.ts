import { Injectable, signal } from '@angular/core';

export interface TestProgress {
  bestScore: number; // procenat, 0-100
  lastAttemptAt: number;
  attempts: number;
}

const STORAGE_KEY = 'angular-quiz-progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly progress = signal<Record<string, TestProgress>>(this.load());

  getProgress(testId: string): TestProgress | undefined {
    return this.progress()[testId];
  }

  recordAttempt(testId: string, correctCount: number, total: number): void {
    const scorePercent = Math.round((correctCount / total) * 100);
    const current = this.progress();
    const existing = current[testId];

    const updated: TestProgress = {
      bestScore: Math.max(existing?.bestScore ?? 0, scorePercent),
      lastAttemptAt: Date.now(),
      attempts: (existing?.attempts ?? 0) + 1,
    };

    const next = { ...current, [testId]: updated };
    this.progress.set(next);
    this.save(next);
  }

  private load(): Record<string, TestProgress> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private save(data: Record<string, TestProgress>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage nedostupan (npr. privatni mod) — napredak se jednostavno neće sačuvati
    }
  }
}
