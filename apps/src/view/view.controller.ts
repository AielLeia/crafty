import { Controller, Get, Query } from '@nestjs/common';
import { ViewTimelineUseCase } from '@aiel/crafty';
import { ViewWallUseCase } from '@aiel/crafty';
import { MessagePrismaRepository } from '@/src/repositories/message.prisma.repository';
import { FolloweePrismaRepository } from '@/src/repositories/followee.prisma.repository';
import { TimelineDefaultPresenter } from '@/src/presenter/timeline.default.presenter';

@Controller()
export class ViewController {
  private viewTimelineUseCase: ViewTimelineUseCase;
  private viewWallUseCase: ViewWallUseCase;

  constructor(
    private readonly messageRepository: MessagePrismaRepository,
    private readonly followRepository: FolloweePrismaRepository,
    private readonly timelinePresenter: TimelineDefaultPresenter
  ) {
    this.viewTimelineUseCase = new ViewTimelineUseCase(this.messageRepository);
    this.viewWallUseCase = new ViewWallUseCase(
      this.messageRepository,
      this.followRepository
    );
  }

  @Get('view')
  async viewTimeline(@Query('user') user: string) {
    return await this.viewTimelineUseCase.handle(
      { user },
      this.timelinePresenter
    );
  }

  @Get('wall')
  async viewWall(@Query('user') user: string) {
    return await this.viewWallUseCase.handle({ user }, this.timelinePresenter);
  }
}
