import { UserEntry, Message, Room } from "./interfaces";
//state types
export enum ActionTypes {
  CLEAR = "clear",
  SET_USER = "set user",
  MAKE_USER_ONLINE = "make user online",
  APPEND_USERS = "append users",
  SET_MESSAGES = "set messages",
  PREPEND_MESSAGES = "prepend messages",
  APPEND_MESSAGE = "append message",
  SET_LAST_MESSAGE = "set last message",
  SET_CURRENT_ROOM = "set current room",
  ADD_ROOM = "add room",
  SET_ROOMS = "set rooms",
  ADD_MESSAGE = "add message",
}

//action type of state reducer
export type Action =
  | { type: ActionTypes.CLEAR }
  | { type: ActionTypes.SET_USER; payload: UserEntry }
  | { type: ActionTypes.MAKE_USER_ONLINE; payload: string }
  | { type: ActionTypes.APPEND_USERS; payload: { [id: string]: UserEntry } }
  | {
      type: ActionTypes.SET_MESSAGES;
      payload: { id: string; messages: Message[] };
    }
  | {
      type: ActionTypes.PREPEND_MESSAGES;
      payload: { id: string; messages: Message[] };
    }
  | {
      type: ActionTypes.APPEND_MESSAGE;
      payload: { id: string; message: Message };
    }
  | {
      type: ActionTypes.SET_LAST_MESSAGE;
      payload: { id: string; lastMessage: Message };
    }
  | { type: ActionTypes.SET_CURRENT_ROOM; payload: string }
  | { type: ActionTypes.ADD_ROOM; payload: Room }
  | { type: ActionTypes.SET_ROOMS; payload: Room[] }
  | { type: ActionTypes.ADD_MESSAGE; payload: Message };
