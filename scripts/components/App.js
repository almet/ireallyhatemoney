import React from "react";
import { Link } from "react-router";
import mixin from "react-mixin";

export class BillCreationForm extends React.Component {

  onFormSubmit(event) {
    event.preventDefault();
    var record = {label: event.target.label.value};
    this.updateRecord(record);
  }

  updateRecord(record) {
    this.props.store.create(record);
  }

  render() {
    return (
      <form id="bill-creation-form" onSubmit={this.onFormSubmit.bind(this)}>
          <div className="form-group">
              <label for="payer">payer</label>
              <input id="payer" className="form-control" name="payer" type="text" />
          </div>
          <div className="form-group">
              <label for="owers">owers</label>
              <input id="owers" className="form-control" name="owers" type="text" />
          </div>
          <div className="form-group">
              <label for="amount">amount</label>
              <input id="amount" className="form-control" name="amount" type="text" />
          </div>
          <div className="form-group">
              <label for="description">description</label>
              <input id="description" className="form-control" name="description" type="text" />
          </div>
          <div className="form-group">
              <label for="date">date</label>
              <input id="date" className="form-control" name="date" type="date" />
          </div>

        <button type="submit">Create a new bill</button>
      </form>
    );
  }
}


export class Bills extends React.Component {

  static get defaultProps() {
    return {items: []};
  }

  render() {
    return (
      <ul>{
        this.props.items.map((label, i) => {
          return <li key={i}>{label}</li>;
        })
      }</ul>
    );
  }
}


export class BillList extends React.Component {

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
    return (
      <div className={disabled}>
        <Bills items={this.state.items.map(item => item.label)}/>
        <div className="error">{this.state.error}</div>
        <Link to="new-bill">HERE</Link>
      </div>
    );
  }
}
