import { beforeEach, describe, expect, test } from 'vitest';
import PostMessageUseCase, {
  DateProvider,
  EmptyMessageError,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
} from '@/post-message.usecase.ts';

describe('Feature: Posting a message', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: A message can contain a maximum of 280 characters', () => {
    test('Alice can post a message for her timeline', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostAMessage({
        id: 'message-id',
        text: 'Hello world 2',
        author: 'Alice',
      });

      fixture.thenPostedMessageShouldBe({
        id: 'message-id',
        text: 'Hello world 2',
        author: 'Alice',
        publishedAt: new Date('2023-01-19T19:00:00.000Z'),
      });
    });

    test('Alice cannot post a message with more than 281 characters', () => {
      const textWithLengthOf281 =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dignissim sem sem, eu iaculis est feugiat at. Sed vehicula vitae nibh vel imperdiet. Integer a metus quis sapien pharetra pretium. Nulla dictum massa ut imperdiet mattis. Phasellus vitae vehicula justo, ac nulla.';

      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostAMessage({
        id: 'message-id',
        text: textWithLengthOf281,
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe('Rule: Message cannot be empty', () => {
    test('Alice cannot post an empty message', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostAMessage({
        id: 'message-id',
        text: '',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test('Alice cannot post a message with only white spaces', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostAMessage({
        id: 'message-id',
        text: '              ',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

class InMemoryMessageRepository implements MessageRepository {
  message: Message = { id: '', author: '', text: '', publishedAt: new Date() };

  save(msg: Message) {
    this.message = msg;
  }
}

class StubDateProvider implements DateProvider {
  now: Date = new Date();

  getNow(): Date {
    return this.now;
  }
}

function createFixture() {
  let thrownError = Error;

  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();

  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },

    whenUserPostAMessage(postMessageCommand: PostMessageCommand) {
      try {
        postMessageUseCase.handle(postMessageCommand);
      } catch (e: unknown) {
        // @ts-ignore
        thrownError = e;
      }
    },

    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.message);
    },

    thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
}

type Fixture = ReturnType<typeof createFixture>;
