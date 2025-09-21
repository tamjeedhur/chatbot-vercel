import { createContext, useContext, useReducer, Dispatch } from "react";
import { ActionTypes,Action } from "@/types/actionTypes";
import { State } from "@/types/interfaces";




const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.CLEAR:
      return { currentRoom: "0", rooms: {}, users: {} };
    case ActionTypes.SET_USER: {
      return {
        ...state,
        users: { ...state.users, [action.payload.id]: action.payload },
      };
    }
    case ActionTypes.MAKE_USER_ONLINE: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload]: { ...state.users[action.payload], online: true },
        },
      };
    }
    case ActionTypes.APPEND_USERS: {
      return { ...state, users: { ...state.users, ...action.payload } };
    }
    case ActionTypes.SET_MESSAGES: {
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.id]: {
            ...state.rooms[action.payload.id],
            messages: action.payload.messages,
            offset: action.payload.messages.length,
          },
        },
      };
    }
    case ActionTypes.PREPEND_MESSAGES: {
      const messages = [
        ...action.payload.messages,
        ...(state.rooms[action.payload.id].messages || []),
      ];
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.id]: {
            ...state.rooms[action.payload.id],
            messages,
            offset: messages.length,
          },
        },
      };
    }
    case ActionTypes.APPEND_MESSAGE:
      if (state.rooms[action.payload.id] === undefined) {
        return state;
      }
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.id]: {
            ...state.rooms[action.payload.id],
            lastMessage: action.payload.message,
            messages: state.rooms[action.payload.id].messages
              ? [
                  ...(state.rooms[action.payload.id].messages || []),
                  action.payload.message,
                ]
              : undefined,
          },
        },
      };
    case ActionTypes.SET_LAST_MESSAGE:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.id]: {
            ...state.rooms[action.payload.id],
            lastMessage: action.payload.lastMessage,
          },
        },
      };
    case ActionTypes.SET_CURRENT_ROOM:
      return { ...state, currentRoom: action.payload };
    case ActionTypes.ADD_ROOM:
      return {
        ...state,
        rooms: { ...state.rooms, [action.payload.id]: action.payload },
      };
    case ActionTypes.SET_ROOMS: {
      /** @type {Room[]} */
      const newRooms = action.payload;
      const rooms = { ...state.rooms };
      newRooms.forEach((room) => {
        rooms[room.id] = {
          ...room,
          messages: rooms[room.id] && rooms[room.id].messages,
        };
      });
      return { ...state, rooms };
    }
    default:
      return state;
  }
};

const initialState: State = {
  currentRoom: "main",
  rooms: {},
  users: {},
};

const useAppStateContext = () => {
  return useReducer(reducer, initialState);
};

export const AppContext = createContext<
  ReturnType<typeof useAppStateContext> | undefined
>(undefined);

export const useAppState = (): [State, Dispatch<Action>] => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppContext.Provider");
  }
  return context;
};

export default useAppStateContext;
