import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Store from "./components/Store";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Switch } from "react-router";
import NavBar from "./components/NavBar";
import { useReducer, useState } from "react";
import UserContext from "./UserContext";
import Products from "./components/Products";

let initialState = {
  isLoggedIn: false,
  currentUserId: null,
  currentUserName: null,
  currentRole: null,
};
let reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        isLoggedIn: true,
        currentUserId: action.payload.currentUserId,
        currentUserName: action.payload.currentUserName,
        currentRole: action.payload.currentRole,
      };
      case 'logout':return{
        isLoggedIn: false,
        currentUserId: null,
        currentUserName: null,
        currentRole: null,

      }
  }
  return state;
};
function App() {
 
  const [user, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      <NavBar />
      <div className="container-fluid">
        <Switch>
          <Route exact path="/" component={Login} />

          <Route path="/dashboard" component={Dashboard} />

          <Route path="/register" component={Register} />
          <Route path="/store" component={Store} />
          <Route path="/products" component={Products} />

          <Route path="/*" component={NotFound} />
        </Switch>
      </div>
    </UserContext.Provider>
  );
}

export default App;
