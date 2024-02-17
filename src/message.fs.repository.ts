import * as path from 'path';
import * as fs from 'fs';
import { MessageRepository } from '@/message.repository.ts';
import { Message } from '@/message.ts';

export class MessageFsRepository implements MessageRepository {
  getAllOfUser(_: string): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }

  save(message: Message): Promise<void> {
    return fs.promises.appendFile(
      path.join(__dirname, 'message.json'),
      JSON.stringify(message)
    );
  }
}
