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
import { ProtectedRoute } from "./protectedRoute"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/todos" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <ProtectedRoute path="/todos" component={Todos} />
        <ProtectedRoute path="/create" component={Create} />
      </Switch>
    </HashRouter>
  );
}

export default App;
