import { beforeEach, describe, test } from 'vitest';
import {
  createMessagingFixture,
  MessagingFixture,
} from '@/message/tests/messaging.fixture.ts';
import { messageBuilder } from '@/message/tests/message.builder.ts';

describe('Feature: Viewing a personal timeline', () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe('Rule: Message are shown in reverse chronological order', () => {
    test.only('Alice can view the 3 messages she published in her timeline', async () => {
      const aliceMessageBuilder = messageBuilder().authoredBy('Alice');

      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withId('message-1')
          .withText('My first message')
          .withPublishedAt(new Date('2023-02-07T16:27:59.000Z'))
          .build(),
        aliceMessageBuilder
          .withId('message-2')
          .withText('My second message')
          .withPublishedAt(new Date('2023-02-07T16:30:00.000Z'))
          .build(),
        aliceMessageBuilder
          .withId('message-4')
          .withText('My last message')
          .withPublishedAt(new Date('2023-02-07T16:30:30.000Z'))
          .build(),
        messageBuilder().authoredBy('Bob').build(),
      ]);
      fixture.givenNowIs(new Date('2023-02-07T16:31:00.000Z'));

      await fixture.whenUserSeesTheTimelineOf('Alice');

      fixture.thenUserShouldSee([
        {
          author: 'Alice',
          text: 'My last message',
          publicationTime: 'less than a minute ago',
        },
        {
          author: 'Alice',
          text: 'My second message',
          publicationTime: 'one minute ago',
        },
        {
          author: 'Alice',
          text: 'My first message',
          publicationTime: '3 minutes ago',
        },
      ]);
    });
  });
});
