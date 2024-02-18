import * as path from 'path';
import * as fs from 'fs';
import { MessageRepository } from '@/message.repository.ts';
import { Message, MessageText } from '@/message.ts';

export class MessageFsRepository implements MessageRepository {
  constructor(
    private readonly messagePath = path.join(__dirname, 'message.json')
  ) {}

  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();
    return messages.filter((msg) => msg.author === user);
  }

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();
    const exitingMessage = messages.findIndex((msg) => msg.id === message.id);

    if (exitingMessage === -1) {
      messages.push(message);
    } else {
      messages[exitingMessage] = message;
    }

    return fs.promises.writeFile(
      this.messagePath,
      JSON.stringify(
        messages.map((msg) => ({
          id: msg.id,
          author: msg.author,
          publishedAt: msg.publishedAt,
          text: msg.text.value,
        }))
      )
    );
  }

  async getById(messageId: string): Promise<Message> {
    const messages = await this.getMessages();
    return messages.find((msg) => msg.id === messageId)!;
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
      text: MessageText.of(msg.text),
      author: msg.author,
      publishedAt: new Date(msg.publishedAt),
    }));
  }
}
