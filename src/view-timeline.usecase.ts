import { MessageRepository } from '@/message.repository';

export default class ViewTimelineUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

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

    return Promise.resolve([
      {
        author: messagesOfUser[0].author,
        text: messagesOfUser[0].text,
        publicationTime: '1 minute ago',
      },
      {
        author: messagesOfUser[1].author,
        text: messagesOfUser[1].text,
        publicationTime: '3 minutes ago',
      },
    ]);
  }
}
