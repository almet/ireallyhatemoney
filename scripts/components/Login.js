import btoa from "btoa";
import localStorage from "localStorage";
import React from "react";
import { Link } from "react-router";

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    var authorization = localStorage.getItem("Authorization");
    if (authorization) {
      this.props.store.setAuth();
      this.context.router.transitionTo('project-list');
    }
  }

  onFormSubmit(event) {
      event.preventDefault();
      this.handleFormEvent(event);
      this.context.router.transitionTo('project-list');
  }

  handleFormEvent(event) {
    var username = event.target.username.value;
    var password = event.target.password.value;
    localStorage.setItem("Authorization", btoa(username + ":" + password));
    this.props.store.setAuth();
  }


  render() {
    return (
      <div id="login" className="container">
        <div className="row">
          <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">
            <h1>I really hate money</h1>
            <form id="login-form" onSubmit={this.onFormSubmit.bind(this)}>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon"><i className="fa fa-user"></i></div>
                    <input type="text" name="username" placeholder="Identifiant" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon"><i className="fa fa-lock"></i></div>
                    <input type="password" name="password" placeholder="Password" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// Hackety hack in order to inject the router object in the context.
LoginForm.contextTypes = {
  router: React.PropTypes.func
};
