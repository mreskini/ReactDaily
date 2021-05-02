import Login from "./components/login"
import Todos from "./components/todos"
import Create from "./components/create"
import Logout from "./components/logout"

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
        <Route path="/logout" component={Logout} />
      </Switch>
    </HashRouter>
  );
}

export default App;
