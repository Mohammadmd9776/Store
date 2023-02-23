import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "jquery";
import "@popperjs/core/dist/umd/popper";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter><App /></BrowserRouter>
    
  
);


