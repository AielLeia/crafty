import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import path from 'path';
import { MessageFsRepository } from '@/src/repositories/message.fs.repository';
import fs from 'fs';
import { messageBuilder } from '@aiel/crafty';

const testMessagePath = path.join(__dirname, 'message.test.json');

describe('MessageFsRepository', () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testMessagePath, JSON.stringify([]));
  });

  afterAll(async () => {
    await fs.promises.unlink(testMessagePath);
  });

  test('save() can save a message in the files system', async () => {
    const messageRepository = new MessageFsRepository(testMessagePath);

    await messageRepository.save(
      messageBuilder()
        .authoredBy('Alice')
        .withId('m1')
        .withText('Text message')
        .withPublishedAt(new Date('2024-02-18T07:49:00.000Z'))
        .build()
    );

    const messages = await fs.promises.readFile(testMessagePath);
    const messageJson = JSON.parse(messages.toString());
    expect(messageJson).toEqual([
      {
        id: 'm1',
        author: 'Alice',
        publishedAt: '2024-02-18T07:49:00.000Z',
        text: 'Text message',
      },
    ]);
  });

  test('save() can update an existing message in the files system', async () => {
    const messageRepository = new MessageFsRepository(testMessagePath);
    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: 'm1',
          author: 'Alice',
          publishedAt: '2024-02-18T07:49:00.000Z',
          text: 'Text message',
        },
      ])
    );

    await messageRepository.save(
      messageBuilder()
        .authoredBy('Alice')
        .withId('m1')
        .withText('Text message edited')
        .withPublishedAt(new Date('2024-02-18T07:49:00.000Z'))
        .build()
    );

    const messages = await fs.promises.readFile(testMessagePath);
    const messageJson = JSON.parse(messages.toString());
    expect(messageJson).toEqual([
      {
        id: 'm1',
        author: 'Alice',
        publishedAt: '2024-02-18T07:49:00.000Z',
        text: 'Text message edited',
      },
    ]);
  });

  test('getById() returns a message by its id', async () => {
    const messageRepository = new MessageFsRepository(testMessagePath);
    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: 'm1',
          author: 'Alice',
          publishedAt: '2024-02-18T07:49:00.000Z',
          text: 'Text message',
        },
        {
          id: 'm2',
          author: 'Bob',
          publishedAt: '2024-02-18T07:50:00.000Z',
          text: 'Text message 2',
        },
      ])
    );

    const message = await messageRepository.getById('m2');

    expect(message).toEqual(
      messageBuilder()
        .withId('m2')
        .authoredBy('Bob')
        .withPublishedAt(new Date('2024-02-18T07:50:00.000Z'))
        .withText('Text message 2')
        .build()
    );
  });

  test('getAllOfUser() returns all messages for a specific user', async () => {
    const messageRepository = new MessageFsRepository(testMessagePath);
    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: 'm1',
          author: 'Alice',
          publishedAt: '2024-02-18T07:49:00.000Z',
          text: 'Text message',
        },
        {
          id: 'm3',
          author: 'Alice',
          publishedAt: '2024-02-18T07:58:00.000Z',
          text: "Text message 2 d'Alice",
        },
        {
          id: 'm2',
          author: 'Bob',
          publishedAt: '2024-02-18T07:50:00.000Z',
          text: 'Text message 2',
        },
      ])
    );

    const message = await messageRepository.getAllOfUser('Alice');

    expect(message).toHaveLength(2);
    expect(message).toEqual(
      expect.arrayContaining([
        messageBuilder()
          .withId('m1')
          .authoredBy('Alice')
          .withPublishedAt(new Date('2024-02-18T07:49:00.000Z'))
          .withText('Text message')
          .build(),
        messageBuilder()
          .withId('m3')
          .authoredBy('Alice')
          .withPublishedAt(new Date('2024-02-18T07:58:00.000Z'))
          .withText("Text message 2 d'Alice")
          .build(),
      ])
    );
  });
});
