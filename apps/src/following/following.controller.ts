import { Body, Controller, Post } from '@nestjs/common';
import { UserFollowUseCase } from '@aiel/crafty';
import { FolloweePrismaRepository } from '@/src/repositories/followee.prisma.repository';
import { FollowCommand } from '@aiel/crafty';

@Controller()
export class FollowingController {
  private followingUseCase: UserFollowUseCase;

  constructor(
    private readonly followeePrismaRepository: FolloweePrismaRepository
  ) {
    this.followingUseCase = new UserFollowUseCase(followeePrismaRepository);
  }

  @Post('follow')
  async follow(@Body() followBody: { user: string; followee: string }) {
    const followCommand: FollowCommand = {
      name: followBody.user,
      userToFollow: followBody.followee,
    };

    await this.followingUseCase.handle(followCommand);

    return Promise.resolve();
  }
}
