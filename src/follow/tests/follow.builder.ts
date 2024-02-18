import { UserFollowee } from '@/follow/domain/user-followee.ts';

export const userBuilder = ({
  name = 'user name',
  followees = [],
}: { name?: string; followees?: string[] } = {}) => {
  const props = { name, followees };
  return {
    withName(_name: string) {
      return userBuilder({ ...props, name: _name });
    },
    addFollowee(_followee: string) {
      props.followees.push(_followee);
      return userBuilder({ ...props, followees: props.followees });
    },
    addFollowees(..._followees: string[]) {
      props.followees.push(..._followees);
      return userBuilder({ ...props, followees: props.followees });
    },
    build(): UserFollowee {
      return UserFollowee.fromData({
        name: props.name,
        followees: props.followees,
      });
    },
  };
};
