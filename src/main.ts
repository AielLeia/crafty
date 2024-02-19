#!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import PostMessageUseCase, {
  PostMessageCommand,
} from '@/message/application/usecase/post-message.usecase.ts';
import { MessageFsRepository } from '@/message/infrastructure/message.fs.repository.ts';
import ViewTimelineUseCase from '@/message/application/usecase/view-timeline.usecase.ts';
import EditMessageUseCase, {
  EditMessageCommand,
} from '@/message/application/usecase/edit-message.usecase.ts';
import { RealDateProvider } from '@/message/infrastructure/real-date.provider.ts';
import {
  FollowCommand,
  UserFollowUseCase,
} from '@/message/application/usecase/user-follow.usecase.ts';
import { FollowFsRepository } from '@/message/infrastructure/follow.fs.repository.ts';

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
const editMessageUseCase = new EditMessageUseCase(messageRepository);

const followRepository = new FollowFsRepository();
const followUseCase = new UserFollowUseCase(followRepository);

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
  )
  .addCommand(
    new Command('edit')
      .argument('<message-id>', 'The message id of the message to edit')
      .argument('<message>', 'The new text')
      .action(async (messageId, message) => {
        try {
          const editMessageCommand: EditMessageCommand = {
            messageId,
            text: message,
          };
          await editMessageUseCase.handle(editMessageCommand);
          console.log('Message edited');
        } catch (e: unknown) {
          console.error(e);
        }
      })
  )
  .addCommand(
    new Command('follow')
      .argument('<user-follower>', 'The user who want to follow')
      .argument('<user-followee>', 'The followee user')
      .action(async (userFollower, userFollowee) => {
        try {
          const followCommand: FollowCommand = {
            name: userFollower,
            userToFollow: userFollowee,
          };
          await followUseCase.handle(followCommand);
          console.log(`${userFollower} follow ${userFollowee}`);
        } catch (e: unknown) {
          console.error(e);
        }
      })
  );

program.parse();
