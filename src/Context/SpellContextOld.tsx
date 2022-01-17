export{}
// import { createContext, useState } from "react";
// import { v4 as uuid_v4 } from "uuid";
// import { socket } from "./SocketContext";
// import {SpellList} from "../Interfaces/initiative";


// const projectkey = "initiativebot";
// const spells_list =
//   localStorage.getItem(`${projectkey}spell_list`) != null
//     ? JSON.parse(localStorage.getItem(`${projectkey}spell_list`) as string)
//     : [];
// export const SpellContext = createContext(spells_list);

// const SpellContextProvider = (props: any) => {
//   const sessionId = localStorage.getItem('sessionId')
//   const [spell_list, setSpells] = useState([] as SpellList[])
  
//   const loadSpells = async () => {
//     let spellData;
//     let spellList: SpellList[] = [];
//     try {
//       if (sessionId != null) {
//         await sessionFunctions.GET_INITIAL_SPELLS(socket,sessionId);
//         spellData = localStorage.getItem(`dungeonbot-session-${sessionId}-spells`)
//         if (spellData != null){
//           spellData = JSON.parse(spellData)
//           spellData.forEach((item:string) => {
//             let storage = localStorage.getItem(`dungeonbot-session-${sessionId}-spells-${item}`)
//             if(storage != null) { 
//               spellList.push(JSON.parse(storage) as SpellList)
//             }
//           })
//           setSpells(spellList)
//         }
//     }
//   }
//     catch(error){
//       setSpells([])
//     }
// }

  

//   const spell_submit = (e: any) => {
   
//     let spellid = String(uuid_v4());

//     let new_spell = {
//       id: spellid,
//       effectName: e.target[0].value,
//       effectDescription: e.target[1].value,
//       durationTime: Number(e.target[2].value),
//       durationType: Number(e.target[3].value),
//       characterIds: []
//     };

//     setSpells([...spell_list, new_spell]);
//     socket.emit("server_add_spell", { room: sessionId, spell: new_spell });
//     let spell_form = document.getElementById("spell-form");
//     if (spell_form) (spell_form as HTMLFormElement).reset();
    
//   };

//   // const change_color = (e: ChangeEvent<HTMLInputElement>, id: any) => {
//   //   e.preventDefault();
//   //   console.log(e.target.value);
//   //   let new_state = [...spell_list];
//   //   let spell_index = new_state.map((item: any) => item.id).indexOf(id);
//   //   new_state[spell_index].color = e.target.value;
//   //   setSpells(new_state);
//   //   socket.emit("server_update_spell", {
//   //     room: session_id,
//   //     spell: new_state[spell_index],
//   //   });
//   // };

//   const update_spell_effect = (id:string,char:any,spell_id:string) =>{
//     let target_index = id
//     let targetid = char[target_index].id as string
//     console.log(targetid)
//     let new_target: SpellList[] = [...spell_list]
//     let new_index = new_target.map((item:any) => item.id).indexOf(spell_id)
//     new_target[new_index].characterIds.push(targetid)
//     setSpells(new_target)
//     socket.emit('server_update_spell',{room:sessionId,spell:new_target[new_index]})
//   }

  

//   const remove_spell_effect = (id:string,target:any,spell_id:string)=> {
//     let target_index = id
//     let targetid = target[target_index].id
//     let new_target = [...spell_list]
//     let new_index = new_target.map((item:any) => item.id).indexOf(spell_id)
//     let effect_index = new_target[new_index].characterIds.map((item:any) => item.id).indexOf(targetid)
//     new_target[new_index].characterIds.splice(effect_index,1)
//     socket.emit('server_update_spell',{room:sessionId,spell:new_target[new_index]})
//   }

//   const remove_spell = (id: string) => {
//     console.trace('this is happening at remove spell')
//     let new_state = [...spell_list];
//     let index = new_state.map((item: any) => item.id).indexOf(id);
//     new_state.splice(index, 1);
//     setSpells(new_state);
//     console.log(new_state[index]);
//     socket.emit("server_del_spell", {
//       room: sessionId,
//       id:id,
//     });
//   };

//   const send_spells = () => {
//     socket.emit("server_show_spell", {room:sessionId,channel_id:sessionId
//     });
//   }
//   return (
//     <SpellContext.Provider
//       value={{
//         spell_list,
//         setSpells,
//         spell_submit,
//         remove_spell,
//         send_spells,
//         loadSpells,
//         update_spell_effect,
//         remove_spell_effect
//       }}
//     >
//       {props.children}
//     </SpellContext.Provider>
//   );
// };

// export default SpellContextProvider;
