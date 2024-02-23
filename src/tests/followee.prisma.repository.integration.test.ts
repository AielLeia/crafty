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
import { FolloweePrismaRepository } from '@/infrastructure/followee.prisma.repository.ts';
import { followBuilder } from '@/tests/follow.builder.ts';

const asyncExec = promisify(exec);

describe('FolloweePrismaRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('crafty-test')
      .withUsername('crafty-test')
      .withPassword('crafty-test')
      .withExposedPorts(5432)
      .start();

    const databaseurl = container.getConnectionUri();

    prismaClient = new PrismaClient({
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

  test('save() should save a new user followee', async () => {
    const followeeRepository = new FolloweePrismaRepository(prismaClient);

    await followeeRepository.save(
      followBuilder().withName('Alice').addFollowees('Charle', 'Bob').build()
    );

    const savedFollowee = await prismaClient.user.findFirstOrThrow({
      where: { name: 'Alice' },
      include: { following: true },
    });

    expect(savedFollowee.name).toEqual('Alice');
    expect(savedFollowee.following).toHaveLength(2);
    expect(savedFollowee.following).toEqual([
      expect.objectContaining({ name: 'Charle' }),
      expect.objectContaining({ name: 'Bob' }),
    ]);
  });

  test('getFolloweesOf() all followees of a specifc user', async () => {
    const followeeRepository = new FolloweePrismaRepository(prismaClient);

    await followeeRepository.save(
      followBuilder().withName('Alice').addFollowees('Charle', 'Bob').build()
    );

    const savedFollowee = await followeeRepository.getFolloweesOf('Alice');

    expect(savedFollowee.name).toEqual('Alice');
    expect(savedFollowee.followees.data).toEqual(['Charle', 'Bob']);
  });
});
