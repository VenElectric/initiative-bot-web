import React, { createContext,useEffect } from "react";
import useLocalStorage from "../Hooks/useLocaleStorage";
import { v4 as uuid_v4 } from "uuid";
import { ChangeEvent } from "react";
import { socket } from "./SocketContext";
import { SpellLine} from "../Interfaces/Interfaces";
import { get_spells } from "../services/redis-request";

const projectkey = "initiativebot";
const spells_list =
  localStorage.getItem(`${projectkey}spell_list`) != null
    ? JSON.parse(localStorage.getItem(`${projectkey}spell_list`) as string)
    : [];
export const SpellContext = createContext(spells_list);

const SpellContextProvider = (props: any) => {
  const session_id = "723744588346556419";
  const [spell_list, setSpells] = useLocalStorage("spell_list", [] as SpellLine[]);

  const load_spells = async () => {
    let init_data = await get_spells(session_id)
    try{
        if (init_data === 0 || init_data === []){
            setSpells([])
        }
        else{
            
            setSpells(init_data)
        }
    }
    catch(error){
      setSpells([])
    }
}

useEffect(()=> {
    console.log('use effect?')
    load_spells()
},[])
  
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const spell_submit = (e: any) => {
    e.preventDefault();
    let spellid = String(uuid_v4());

    let new_spell = {
      id: spellid,
      name: e.target[0].value,
      effect: e.target[1].value,
      duration_num: e.target[2].value,
      duration_type: e.target[3].value,
      color: getRandomColor(),
    };

    setSpells([...spell_list, new_spell]);
    socket.emit("server_add_spell", { room: session_id, spell: new_spell });
    let spell_form = document.getElementById("spell-form");
    if (spell_form) (spell_form as HTMLFormElement).reset();
    
  };

  const change_color = (e: ChangeEvent<HTMLInputElement>, id: any) => {
    e.preventDefault();
    console.log(e.target.value);
    let new_state = [...spell_list];
    let spell_index = new_state.map((item: any) => item.id).indexOf(id);
    new_state[spell_index].color = e.target.value;
    setSpells(new_state);
    socket.emit("server_update_spell", {
      room: session_id,
      spell: new_state[spell_index],
    });
  };

  const remove_spell = (id: string) => {
    let new_state = [...spell_list];
    let index = new_state.map((item: any) => item.id).indexOf(id);
    new_state.splice(index, 1);
    setSpells(new_state);
    console.log(new_state[index]);
    socket.emit("server_del_spell", {
      room: session_id,
      spell: new_state[index],
    });
  };

  const send_spells = () => {

    socket.emit("server_show_spell", {room:session_id
    });
  }
  return (
    <SpellContext.Provider
      value={{
        spell_list,
        setSpells,
        spell_submit,
        remove_spell,
        change_color,
        send_spells
      }}
    >
      {props.children}
    </SpellContext.Provider>
  );
};

export default SpellContextProvider;
