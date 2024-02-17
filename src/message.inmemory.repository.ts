import { MessageRepository } from '@/message.repository.ts';
import { Message } from '@/message.ts';

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>();

  save(msg: Message): Promise<void> {
    this._save(msg);
    return Promise.resolve();
  }

  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()]
        .filter((msg) => msg.author === user)
        .map((m) => ({
          id: m.id,
          author: m.author,
          text: m.text,
          publishedAt: m.publishedAt,
        }))
    );
  }

  getById(messageId: string): Promise<Message> {
    return Promise.resolve(this.getMessageById(messageId));
  }

  getMessageById(messageId: string) {
    return this.messages.get(messageId)!;
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(this._save.bind(this));
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
