import { DateProvider } from '@/post-message.usecase.ts';

export class StubDateProvider implements DateProvider {
  now: Date = new Date();

  getNow(): Date {
    return this.now;
  }
}
