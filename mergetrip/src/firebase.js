import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useState, useEffect, useContext, createContext } from 'react';

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDsF7RMtwacYeIGbEz3X_9Z8SNLAqSB30M',
  authDomain: 'mergetrip.io',
  projectId: 'mergetrip-66b11',
  databaseURL: 'https://mergetrip-66b11-default-rtdb.firebaseio.com/',
  storageBucket: 'mergetrip-66b11.appspot.com',
  messagingSenderId: '14509175384',
  appId: '1:14509175384:web:b98365cafeb4db7e56d02d',
  measurementId: 'G-1MW1Z2SLT1'
});

// set persistance
// const auth = getAuth();
// setPersistence(auth, browserSessionPersistence)
//   .then(() => {
//     console.log('Persistance Set');
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
// const analytics = getAnalytics(app);

export const AuthContext = createContext();

export const AuthContextProvider = props => {
  // const [user, setUser] = useState();
  // const [error, setError] = useState();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
  //   return () => unsubscribe();
  // }, []);
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth} {...props}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  // const auth = useContext(AuthContext);
  // return { ...auth, isAuthenticated: auth.user != null };
  return useContext(AuthContext);
};

function useProvideAuth () {
  const [user, setUser] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = async (email, password) => {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  };

  const signup = async (email, password) => {
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const logout = async () => {
    return await firebase
      .auth()
      .signOut();
  };

  const sendPasswordResetEmail = async email => {
    return await firebase
      .auth()
      .sendPasswordResetEmail(email);
  };

  const confirmPasswordReset = async (code, password) => {
    return await firebase
      .auth()
      .confirmPasswordReset(code, password);
  };

  const loginWithGoogle = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return await firebase
      .auth()
      .signInWithPopup(googleProvider);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    login,
    signup,
    logout,
    loginWithGoogle,
    sendPasswordResetEmail,
    confirmPasswordReset
  };
}
