import { TimelineDefaultPresenter } from '@/app/timeline.default.presenter.ts';
import { followBuilder } from '@/fixtures/follow.builder.ts';
import {
  FollowFixture,
  createFollowFixture,
} from '@/fixtures/follow.fixture.ts';
import { messageBuilder } from '@/fixtures/message.builder.ts';
import {
  MessagingFixture,
  createMessagingFixture,
} from '@/fixtures/messaging.fixture.ts';
import { StubDateProvider } from '@/tests/stub.dateprovider.ts';
import { beforeEach, describe, expect, test } from 'vitest';

import { FollowRepository } from '@/application/follow.repository.ts';
import { MessageRepository } from '@/application/message.repository.ts';
import { ViewWallUseCase } from '@/application/usecase/view-wall.usecase.ts';

describe('Feature: Viewing user wall', () => {
  let fixture: Fixture;
  let messagingFixture: MessagingFixture;
  let followFixture: FollowFixture;

  beforeEach(() => {
    messagingFixture = createMessagingFixture();
    followFixture = createFollowFixture();
    fixture = createFixture({
      messageRepository: messagingFixture.messageRepository,
      followeeRepository: followFixture.followeRepository,
    });
  });

  describe('Rule: All the messages from the user and her followees should appear in reverse chronological order', () => {
    test("Charlie has subscribes to Alice's timeline, and thus cas view an aggregated list of all subscriptions", async () => {
      fixture.givenNowIs(new Date('2024-02-19T19:03:00.000Z'));
      messagingFixture.givenTheFollowingMessagesExist([
        messageBuilder()
          .withId('message-1')
          .authoredBy('Alice')
          .withText('Message de alice')
          .withPublishedAt(new Date('2024-02-19T18:48:00.000Z'))
          .build(),
        messageBuilder()
          .withId('message-2')
          .authoredBy('Charlie')
          .withText('Message de charlie')
          .withPublishedAt(new Date('2024-02-19T19:03:00.000Z'))
          .build(),
      ]);

      await followFixture.givenSubscribedUsers([
        followBuilder().withName('Alice').addFollowee('Charlie').build(),
        followBuilder().withName('Charlie').addFollowee('Alice').build(),
      ]);

      await fixture.whenTheUserSeesTheWallOf('Charlie');

      await fixture.thenUserShouldSee([
        {
          author: 'Charlie',
          text: 'Message de charlie',
          publicationTime: 'less than a minute ago',
        },
        {
          author: 'Alice',
          text: 'Message de alice',
          publicationTime: '15 minutes ago',
        },
      ]);
    });
  });
});

const createFixture = ({
  messageRepository,
  followeeRepository,
}: {
  messageRepository: MessageRepository;
  followeeRepository: FollowRepository;
}) => {
  const dateProvider = new StubDateProvider();
  let wall: { author: string; text: string; publicationTime: string }[];
  const viewWallUseCase = new ViewWallUseCase(
    messageRepository,
    followeeRepository
  );
  const defaultTimelinePresenter = new TimelineDefaultPresenter(dateProvider);

  return {
    givenNowIs(_now: Date) {
      dateProvider.now = _now;
    },

    async whenTheUserSeesTheWallOf(user: string) {
      wall = await viewWallUseCase.handle({ user }, defaultTimelinePresenter);
    },

    async thenUserShouldSee(
      expectedWall: { author: string; text: string; publicationTime: string }[]
    ) {
      expect(wall).toEqual(expectedWall);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
