import { StubDateProvider } from '@/stub.dateprovider.ts';
import { InMemoryMessageRepository } from '@/message.inmemory.repository.ts';
import PostMessageUseCase, {
  PostMessageCommand,
} from '@/post-message.usecase.ts';
import { Message, MessageText } from '@/message.ts';
import { expect } from 'vitest';
import ViewTimelineUseCase from '@/view-timeline.usecase.ts';
import EditMessageUseCase, {
  EditMessageCommand,
} from '@/edit-message.usecase.ts';

export const createMessagingFixture = () => {
  let thrownError: Error;

  let timeline: {
    author: string;
    text: MessageText;
    publicationTime: string;
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();

  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },

    givenNowIs(now: Date) {
      dateProvider.now = now;
    },

    async whenUserSeesTheTimelineOf(author: string) {
      timeline = await viewTimelineUseCase.handle({ user: author });
    },

    async whenUserPostAMessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (e: unknown) {
        if (e instanceof Error) {
          thrownError = e;
        }
      }
    },

    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (e: unknown) {
        if (e instanceof Error) {
          thrownError = e;
        }
      }
    },

    async thenMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(
        await messageRepository.getById(expectedMessage.id)
      );
    },

    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: MessageText;
        publicationTime: string;
      }[]
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },

    thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
