import { MessageRepository } from '@/application/message.repository.ts';
import { FollowRepository } from '@/application/follow.repository.ts';
import { DateProvider } from '@/application/date.provider.ts';
import { Timeline } from '@/domain/timeline.ts';

export class ViewWallUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followRepository: FollowRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const followees = await this.followRepository.getFolloweesOf(user);
    const messages = (
      await Promise.all(
        [user, ...followees.followees.data].map((usr) =>
          this.messageRepository.getAllOfUser(usr)
        )
      )
    ).flat();

    const timeline = new Timeline(messages, this.dateProvider);

    return timeline.data;
  }
}
