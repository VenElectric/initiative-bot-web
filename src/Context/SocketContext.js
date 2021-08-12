import React,{createContext} from 'react'
const io = require("socket.io-client");


export const socket = io("https://dungeon-bot-server.herokuapp.com")
// export const socket = io("http://localhost:8000")
export const SocketContext = createContext(socket);