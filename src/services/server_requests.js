import axios from 'axios'
import { server_endpoints } from './static'
import {socket} from '../Context/SocketContext'
import {devurl} from '../dev.json'
import {produrl} from '../config.json'

let url = produrl

export function send_error(session_id,error_name,error_msg,tracer){
    socket.emit('error_reporting',{room:session_id,error_name:error_name,error_msg:error_msg,tracer:tracer})
   }

export function log_info(session_id,data_msg,tracer){
    socket.emit('logger_info',{room:session_id,data_msg:data_msg,tracer:tracer})
   }

export function get_init(session_id){
    let myurl = `${url}${server_endpoints.get_init}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(myurl).then(response => {
        if (response.data != null){
            log_info(session_id,response.data,'get_init')
            resolve(response.data)
        }
        if (response.data === null){
            log_info(session_id,'Response Data Null','get_init')
            resolve([])
        }
    })})

    return axios_request
    
}

export function get_spells(session_id){
    
    let myurl = `${url}${server_endpoints.get_spells}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(myurl).then(response => {
        if (response.data != null){
            log_info(session_id,response.data,'get_spells')
            resolve(response.data)
        }
        if (response.data === null){
            log_info(session_id,'Response Data Null','get_spells')
            resolve([])
        }
    })})

    return axios_request
    
}

export async function round_start(session_id){
   
    let myurl = `${url}${server_endpoints.roundstart}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(myurl).then(response => {
        if (response.data != null){
            log_info(session_id,response.data,'round_start')
            resolve(response.data)
        }
        if (response.data === null){
            log_info(session_id,'Response Data Null','round_start')
            resolve([])
        }
    }).catch(error => {
        resolve([])
        send_error(session_id,error.name,error,'round_start')
    })
})
    return axios_request

}



