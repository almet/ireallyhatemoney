import React from "react";
import { Link } from "react-router";

export class BillCreationForm extends React.Component {

  onFormSubmit(event) {
    event.preventDefault();
    var record = {
        payer: event.target.payer.value,
        owers: event.target.owers.value,
        description: event.target.description.value,
        amount: event.target.amount.value,
        date: event.target.date.value
    };

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
              <input id="amount" className="form-control" name="amount" type="float" />
          </div>
          <div className="form-group">
              <label for="description">description</label>
              <input id="description" className="form-control" name="description" type="text" />
          </div>
          <div className="form-group">
              <label for="date">date</label>
              <input id="date" className="form-control" name="date" type="date" />
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-default">Submit and add a new one</button>
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
      <div id="billList">
          <table className="table">
              <thead>
                  <tr><th>Who paid?</th><th>What?</th><th>How much?</th><th>For whom?</th><th>Date</th></tr>
              </thead>
              <tbody>
              {
                this.props.items.map((item, i) => {
                  return (
                    <tr key={i}>
                        <td>{item.payer}</td>
                        <td>{item.description}</td>
                        <td>{item.amount}</td>
                        <td>{item.owers}</td>
                        <td>{item.date}</td>
                    </tr>);
                })
              }
              </tbody>
          </table>
      </div>
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
        <Bills items={this.state.items}/>
        <div className="error">{this.state.error}</div>
        <Link to="new-bill">HERE</Link>
      </div>
    );
  }
}
