import { EmptyMessageError } from '@/domain/error/empty-message.error.ts';
import { MessageTooLongError } from '@/domain/error/message-too-long.error.ts';

export class MessageText {
  private constructor(readonly value: string) {}

  static of(text: string) {
    if (text.length > 280) {
      throw new MessageTooLongError();
    }

    if (text.trim().length === 0) {
      throw new EmptyMessageError();
    }

    return new MessageText(text);
  }
}
