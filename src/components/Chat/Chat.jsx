/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";
import moment from "moment";
import ScrollableFeed from "react-scrollable-feed";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import "./styles.css";
import db from "../../util/firebase";
import { Message } from "..";
import { useStateValue } from "../../util/StateProvider";

export default function Chat() {
    const textInput = useRef();
    const [{ user }] = useStateValue();
    const { roomID } = useParams();
    const { transcript, resetTranscript } = useSpeechRecognition();

    const [room, setRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        db.collection("rooms")
            .doc(roomID)
            .onSnapshot((snapshot) => {
                const room = snapshot.data();
                setRoom({
                    name: room.name,
                    seed: room.seed,
                    seen: room.seen,
                    active: room.active,
                });
            });

        db.collection("rooms")
            .doc(roomID)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );

        return () => {
            db.collection("rooms").doc(roomID).update({ active: false });
        };
    }, [roomID]);

    useEffect(() => {
        textInput.current.focus();
        textInput.current.value = transcript;
        setText(transcript);
    }, [transcript]);

    const formatTime = (unixTimestamp) => {
        if (unixTimestamp) return moment.unix(unixTimestamp).local(true).format("h:mm A");
        else return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        text.trim();

        if (text) {
            db.collection("rooms").doc(roomID).collection("messages").add({
                name: user.displayName,
                userID: user.uid,
                userImage: user.photoURL,
                content: text,
                timestamp: new Date(),
            });

            db.collection("rooms").doc(roomID).update({
                active: true,
                seen: new Date(),
            });
        }

        textInput.current.value = "";
        setText("");
    };

    const speechToText = () => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) return null;

        resetTranscript();
        SpeechRecognition.startListening();
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${room?.seed}.svg`} />
                <div className="chat__header__info">
                    <h3>{room?.name}</h3>
                    <p>{room?.active ? "Active Now" : room?.seen && "Last seen at " + formatTime(room.seen)}</p>
                </div>
                <div className="chat__header__icons">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <ScrollableFeed className="chat__body" forceScroll>
                {messages.length === 0 ? (
                    <p>No Messages</p>
                ) : (
                    messages?.map((message) => <Message message={message} key={message.id} />)
                )}
            </ScrollableFeed>
            <div className="chat__input">
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <form>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message"
                        ref={textInput}
                    />
                    <button type="submit" onClick={handleSubmit}>
                        Send a message
                    </button>
                </form>
                <IconButton onClick={speechToText}>
                    <Mic />
                </IconButton>
            </div>
        </div>
    );
}
