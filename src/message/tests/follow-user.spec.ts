import { beforeEach, describe, test } from 'vitest';
import {
  createFollowFixture,
  FollowFixture,
} from '@/message/tests/follow.fixture.ts';
import { followBuilder } from '@/message/tests/follow.builder.ts';
import { MultipleTimeFollowError } from '@/message/domain/error/multiple-time-follow.error.ts';
import { UnknownUserError } from '@/message/domain/error/unknown-user.error.ts';

describe('Feature: Following user', () => {
  let fixture: FollowFixture;

  beforeEach(() => {
    fixture = createFollowFixture();
  });

  describe('Rule: User can follow another user', () => {
    test('Alice can follow bob', async () => {
      const aliceBuilder = followBuilder().withName('Alice');

      await fixture.givenSubscribedUsers([
        followBuilder().withName('Charlie').build(),
        aliceBuilder.build(),
        followBuilder().withName('Bob').build(),
      ]);

      await fixture.whenUserFollow({
        name: 'Alice',
        userToFollow: 'Bob',
      });

      await fixture.thenUserFolloweesAre(
        aliceBuilder.addFollowee('Bob').build()
      );
    });

    test('Alice can follow more than one user', async () => {
      const aliceBuilder = followBuilder().withName('Alice');

      await fixture.givenSubscribedUsers([
        followBuilder().withName('Charlie').build(),
        aliceBuilder.build(),
        followBuilder().withName('Bob').build(),
      ]);

      await fixture.givenUserFollowees(
        aliceBuilder.addFollowee('Charlie').build()
      );

      await fixture.whenUserFollow({
        name: 'Alice',
        userToFollow: 'Bob',
      });

      await fixture.thenUserFolloweesAre(
        aliceBuilder.addFollowees('Bob').build()
      );
    });
  });

  describe('Rule: User cannot follow a user multiple time', () => {
    test('Alice cannot follow Bob twice', async () => {
      const aliceBuilder = followBuilder().withName('Alice');

      await fixture.givenSubscribedUsers([
        aliceBuilder.build(),
        followBuilder().withName('Bob').build(),
      ]);

      await fixture.givenUserFollowees(aliceBuilder.addFollowee('Bob').build());

      await fixture.whenUserFollow({
        name: 'Alice',
        userToFollow: 'Bob',
      });

      await fixture.thenErrorShouldBe(MultipleTimeFollowError);
    });
  });

  describe('Rule: User cannot follow not subscribe user', () => {
    test('Alice cannot follow not subscribe user', async () => {
      const aliceBuilder = followBuilder().withName('Alice');

      await fixture.givenSubscribedUsers([
        aliceBuilder.build(),
        followBuilder().withName('Bob').build(),
      ]);

      await fixture.givenUserFollowees(aliceBuilder.addFollowee('Bob').build());

      await fixture.whenUserFollow({
        name: 'Alice',
        userToFollow: 'Charlie',
      });

      await fixture.thenErrorShouldBe(UnknownUserError);
    });
  });
});
