import Login from "./components/login"
import Home from "./components/home"
import Create from "./components/create"

import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/create" component={Create} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
