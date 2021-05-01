import Login from "./components/login"
import Todos from "./components/home"
import Create from "./components/create"
import {
  HashRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
            <Redirect to="/login"/>
        </Route>
        <Route path="/todos" component={Todos} />
        <Route path="/login" component={Login} />
        <Route path="/create" component={Create} />
      </Switch>
    </HashRouter>
  );
}

export default App;
