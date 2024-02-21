import { FollowRepository } from '@/application/follow.repository.ts';
import { UserFollowee } from '@/domain/user-followee';
import { PrismaClient } from '@prisma/client';

export class FolloweePrismaRepository implements FollowRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getFolloweesOf(userName: string): Promise<UserFollowee> {
    let user = await this.prismaClient.user.findFirstOrThrow({
      where: { name: userName },
      include: { following: true },
    });
    return UserFollowee.fromData({
      name: user.name,
      followees: user.following.map((f) => f.name),
    });
  }
  async save(user: UserFollowee): Promise<void> {
    await this.upsertUser(user.name);
    user.followees.data.forEach((followee) => this.upsertUser(followee));
    user.followees.data.forEach((followee) => {
      this.prismaClient.user.update({
        where: { name: user.name },
        data: {
          following: {
            connectOrCreate: [
              {
                where: { name: followee },
                create: { name: followee },
              },
            ],
          },
        },
      });
    });
  }

  private async upsertUser(user: string) {
    await this.prismaClient.user.upsert({
      where: { name: user },
      update: { name: user },
      create: { name: user },
    });
  }
}
