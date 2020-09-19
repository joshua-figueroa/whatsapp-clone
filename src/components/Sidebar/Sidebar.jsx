/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import { DonutLarge, Chat, MoreVert, SearchOutlined, Add } from "@material-ui/icons";

import "./styles.css";
import { Conversation } from "..";
import db from "../../util/firebase";
import { useStateValue } from "../../util/StateProvider";

export default function Sidebar() {
    const seed = Math.floor(Math.random() * 5000);
    const [{ user }] = useStateValue();
    const [rooms, setRooms] = useState([]);
    const [searchRooms, setSearchRooms] = useState([]);
    const [text, setText] = useState("");
    const textInput = useRef();

    useEffect(() => {
        db.collection("rooms")
            .orderBy("seen", "desc")
            .onSnapshot((snapshot) => {
                setRooms(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                );

                setSearchRooms(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                );
            });
    }, []);

    useEffect(() => {
        setSearchRooms(rooms.filter((room) => room.data.name.search(text.trim()) !== -1));

        return () => {
            setSearchRooms(rooms);
        };
    }, [text]);

    const addChat = () => {
        const roomName = prompt("Enter the name for the chat room");

        if (roomName) {
            db.collection("rooms").add({
                name: roomName,
                seed,
                seen: new Date(),
                active: false,
            });
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user.photoURL} />
                <div className="sidebar__icons">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input
                        type="text"
                        placeholder="Search Conversation"
                        onChange={(e) => setText(e.target.value)}
                        ref={textInput}
                        value={text}
                    />
                </div>
            </div>
            <div className="sidebar__chats">
                {searchRooms?.length === 0 ? (
                    <span>Selected room can't be found</span>
                ) : (
                    searchRooms?.map((room) => (
                        <Link to={`/room/${room.id}`} key={room.id}>
                            <Conversation name={room.data.name} seed={room.data.seed} roomID={room.id} />
                        </Link>
                    ))
                )}
                <div className="sidebar__addChat">
                    <IconButton onClick={addChat}>
                        <Add />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
