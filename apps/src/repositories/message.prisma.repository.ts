import { MessageRepository } from '@aiel/crafty';
import { Message } from '@aiel/crafty';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/prisma.service';

@Injectable()
export class MessagePrismaRepository implements MessageRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async save(message: Message): Promise<void> {
    const messageData = message.data;
    await this.prismaClient.user.upsert({
      where: { name: messageData.author },
      update: { name: messageData.author },
      create: { name: messageData.author },
    });

    console.log('saving a message');

    await this.prismaClient.message.upsert({
      where: { id: messageData.id },
      update: {
        text: messageData.text,
        id: messageData.id,
        authorId: messageData.author,
        publishedAt: messageData.publishedAt,
      },
      create: {
        id: messageData.id,
        text: messageData.text,
        authorId: messageData.author,
        publishedAt: messageData.publishedAt,
      },
    });
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    const messagesData = await this.prismaClient.message.findMany({
      where: { authorId: user },
    });
    return messagesData.map((m) =>
      Message.fromData({
        id: m.id,
        publishedAt: m.publishedAt,
        author: m.authorId,
        text: m.text,
      })
    );
  }

  async getById(messageId: string): Promise<Message> {
    const messageData = await this.prismaClient.message.findFirstOrThrow({
      where: { id: messageId },
      include: { author: true },
    });

    return Message.fromData({
      id: messageData.id,
      publishedAt: messageData.publishedAt,
      author: messageData.author.name,
      text: messageData.text,
    });
  }
}
