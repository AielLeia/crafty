import { UserFollowee } from '@/domain/user-followee.ts';

type FollowBuilder = {
  withName(_name: string): FollowBuilder;
  addFollowee(_followee: string): FollowBuilder;
  addFollowees(..._followees: string[]): FollowBuilder;
  build(): UserFollowee;
};

export const followBuilder = ({
  name = 'user name',
  followees = [],
}: { name?: string; followees?: string[] } = {}): FollowBuilder => {
  const props = { name, followees };
  return {
    withName(_name: string) {
      return followBuilder({ ...props, name: _name });
    },
    addFollowee(_followee: string) {
      props.followees.push(_followee);
      return followBuilder({ ...props, followees: props.followees });
    },
    addFollowees(..._followees: string[]) {
      props.followees.push(..._followees);
      return followBuilder({ ...props, followees: props.followees });
    },
    build(): UserFollowee {
      return UserFollowee.fromData({
        name: props.name,
        followees: props.followees,
      });
    },
  };
};
