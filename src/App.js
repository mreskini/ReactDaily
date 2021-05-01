import { useState } from "react"
import Login from "./components/login"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <div>
      {
        isLoggedIn ? <p>Home Screen</p> : <Login />
      }
    </div>
  );
}

export default App;
