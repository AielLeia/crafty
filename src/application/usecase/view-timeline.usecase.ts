import { MessageRepository } from '@/application/message.repository.ts';
import { DateProvider } from '@/application/date.provider.ts';
import { Timeline } from '@/domain/timeline.ts';

export default class ViewTimelineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle({ user }: { user: string }): Promise<
    {
      author: string;
      text: string;
      publicationTime: string;
    }[]
  > {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    const timeline = new Timeline(messagesOfUser, this.dateProvider);

    return timeline.data;
  }
}
