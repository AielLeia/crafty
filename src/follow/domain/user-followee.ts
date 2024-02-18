import { MultipleTimeFollowError } from '@/follow/domain/error/multiple-time-follow.error.ts';

export class Followees {
  constructor(private readonly names: string[] = []) {}

  addFollowee(followee: string) {
    const existingUserToFollow = this.names.find((f) => f === followee);

    if (existingUserToFollow) {
      throw new MultipleTimeFollowError();
    }
    this.names.push(followee);
  }

  get data() {
    return this.names;
  }

  static fromData(data: Followees['data']): Followees {
    return new Followees(data);
  }
}

export class UserFollowee {
  private constructor(
    private readonly _name: string,
    private readonly _followees: Followees
  ) {}

  get name(): string {
    return this._name;
  }

  get followees() {
    return this._followees;
  }

  get data() {
    return {
      name: this.name,
      followees: this._followees.data,
    };
  }

  static fromData(data: UserFollowee['data']) {
    return new UserFollowee(data.name, Followees.fromData(data.followees));
  }
}
