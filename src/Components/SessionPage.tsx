export{}
// import React, { useContext, useEffect, useState, useRef } from "react";
// import {
//   Container,
//   Row,
//   Button,
//   Col,
//   Accordion,
//   Alert,
//   ListGroup,
//   Modal,
//   ToastContainer,
//   Toast,
// } from "react-bootstrap";
// import { SpellLine, InitiativeLine } from "../Interfaces/Interfaces";
// import InitRecord from "./InitRecord";
// import SpellRecord from "./SpellRecord";
// import { ReactSortable } from "react-sortablejs";
// import SpellForm from "./SpellForm";
// import InitForm from "./InitForm";
// import InitiativeRecords from "./InitiativeRecords";
// import { InitiativeContext } from "../Context/InitContext";
// import { SpellContext } from "../Context/SpellContextOld";
// import { SocketContext } from "../Context/SocketContext";
// import { TiDeleteOutline, TiPlus } from "react-icons/ti";
// import { EmitTypes } from "../Interfaces/EmitTypes";
// import { IInit } from "../Interfaces/initiative";
// import InitiativeProvider from "../Context/SpellContext";

// export default function SessionPage() {
//   const projectkey = "initiativebot";


//   const socket = useContext(SocketContext);
//   let mounted = useRef(true);

//   const [showA, setShowA] = useState(false);

//   const toggleShowA = () => setShowA(!showA);

//   mounted.current = true;

//   // Can this be it's own component???
//   useEffect(() => {
//     socket.on("client_init", function (data: any) {
//       // used for updating initiative
//       setinitiative([...data.initiativeList]);
//       setSort(data.isSorted);
//     });

//     socket.on("client_add_init", function (data: any) {
//       // called when new initiative is added to the list
//       setTimeout(() => {
//         //@ts-ignore
//         let old_data = JSON.parse(localStorage.getItem(`${projectkey}character`));
//         old_data.push(data.initiative);
//         setinitiative(old_data);
//         setSort(data.sort);
//       }, 1000);
//     });

//     socket.on("client_update_init", function (data: any) {
//       // when values are updated in an initiative record
//       let new_init = data.initiative as IInit;
//       let init_index = initiativeList
//         .map((item: any) => item.id)
//         .indexOf(new_init.id);
//       let new_state = [...initiativeList];
//       new_state[init_index] = new_init;
//       setinitiative(new_state);
//     });

//     socket.on("client_remove_init", function (data: any) {
//       // when an initiative record is removed
//       setTimeout(() => {
//         //@ts-ignore
//         let new_state = JSON.parse(localStorage.getItem(`${projectkey}character`));
//         let index = new_state.map((item: any) => item.id).indexOf(data.id);
//         new_state.splice(index, 1);
//         setinitiative(new_state);
//       }, 1000);
//     });

//     socket.on("client_update_spell", function (data: any) {
//       // when values are updated for a spell effect
//       setTimeout(() => {
//         //@ts-ignore
//         let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`));
//         let index = new_state
//           .map((item: any) => item.id)
//           .indexOf(data.spell.id);
//         new_state[index] = { ...data.spell };
//         setSpells(new_state);
//       }, 1000);
//     });

//     socket.on("add_spell", function (data: any) {
//       // add a new spell
//       console.log(data.spell);
//       setTimeout(() => {
//         console.log("test?");
//         //@ts-ignore
//         let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`));
//         new_state.push(data.spell);
//         setSpells(new_state);
//       }, 1000);
//     });

//     socket.on("client_del_spell", function (data: any) {
//       // when spell is deleted
//       setTimeout(() => {
//         let localStorageState = localStorage.getItem(`${projectkey}spell_list`);
//         let newState = [] as IInit[];
//         if (localStorageState != null) {
//           newState = JSON.parse(localStorageState);
//         }
//         let index = newState.map((item: any) => item.id).indexOf(data.id);
//         newState.splice(index, 1);
//         setSpells(newState);
//       }, 1000);
//     });

//     socket.on("client_update_target", function (data: any) {
//       // called whenever the target list is updated for a spell effect.
//       // The main list holds a list of characters not targeted by the spell
//       // target list holds a list of characters that are targeted by the spell
//       let spell_id = data.id;
//       localStorage.setItem(
//         `${projectkey}target_list${spell_id}`,
//         JSON.stringify(data.target)
//       );
//       localStorage.setItem(
//         `${projectkey}main_list${spell_id}`,
//         JSON.stringify(data.main)
//       );
//     });

