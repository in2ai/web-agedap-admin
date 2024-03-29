import secureLocalStorage from 'react-secure-storage';
import { User } from '@/models/user';

// USER
const getUser = async (): Promise<User> => {
  try {
    const userStored = secureLocalStorage.getItem('user') as string;
    if (!userStored) throw new Error('User not found');
    return JSON.parse(userStored);
  } catch (err) {
    throw new Error(`ERROR recovering stored user => ${err}`);
  }
};

const setUser = async (user: User): Promise<void> => {
  try {
    secureLocalStorage.setItem('user', JSON.stringify(user));
  } catch (err) {
    throw new Error(`ERROR storing user => ${err}`);
  }
};

const removeUser = async (): Promise<void> => {
  try {
    secureLocalStorage.removeItem('user');
  } catch (err) {
    throw new Error(`ERROR removing user => ${err}`);
  }
};

const userStoreService = {
  getUser,
  setUser,
  removeUser,
};

export default userStoreService;
