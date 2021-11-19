import React from 'react';
import { useAuthState } from '../firebase';

const withAuthHOC = (Component) => {
  return (props) => {
    const auth = useAuthState();

    if (auth.user) {
      return <Component authState={auth} {...props} />;
    } else {
      return <p>Loading...</p>;
    }
  };
};

export default withAuthHOC;
