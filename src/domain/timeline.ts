import { Message } from '@/domain/message.ts';

export class Timeline {
  constructor(private readonly messages: Message[]) {}

  get data() {
    this.messages.sort(
      (msg1, msg2) => msg2.publishedAt.getTime() - msg1.publishedAt.getTime()
    );

    return this.messages.map((msg) => msg.data);
  }
}
