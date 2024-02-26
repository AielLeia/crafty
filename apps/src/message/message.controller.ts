import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessagePrismaRepository } from '@/src/repositories/message.prisma.repository';
import { EditMessageUseCase, PostMessageUseCase } from '@aiel/crafty';
import { RealDateProvider } from '@/src/providers/real-date.provider';
import { PostMessageCommand } from '@aiel/crafty';
import { EditMessageCommand } from '@aiel/crafty';

@Controller()
export class MessageController {
  private editMessageUseCase: EditMessageUseCase;
  private postMessageUseCase: PostMessageUseCase;

  constructor(
    private readonly messageRepository: MessagePrismaRepository,
    private readonly dateProvider: RealDateProvider
  ) {
    this.editMessageUseCase = new EditMessageUseCase(messageRepository);
    this.postMessageUseCase = new PostMessageUseCase(
      messageRepository,
      dateProvider
    );
  }

  @Post('post')
  async post(
    @Body() postMessageBody: { user: string; message: string }
  ): Promise<void> {
    const postMessageCommand: PostMessageCommand = {
      id: `${Math.random() * 1000}`,
      author: postMessageBody.user,
      text: postMessageBody.message,
    };
    const result = await this.postMessageUseCase.handle(postMessageCommand);
    if (result.isErr()) {
      throw new Error(result.error.message);
    }
    return Promise.resolve();
  }

  @Post('edit/:messageId')
  async edit(
    @Body() editMessageBody: { message: string },
    @Param() params: { messageId: string }
  ): Promise<void> {
    const editMessageCommand: EditMessageCommand = {
      messageId: params.messageId,
      text: editMessageBody.message,
    };
    const result = await this.editMessageUseCase.handle(editMessageCommand);
    if (result.isErr()) {
      throw new Error(result.error.message);
    }
    return Promise.resolve();
  }
}
