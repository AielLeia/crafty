import { beforeEach, describe, test } from 'vitest';
import {
  createMessagingFixture,
  MessagingFixture,
} from '@/tests/messaging.fixture.ts';
import { messageBuilder } from '@/tests/message.builder.ts';
import { EmptyMessageError, MessageTooLongError } from '@/message.ts';

describe('Feature: Editing messaging', () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe('Rule: The edited text should not be superior to 280 characters', () => {
    test('Alice can edit her message to a text inferior to 280 characters', async () => {
      const aliceMessageBuilder = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld');

      fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: 'Hello World',
      });

      await fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText('Hello World').build()
      );
    });

    test('Alice cannot edit a message to a text superior to 280 characters', async () => {
      const textWithLengthOf281 =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim sem sem, eu iaculis est feugiat at. Sed vehicula vitae nibh vel imperdiet. Integer a metus quis sapien pharetra pretium. Nulla dictum massa ut imperdiet mattis. Phasellus vitae vehicula justo, ac nulla.';

      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: textWithLengthOf281,
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test('Alice cannot edit a message to an empty text', async () => {
      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: '',
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test('Alice cannot edit a message to only white space text', async () => {
      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: '                   ',
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
