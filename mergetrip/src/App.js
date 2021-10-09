import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Account from './components/Account';
import Navbar from './components/Navbar';


function App () {
  return (
    <><Navbar />
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/otherpage'>
        <p>Other page</p>
      </Route>
      <Route exact path='/account' component={Account} />
    </Switch></>
  );
}

export default App;
