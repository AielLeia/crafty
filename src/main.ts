#!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import PostMessageUseCase, {
  DateProvider,
  PostMessageCommand,
} from '@/post-message.usecase';
import { InMemoryMessageRepository } from '@/message.inmemory.repository';

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);

const program = new Command();

program
  .version('1.0.0')
  .description('Crafty social network')
  .addCommand(
    new Command('post')
      .argument('<user>', 'the current user')
      .argument('<message>', 'the message to post')
      .action((user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: 'message-id',
          author: user,
          text: message,
        };

        try {
          postMessageUseCase.handle(postMessageCommand);
          console.log('Message poster');
          console.table([messageRepository.message]);
        } catch (e: unknown) {
          console.error(e);
        }
      })
  );

program.parse();
