import React from 'react';
import { Redirect } from 'react-router';
import { useAuthState } from '../firebase';

const withAuthHOC = (Component) => {
  return (props) => {
    const auth = useAuthState();

    console.log('withAuthHOC: ', auth);
    if (auth.user === null) {
      // firebase auth state is not yet determined
      return <p>Loading...</p>;
    } else if (auth.user === false) {
      // user not logged in
      return <Redirect to='/login' />;
    } else {
      // return <p>Loading...</p>;
      return <Component authState={auth} {...props} />;
    }
  };
};

export default withAuthHOC;
