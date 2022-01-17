// import React, { createContext, useState } from "react";
// import { v4 as uuid_v4 } from "uuid";
// import useLocalStorage from "../Hooks/useLocaleStorage";
// import { sort_init } from "../services/init_funcs";
// import { DiceRoll } from "rpg-dice-roller";
// import { ISessionData, IInit, IStatus } from "../Interfaces/initiative";
// import { socket } from "./SocketContext";
// import { EmitTypes } from "../Interfaces/EmitTypes";
// import { collectionTypes, SessionFunctionTypes,InitiativeContextEnums } from "../Interfaces/InitiativeContextEnums"
// import { sessionFunctions } from "../services/server";

// const projectkey = "initiativeiativebot";

// // @ts-ignore
// // const character_list =localStorage.getItem(`${projectkey}character`) != null ? JSON.parse(localStorage.getItem(`${projectkey}character`))
// //     : [];
// export const InitiativeContext = createContext([]);

// const InitiativeContextProvider = (props: any) => {
//   const sessionId = localStorage.getItem("sessionId") != null ? localStorage.getItem("sessionId"): "";

//   // initiativeialize localstorage
//   const [initiativeList, setinitiative] = useState([] as IInit[]);
//   const [sorted, setSort] = useLocalStorage("character_sort", false);

 

//   const loadInitiative = async () => {
//     let sessionData;
//     let initiativeArray: IInit[] = [];
//     try {
//       if (sessionId != null) {
//         await sessionFunctions.GET_INITIAL_INIT(socket, sessionId);
//         sessionData = localStorage.getItem(
//           `dungeonbot-session-${sessionId}-initiative`
//         );
//         if (sessionData != null) {
//           sessionData = JSON.parse(sessionData);
//           sessionData.forEach((item: string) => {
//             let storage = localStorage.getItem(
//               `dungeonbot-session-${sessionId}-initiative-${item}`
//             );
//             if (storage != null) {
//               initiativeArray.push(JSON.parse(storage) as IInit);
//             }
//           });
//           setinitiative(initiativeArray);
//           console.info(initiativeList);

//           let newsorted = localStorage.getItem(
//             `dungeonbot-session-${sessionId}-isSorted`
//           );
//           if (newsorted != null) {
//             setSort(JSON.parse(newsorted));
//           }
//         }
//       }
//     } catch (error) {
//       setinitiative([]);
//       console.log(error);
//     }
//   };

//   // when the initiativeiative list is changed (drag and drop) updated the line order
//   const update_order = () => {
//     setTimeout(() => {
//       //@ts-ignore
//       let new_state = JSON.parse(localStorage.getItem(`${projectkey}character`));

//       for (let x = 0; x < new_state.length; x++) {
//         new_state[x].roundOrder = x + 1;
//       }

//       socket.emit(
//         "server_initiative",
//         {
//           room: sessionId,
//           initiativeiative: new_state,
//         },
//         (answer: any) => {
//           console.log(answer);
//         }
//       );
//     }, 1000);
//   };

//   // add in a new initiativeiative
//   const addInitiative = (e: any) => {
//     let charid = String(uuid_v4());
//     let initiative: number = 0;

//     // roll a dice if the user wants the bot to do it for them
//     if (e.target[3].value === "0") {
//       initiative = Number(e.target[2].value);
//     }
//     if (e.target[3].value === "1") {
//       let diceroll = new DiceRoll(`d20+${e.target[4].value}`);
//       console.log(diceroll.total);
//       initiative = diceroll.total;
//     }
//     // construct the initiativeiative object
//     let new_data = {
//       id: charid,
//       characterName: e.target[0].value,
//       initiative: Number(initiative),
//       initiativeModifier: Number(e.target[4].value),
//       isCurrent: false,
//       roundOrder: 0,
//       isNpc: e.target[1].value,
//       statusEffects: [],
//     };
//     console.log(new_data);
//     // reset the form
//     let initiative_form = document.getElementById("initiative-form");
//     if (initiative_form) (initiative_form as HTMLFormElement).reset();

//     // change all current marks to false (since we need to resort initiativeiative)

//     // if the sorted state is true, change it to false since we've added in a new intiaitive
//     // add to initiativeitiative list and character list (for spells)
//     setinitiative([...initiativeList, new_data]);
//     // setList([
//     //   ...char_list,
//     //   {
//     //     id: new_data.id,
//     //     name: new_data.characterName,
//     //     status_effects: new_data.statusEffects,
//     //   },
//     // ]);

//     // make sure to add in the new initiativeiative record to all spell's main lists.
//     //@ts-ignore
//     // we are going to make the characterIds field in Spellist an object {id: 1234, affected: false}
//     // this will hopefully be easier to keep track of who is and isn't affected.
//     // let spells = JSON.parse(localStorage.getItem(`${projectkey}spell_list`));
//     // for (let record of spells) {
//     //   //@ts-ignore
//     //   let main_initiative = JSON.parse(localStorage.getItem(`${projectkey}main_list${record.id}`));
//     //   main_initiative.push({
//     //     id: new_data.id,
//     //     name: new_data.characterName,
//     //     status_effects: new_data.statusEffects,
//     //   });
//     //   localStorage.setItem(
//     //     `${projectkey}main_list${record.id}`,
//     //     JSON.stringify(main_initiative)
//     //   );
//     // }
//   if(sessionId != null){
//     sessionFunctions.CREATE_NEW(
//       socket,
//       sessionId,
//       collectionTypes.INITIATIVE,
//       new_data
//     );
//   }
    
//   };

