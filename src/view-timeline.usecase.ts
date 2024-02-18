import { MessageRepository } from '@/message.repository';
import { DateProvider } from '@/post-message.usecase.ts';

const ONE_MINUTE_IN_MS = 60000;

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

    messagesOfUser.sort(
      (msg1, msg2) => msg2.publishedAt.getTime() - msg1.publishedAt.getTime()
    );

    return Promise.resolve(
      messagesOfUser.map((msg) => ({
        author: msg.author,
        text: msg.text.value,
        publicationTime: this.publicationTime(msg.publishedAt),
      }))
    );
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
