import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Main from './components/Main';
import Home from './components/Home';
import Login from './components/Login';
import AccountDetails from './components/AccountDetails';
import { Helmet } from 'react-helmet';
import Groups from './components/Groups';
import CreateGroup from './components/CreateGroup';

// import { Login } from './Components/Login';
//import Profile from './components/Profile';

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
    <>
      <Helmet>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#dfd2b6' />
        <meta name='theme-color' content='#DFD2B6' />
      </Helmet>
      <AuthContextProvider>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/main' component={Main} />
            <Route exact path='/profile' component={AccountDetails} />
            <Route exact path='/groups' component={Groups} />
            <Route exact path='/createGroup' component={CreateGroup} />
          </Switch>
        </Router>
      </AuthContextProvider>
    </>
  );
}

export default App;
