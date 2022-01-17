import {createContext} from 'react'
import {devsocket_url} from '../dev.json'
// eslint-disable-next-line no-unused-vars
import {socket_url} from '../config.json'



const io = require("socket.io-client");



export const socket = io(devsocket_url)

export const SocketContext = createContext(socket);