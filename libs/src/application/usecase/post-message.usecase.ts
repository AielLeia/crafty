import { EmptyMessageError } from '@/domain/error/empty-message.error.ts';
import { MessageTooLongError } from '@/domain/error/message-too-long.error.ts';
import { Message } from '@/domain/message.ts';

import { DateProvider } from '@/application/date.provider.ts';
import { MessageRepository } from '@/application/message.repository.ts';
import { Err, Ok, Result } from '@/application/result.ts';

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(
    postMessageCommand: PostMessageCommand
  ): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {
    let message: Message;

    try {
      message = Message.fromData({
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: this.dateProvider.getNow(),
      });
    } catch (err) {
      return Err.of(err as Error);
    }

    await this.messageRepository.save(message);

    return Ok.of(undefined);
  }
}
