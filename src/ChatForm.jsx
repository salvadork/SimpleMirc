import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();
    data.append("msg", this.state.message);
    let response = await fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("Go back you HACKER");
      return;
    }
  };
  removeMessages = async event => {
    event.preventDefault();
    let response = await fetch("/currentuser");
    let responseBody = JSON.parse(await response.text());
  };
  logOut = async event => {
    event.preventDefault();
    let response = await fetch("/logout");
    let responseBody = JSON.parse(await response.text());
    this.props.dispatch({
      type: "log-out"
    });
  };
  render = () => {
    return (
      <div className="box">
        <form onSubmit={this.handleSubmit}>
          <input class="myButton" type="submit" />
          <input
            class="typebox"
            onChange={this.handleMessageChange}
            type="text"
          />
        </form>
        <form onClick={this.logOut}>
          <input class="myButton" type="submit" value="Log off" />
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    messages: state.msgs
  };
};
let ChatForm = connect(mapStateToProps)(UnconnectedChatForm);
export default ChatForm;
