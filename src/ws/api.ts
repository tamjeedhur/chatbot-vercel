import axios from 'axios';
axios.defaults.withCredentials = true;

import { Server_URL, API_VERSION, MESSAGES_TO_LOAD } from '@/utils/constants';
import { ButtonLinks, PreloadedRoom, ResponseRoom, ResponseMessage } from '@/types/interfaces';

const url = (x: string) => `${Server_URL}/api${x.startsWith('/') ? x : `/${x}`}`;

/** Checks if there's an existing session. */
export const getMe = (): Promise<any | null> => {
  'getting user from session';
  return axios
    .get(`${Server_URL}/api/v1/auth/me`, {
      withCredentials: true,
    })
    .then((x) => x.data)
    .catch((_) => null);
};

/** Handle user log in */
export const login = (email: string, password: string): Promise<any> => {
  return axios
    .post(`${Server_URL}/api/v1/auth/login`, {
      email,
      password,
    })
    .then((x) => {
      return x.data; // Added return here
    })
    .catch((e) => {
      throw new Error(e.response?.data?.message || e.message);
    });
};

export const logOut = () => {
  console.log('logout hit');
  return axios.post(`${Server_URL}/api/v1/auth/logout`);
};

/**
 * Function for checking which deployment urls exist.
 *
 * @returns {Promise<{
 *   heroku?: string;
 *   google_cloud?: string;
 *   vercel?: string;
 *   github?: string;
 * }>}
 */
export const getButtonLinks = (): Promise<ButtonLinks | null> => {
  return axios
    .get(`${Server_URL}/api/v1/links`)
    .then((x) => x.data)
    .catch((_) => null);
};

/** This was used to get a random login name (for demo purposes). */
export const getRandomName = (): Promise<string> => {
  return axios.get(`${Server_URL}/api/v1/randomname`).then((x) => x.data);
};

/**
 * Load messages
 *
 * @param {string} id room id
 * @param {number} offset
 * @param {number} size
 * @param {string} accessToken optional access token for authentication
 */
export const getMessages = (id: string, offset: number = 0, size: number = MESSAGES_TO_LOAD, accessToken?: string): Promise<ResponseMessage[]> => {
  const headers: any = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return axios
    .get(`${Server_URL}/api/v1/room/${id}/messages`, {
      params: {
        offset,
        size,
      },
      headers,
    })
    .then((x) => x.data.reverse());
};

/**
 * @returns {Promise<{ name: string, id: string, messages: Array<import('./state').Message> }>}
 */
export const getPreloadedRoom = async (): Promise<PreloadedRoom> => {
  return axios.get(`${Server_URL}/api/v1/room/0/preload`).then((x) => x.data);
};

/**
 * Fetch users by requested ids
 * @param {Array<number | string>} ids
 */
export const getUsers = (accessToken?: string): Promise<any[]> => {
  const headers: any = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Use the correct auth service endpoint for user management
  const apiUrl = `${Server_URL}/api/v1/auth/users`;
  console.log('getUsers called with URL:', apiUrl);
  console.log('getUsers headers:', headers);

  return axios
    .get(apiUrl, { headers })
    .then((x) => x.data)
    .catch((error) => {
      console.error('getUsers error:', error.response?.status, error.response?.data);
      if (error.response?.status === 403) {
        console.warn('User does not have admin privileges to access user list');
        return []; // Return empty array if user doesn't have admin role
      }
      throw error;
    });
};

export const upvoteMessage = (messageId: string): Promise<any> => {
  return axios.post(`${Server_URL}/api/v1/messages/${messageId}/upvote`).then((res) => res.data);
};

export const downvoteMessage = (messageId: string): Promise<any> => {
  return axios.post(`${Server_URL}/api/v1/messages/${messageId}/downvote`).then((res) => res.data);
};

/** Fetch users which are online */
export const getOnlineUsers = (accessToken?: string): Promise<any[]> => {
  const headers: any = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Use the correct auth service endpoint for user management
  // Note: This endpoint requires admin role and doesn't filter by online status
  const apiUrl = `${Server_URL}/api/v1/auth/users`;
  console.log('getOnlineUsers called with URL:', apiUrl);
  console.log('getOnlineUsers headers:', headers);

  return axios
    .get(apiUrl, { headers })
    .then((x) => x.data)
    .catch((error) => {
      console.error('getOnlineUsers error:', error.response?.status, error.response?.data);
      if (error.response?.status === 403) {
        console.warn('User does not have admin privileges to access user list');
        return []; // Return empty array if user doesn't have admin role
      }
      throw error;
    });
};

/** This one is called on a private messages room created. */
export const addRoom = async (
  conversationId: string,
  accessToken?: string,
  options?: {
    includeMessages?: boolean;
    offset?: number;
    size?: number;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<any> => {
  console.log('addRoom called with:', { conversationId, hasToken: !!accessToken, options });
  const apiUrl = `${Server_URL}/api/v1/room`;
  console.log('addRoom API URL:', apiUrl);

  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Enhanced request body with optional message parameters
    const requestBody: any = { conversationId };

    if (options?.includeMessages) {
      requestBody.includeMessages = true;
      requestBody.offset = options.offset || 0;
      requestBody.size = options.size || 15;
      requestBody.sortOrder = options.sortOrder || 'desc';
    }

    console.log('addRoom request body:', requestBody);

    const response = await axios.post(apiUrl, requestBody, { headers });
    console.log('addRoom response:', response.data);
    return response.data;
  } catch (error) {
    console.error('addRoom error:', error);
    throw error;
  }
};

/**
 * @returns {Promise<Array<{ names: string[]; id: string }>>}
 */
export const getRooms = async (userId: string): Promise<ResponseRoom[]> => {
  return axios.get(`${Server_URL}/api/v1/rooms/${userId}`).then((x) => x.data);
};
