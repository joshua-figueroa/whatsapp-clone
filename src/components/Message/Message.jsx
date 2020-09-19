import React from "react";
import { Avatar } from "@material-ui/core";
import moment from "moment";

import "./styles.css";
import { useStateValue } from "../../util/StateProvider";

export default function Message({ message }) {
    const [{ user }] = useStateValue();
    const self = user.uid === message?.data.userID;

    const formatTime = (unixTimestamp) => {
        if (unixTimestamp) return moment.unix(unixTimestamp).local(true).format("h:mm A");
        else return "";
    };

    return (
        <div className={`message ${self ? "sent" : "receive"}`}>
            {!self && <Avatar src={message?.data.userImage} className="message__avatar" />}
            <div className="message__body">
                {!self && <span className="message__name">{message?.data.name}</span>}
                <div className="message__bubble">
                    <span className="message__text">{message?.data.content}</span>
                    <span className="message__timestamp">{formatTime(message.data?.timestamp)}</span>
                </div>
            </div>
        </div>
    );
}
