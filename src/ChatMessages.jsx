import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      let response = await fetch("/messages");
      let responseBody = await response.text();

      let parsed = JSON.parse(responseBody);

      this.props.dispatch({
        type: "set-messages",
        messages: parsed
      });
    };
    setInterval(updateMessages, 500);
  };
  render = () => {
    let msgToElement = e => (
      <li>
        {e.timestamp}| <b>{e.username} </b>:
        {e.message.includes(".gif") ? <img src={e.message}></img> : e.message}
      </li>
    );
    let newArray = this.props.messages.slice(-20);
    return <div>{newArray.map(msgToElement)}</div>;
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs,
    user: state.deleteUser
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
