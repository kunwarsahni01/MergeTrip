import logo from './logo.svg';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App () {
  return (
    <Switch>
      <Route exact path='/'>
        {/* we can replace pages here */}
        <p>home page</p>
      </Route>
      <Route exact path='/otherpage'>
        <p>Other page</p>
      </Route>
    </Switch>
  );
}

export default App;
