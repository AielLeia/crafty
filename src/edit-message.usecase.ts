import { MessageRepository } from '@/message.repository.ts';
import { Message, MessageText } from '@/message.ts';

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

export default class EditMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle(editMessageCommand: EditMessageCommand) {
    const newMessageText = MessageText.of(editMessageCommand.text);
    const message = await this.messageRepository.getById(
      editMessageCommand.messageId
    );
    const editedMessage: Message = {
      ...message,
      text: newMessageText,
    };

    await this.messageRepository.save(editedMessage);
  }
}
