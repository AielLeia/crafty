import { expect } from 'vitest';
import { UserFollowee } from '@/domain/user-followee.ts';
import {
  FollowCommand,
  UserFollowUseCase,
} from '@/application/usecase/user-follow.usecase.ts';
import { InMemoryFollowRepository } from '@/tests/follow.inmemory.repository.ts';

export const createFollowFixture = () => {
  let thrownError: Error;
  const followeRepository = new InMemoryFollowRepository();
  const userFollowUseCase = new UserFollowUseCase(followeRepository);

  return {
    async givenSubscribedUsers(initialSubscribedUser: UserFollowee[]) {
      await followeRepository.givenExistingUserAndThereFollowees(
        initialSubscribedUser
      );
    },

    async givenUserFollowees(initialUserFollowees: UserFollowee) {
      await followeRepository.save(initialUserFollowees);
    },

    async whenUserFollow(followCommand: FollowCommand) {
      try {
        await userFollowUseCase.handle(followCommand);
      } catch (e: unknown) {
        if (e instanceof Error) {
          thrownError = e;
        }
      }
    },

    async thenUserFolloweesAre(expectedUserFollowees: UserFollowee) {
      expect(expectedUserFollowees).toEqual(
        await followeRepository.getFolloweesOf(expectedUserFollowees.name)
      );
    },

    async thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },

    followeRepository,
  };
};

export type FollowFixture = ReturnType<typeof createFollowFixture>;
