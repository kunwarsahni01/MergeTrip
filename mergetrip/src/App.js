import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Account from './components/Account';
import Main from './components/Main';

function App () {
  return (
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/otherpage'>
        <p>Other page</p>
      </Route>
      <Route exact path='/account' component={Account} />
      <Route exact path='/main' component={Main} />
    </Switch>
  );
}

export default App;
