import React, { Component } from "react";
import { connect } from "react-redux";
import Users from "./Users.jsx";
import Signup from "./Signup.jsx";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
class UnconnectedApp extends Component {
  componentDidMount = async () => {
    let response = await fetch("/auto-login");
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.logged) {
      this.props.dispatch({
        type: "login-success"
      });
    }
  };
  render = () => {
    if (this.props.lgin) {
      return (
        <div className="container">
          
          <div className="chat-main">
            <ChatMessages />
          </div>
          <div className="inputbox">
            <ChatForm />
          </div>
          <div className="sidebar">
            <Users className="users" />
          </div>
        </div>
      );
    }
    return (
      <div className="main">
        <h1>Signup</h1>
        <Signup />
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
