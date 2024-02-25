import { MessageRepository } from '@/application/message.repository.ts';
import { FollowRepository } from '@/application/follow.repository.ts';
import { Timeline } from '@/domain/timeline.ts';
import { TimelinePresenter } from '@/application/timeline.presenter.ts';

export class ViewWallUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followRepository: FollowRepository
  ) {}

  async handle<T>(
    {
      user,
    }: {
      user: string;
    },
    timelinePresenter: TimelinePresenter<T>
  ) {
    const followees = await this.followRepository.getFolloweesOf(user);
    const messages = (
      await Promise.all(
        [user, ...followees.followees.data].map((usr) =>
          this.messageRepository.getAllOfUser(usr)
        )
      )
    ).flat();

    const timeline = new Timeline(messages);

    return timelinePresenter.show(timeline);
  }
}
