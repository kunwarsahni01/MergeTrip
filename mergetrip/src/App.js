import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Account from './components/Account';
import Main from './components/Main';
import { Helmet } from "react-helmet";

function App() {
  return (
    <div>
      <Helmet>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#dfd2b6" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/otherpage'>
          <p>Other page</p>
        </Route>
        <Route exact path='/account' component={Account} />
        <Route exact path='/main' component={Main} />
      </Switch>
    </div>
  );
}

export default App;
