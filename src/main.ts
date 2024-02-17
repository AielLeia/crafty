#!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import PostMessageUseCase, {
  DateProvider,
  PostMessageCommand,
} from '@/post-message.usecase';
import { MessageFsRepository } from '@/message.fs.repository.ts';

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new MessageFsRepository();
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
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: 'message-id',
          author: user,
          text: message,
        };

        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log('Message poster');
        } catch (e: unknown) {
          console.error(e);
        }
      })
  );

program.parse();
