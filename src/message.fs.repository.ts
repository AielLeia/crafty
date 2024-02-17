import * as path from 'path';
import * as fs from 'fs';
import { Message, MessageRepository } from '@/post-message.usecase.ts';

export class MessageFsRepository implements MessageRepository {
  save(message: Message): Promise<void> {
    return fs.promises.appendFile(
      path.join(__dirname, 'message.json'),
      JSON.stringify(message)
    );
  }
}
