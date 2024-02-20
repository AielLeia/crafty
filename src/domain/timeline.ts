import { Message } from '@/domain/message.ts';
import { DateProvider } from '@/application/date.provider.ts';

const ONE_MINUTE_IN_MS = 60000;

export class Timeline {
  constructor(
    private readonly messages: Message[],
    private readonly dateProvider: DateProvider
  ) {}

  get data() {
    this.messages.sort(
      (msg1, msg2) => msg2.publishedAt.getTime() - msg1.publishedAt.getTime()
    );

    return this.messages.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this.publicationTime(msg.publishedAt),
    }));
  }

  private publicationTime(publishedAt: Date) {
    const now = this.dateProvider.getNow();
    const elapseMinuteBetween = now.getTime() - publishedAt.getTime();
    const timeInMinute = Math.floor(elapseMinuteBetween / ONE_MINUTE_IN_MS);

    if (timeInMinute < 1) return 'less than a minute ago';
    if (timeInMinute < 2) return 'one minute ago';

    return `${timeInMinute} minutes ago`;
  }
}
