import { DateProvider } from '@/application/date.provider.ts';

export class StubDateProvider implements DateProvider {
  now: Date = new Date();

  getNow(): Date {
    return this.now;
  }
}
