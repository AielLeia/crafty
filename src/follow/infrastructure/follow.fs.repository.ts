import { FollowRepository } from '@/follow/application/follow.repository.ts';
import { UserFollowee } from '../domain/user-followee';
import path from 'path';
import fs from 'fs';

export class FollowFsRepository implements FollowRepository {
  constructor(
    private readonly followPath = path.join(__dirname, 'follow.json')
  ) {}

  async findUserByName(userName: string): Promise<UserFollowee> {
    const followees = await this.getAllFollower();
    return followees.find((f) => f.name === userName)!;
  }
  async save(user: UserFollowee): Promise<void> {
    const followees = await this.getAllFollower();
    const existingFollow = followees.findIndex(
      (followee) => followee.name === user.name
    );

    if (existingFollow === -1) {
      followees.push(user);
    } else {
      followees[existingFollow] = user;
    }

    return fs.promises.writeFile(
      this.followPath,
      JSON.stringify(followees.map((f) => f.data))
    );
  }

  private async getAllFollower(): Promise<UserFollowee[]> {
    const followees = await fs.promises.readFile(this.followPath);
    const followeesJson = JSON.parse(followees.toString()) as {
      name: string;
      followees: string[];
    }[];

    return followeesJson.map((followee) => {
      return UserFollowee.fromData({
        name: followee.name,
        followees: followee.followees,
      });
    });
  }
}
