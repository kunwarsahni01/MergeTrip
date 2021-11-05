import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Main from './components/Main';
import Home from './components/Home';
import NewLogin from './components/NewLogin';
// import { Login } from './Components/Login';
import Profile from './components/Profile';

import { AuthContextProvider, useAuthState } from './firebase';
import './App.css';

const AuthenticatedRoute = ({ component: C, ...props }) => {
  const auth = useAuthState();
  const isAuthenticated = auth;
  console.log(`AuthenticatedRoute: ${isAuthenticated}`);
  return (
    <Route
      {...props}
      render={routeProps =>
        isAuthenticated ? <C {...routeProps} /> : <Redirect to='/login' />}
    />
  );
};

const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log(`UnauthenticatedRoute: ${isAuthenticated}`);
  return (
    <Route
      {...props}
      render={routeProps =>
        !isAuthenticated ? <C {...routeProps} /> : <Redirect to='/' />}
    />
  );
};

function App () {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={NewLogin} />
          <AuthenticatedRoute exact path='/main' component={Main} />
          <Route exact path='/profile' component={Profile} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
