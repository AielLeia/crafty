import { Timeline } from '@/domain/timeline';

import { TimelinePresenter } from '@/application/timeline.presenter.ts';

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
