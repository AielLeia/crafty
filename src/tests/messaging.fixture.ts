import { StubDateProvider } from '@/tests/stub.dateprovider.ts';
import { InMemoryMessageRepository } from '@/tests/message.inmemory.repository.ts';
import PostMessageUseCase, {
  PostMessageCommand,
} from '@/application/usecase/post-message.usecase.ts';
import { Message } from '@/domain/message.ts';
import { expect } from 'vitest';
import ViewTimelineUseCase from '@/application/usecase/view-timeline.usecase.ts';
import EditMessageUseCase, {
  EditMessageCommand,
} from '@/application/usecase/edit-message.usecase.ts';
import { TimelineDefaultPresenter } from '@/app/timeline.default.presenter.ts';

export const createMessagingFixture = () => {
  let thrownError: Error;

  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();

  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);
  const editMessageUseCase = new EditMessageUseCase(messageRepository);
  const defaultTimelinePresenter = new TimelineDefaultPresenter(dateProvider);

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },

    givenNowIs(now: Date) {
      dateProvider.now = now;
    },

    async whenUserSeesTheTimelineOf(author: string) {
      timeline = await viewTimelineUseCase.handle(
        { user: author },
        defaultTimelinePresenter
      );
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
        text: string;
        publicationTime: string;
      }[]
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },

    thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },

    messageRepository,
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
