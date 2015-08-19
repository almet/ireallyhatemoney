/*
 * Webpack inclusions.
 */
require("bootstrap/less/bootstrap.less");
require("./style/app.less")

import "babel/polyfill";
import btoa from "btoa";
import React from "react";
import { BillList, BillCreationForm } from "./components/App";
import { Store } from "./store";
import Kinto from "kinto";
import Router, { Route, DefaultRoute }  from "react-router";

// Take username from location hash (With default value):
// const project = window.location.hash = (window.location.hash.slice(1) || "public-demo");
const project = "public-demo";
const userpass64 = btoa(project + ":s3cr3t");

// Use Mozilla demo server with Basic authentication:
const server = "http://localhost:8888/v1";
const auth = "Basic " + userpass64;
const options = {
    remote: server,
    headers: {Authorization: auth}
};

const kinto = new Kinto(options);

const store = new Store(kinto, "bills");

// Make sure local data depend on current user.
// Note: Kinto.js will have an option: https://github.com/Kinto/kinto.js/pull/111
store.collection.db.dbname = userpass64 + store.collection.db.dbname;

// XXX redirect by default to the bill list.
var routes = (
    <Route>
        <DefaultRoute handler={BillList}/>
        <Route name="new-bill"
               handler={BillCreationForm} />
       <Route name="bill-list"
              handler={BillList} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler store={store}/>, document.getElementById("app"));
})
