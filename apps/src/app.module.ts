import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageController } from './message/message.controller';
import { FolloweePrismaRepository } from '@/src/repositories/followee.prisma.repository';
import { MessagePrismaRepository } from '@/src/repositories/message.prisma.repository';
import { RealDateProvider } from '@/src/providers/real-date.provider';
import { PrismaService } from '@/src/prisma.service';
import { FollowingController } from './following/following.controller';
import { ViewController } from './view/view.controller';
import { TimelineDefaultPresenter } from '@/src/presenter/timeline.default.presenter';
import { TimelineApiPresenter } from '@/src/presenter/timeline.api.presenter';

@Module({
  imports: [],
  controllers: [
    AppController,
    MessageController,
    FollowingController,
    ViewController,
  ],
  providers: [
    AppService,
    FolloweePrismaRepository,
    MessagePrismaRepository,
    RealDateProvider,
    PrismaService,
    TimelineDefaultPresenter,
    TimelineApiPresenter,
  ],
})
export class AppModule {}
