import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider,
} from '../../@crema/services/auth/firebase/firebase';
import {Dispatch} from 'redux';
import {AppActions} from '../../types';
import {fetchError, fetchStart, fetchSuccess} from './Common';
import {AuthUser} from '../../types/models/AuthUser';
import {
  UPDATE_FIREBASE_USER,
  UpdateAuthUserActions,
} from '../../types/actions/Auth.actions';

export const onSignUpFirebaseUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onForgetPasswordFirebaseUser = (email: string) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          dispatch(fetchSuccess());
          // dispatch({type: UPDATE_FIREBASE_USER, payload: data});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

/*export const onGetFirebaseSignInUser = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .onAuthStateChanged()
        .then((authUser) => {
          dispatch(fetchSuccess());
          const userInfo = {
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
            token: authUser.refreshToken
          };
          dispatch({
            type: UPDATE_FIREBASE_USER,
            payload: userInfo
          });

        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};*/

export const onSignInFirebaseUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onSignOutFirebaseUser = () => {
  return (dispatch: Dispatch<AppActions>) => {
    console.log('onSignOutFirebaseUser');
    dispatch(fetchStart());
    try {
      auth
        .signOut()
        .then(() => {
          dispatch(fetchSuccess());
          dispatch({type: UPDATE_FIREBASE_USER, payload: null});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const signInUserWithGoogle = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .signInWithPopup(googleAuthProvider)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};
export const signInUserWithGithub = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .signInWithPopup(githubAuthProvider)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const signInUserWithFacebook = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .signInWithPopup(facebookAuthProvider)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const signInUserWithTwitter = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      auth
        .signInWithPopup(twitterAuthProvider)
        .then((data) => {
          dispatch(fetchSuccess());
          const userInfo: AuthUser = {
            uid: data.user!.uid,
            displayName: data.user!.displayName || '',
            email: data.user!.email || '',
            photoURL: data.user!.photoURL || '',
            token: data.user!.refreshToken,
          };
          dispatch({type: UPDATE_FIREBASE_USER, payload: userInfo});
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const setCurrentUser = (
  user: AuthUser | null,
): UpdateAuthUserActions => ({
  type: UPDATE_FIREBASE_USER,
  payload: user,
});
