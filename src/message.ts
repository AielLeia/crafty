export class Message {
  constructor(
    private readonly _id: string,
    private readonly _author: string,
    private _text: MessageText,
    private readonly _publishedAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get author(): string {
    return this._author;
  }

  get text() {
    return this._text.value;
  }

  get publishedAt(): Date {
    return this._publishedAt;
  }

  get data() {
    return {
      id: this.id,
      publishedAt: this.publishedAt,
      author: this.author,
      text: this.text,
    };
  }

  editText(newText: string) {
    this._text = MessageText.of(newText);
  }

  static fromData(data: Message['data']) {
    return new Message(
      data.id,
      data.author,
      MessageText.of(data.text),
      data.publishedAt
    );
  }
}

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export class MessageText {
  private constructor(readonly value: string) {}

  static of(text: string) {
    if (text.length > 280) {
      throw new MessageTooLongError();
    }

    if (text.trim().length === 0) {
      throw new EmptyMessageError();
    }

    return new MessageText(text);
  }
}
