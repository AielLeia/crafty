import { FollowRepository } from '@aiel/crafty';
import { UserFollowee } from '@aiel/crafty';
import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {PrismaService} from "@/src/prisma.service";

@Injectable()
export class FolloweePrismaRepository implements FollowRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async getFolloweesOf(userName: string): Promise<UserFollowee> {
    const user = await this.prismaClient.user.findFirstOrThrow({
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
    for (const followee of user.followees.data) {
      await this.upsertUser(followee);
    }
    for (const followee of user.followees.data) {
      await this.prismaClient.user.update({
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
    }
  }

  private async upsertUser(user: string) {
    await this.prismaClient.user.upsert({
      where: { name: user },
      update: { name: user },
      create: { name: user },
    });
  }
}
