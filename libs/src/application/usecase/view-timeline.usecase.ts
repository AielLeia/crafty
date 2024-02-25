import { MessageRepository } from '@/application/message.repository.ts';
import { Timeline } from '@/domain/timeline.ts';
import { TimelinePresenter } from '@/application/timeline.presenter.ts';

export class ViewTimelineUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle<T>(
    { user }: { user: string },
    timelinePresenter: TimelinePresenter<T>
  ) {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    const timeline = new Timeline(messagesOfUser);

    return timelinePresenter.show(timeline);
  }
}
