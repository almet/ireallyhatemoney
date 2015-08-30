import React from "react";
import { Link } from "react-router";

export class ProjectCreationForm extends React.Component {
  clearForm() {
      var list = document.querySelectorAll("#project-creation-form input");
      Array.map(list, i => { i.value = ""});
  }

  onFormSubmit(event) {
      event.preventDefault();
      var e = event;

      this.handleFormEvent(event);
      this.clearForm();
      this.context.router.transitionTo('project-list');
  }

  handleFormEvent(event) {
      var project = this.buildProject(event);
      this.saveProject(project);
  }

  buildRecord(event) {
      var people = [];
      for (var person in event.target.owners.value.split(',')) {
        person = person.trim();
        if (person) {
          people.push(person);
        }
      }
      return {
          title: event.target.title.value,
          people: people
      };
  }

  /**
   * Save an existing record, or create a new one.
   **/
  saveRecord(record) {
    this.props.store.createProject(project);
  }

  render() {
    return (
      <form id="project-creation-form" onSubmit={this.onFormSubmit.bind(this)}>
          <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" className="form-control" name="name" type="text" />
          </div>
          <div className="form-group">
              <label htmlFor="people">Owers</label>
              <input id="people" className="form-control" name="people" type="text" />
          </div>

          <button type="submit" className="btn btn-primary">Add project</button>
      </form>
    );
  }
}

// Hackety hack in order to inject the router object in the context.
ProjectCreationForm.contextTypes = {
  router: React.PropTypes.func
};

export class Projects extends React.Component {

  static get defaultProps() {
    return {projects: []};
  }

  render() {
    return (
      <div id="projectList">
        <ul>
         {
           this.props.projects.map((project, i) => {
             return (
               <li key={i}><Link to="bill-list" params={project.name}>{project.name}</Link></li>
             );
           })
         }
        </ul>
      </div>
    );
  }
}


export class ProjectList extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.store.state;
    this.props.store.on("change", state => {
      this.setState(Object.assign({busy: false}, state));
    });
    this.props.store.on("error", error => {
      this.setState({busy: false, error: error.message});
    });
    this.props.store.load();
  }

  syncRecords() {
    this.setState({busy: true, error: ""});
    this.props.store.sync();
  }

  render() {
    var disabled = this.state.busy ? "disabled" : "";
    var projects = [];

    for(var key in this.state.projects) {
       projects.push(this.state.projects[key].data;
    }
    return (
      <div className={disabled}>
        <Projects projects={projects}/>
        <div className="error">{this.state.error}</div>
        <Link to="new-project">Add a new project</Link>
      </div>
    );
  }
}
