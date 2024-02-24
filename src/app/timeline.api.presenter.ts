import { TimelinePresenter } from '@/application/timeline.presenter.ts';
import { Timeline } from '@/domain/timeline';

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
