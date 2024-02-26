import { Timeline } from '@aiel/crafty';

import { TimelinePresenter } from '@aiel/crafty';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimelineApiPresenter
  implements
    TimelinePresenter<
      { id: string; author: string; publishedAt: Date; text: string }[]
    >
{
  show(
    timeline: Timeline
  ): { id: string; author: string; publishedAt: Date; text: string }[] {
    return timeline.data;
  }
}
