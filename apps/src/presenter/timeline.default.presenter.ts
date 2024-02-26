import { Timeline } from '@aiel/crafty';

import { TimelinePresenter } from '@aiel/crafty';
import { Injectable } from '@nestjs/common';
import { RealDateProvider } from '@/src/providers/real-date.provider';

const ONE_MINUTE_IN_MS = 60000;

@Injectable()
export class TimelineDefaultPresenter
  implements
    TimelinePresenter<
      {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    >
{
  constructor(private readonly dateProvider: RealDateProvider) {}

  show(timeline: Timeline) {
    const messages = timeline.data;
    return messages.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this.publicationTime(msg.publishedAt),
    }));
  }

  private publicationTime(publishedAt: Date) {
    const now = this.dateProvider.getNow();
    const elapseMinuteBetween = now.getTime() - publishedAt.getTime();
    const timeInMinute = Math.floor(elapseMinuteBetween / ONE_MINUTE_IN_MS);

    if (timeInMinute < 1) return 'less than a minute ago';
    if (timeInMinute < 2) return 'one minute ago';

    return `${timeInMinute} minutes ago`;
  }
}
