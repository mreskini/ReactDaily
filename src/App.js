import Login from "./components/login"
import Todos from "./components/todos"
import Create from "./components/create"
import Logout from "./components/logout"
import Edit from "./components/edit"

import {
  HashRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { ProtectedRoute } from "./protectedRoute"
import PageNotFound from "./pageNotFound"

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
        <ProtectedRoute path="/create/:label_id" component={Create} />
        <ProtectedRoute path="/edit/:todo_id" component={Edit} />
        <Route path="/" component={PageNotFound} />
      </Switch>
    </HashRouter>
  )
}

export default App
