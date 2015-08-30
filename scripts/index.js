/*
 * Webpack inclusions.
 */
require("bootstrap/less/bootstrap.less");
require("./style/app.less")

import "babel/polyfill";
import btoa from "btoa";
import React from "react";
import { LoginForm } from "./components/Login";
import { ProjectList, ProjectCreationForm } from "./components/Project";
import { BillList, BillCreationForm } from "./components/Bill";
import { Store } from "./store";
import Kinto from "kinto";
import Router, { Route, DefaultRoute }  from "react-router";

// Use Mozilla demo server with Basic authentication:
const server = "https://kinto.dev.mozaws.net/v1";
const options = {
  remote: server
};

const kinto = new Kinto(options);

const store = new Store(kinto);

var routes = (
    <Route>
        <DefaultRoute handler={LoginForm}/>
        <Route name="login"
               handler={LoginForm} />
        <Route name="new-project"
               handler={ProjectCreationForm} />
       <Route name="project-list"
              handler={ProjectList} />
        <Route name="new-bill"
               handler={BillCreationForm} />
       <Route name="bill-list"
              handler={BillList} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler store={store}/>, document.getElementById("app"));
})
