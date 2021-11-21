import React from 'react';
import { Redirect } from 'react-router';
import { useAuthState } from '../firebase';

const withoutAuthHOC = (Component) => {
  return (props) => {
    const auth = useAuthState();

    if (auth.user === false) {
      return <Component authState={auth} {...props} />;
    } else {
      return <Redirect to='/main' />;
    }
  };
};

export default withoutAuthHOC;
