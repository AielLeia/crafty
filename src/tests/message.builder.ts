import { Message } from '@/domain/message.ts';

export const messageBuilder = ({
  id = 'message-id',
  author = 'author',
  text = 'Some text',
  publishedAt = new Date('2024-02-17T18:10:00.000Z'),
} = {}) => {
  const props = { id, author, text, publishedAt };
  return {
    withId(_id: string) {
      return messageBuilder({ ...props, id: _id });
    },
    authoredBy(_author: string) {
      return messageBuilder({ ...props, author: _author });
    },
    withText(_text: string) {
      return messageBuilder({ ...props, text: _text });
    },
    withPublishedAt(_publishedAt: Date) {
      return messageBuilder({ ...props, publishedAt: _publishedAt });
    },
    build(): Message {
      return Message.fromData({
        id: props.id,
        author: props.author,
        text: props.text,
        publishedAt: props.publishedAt,
      });
    },
  };
};
