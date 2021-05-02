import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { createStore } from "redux"
import { Provider } from "react-redux"
import mainReducer from "./reducers/mainReducer"
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

const store = createStore(mainReducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

