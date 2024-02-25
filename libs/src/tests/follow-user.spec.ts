import { followBuilder } from '@/fixtures/follow.builder.ts';
import {
  FollowFixture,
  createFollowFixture,
} from '@/fixtures/follow.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

import { MultipleTimeFollowError } from '@/domain/error/multiple-time-follow.error.ts';
import { UnknownUserError } from '@/domain/error/unknown-user.error.ts';

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
