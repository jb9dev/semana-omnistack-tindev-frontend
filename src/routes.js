import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login";
import Main from "./pages/Main";

export default function routes() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <Route exact path="/devs/:id" component={Main} />
    </BrowserRouter>
  );
}
