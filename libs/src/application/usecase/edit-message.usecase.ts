import { MessageRepository } from '@/application/message.repository.ts';
import { EmptyMessageError } from '@/domain/error/empty-message.error.ts';
import { MessageTooLongError } from '@/domain/error/message-too-long.error.ts';
import { Err, Ok, Result } from '@/application/result.ts';

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle(
    editMessageCommand: EditMessageCommand
  ): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {
    const message = await this.messageRepository.getById(
      editMessageCommand.messageId
    );

    try {
      message.editText(editMessageCommand.text);
    } catch (err) {
      return Err.of(err as Error);
    }

    await this.messageRepository.save(message);

    return Ok.of(undefined);
  }
}
