import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import { MessagePrismaRepository } from '@/src/repositories/message.prisma.repository';
import { messageBuilder } from '@aiel/crafty';
import {PrismaService} from "@/src/prisma.service";

const asyncExec = promisify(exec);

describe('MessagePrismaRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaService;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('crafty-test')
      .withUsername('crafty-test')
      .withPassword('crafty-test')
      .withExposedPorts(5432)
      .start();

    const databaseurl = container.getConnectionUri();

    prismaClient = new PrismaService({
      datasources: {
        db: {
          url: databaseurl,
        },
      },
    });

    await asyncExec(
      `set "DATABASE_URL=${databaseurl}" && npx prisma migrate deploy`
    );

    await prismaClient.$connect();
  });

  afterAll(async () => {
    await container.stop();
    await prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.message.deleteMany();
    await prismaClient.$executeRawUnsafe('DELETE FROM "User" CASCADE');
  });

  test('save() should save a new message', async () => {
    const messageRepository = new MessagePrismaRepository(prismaClient);
    await messageRepository.save(
      messageBuilder()
        .withId('m1')
        .authoredBy('Alice')
        .withText('Hello world')
        .withPublishedAt(new Date('2024-02-23T10:00:00.000Z'))
        .build()
    );

    const expectedMessage = await prismaClient.message.findFirstOrThrow({
      where: { id: 'm1' },
    });
    expect(expectedMessage).toEqual({
      id: 'm1',
      authorId: 'Alice',
      text: 'Hello world',
      publishedAt: new Date('2024-02-23T10:00:00.000Z'),
    });
  });

  test('save() should update an existing new message', async () => {
    await prismaClient.user.upsert({
      where: { name: 'Alice' },
      update: { name: 'Alice' },
      create: { name: 'Alice' },
    });
    await prismaClient.message.create({
      data: {
        id: 'm1',
        authorId: 'Alice',
        text: 'Hello world',
        publishedAt: new Date('2024-02-23T10:00:00.000Z'),
      },
    });

    const messageRepository = new MessagePrismaRepository(prismaClient);
    await messageRepository.save(
      messageBuilder()
        .withId('m1')
        .authoredBy('Alice')
        .withText('Hello world ? How are you ?')
        .withPublishedAt(new Date('2024-02-23T10:00:00.000Z'))
        .build()
    );

    const expectedMessage = await prismaClient.message.findFirstOrThrow({
      where: { id: 'm1' },
    });
    expect(expectedMessage).toEqual({
      id: 'm1',
      authorId: 'Alice',
      text: 'Hello world ? How are you ?',
      publishedAt: new Date('2024-02-23T10:00:00.000Z'),
    });
  });

  test('getById() should return a message by its id', async () => {
    await prismaClient.user.upsert({
      where: { name: 'Alice' },
      update: { name: 'Alice' },
      create: { name: 'Alice' },
    });
    await prismaClient.message.create({
      data: {
        id: 'm1',
        authorId: 'Alice',
        text: 'Hello world',
        publishedAt: new Date('2024-02-23T10:00:00.000Z'),
      },
    });

    const messageRepository = new MessagePrismaRepository(prismaClient);
    const savedMessage = await messageRepository.getById('m1');

    expect(savedMessage.data).toEqual({
      id: 'm1',
      author: 'Alice',
      text: 'Hello world',
      publishedAt: new Date('2024-02-23T10:00:00.000Z'),
    });
  });

  test('getAllOfUser() should return all message of a specific user', async () => {
    await prismaClient.user.upsert({
      where: { name: 'Alice' },
      update: { name: 'Alice' },
      create: { name: 'Alice' },
    });
    await prismaClient.user.upsert({
      where: { name: 'Bob' },
      update: { name: 'Bob' },
      create: { name: 'Bob' },
    });
    await prismaClient.message.create({
      data: {
        id: 'm1',
        authorId: 'Alice',
        text: 'Hello world',
        publishedAt: new Date('2024-02-23T10:00:00.000Z'),
      },
    });
    await prismaClient.message.create({
      data: {
        id: 'm2',
        authorId: 'Alice',
        text: 'Hello world. How are you ?',
        publishedAt: new Date('2024-02-24T10:00:00.000Z'),
      },
    });
    await prismaClient.message.create({
      data: {
        id: 'm3',
        authorId: 'Bob',
        text: 'Hello world. How are you ?',
        publishedAt: new Date('2024-02-24T10:00:00.000Z'),
      },
    });

    const messageRepository = new MessagePrismaRepository(prismaClient);
    const savedMessages = await messageRepository.getAllOfUser('Alice');

    expect(savedMessages).toHaveLength(2);
    expect(savedMessages.map((sm) => sm.data)).toEqual([
      {
        id: 'm1',
        author: 'Alice',
        text: 'Hello world',
        publishedAt: new Date('2024-02-23T10:00:00.000Z'),
      },
      {
        id: 'm2',
        author: 'Alice',
        text: 'Hello world. How are you ?',
        publishedAt: new Date('2024-02-24T10:00:00.000Z'),
      },
    ]);
  });
});
