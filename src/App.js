import { useState } from "react"
import Login from "./components/login"
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom"
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
