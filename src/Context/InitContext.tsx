import React,{createContext,useState,useEffect,useContext} from 'react'
import { v4 as uuid_v4 } from "uuid";
import useLocalStorage from "../Hooks/useLocaleStorage";
import { sort_init } from '../services/init_funcs';
import {get_init,round_start} from '../services/server_requests'
import { DiceRoll } from 'rpg-dice-roller';
import { InitiativeLine } from '../Interfaces/Interfaces';
import {socket} from './SocketContext'
import { ChangeEvent } from 'react';


const projectkey = 'initiativebot'


 // @ts-ignore
const character_list = localStorage.getItem(`${projectkey}character`) != null ? JSON.parse(localStorage.getItem(`${projectkey}character`)): []
export const InitContext = createContext(character_list);

// export const InitContext = createContext();

const InitContextProvider = (props:any) => {
    const session_id = localStorage.getItem('session_id')
    // @ts-ignore
    const [loading,setLoad] = useState(false)
    const [error,setError] = useState({})
    // @ts-ignore
    // const character_list = localStorage.getItem(`${projectkey}character`) != null ? JSON.parse(localStorage.getItem(`${projectkey}character`)): []
    const [init_list,setInit] = useLocalStorage("character", [] as InitiativeLine[]);
    const [sorted,setSort] = useLocalStorage("character_sort",false)
    const [ondeck,setOndeck] = useLocalStorage("character_ondeck",0)
    const [char_list,setList] = useState(init_list.map((item) => {return {id:item.id,name:item.name,status_effects:item.status_effects}}))

    const load_init = async () => {
        let init_data = await get_init(session_id)
       
        try{
            if (init_data === 0 || init_data === []){
                setInit([])
                setSort(false)
                setOndeck(0)
            }
            else{
                let sorted_list = await sort_init(init_data.init_list,false)
               
                setInit(sorted_list)
                setOndeck(init_data.initial.on_deck)
                setSort(init_data.initial.sort)
            }
        }
        catch(error){
            setInit([])
        }
    }
    
    // useEffect(()=> {
    //     console.log('use effect?')
    //     load_init()
    // },[])

   
    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    const update_order = () => {
        
       setTimeout(()=>{
           //@ts-ignore
        let new_state = JSON.parse(localStorage.getItem(`${projectkey}character`))
        for(let x=0;x<new_state.length;x++){
                new_state[x].line_order = x+1
            }
            console.log(new_state)
        
        socket.emit('server_init',{room:session_id,sort:sorted,on_deck:ondeck,initiative:new_state},(answer:any) => {
                    console.log(answer)
                  })
        
       },1000) 

    }

    // const update_status_color = (e:ChangeEvent<HTMLInputElement>,id:string) => {
    //     let new_state = [...init_list]
    //     let color = e.target.value
    //     for (let x in new_state){
    //         let new_index = new_state[x].status_effects.map((item:any) => item.id).indexOf(id)
    //         if (new_index >= 0){
    //             new_state[x].status_effects[new_index].color = color
    //         }
    //     }
    //     setInit(new_state)
    // }

    const add_init = (e:any) => {
    
    let charid = String(uuid_v4())
    let init:number = 0
        console.log(e.target[3].value)
    if (e.target[3].value === '0'){
        init = Number(e.target[2].value)
    }
    if (e.target[3].value === '1'){
        let diceroll = new DiceRoll(`d20+${e.target[4].value}`)
        console.log(diceroll.total)
        init = diceroll.total
    }
    let new_data = {id: charid,
        name: e.target[0].value,
        init: init,
        init_mod: Number(e.target[4].value),
        cmark : false,
        line_order: 0,
        npc: e.target[1].value,
        status_effects: [],
        }
    setInit([...init_list,new_data])
    setList([...char_list,{id:new_data.id,name:new_data.name,status_effects:new_data.status_effects}])
    let init_form = document.getElementById('init-form')
    if (init_form) (init_form as HTMLFormElement).reset()

    if(sorted){
        for (let x=0;x<init_list.length;x++){
            init_list[x].cmark=false
        }
    }
    setSort(false)
    // let response = add_new_init(session_id,new_data)
    console.trace(new_data)
    console.trace(init_list)
    socket.emit('server_add_init',{room:session_id,sort:false,initiative:new_data})

    }

    const remove_status_effect = (id:string,target:any,spell_id:string,char:any) => {
        let target_index = id
        let targetid = target[target_index].id
        let new_target = [...init_list]
        let new_index = new_target.map((item:any) => item.id).indexOf(targetid)
        let effect_index = new_target[new_index].status_effects.map((item:any) => item.id).indexOf(spell_id)
		new_target[new_index].status_effects.splice(effect_index,1)
		setInit(new_target)
        let emit_data = [...new_target]
        socket.emit('server_update_init',{room:session_id,sort:sorted,on_deck:ondeck,initiative:emit_data,id:targetid,index:new_index},(answer:any) => {
        console.log(answer)
        setTimeout(()=>{
            //@ts-ignore
         let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
         //@ts-ignore
         let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
         
         socket.emit('server_update_target',{room:session_id,target:target_state,main:main_state,id:spell_id},(answer:any) => {
                     console.log(answer)
                   })
         
        },1000) 
      })
        // update_init(targetid,new_target[new_index])
    }

    const new_target = (id:string,char:any,spell_id:string,spell_name:string,spell_effect:string) => {
        console.log('on add?')
        let target_index = id
        let targetid = char[target_index].id
        let new_target = [...init_list]
        console.table(new_target)
        let new_index = new_target.map((item:any) => item.id).indexOf(targetid)
		
        new_target[new_index].status_effects.push({id:spell_id,name:spell_name,effect:spell_effect})
		setInit(new_target)
      
        socket.emit('server_update_init',{room:session_id,sort:sorted,on_deck:ondeck,initiative:new_target,id:targetid,index:new_index})
        
      
        setTimeout(()=>{
        //@ts-ignore
        let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
        //@ts-ignore
        let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
        
        socket.emit('server_update_target',{room:session_id,target:target_state,main:main_state,id:spell_id},(answer:any) => {
                 console.log(answer)
               })
     
    },1000) 
    }

    const remove_init = (id:string) => {
        let new_state = [...init_list]
        let char_state = [...char_list]
        let index = new_state.map((item:any) => item.id).indexOf(id)
        let charindex = char_state.map((item:any)=> item.id).indexOf(id)
		new_state.splice(index,1)
        char_state.splice(charindex,1)
        setList(char_state)
		setInit(new_state)
        console.log(session_id)
        socket.emit('server_remove_init',{room:session_id,id:id})
    }
    const next_turn = () => {
        let new_state = [...init_list]
        let current = new_state.map((item:any) => item.line_order).indexOf(ondeck)
        console.log(current)
        let next:number;
        let prev:number = 0
        let emit_deck:number = 0

        if (ondeck === init_list.length){
            console.info(ondeck,'===')
            next = 1
            prev = current - 1
            new_state[prev].cmark = false
            new_state[current].cmark = true
            emit_deck = next
            setOndeck(next)
        }
        if (ondeck < init_list.length && ondeck > 1){
            console.info(ondeck,'< and >')
            next = ondeck + 1
            console.info(next)
            prev = current - 1
            new_state[prev].cmark = false
            new_state[current].cmark = true
            emit_deck = next
            setOndeck(next)
        }
        if (ondeck === 1){
            console.info(ondeck,'===1')
            next = ondeck + 1
            prev = init_list.length - 1
            console.info(init_list.length)
            new_state[prev].cmark = false
            new_state[current].cmark = true
            emit_deck = next
            setOndeck(next)
        }

        setInit(new_state)
        let emit_data = [...new_state]
        socket.emit('server_init',{room:session_id,sort:sorted,on_deck:emit_deck,initiative:emit_data})
        socket.emit('server_next',{room:session_id,next:new_state[current].name})
    }
    const previous_turn = () => {
        let new_state = [...init_list]
        let next = new_state.map((item:any) => item.line_order).indexOf(ondeck)
        console.log(next)
        let current:number;
        let prev:number = 0
        let emit_deck:number = 0

        if (ondeck === 2){
            console.info(ondeck,'===')
            current = 0
            prev = init_list.length - 1
            new_state[prev].cmark = true
            new_state[current].cmark = false
            emit_deck = 1
            setOndeck(1)
        }
        if (ondeck <= init_list.length && ondeck > 2){
            console.info(ondeck,'< and >')
            current = next - 1
            console.info(next)
            prev = current - 1
            new_state[prev].cmark = true
            new_state[current].cmark = false
            emit_deck = current + 1
            setOndeck(current + 1)
        }
        if (ondeck === 1)
        {
            current = init_list.length - 1
            console.info(next)
            prev = current - 1
            new_state[prev].cmark = true
            new_state[current].cmark = false
            emit_deck = init_list.length
            setOndeck(init_list.length)
        }

        setInit(new_state)
        let emit_data = [...new_state]
        socket.emit('server_init',{room:session_id,sort:sorted,on_deck:emit_deck,initiative:emit_data},(answer:any) => {
            console.log(answer)
          })
          socket.emit('server_prev',{room:session_id,prev:new_state[prev].name})
        console.log('prev turn')
    }

    async function sort_list() {
        let sorted_init = await round_start(session_id)
        console.log(sorted_init)
        setInit(sorted_init)
        setSort(true)
        setOndeck(2)
        let emit_data = [...sorted_init]
    socket.emit('server_init',{room:session_id,sort:true,on_deck:2,initiative:emit_data},(answer:any) => {
        console.log(answer)
      })
    }

    const set_current = (id:string) =>{
        let new_state = [...init_list]
        let index = new_state.map((item:any) => item.id).indexOf(id)
        let line_order = new_state[index].line_order
        let ondeck_find = line_order === init_list.length ? 1 : line_order + 1

        for (let x=0;x<new_state.length;x++){
            new_state[x].cmark=false
        }
		new_state[index].cmark = true
        setOndeck(ondeck_find)
		setInit(new_state)
        let emit_data = [...new_state]
        socket.emit('server_init',{room:session_id,sort:true,on_deck:ondeck_find,initiative:emit_data},(answer:any) => {
            console.log(answer)
          })
    }

    async function reroll_init(id:string) {
        let new_state = [...init_list]
        for (let x=0;x<new_state.length;x++){
            new_state[x].cmark=false
        }
        let index = new_state.map((item:any) => item.id).indexOf(id)
        let diceroll = new DiceRoll(`d20+${new_state[index].init_mod}`)
        new_state[index].init = diceroll.total
        let sorted_init = await sort_init(new_state,false)
        setInit(sorted_init)
        let emit_data = [...sorted_init]
        socket.emit('server_init',{room:session_id,sort:false,on_deck:0,initiative:emit_data},(answer:any) => {
            console.log(answer)
          })
    }

    const send_init = () => {

        socket.emit("server_show_init", {room:session_id
        });
      }

        return (
        <InitContext.Provider value={{load_init,send_init,char_list,setList,init_list,setInit,setSort,add_init,next_turn,previous_turn,sort_list,remove_init,remove_status_effect,new_target,sorted,set_current,reroll_init,loading,error,setOndeck,update_order}}>
            {props.children}
        </InitContext.Provider>
    )
}

export default InitContextProvider;

