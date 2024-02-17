import * as path from 'path';
import * as fs from 'fs';
import { MessageRepository } from '@/message.repository.ts';
import { Message } from '@/message.ts';

export class MessageFsRepository implements MessageRepository {
  private readonly messagePath = path.join(__dirname, 'message.json');

  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();
    return messages.filter((msg) => msg.author === user);
  }

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();
    messages.push(message);
    return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
  }

  private async getMessages(): Promise<Message[]> {
    const messageInFile = await fs.promises.readFile(this.messagePath);
    const messages = JSON.parse(messageInFile.toString()) as {
      id: string;
      text: string;
      author: string;
      publishedAt: Date;
    }[];

    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      author: msg.author,
      publishedAt: new Date(msg.publishedAt),
    }));
  }
}
