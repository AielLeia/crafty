import { DateProvider } from '@aiel/crafty';

export class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}
