import { DateProvider } from '@/application/date.provider.ts';

export class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}
