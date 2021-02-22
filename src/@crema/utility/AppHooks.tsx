import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {auth as firebaseAuth} from '../services/auth/firebase/firebase';
import {AppState} from '../../redux/store';
import {UPDATE_FIREBASE_USER} from '../../types/actions/Auth.actions';

export const useAuthToken = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const {user} = useSelector<AppState, AppState['auth']>(({auth}) => auth);
  const authUser = user;
  useEffect(() => {
    const firebaseCheck = () =>
      new Promise((resolve) => {
        firebaseAuth.onAuthStateChanged((authUser) => {
          if (authUser) {
            dispatch({
              type: UPDATE_FIREBASE_USER,
              payload: {
                uid: authUser.uid,
                displayName: authUser.displayName,
                email: authUser.email,
                photoURL: authUser.photoURL,
                token: authUser.refreshToken,
              },
            });
          }
          resolve(null);
        });
        return Promise.resolve();
      });
    const checkAuth = () => {
      Promise.all([firebaseCheck()]).then(() => {
        setLoading(false);
      });
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) {
      setToken(null);
    }
    if (authUser && authUser.token) {
      console.log('authUser.token: ', authUser.token);
      setToken(authUser.token);
    }
  }, [authUser]);

  return [token, loading];
};

export const useAuthUser = () => {
  const {user} = useSelector<AppState, AppState['auth']>(({auth}) => auth);
  if (user) {
    return user;
  }
  return null;
};
