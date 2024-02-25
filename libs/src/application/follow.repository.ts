import { UserFollowee } from '@/domain/user-followee.ts';

export interface FollowRepository {
  getFolloweesOf(userName: string): Promise<UserFollowee>;

  save(user: UserFollowee): Promise<void>;
}
