#!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import PostMessageUseCase, {
  DateProvider,
  PostMessageCommand,
} from '@/post-message.usecase';
import { MessageFsRepository } from '@/message.fs.repository.ts';
import ViewTimelineUseCase from '@/view-timeline.usecase.ts';

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
const viewTimelineUseCase = new ViewTimelineUseCase(
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
          id: `${Math.floor(Math.random() * 10000)}`,
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
  )
  .addCommand(
    new Command('view')
      .argument('<user>', 'the user to view the timeline of')
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUseCase.handle({ user });
          console.table(timeline);
        } catch (e: unknown) {
          console.error(e);
        }
      })
  );

program.parse();
