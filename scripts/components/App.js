import "bootstrap/less/bootstrap.less";
import "../style/app.less";

import React from "react";
import { Link } from "react-router";

export class BillCreationForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          action: "submit-and-redirect"
      }
  }

  clearForm() {
      var list = document.querySelectorAll("#bill-creation-form input");
      Array.map(list, i => { i.value = ""});
  }

  onFormSubmit(event) {
      event.preventDefault();
      var e = event;

      this.handleFormEvent(event);
      if (this.state.action === "submit-and-clear") {
          this.clearForm();
      } else if (this.state.action === "submit-and-redirect"){
          this.context.router.transitionTo('bill-list');
      }
  }

  onClick(action) {
      this.state.action = action;
  }

  handleFormEvent(event) {

      var record = this.buildRecord(event);
      this.saveRecord(record);
  }

  buildRecord(event) {
      return {
          payer: event.target.payer.value,
          owers: event.target.owers.value,
          description: event.target.description.value,
          amount: event.target.amount.value,
          date: event.target.date.value
      };
  }

  /**
   * Save an existing record, or create a new one.
   **/
  saveRecord(record) {
    this.props.store.create(record);
  }

  render() {
    return (
      <form id="bill-creation-form" onSubmit={this.onFormSubmit.bind(this)}>
          <div className="form-group">
              <label htmlFor="payer">payer</label>
              <input id="payer" className="form-control" name="payer" type="text" />
          </div>
          <div className="form-group">
              <label htmlFor="owers">owers</label>
              <input id="owers" className="form-control" name="owers" type="text" />
          </div>
          <div className="form-group">
              <label htmlFor="amount">amount</label>
              <input id="amount" className="form-control" name="amount" type="float" />
          </div>
          <div className="form-group">
              <label htmlFor="description">description</label>
              <input id="description" className="form-control" name="description" type="text" />
          </div>
          <div className="form-group">
              <label htmlFor="date">date</label>
              <input id="date" className="form-control" name="date" type="date" />
          </div>

          <button type="submit" className="btn btn-primary" onClick={() => this.onClick("submit-and-redirect") }>Submit</button>
          <button type="submit" className="btn btn-default" onClick={() => this.onClick("submit-and-clear") }>Submit and add a new one</button>
      </form>
    );
  }
}

// Hackety hack in order to inject the router object in the context.
BillCreationForm.contextTypes = {
  router: React.PropTypes.func
};

export class BillList extends React.Component {

  static get defaultProps() {
    return {items: []};
  }

  render() {
    return (
      <div id="bill-list">
          <table className="table table-striped">
              <thead>
                  <tr><th>Who paid?</th><th>What?</th><th>How much?</th><th>For whom?</th><th>Date</th></tr>
              </thead>
              <tbody>
              {
                this.props.items.map((item, i) => {
                  return (
                    <tr key={i} className="bill" data-status={item._status}>
                        <td>{item.payer}</td>
                        <td>{item.description}</td>
                        <td>{item.amount}</td>
                        <td>{item.owers}</td>
                        <td>{item.date}</td>
                    </tr>
                  );
                })
              }
              </tbody>
          </table>
      </div>
    );
  }
}

export class Distribution extends React.Component {

  static get defaultProps() {
    return {items: []};
  }

