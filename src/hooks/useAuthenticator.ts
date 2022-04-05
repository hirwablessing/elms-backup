import { AxiosError } from 'axios';
import { create, isSet } from 'lodash';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { queryClient } from '../plugins/react-query';
import { authenticatorStore } from '../store/administration';
import { LoginInfo, Response } from '../types';
import { AuthUser } from '../types/services/user.types';
import cookie from '../utils/cookie';
let created = false;

export default function useAuthenticator() {
  const [user, setUser] = useState<AuthUser>();
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [_isError, setIsError] = useState(false);
  const [_error, setError] = useState<AxiosError<Response>>();
  const [userAvailabe, setUserAvailable] = useState(false);
  const { refetch } = authenticatorStore.authUser(false);
  const { mutateAsync } = authenticatorStore.login();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const history = useHistory();
  const [isSettingUser, setIsSettingUser] = useState(false);

  const fetchData = useCallback(async () => {
    setIsUserLoading(true);
    const { data, isSuccess, isError, error } = await refetch();
    console.log(
      user?.id,
      data?.data.data.id,
      data?.data.data.id != user?.id,
      isSettingUser,
      isError,
      isError,
      data,
      isUserLoading,
    );

    const context = useContext();
    console.log(context, 'context');

    if (isSuccess && data?.data.data.id != user?.id && !isSettingUser) {
      console.log('confirmations');
      setUser((_old) => {
        console.log('trapish', data?.data.data);
        setIsSettingUser(true);
        return data?.data.data;
      });
      setUserAvailable(true);
    }

    if (error) setError(error as AxiosError);

    setIsError(isError);
    setIsUserLoading(false);
  }, [isSettingUser, isUserLoading, refetch, user?.id]);

  useEffect(() => {
    if (!created) {
      fetchData();
      created = true;
    }
    console.log('authenticator triggered , useEffect', user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(user, 'user has changed');
  }, [user]);

  async function login<T>(e: FormEvent<T>, details: LoginInfo) {
    e.preventDefault();

    setIsLoggingIn(true);
    const toastId = toast.loading('Authenticating...');
    logout();

    await mutateAsync(details, {
      async onSuccess(data) {
        cookie.setCookie('jwt_info', JSON.stringify(data?.data.data));
        setIsLoggingIn(false);
        await fetchData();
        toast.success(data.data.message, { duration: 1200, id: toastId });
        redirectTo('/redirecting');
      },
      onError(error) {
        setIsLoggingIn(false);
        console.log(error);
        toast.error('Authentication failed', { duration: 3000, id: toastId });
      },
    });
  }

  function logout() {
    setUser(undefined);
    setUserAvailable(false);
    queryClient.clear();
    cookie.eraseCookie('jwt_info');
    cookie.eraseCookie('user_role');
  }

  const redirectTo = (path: string) => {
    history.push(path);
  };

  return {
    user,
    userLoading: isUserLoading,
    userAvailabe,
    isLoggingIn,
    login,
    logout,
    isError: _isError,
    error: _error,
  };
}
