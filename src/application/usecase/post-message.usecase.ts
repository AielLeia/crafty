import { MessageRepository } from '@/application/message.repository.ts';
import { Message } from '@/domain/message.ts';
import { DateProvider } from '@/application/date.provider.ts';

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
