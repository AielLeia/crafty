import { beforeEach, describe, test } from 'vitest';
import {
  EmptyMessageError,
  MessageTooLongError,
} from '@/post-message.usecase.ts';
import {
  createMessagingFixture,
  MessagingFixture,
} from '@/tests/messaging.fixture.ts';
import { messageBuilder } from '@/tests/message.builder.ts';

describe('Feature: Posting a message', () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe('Rule: A message can contain a maximum of 280 characters', () => {
    test('Alice can post a message for her timeline', async () => {
      const newAliceMessage = messageBuilder()
        .withId('message-id')
        .withText('Hello world 2')
        .authoredBy('Alice');

      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostAMessage(newAliceMessage.build());

      fixture.thenMessageShouldBe(
        newAliceMessage
          .withPublishedAt(new Date('2023-01-19T19:00:00.000Z'))
          .build()
      );
    });

    test('Alice cannot post a message with more than 281 characters', async () => {
      const textWithLengthOf281 =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim sem sem, eu iaculis est feugiat at. Sed vehicula vitae nibh vel imperdiet. Integer a metus quis sapien pharetra pretium. Nulla dictum massa ut imperdiet mattis. Phasellus vitae vehicula justo, ac nulla.';

      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: textWithLengthOf281,
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe('Rule: Message cannot be empty', () => {
    test('Alice cannot post an empty message', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: '',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test('Alice cannot post a message with only white spaces', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: '              ',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
