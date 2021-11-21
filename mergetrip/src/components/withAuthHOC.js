import React from 'react';
import { Redirect } from 'react-router';
import { useAuthState } from '../firebase';

const withAuthHOC = (Component) => {
  return (props) => {
    const auth = useAuthState();

    console.log('withAuthHOC: ', auth);
    if (auth.user !== false) {
      return <Component authState={auth} {...props} />;
    } else {
      // return <p>Loading...</p>;
      return <Redirect to='/login' />;
    }
  };
};

export default withAuthHOC;
