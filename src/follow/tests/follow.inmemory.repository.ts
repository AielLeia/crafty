import { UserFollowee } from '@/follow/domain/user-followee.ts';
import { FollowRepository } from '@/follow/application/follow.repository.ts';

export class InMemoryFollowRepository implements FollowRepository {
  users: Map<string, UserFollowee> = new Map();

  findUserByName(userName: string): UserFollowee {
    return this.users.get(userName)!;
  }

  save(user: UserFollowee): Promise<void> {
    this.users.set(user.name, user);
    return Promise.resolve();
  }

  async givenExistingUserAndThereFollowees(users: UserFollowee[]) {
    users.forEach(this.save.bind(this));
  }
}
