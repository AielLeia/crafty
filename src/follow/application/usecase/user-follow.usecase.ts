import { UnknownUserError } from '@/follow/domain/error/unknown-user.error.ts';
import { FollowRepository } from '@/follow/application/follow.repository.ts';

export type FollowCommand = { name: string; userToFollow: string };

export class UserFollowUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async handle(followCommand: FollowCommand) {
    const currentUser = this.followRepository.findUserByName(
      followCommand.name
    );

    const userToFollow = this.followRepository.findUserByName(
      followCommand.userToFollow
    );

    if (!userToFollow) {
      throw new UnknownUserError();
    }

    currentUser.followees.addFollowee(userToFollow.name);

    await this.followRepository.save(currentUser);
  }
}
