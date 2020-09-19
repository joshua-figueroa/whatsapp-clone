import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";

import "./styles.css";
import db from "../../util/firebase";
import { useStateValue } from "../../util/StateProvider";

export default function Conversation({ seed, name, roomID }) {
    const [{ user }] = useStateValue();
    const [message, setMessage] = useState();

    useEffect(() => {
        db.collection("rooms")
            .doc(roomID)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => setMessage(snapshot.docs[snapshot.docs.length - 1]?.data()));
    });

    const truncate = (str) => {
        if (str.length > 60) return str.substring(0, 60) + "...";
        else return str;
    };

    const lastMessage = (message) => {
        if (!message) return "";
        const content = truncate(message?.content);

        if (message.userID === user.uid) return `You: ${content}`;
        return `${message.name}: ${content}`;
    };

    return (
        <div className="conversation">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="conversation__info">
                <h3>{name}</h3>
                <p>{lastMessage(message)}</p>
            </div>
        </div>
    );
}
