import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { initializeApp } from 'firebase/app'
import { useState, useEffect, useContext, createContext } from 'react'
import { browserSessionPersistence, setPersistence } from '@firebase/auth';

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyDsF7RMtwacYeIGbEz3X_9Z8SNLAqSB30M",
    authDomain: "mergetrip.io",
    projectId: "mergetrip-66b11",
    databaseURL: "https://mergetrip-66b11-default-rtdb.firebaseio.com/",
    storageBucket: "mergetrip-66b11.appspot.com",
    messagingSenderId: "14509175384",
    appId: "1:14509175384:web:b98365cafeb4db7e56d02d",
    measurementId: "G-1MW1Z2SLT1"
})

//set persistance
const auth = getAuth();
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistance Set");
  })
  .catch((error) => {
    console.log(error.message);
  })
// const analytics = getAnalytics(app);

export const AuthContext = createContext()

export const AuthContextProvider = props => {
    const [user, setUser] = useState()
    const [error, setError] = useState()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
        return () => unsubscribe()
    }, [])
    return <AuthContext.Provider value={{ user, error }} {...props} />
}

export const useAuthState = () => {
    const auth = useContext(AuthContext)
    return { ...auth, isAuthenticated: auth.user != null }
}