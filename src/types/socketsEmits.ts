export enum SocketEmits {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    MESSAGE = "message",
    JOIN_ROOM ="room.join",
    CONNECTION_ERROR = "connect_error",
    USER_CONNECTED = "user.connected",
    USER_DISCONNECTED = "user.disconnected",
    SHOW_ROOM = "show.room",
    USER_ROOM = "user.room",
    USER_AUTHENTICATE = "user.authenticate",
    USER_AUTHENTICATED = "user.authenticated",
}