//     socket.on(EmitTypes.ROUND_START, function (data: any) {
//       // start rounds/game start
//       setinitiative(data.initiativeList);
//       setSort(data.isSorted);
//     });

//     socket.on("save_complete", function (data: any) {
//       // show pop up when data is aved
//       toggleShowA();
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (mounted.current) {
//       // load spells and initiative from db
//       loadSpells();
//       loadInitiative();
//     }
//     return () => {
//       mounted.current = false;
//     };
//   }, [loadSpells, loadInitiative]);

//   const [record, setRecord] = useState({} as SpellLine);

//   function spell_click(id: string) {
//     // click on spell name to show spell info
//     // let index = spell_list.map((item: SpellLine) => item.id).indexOf(id);
//     // spell record updated so that info window updates whenever you click a different spell
//     setRecord(spell_list[index]);
//     setShowdata(false);
//   }

//   function handle_spell_submit(e: any) {
//     // handle adding new spell
//     e.preventDefault();
//     // spell_submit(e);
//     spellClose();
//   }

//   function handle_init_submit(e: any) {
//     let initiativeForm = document.getElementById("initiative-form");
//     if (initiativeForm) (initiativeForm as HTMLFormElement).reset();
//     // handle adding new initiative
//     e.preventDefault();
//     // addInitiative(e);
//     initClose();
//   }

//   function save_data() {
//     // grab the data from local storage, send to server to save in db
//     //@ts-ignore
//     let init_data = JSON.parse(localStorage.getItem(`${projectkey}character`));
//     console.table(init_data);
//     //@ts-ignore
//     let spell_data = JSON.parse(localStorage.getItem(`${projectkey}spell_list`));
//     console.table(spell_data);
//     //@ts-ignore
//     let ondeck = localStorage.getItem(`${projectkey}character_ondeck`);
//     // React was most likely adding in escape characters to these values so they need to be removed when sending to db
//     ondeck?.replace("/", "");
//     ondeck?.replace('"', "");
//     console.log(ondeck);
//     //@ts-ignore
//     let sort = localStorage.getItem(`${projectkey}character_sort`);
//     sort?.replace("/", "");
//     sort?.replace('"', "");
//     let session_id = localStorage.getItem("session_id");

//     if (init_data !== [] && spell_data !== []) {
//       socket.emit("server_save", {
//         spells: spell_data,
//         init: init_data,
//         room: session_id,
//         ondeck: ondeck,
//         sort: Boolean(sort),
//       });
//     }
//   }

//   const [show_data, setShowdata] = useState(true);

//   const [initMod, setinitiativeMod] = useState(false);
//   const [spellMod, setSpellMod] = useState(false);

//   // modal form functions
//   const initClose = () => setinitiativeMod(false);
//   const initOpen = () => setinitiativeMod(true);

//   const spellClose = () => setSpellMod(false);
//   const spellOpen = () => setSpellMod(true);

//   return (
//     <>
//       <ToastContainer position="middle-center">
//         <Toast show={showA} onClose={toggleShowA} className="p-3 ">
//           <Toast.Header closeButton={true}></Toast.Header>
//           <Toast.Body>Save Complete</Toast.Body>
//         </Toast>
//       </ToastContainer>
//       <br></br>
//       <Row className="justify-content-md-center listfeed">
//         <h1 style={{ alignContent: "center", textAlign: "center" }}>
//           <Alert className="initbotheader">Dungeon Bot</Alert>
//         </h1>
//       </Row>
//       <br></br>
//       <br></br>
//       <Row className="justify-content-md-center listfeed">
//         {/* <Button className="screenbutborder" onClick={() => save_data()}>
//           Save Data
//         </Button> */}
//       </Row>

//       <Container fluid>
//         <br></br>
//         <br></br>
//         <Row md={10} className="justify-content-md-center">
//           {/* *********** INITIATIVE START *********** */}
          
//           <Col lg={3} md={7} className="bordercol">
          
//             <div className="mainborder">
//               {/* HEADER COMPONENT */}
//               <Row>
//                 <h2>Initiative</h2>
//                 <Button className="screenbutborder" onClick={() => initOpen()}>
//                   <TiPlus></TiPlus>
//                 </Button>
//               </Row>
//               {/* HEADER COMPONENT */}
//               <br></br>
//               {/* INITIATIVE LIST COMPONENT */}
//               <InitiativeRecords />

//               {/* INITIATIVE LIST COMPONENT */}
//               <br></br>
//               {/* BUTTON TO DISCORD COMPONENT */}
//                {sorted ? (
//                 <>
//                   <Button
//                     className="screenbutborder"
//                     onClick={() => send_initiative()}
//                   >
//                     Send Initiative to Discord
//                   </Button>
                 
//                   <br></br>
//                   <br></br>
                 
//                   <Button
//                     className="screenbutborder"
//                     onClick={() => previous_turn()}
//                   >
//                     Previous
//                   </Button>
            
//                   <Button
//                     className="screenbutborder"
//                     onClick={() => next_turn()}
//                   >
//                     Next
//                   </Button>
//                  </>
//               ) : (
//                 []
//               )} 
// //               {/* SORT BUTTON COMPONENT */}
//                {sorted ? 
//                 <Button className="screenbutborder" onClick={() => resort()}>
//                   Sort Initiative
//                 </Button>
//                : 
//                 <Button
//                   className="screenbutborder"
//                   onClick={() => ROUND_START()}
//                 >
//                   Sort Initiative
//                 </Button>
//               }
// //               {/* SORT BUTTON COMPONENT */}
//             </div>
//             <br></br>
//             {/* INITIATIVE FORM MODAL COMPONENT */}
//              <Modal show={initMod} onHide={initClose}>
//               <InitForm handle_submit={handle_init_submit} />
//             </Modal>             {/* INITIATIVE FORM MODAL COMPONENT */}
//             {/* *********** <<<<< INITIATIVE END >>>>*********** */}
           
//           </Col> 
//          {/* IN BETWEEN BORDER COMPONENT */}
//           <Col xs="auto" className="bordercol">
//             <div className="inbetweenborder"></div>
//           </Col>
// //           {/* IN BETWEEN BORDER COMPONENT */}
//           {/* *********** <<<<< SPELL LIST START>>>>*********** */}
//           <Col lg={2} md={6} className="bordercol">
//             <div className="mainborder">
//               {/* HEADER COMPONENT */}
//               <Row>
//                 <h2>Spells</h2>
//                 <Button onClick={() => spellOpen()} className="screenbutborder">
//                   <TiPlus></TiPlus>
//                 </Button>
//                 {/* HEADER COMPONENT */}
//                 {/* INCLUDE MODAL IN HEADER COMPONENT????? */}
//               </Row>
//               {/* SPELL LIST COMPONENT */}
//               <ListGroup variant="flush">
//                 {spell_list != null
//                   ? spell_list.map((item: SpellLine) => {
//                       return (
//                         <ListGroup.Item key={item.id}>
//                           <Button
//                             className="listbuttonborder"
//                             onClick={(e) => spell_click(item.id)}
//                           >
//                             {item.name}
//                           </Button>
//                           <TiDeleteOutline
//                             onClick={() => remove_spell(item.id)}
//                             style={{ float: "right" }}
//                           />
//                         </ListGroup.Item>
//                       );
//                     })
//                   : []}
//               </ListGroup>
//               {/* SPELL LIST COMPONENT */}
//               {/* SPELL LIST TO DISCORD BUTTON COMPONENT */}
//                {spell_list != null ? (
//                 <>
//                   <br></br>
//                   <Button
//                     className="screenbutborder"
//                     onClick={() => send_spells()}
//                   >
//                     Send Spells to Discord
//                   </Button>
//                 </>
//               ) : (
//                 []
//               )} */}
//               {/* SPELL LIST TO DISCORD BUTTON COMPONENT */}
//             </div>
//             <br></br>
//           </Col>
//           {/* *********** <<<<< SPELL LIST END >>>>*********** */}
//           <Col xs="auto" className="bordercol">
//             <div className="inbetweenborder-two"></div>
//           </Col>
//           {/* *********** <<<<< SPELL INFO START>>>>*********** */}
//           <Col lg={3} md={7} className="bordercol">
//             <div className="infoborder">
              
//               <SpellRecord
//                 change_color={change_color}
//                 record={record}
//                 show_data={show_data}
//                 setRecord={setRecord}
//               />
//             </div>
//             {/* SPELL FORM MODAL, ADD TO HEADER???? */}
//             <Modal show={spellMod} onHide={spellClose}>
//               <SpellForm handle_submit={handle_spell_submit} />
//             </Modal>
//             {/* SPELL FORM MODAL, ADD TO HEADER???? */}
//           </Col>
//           {/* *********** <<<<< SPELL INFO END >>>>*********** */}
//         </Row>
//       </Container>
//     </>
//   );
// }
