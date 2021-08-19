import React,{createContext} from 'react'
import {socket_url} from '../config.json'



const io = require("socket.io-client");



export const socket = io(socket_url)

export const SocketContext = createContext(socket);