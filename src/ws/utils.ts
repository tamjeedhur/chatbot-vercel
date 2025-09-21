// @ts-check

import { getUsers } from './api';
import { UserEntry, Message } from '@/types/interfaces';
import { ActionTypes, Action } from '@/types/actionTypes';

/**
 * @param {string[]} names
 * @param {string} username
 */
export const parseRoomName = (names: string[], username: string): string => {
  for (let name of names) {
    if (typeof name !== 'string') {
      name = name[0];
    }
    if (name !== username) {
      return name;
    }
  }
  return names[0];
};

/** Get an avatar for a room or a user */
export const getAvatarByUserAndRoomId = (roomId: string = '1'): string => {
  const TOTAL_IMAGES = 13;
  const seed1 = 654;
  const seed2 = 531;

  const uidParsed = +(roomId.split(':').pop() ?? '0');
  let roomIdParsed = +(roomId.split(':').reverse().pop() ?? '0');
  if (roomIdParsed < 0) {
    roomIdParsed += 3555;
  }

  const theId = (uidParsed * seed1 + roomIdParsed * seed2) % TOTAL_IMAGES;

  return `${process.env.PUBLIC_URL}/avatars/${theId}.jpg`;
};

const jdenticon = require('jdenticon');

interface AvatarCache {
  [key: string]: string;
}

const avatars: AvatarCache = {};

export const getAvatar = (username: string): string => {
  let av = avatars[username];
  if (av === undefined) {
    av = 'data:image/svg+xml;base64,' + window.btoa(jdenticon.toSvg(username, 50));
    avatars[username] = av;
  }
  return av;
};

export const populateUsersFromLoadedMessages = async (
  users: { [id: string]: UserEntry },
  dispatch: (action: Action) => void,
  messages: Message[],
  accessToken?: string
): Promise<void> => {
  const userIds: { [key: string]: number } = {};
  messages.forEach((message) => {
    userIds[message.from] = 1;
  });

  const ids = Object.keys(userIds).filter((id) => users[id] === undefined);

  if (ids.length !== 0) {
    /** We need to fetch users first */
    const newUsers = await getUsers(accessToken);
    dispatch({
      type: ActionTypes.APPEND_USERS,
      payload: Object.fromEntries(newUsers.map((user) => [user.id, user])),
    });
  }
};
