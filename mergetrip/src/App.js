import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

function App () {
  return (
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/otherpage'>
        <p>Other page</p>
      </Route>
    </Switch>
  );
}

export default App;
