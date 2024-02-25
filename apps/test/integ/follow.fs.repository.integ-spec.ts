import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import path from 'path';
import fs from 'fs';
import { FollowFsRepository } from '@/src/repositories/follow.fs.repository';
import { followBuilder } from '@aiel/crafty';

const testFollowPath = path.join(__dirname, 'follow.test.json');

describe('FollowFsRepository', () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testFollowPath, JSON.stringify([]));
  });

  afterAll(async () => {
    await fs.promises.unlink(testFollowPath);
  });

  test('getFolloweesOf() can get a user by it name', async () => {
    const followRepository = new FollowFsRepository(testFollowPath);

    await fs.promises.writeFile(
      testFollowPath,
      JSON.stringify([
        {
          name: 'Alice',
          followees: ['Charlie', 'Bob'],
        },
        {
          name: 'Bob',
          followees: ['Charlie', 'Alice'],
        },
        {
          name: 'Charlie',
          followees: ['Alice'],
        },
      ])
    );

    const charlie = await followRepository.getFolloweesOf('Charlie');
    expect(charlie).toEqual(
      followBuilder({
        name: 'Charlie',
        followees: ['Alice'],
      }).build()
    );
  });

  test('save() can save a followee information for a user', async () => {
    const followRepository = new FollowFsRepository(testFollowPath);

    await followRepository.save(
      followBuilder().withName('Alice').addFollowees('Charlie', 'Bob').build()
    );

    const follows = await fs.promises.readFile(testFollowPath);
    const followsJson = JSON.parse(follows.toString());
    expect(followsJson).toEqual([
      {
        name: 'Alice',
        followees: ['Charlie', 'Bob'],
      },
    ]);
  });
});