//   const remove_status_effect = (
//     id: string,
//     target: any,
//     spell_id: string,
//     char: any
//   ) => {
//     let target_index = id;
//     let targetid = target[target_index].id;
//     let new_target = [...initiativeList];
//     let new_index = new_target.map((item: any) => item.id).indexOf(targetid);
//     let effect_index = new_target[new_index].statusEffects
//       .map((item: any) => item.id)
//       .indexOf(spell_id);
//     new_target[new_index].statusEffects.splice(effect_index, 1);
//     setinitiative(new_target);

//     socket.emit("server_update_initiative", {
//       room: sessionId,
//       initiativeiative: new_target[new_index],
//       id: targetid,
//       index: new_index,
//     });

//     setTimeout(() => {
//       //@ts-ignore
//       let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`));
//       //@ts-ignore
//       let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`));

//       socket.emit(
//         "server_update_target",
//         {
//           room: sessionId,
//           target: target_state,
//           main: main_state,
//           id: spell_id,
//         },
//         (answer: any) => {
//           console.log(answer);
//         }
//       );
//     }, 1000);
//   };

//   const new_target = (
//     id: string,
//     char: any,
//     spell_id: string,
//     spell_name: string,
//     spell_effect: string
//   ) => {
//     console.log("on add?");
//     let target_index = id;
//     let targetid = char[target_index].id;
//     let new_target = [...initiativeList];
//     console.table(new_target);
//     let new_index = new_target.map((item: any) => item.id).indexOf(targetid);

//     let options = {
//       id: spell_id,
//       spellName: spell_name,
//       effectDescription: spell_effect,
//     };

//     new_target[new_index].statusEffects.push(options);
//     setinitiative(new_target);

//     socket.emit("server_update_initiative", {
//       room: sessionId,
//       initiativeiative: new_target[new_index],
//       id: targetid,
//       index: new_index,
//     });

//     setTimeout(() => {
//       //@ts-ignore
//       let target_state = JSON.parse(
//         localStorage.getItem(`${projectkey}target_list${spell_id}`)
//       );
//       //@ts-ignore
//       let main_state = JSON.parse(
//         localStorage.getItem(`${projectkey}main_list${spell_id}`)
//       );

//       socket.emit(
//         "server_update_target",
//         {
//           room: sessionId,
//           target: target_state,
//           main: main_state,
//           id: spell_id,
//         },
//         (answer: any) => {
//           console.log(answer);
//         }
//       );
//     }, 1000);
//   };

//   const remove_initiative = (id: string) => {
//     let new_state = [...initiativeList];
//     // let char_state = [...char_list];
//     let index = new_state.map((item: any) => item.id).indexOf(id);
//     // let charindex = char_state.map((item: any) => item.id).indexOf(id);
//     new_state.splice(index, 1);
//     // char_state.splice(charindex, 1);
//     // setList(char_state);
//     setinitiative(new_state);
//     console.log(sessionId);
//     socket.emit("server_remove_initiative", { room: sessionId, id: id });
//   };

//   const next_turn = () => {
//     console.log("next turn");
//     // emit data and retrieve updated initiativeList
//   };

//   const previous_turn = () => {
//     console.log("next turn");
//     // emit data and retrieve updated initiativeList
//   };

//   async function ROUND_START() {
//     socket.emit(EmitTypes.ROUND_START, sessionId, (data: any) => {
//       setinitiative(data.initiativeList);
//     });
//   }

//   async function resort() {
//     let sorted_initiative = await sort_init(initiativeList, false);
//     setinitiative(sorted_initiative);
//     socket.emit(
//       "server_initiative",
//       {
//         room: sessionId,
//         initiativeiative: sorted_initiative,
//       },
//       (answer: any) => {
//         console.log(answer);
//       }
//     );
//   }

//   const set_current = (id: string) => {
//     // emit data and update initiative list accordingly
//     let new_state = [...initiativeList];
//     let index = new_state.map((item: any) => item.id).indexOf(id);
//     let roundOrder = new_state[index].roundOrder;
//     let ondeck_find = roundOrder === initiativeList.length ? 1 : roundOrder + 1;

//     for (let x = 0; x < new_state.length; x++) {
//       new_state[x].isCurrent = false;
//     }
//     new_state[index].isCurrent = true;
//     setinitiative(new_state);
//     let emit_data = [...new_state];
//     socket.emit(
//       "server_initiative",
//       {
//         room: sessionId,
//         sort: true,
//         on_deck: ondeck_find,
//         initiativeiative: emit_data,
//       },
//       (answer: any) => {
//         console.log(answer);
//       }
//     );
//   };

//   async function reroll_initiative(id: string) {
//     let new_state = [...initiativeList];
//     for (let x = 0; x < new_state.length; x++) {
//       new_state[x].isCurrent = false;
//     }
//     let index = new_state.map((item: any) => item.id).indexOf(id);
//     let diceroll = new DiceRoll(`d20+${new_state[index].initiativeModifier}`);
//     new_state[index].initiative = diceroll.total;
//     let sorted_initiative = await sort_init(new_state, false);
//     setinitiative(sorted_initiative);
//     let emit_data = [...sorted_initiative];
//     socket.emit(
//       "server_initiative",
//       { room: sessionId, sort: false, on_deck: 0, initiativeiative: emit_data },
//       (answer: any) => {
//         console.log(answer);
//       }
//     );
//   }

//   const send_initiative = () => {
//     let channel_id = localStorage.getItem("channel_id");
//     socket.emit("server_show_initiative", {
//       room: sessionId,
//       channel_id: channel_id,
//     });
//   };

//   return (
//     //@ts-ignore
//     <InitiativeContext.Provider
//       value={{
//         initiativeList,
//         setinitiative,
//         setSort,
//         sorted,
//       }}
//     >
//       {props.children}
//     </InitiativeContext.Provider>
//   );
// };

// export default InitiativeContextProvider;
export{}