  calculateDistribution() {
    // For each item.
    var people = {};
    for(var i = 0; i < this.props.items.length; i++) {
      var item = this.props.items[i];
      // Get a list of people
      if (!people.hasOwnProperty(item.payer)) {
        people[item.payer] = {"credits": 0, "debits": 0, "balance": 0};
      }

      var owers = item.owers.split(',');
      var numParticipants = owers.length + 1;
      var sumForEach = item.amount / numParticipants;

      // For each people get a list of credits and debits
      people[item.payer].credits += parseFloat(item.amount);
      // Payer also pay a part of the amount
      people[item.payer].debits += [parseFloat(sumForEach)];

      for(var j = 0; j < owers.length; j++) {
        var ower = owers[j].trim();
        if (!people.hasOwnProperty(ower)) {
          people[ower] = {"credits": 0, "debits": 0, "balance": 0};
        }
        // Each ower owe a part of the money
        people[ower].debits += parseFloat(sumForEach);
      }
    }

    Object.size = function(obj) {
      var size = 0, key;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };

    // Calculate the balance
    var creditBalances = {};
    var debitBalances = {};

    for (var person in people) {
      if (people.hasOwnProperty(person)) {
        var balance = people[person].credits - people[person].debits;
        if (balance > 0) {
          if (!creditBalances.hasOwnProperty(balance)) {
            creditBalances[balance] = [];
          }
          creditBalances[balance].push(person);
        } else if (balance < 0) {
          balance = balance * -1;
          if (!debitBalances.hasOwnProperty(balance)) {
            debitBalances[balance] = [];
          }
          debitBalances[balance].push(person);
        }
      }
    }

    // Check if some debit equals some credits
    var operations = [];

    console.log(debitBalances, creditBalances, Object.size(debitBalances));

    while (Object.size(debitBalances) > 0) {
      for(var credit in creditBalances) {
        if (debitBalances.hasOwnProperty(credit) &&
            creditBalances.hasOwnProperty(credit)) {
           operations.push({
             from: debitBalances[credit].pop(),
             to: creditBalances[credit].pop(),
             amount: parseFloat(credit)
           });
           if (creditBalances[credit].length === 0) {
             delete creditBalances[credit];
           }
           if (debitBalances[credit].length === 0) {
             delete debitBalances[credit];
           }
        }
      }

      function max(balance) {
        var maxBalance = 0;
        for (var amount in balance) {
          if (balance.hasOwnProperty(amount)) {
            if (parseFloat(amount) > parseFloat(maxBalance)) {
              maxBalance = amount;
            }
          }
        }
        return maxBalance;
      }


      // Take maximum credit and remove maximum debit
      var maxCredits = max(creditBalances);
      var maxDebits = max(debitBalances);

      var debitPerson = debitBalances[maxDebits].pop()
      var creditPerson = creditBalances[maxCredits].pop();

      creditAmount = parseFloat(maxCredits);
      debitAmount = parseFloat(maxDebits);

      console.log(creditPerson, maxCredits, debitPerson, maxDebits, maxCredits > maxDebits, maxCredits < maxDebits, maxDebits < maxCredits, maxCredits < maxDebits, creditAmount < debitAmount);

      if (creditAmount > debitAmount) {
        operations.push({
          from: debitPerson,
          to: creditPerson,
          amount: debitAmount
        });
        var newCredit = creditAmount - debitAmount;
        console.log(maxCredits, maxDebits, newCredit);
        if (!creditBalances.hasOwnProperty(newCredit)) {
          creditBalances[newCredit] = [];
        }
        creditBalances[newCredit].push(creditPerson);
        if (creditBalances[maxCredits].length === 0) {
          delete creditBalances[maxCredits];
        }
        if (debitBalances[maxDebits].length === 0) {
          delete debitBalances[maxDebits];
        }
      } else {
        operations.push({
          from: debitPerson,
          to: creditPerson,
          amount: creditAmount
        });
        var newDebit = debitAmount - creditAmount;
        console.log(maxCredits, maxDebits, newDebit);
        if (!debitBalances.hasOwnProperty(newDebit)) {
          debitBalances[newDebit] = [];
        }
        debitBalances[newDebit].push(debitPerson);
        if (creditBalances.hasOwnProperty(maxCredits) &&
            creditBalances[maxCredits].length === 0) {
          delete creditBalances[maxCredits];
        }
        if (debitBalances.hasOwnProperty(maxDebits) &&
            debitBalances[maxDebits].length === 0) {
          delete debitBalances[maxDebits];
        }
      }
    }
    // Write down a list of operations
    return operations;
  }

  render() {
    var distribution = this.calculateDistribution();
    return (
      <div id="distribution">
        <ul>
          {
            distribution.map((item, i) => {
              return (<li key={i}>{item.from} need to give {item.amount} to {item.to}</li>);
            })
          }
        </ul>
      </div>
    );
  }
}


export class BillView extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.store.state;
  }

  componentDidMount() {
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
        <BillList items={this.state.items}/>
        <div className="error">{this.state.error}</div>
        <Link to="new-bill">HERE</Link>
        <Distribution items={this.state.items}/>
      </div>
    );
  }
}
