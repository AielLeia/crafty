import { beforeEach, describe, expect, test } from 'vitest';
import { InMemoryMessageRepository } from '@/message.inmemory.repository.ts';
import ViewTimelineUseCase from '@/view-timeline.usecase.ts';
import { Message } from '@/message.ts';

describe('Feature: Viewing a personal timeline', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: Message are shown in reverse chronological order', () => {
    test('Alice can view the 2 messages she published in her timeline', async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          author: 'Alice',
          text: 'My first message',
          id: 'message-1',
          publishedAt: new Date('2023-02-07T16:28:00.000Z'),
        },
        {
          author: 'Alice',
          text: 'My second message',
          id: 'message-2',
          publishedAt: new Date('2023-02-07T16:30:00.000Z'),
        },
        {
          author: 'Bob',
          text: 'My first message',
          id: 'message-3',
          publishedAt: new Date('2023-02-07T16:29:00.000Z'),
        },
      ]);
      fixture.givenNowIs(new Date('2023-02-07T16:31:00.000Z'));

      await fixture.whenUserSeesTheTimelineOf('Alice');

      fixture.thenUserShouldSee([
        {
          author: 'Alice',
          text: 'My second message',
          publicationTime: '1 minute ago',
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

const createFixture = () => {
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  const messageRepository = new InMemoryMessageRepository();
  const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(_: Date) {},
    async whenUserSeesTheTimelineOf(author: string) {
      timeline = await viewTimelineUseCase.handle({ user: author });
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
  };
};

type Fixture = ReturnType<typeof createFixture>;
