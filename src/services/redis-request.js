import axios from 'axios'
import { server_endpoints } from './static'


export function get_init(session_id){
    console.log(session_id)
    let url = `http://localhost:8000${server_endpoints.get_init}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(url).then(response => {
        if (response.data != null){
            console.log(response.data)
            resolve(response.data)
        }
        if (response.data === null){
            resolve([])
        }
    })})

    return axios_request
    
}

export function get_spells(session_id){
    console.log(session_id)
    let url = `http://localhost:8000${server_endpoints.get_spells}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(url).then(response => {
        if (response.data != null){
            console.log(response.data)
            resolve(response.data)
        }
        if (response.data === null){
            resolve([])
        }
    })})

    return axios_request
    
}

export async function round_start(session_id){
    console.log(session_id)
    let url = `http://localhost:8000${server_endpoints.roundstart}?session_id=${session_id}`
    let axios_request = new Promise((resolve,reject) => {
        axios.get(url).then(response => {
        if (response.data != null){
            console.log(response)
            resolve(response.data)
        }
        if (response.data === null){
            resolve([])
        }
    }).catch(error => {
        reject('Error')
    })
})
    return axios_request

}



