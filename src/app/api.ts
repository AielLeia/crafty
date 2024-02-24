import 'module-alias/register';
import Fastify, { FastifyInstance } from 'fastify';
import httpErrors from 'http-errors';
import PostMessageUseCase, {
  PostMessageCommand,
} from '@/application/usecase/post-message.usecase.ts';
import ViewTimelineUseCase from '@/application/usecase/view-timeline.usecase.ts';
import EditMessageUseCase, {
  EditMessageCommand,
} from '@/application/usecase/edit-message.usecase.ts';
import { RealDateProvider } from '@/infrastructure/real-date.provider.ts';
import {
  FollowCommand,
  UserFollowUseCase,
} from '@/application/usecase/user-follow.usecase.ts';
import { ViewWallUseCase } from '@/application/usecase/view-wall.usecase.ts';
import { PrismaClient } from '@prisma/client';
import { MessagePrismaRepository } from '@/infrastructure/message.prisma.repository.ts';
import { FolloweePrismaRepository } from '@/infrastructure/followee.prisma.repository.ts';
import { TimelineApiPresenter } from '@/app/timeline.api.presenter.ts';

const prismaClient = new PrismaClient();

const messageRepository = new MessagePrismaRepository(prismaClient);
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);
const editMessageUseCase = new EditMessageUseCase(messageRepository);

const followRepository = new FolloweePrismaRepository(prismaClient);
const followUseCase = new UserFollowUseCase(followRepository);

const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followRepository
);

const timelinePresenter = new TimelineApiPresenter();

const fastify = Fastify({ logger: true });

const routes = async (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post<{ Body: { user: string; message: string } }>(
    '/post',
    {},
    async (request, reply) => {
      const postMessageCommand: PostMessageCommand = {
        id: `${Math.floor(Math.random() * 10000)}`,
        author: request.body.user,
        text: request.body.message,
      };

      try {
        const result = await postMessageUseCase.handle(postMessageCommand);
        if (result.isOk()) {
          reply.status(201);
          return;
        }
        reply.send(httpErrors[403](result.error.message));
      } catch (e) {
        if (e instanceof Error) {
          reply.send(httpErrors[500](e.message));
        }
      }
    }
  );

  fastifyInstance.post<{
    Body: { messageId: string; message: string };
  }>('/edit', {}, async (request, reply) => {
    const editMessageCommand: EditMessageCommand = {
      messageId: request.body.messageId,
      text: request.body.message,
    };

    try {
      const result = await editMessageUseCase.handle(editMessageCommand);
      if (result.isOk()) {
        reply.status(200);
        return;
      }
      reply.send(httpErrors[403](result.error.message));
    } catch (e) {
      if (e instanceof Error) {
        reply.send(httpErrors[500](e.message));
      }
    }
  });

  fastifyInstance.post<{
    Body: { user: string; followee: string };
  }>('/follow', {}, async (request, reply) => {
    const followCommand: FollowCommand = {
      name: request.body.user,
      userToFollow: request.body.followee,
    };

    try {
      await followUseCase.handle(followCommand);
      reply.status(201);
    } catch (e) {
      if (e instanceof Error) {
        reply.send(httpErrors[500](e.message));
      }
    }
  });

  fastifyInstance.get<{
    Querystring: { user: string };
    Reply:
      | { id: string; author: string; publishedAt: Date; text: string }[]
      | httpErrors.HttpError<500>;
  }>('/view', {}, async (request, reply) => {
    try {
      const timeline = await viewTimelineUseCase.handle(
        {
          user: request.query.user,
        },
        timelinePresenter
      );
      reply.status(200).send(timeline);
    } catch (e) {
      if (e instanceof Error) {
        reply.send(httpErrors[500](e.message));
      }
    }
  });

  fastifyInstance.get<{
    Querystring: { user: string };
    Reply:
      | { id: string; author: string; publishedAt: Date; text: string }[]
      | httpErrors.HttpError<500>;
  }>('/wall', {}, async (request, reply) => {
    try {
      const timeline = await viewWallUseCase.handle(
        {
          user: request.query.user,
        },
        timelinePresenter
      );
      reply.status(200).send(timeline);
    } catch (e) {
      if (e instanceof Error) {
        reply.send(httpErrors[500](e.message));
      }
    }
  });
};

fastify.register(routes);
fastify.listen({ port: 3000 });
