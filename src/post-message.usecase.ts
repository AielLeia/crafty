import { MessageRepository } from '@/message.repository';
import { Message } from '@/message.ts';

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export interface DateProvider {
  getNow(): Date;
}

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
