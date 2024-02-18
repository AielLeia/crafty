import { MessageRepository } from '@/message/application/message.repository.ts';
import { Message } from '@/message/domain/message.ts';
import { DateProvider } from '@/message/application/date.provider.ts';

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export default class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(postMessageCommand: PostMessageCommand) {
    await this.messageRepository.save(
      Message.fromData({
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: this.dateProvider.getNow(),
      })
    );
  }
}
