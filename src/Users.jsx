import React, { Component } from "react";
import { connect } from "react-redux";

export class UnconnectedUsers extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      let response = await fetch("/active-users");
      let responseBody = await response.text();
      let parsed = JSON.parse(responseBody);

      this.props.dispatch({
        type: "active-users",
        messages: parsed
      });
    };
    setInterval(updateMessages, 500);
  };
  handleQuery = evt => {
    this.props.dispatch({ type: "query", q: evt.target.value });
  };

  render() {
    let results = this.props.messages.filter(item => {
      return item.includes(this.props.query);
    });
    return (
      <div>
        <div>
          <form>
            <input
              class="sidebar-input"
              type="text"
              onChange={this.handleQuery}
              placeholder="Search user..."
            ></input>
          </form>
        </div>
        <div class="active">Active Users</div>
        {results.map(x => {
          return <li> {x} </li>;
        })}
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    messages: state.activeUsers,
    query: state.searchQuery
  };
};
let Users = connect(mapStateToProps)(UnconnectedUsers);

export default Users;
