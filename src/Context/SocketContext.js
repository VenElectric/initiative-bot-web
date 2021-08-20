import React,{createContext} from 'react'
import {devsocket_url} from '../dev.json'
import {socket_url} from '../config.json'



const io = require("socket.io-client");



export const socket = io(socket_url)

export const SocketContext = createContext(socket);