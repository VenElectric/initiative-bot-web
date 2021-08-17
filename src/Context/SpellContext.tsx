import React, { createContext,useEffect } from "react";
import useLocalStorage from "../Hooks/useLocaleStorage";
import { v4 as uuid_v4 } from "uuid";
import { ChangeEvent } from "react";
import { socket } from "./SocketContext";
import { SpellLine} from "../Interfaces/Interfaces";
import { get_spells } from "../services/server_requests";


const projectkey = "initiativebot";
const spells_list =
  localStorage.getItem(`${projectkey}spell_list`) != null
    ? JSON.parse(localStorage.getItem(`${projectkey}spell_list`) as string)
    : [];
export const SpellContext = createContext(spells_list);

const SpellContextProvider = (props: any) => {
  const session_id = localStorage.getItem('session_id')
  const [spell_list, setSpells] = useLocalStorage("spell_list", [] as SpellLine[]);
  const channel_id = localStorage.getItem('channel_id')
  const load_spells = async () => {
    let init_data = await get_spells(session_id)
    try{
        if (init_data === 0 || init_data === []){
            setSpells([])
        }
        else{
            setSpells(init_data)
            for (let x=0;x<init_data.length;x++){
              localStorage.setItem(`${projectkey}target_list${init_data[x].id}`,JSON.stringify([]))
              localStorage.setItem(`${projectkey}main_list${init_data[x].id}`,JSON.stringify([]))
            }
        }
         
    }
    catch(error){
      setSpells([])
    }
}

// useEffect(()=> {
//     console.log('use effect?')
//     load_spells()
// },[])
  
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const spell_submit = (e: any) => {
   
    let spellid = String(uuid_v4());

    let new_spell = {
      id: spellid,
      name: e.target[0].value,
      effect: e.target[1].value,
      duration_num: Number(e.target[2].value),
      duration_type: Number(e.target[3].value),
      user_ids: []
    };

    setSpells([...spell_list, new_spell]);
    socket.emit("server_add_spell", { room: session_id, spell: new_spell });
    let spell_form = document.getElementById("spell-form");
    if (spell_form) (spell_form as HTMLFormElement).reset();
    
  };

  // const change_color = (e: ChangeEvent<HTMLInputElement>, id: any) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  //   let new_state = [...spell_list];
  //   let spell_index = new_state.map((item: any) => item.id).indexOf(id);
  //   new_state[spell_index].color = e.target.value;
  //   setSpells(new_state);
  //   socket.emit("server_update_spell", {
  //     room: session_id,
  //     spell: new_state[spell_index],
  //   });
  // };

  const update_spell_effect = (id:string,char:any,spell_id:string) =>{
    let target_index = id
    let targetid = char[target_index].id
    console.log(targetid)
    let new_target = [...spell_list]
    let new_index = new_target.map((item:any) => item.id).indexOf(spell_id)
    new_target[new_index].user_ids.push(targetid)
    setSpells(new_target)
    socket.emit('server_update_spell',{room:session_id,spell:new_target[new_index]})
  }

  

  const remove_spell_effect = (id:string,target:any,spell_id:string)=> {
    let target_index = id
    let targetid = target[target_index].id
    let new_target = [...spell_list]
    let new_index = new_target.map((item:any) => item.id).indexOf(spell_id)
    let effect_index = new_target[new_index].user_ids.map((item:any) => item.id).indexOf(targetid)
    new_target[new_index].user_ids.splice(effect_index,1)
    socket.emit('server_update_spell',{room:session_id,spell:new_target[new_index]})
  }

  const remove_spell = (id: string) => {
    console.trace('this is happening at remove spell')
    let new_state = [...spell_list];
    let index = new_state.map((item: any) => item.id).indexOf(id);
    new_state.splice(index, 1);
    setSpells(new_state);
    console.log(new_state[index]);
    socket.emit("server_del_spell", {
      room: session_id,
      id:id,
    });
  };

  const send_spells = () => {
    let channel_id = localStorage.getItem('channel_id')
    socket.emit("server_show_spell", {room:session_id,channel_id:channel_id
    });
  }
  return (
    <SpellContext.Provider
      value={{
        spell_list,
        setSpells,
        spell_submit,
        remove_spell,
        send_spells,
        load_spells,
        update_spell_effect,
        remove_spell_effect
      }}
    >
      {props.children}
    </SpellContext.Provider>
  );
};

export default SpellContextProvider;
