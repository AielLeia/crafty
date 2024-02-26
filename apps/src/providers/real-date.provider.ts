import { DateProvider } from '@aiel/crafty';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}
