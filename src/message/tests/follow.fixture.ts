import { expect } from 'vitest';
import { UserFollowee } from '@/message/domain/user-followee.ts';
import {
  FollowCommand,
  UserFollowUseCase,
} from '@/message/application/usecase/user-follow.usecase.ts';
import { InMemoryFollowRepository } from '@/message/tests/follow.inmemory.repository.ts';

export const createFollowFixture = () => {
  let thrownError: Error;
  const inMemoryFollowRepository = new InMemoryFollowRepository();
  const userFollowUseCase = new UserFollowUseCase(inMemoryFollowRepository);

  return {
    async givenSubscribedUsers(initialSubscribedUser: UserFollowee[]) {
      await inMemoryFollowRepository.givenExistingUserAndThereFollowees(
        initialSubscribedUser
      );
    },

    async givenUserFollowees(initialUserFollowees: UserFollowee) {
      await inMemoryFollowRepository.save(initialUserFollowees);
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
        await inMemoryFollowRepository.findUserByName(
          expectedUserFollowees.name
        )
      );
    },

    async thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
};

export type FollowFixture = ReturnType<typeof createFollowFixture>;
