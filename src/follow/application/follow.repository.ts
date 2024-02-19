import { UserFollowee } from '@/follow/domain/user-followee.ts';

export interface FollowRepository {
  findUserByName(userName: string): Promise<UserFollowee>;

  save(user: UserFollowee): Promise<void>;
}
