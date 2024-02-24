import { Timeline } from '@/domain/timeline.ts';

export interface TimelinePresenter<T> {
  show(timeline: Timeline): T;
}
