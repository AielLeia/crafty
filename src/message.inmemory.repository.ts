import { Message, MessageRepository } from '@/post-message.usecase';

export class InMemoryMessageRepository implements MessageRepository {
  message: Message = { id: '', author: '', text: '', publishedAt: new Date() };

  save(msg: Message): Promise<void> {
    this.message = msg;

    return Promise.resolve();
  }
}
