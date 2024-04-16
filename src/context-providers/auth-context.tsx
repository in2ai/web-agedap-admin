'use client';

import React, { useContext, useEffect, useState } from 'react';
import { User } from '@/models/user';
import nostrService from '@/services/nostr/nostr-service';
import userStoreService from '@/services/store/secure-store-service';

interface AuthContextInterface {
  isLoading: boolean;
  logout: () => void;
  loginBySecretKey: (secret: string) => void;
  loginByUsername: () => void;
  publicKey: string | null;
  secretKey: string | null;
  isLogged: boolean;
}

export const AuthContext = React.createContext<AuthContextInterface>({} as AuthContextInterface);

const AuthContextProvider = (props: any) => {
  console.log('AuthContextProvider');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const isLogged = secretKey !== null;

  useEffect(() => {
    getUser();
  }, []);

  // LOGIN
  const loginBySecretKey = (secretKey: string) => {
    try {
      const publicKey = nostrService.getPublicKeyFromSecret(secretKey);

      const user: User = { publicKey, secretKey };
      setUser(user);
    } catch (e) {
      alert(e);
    }
  };

  const loginByUsername = () => {
    try {
      const keyPair = nostrService.generateKeyPair();

      const user: User = { publicKey: keyPair.publicKey, secretKey: keyPair.secretKey };
      setUser(user);
    } catch (e) {
      alert(e);
    }
  };

  const logout = async () => {
    removeUser();
  };

  // USER
  const getUser = async () => {
    userStoreService
      .getUser()
      .then((user) => {
        setPublicKey(user.publicKey);
        setSecretKey(user.secretKey);
        setIsLoading(false);
      })
      .catch(() => {
        console.log('No user stored');
        setIsLoading(false);
      });
  };

  const setUser = (user: User) => {
    setPublicKey(user.publicKey);
    setSecretKey(user.secretKey);
    userStoreService.setUser(user).catch((e) => {
      alert(e.message);
    });
  };

  const removeUser = () => {
    setPublicKey(null);
    setSecretKey(null);
    userStoreService.removeUser().catch((e) => {
      alert(e.message);
    });
  };

  const api = {
    isLoading,
    logout,
    loginBySecretKey,
    loginByUsername,
    publicKey,
    secretKey,
    isLogged,
  };

  return <AuthContext.Provider value={api}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
