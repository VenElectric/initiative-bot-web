import React,{useContext,useEffect} from "react";
import { Container, Row,Card,Button,Col,Accordion,Alert } from "react-bootstrap";
import { SpellLine, InitiativeLine } from "../Interfaces/Interfaces";
import InitRecord from "./InitRecord";
import SpellRecord from "./SpellRecord";
import { ReactSortable } from "react-sortablejs";
import SpellForm from "./SpellForm";
import InitForm from "./InitForm";
import { InitContext } from "../Context/InitContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { SpellContext } from "../Context/SpellContext";
import { SocketContext } from "../Context/SocketContext";
import axios from "axios";

export default function SessionPage() {

	const projectkey = 'initiativebot'
	const {init_list,setInit,sorted,sort_list,next_turn,previous_turn,setSort,setOndeck,update_order,send_init} = useContext(InitContext)
	const {spell_list,spell_submit,change_color,setSpells,send_spells} = useContext(SpellContext)
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on('client_init',function(data:any){
			console.log(data,'init')
			setInit([...data.initiative])
			setSort(data.sort)
			setOndeck(data.on_deck)
		})

		socket.on('client_add_init',function(data:any){
			setTimeout(()=>{
				console.trace(data)
				console.trace(init_list)
				//@ts-ignore
				let old_data =  JSON.parse(localStorage.getItem(`${projectkey}character`))
				old_data.push(data.initiative)
				console.log(old_data)
				setInit(old_data)
				setSort(data.sort)
			},1000)
		})

		socket.on('client_update_init',function(data:any){
			console.log('client update init')
			let new_state = data.initiative
			let sort = data.sort
			let on_deck = data.ondeck
			setInit(new_state)
			setSort(sort)
			setOndeck(on_deck)

			// this is not updating state for some reason
		})

		socket.on('client_remove_init',function(data:any){
			setTimeout(()=>{
			//@ts-ignore
			let new_state =  JSON.parse(localStorage.getItem(`${projectkey}character`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.id)
			new_state.splice(index,1)
			setInit(new_state)
		},1000)
		})

		socket.on('client_update_spell',function(data:any){
			
			setTimeout(()=>{
				//@ts-ignore
			let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.spell.id)
			new_state[index] = {...data.spell}
			setSpells(new_state)
		},1000)
		})


		socket.on('add_spell',function(data:any){
			console.log(data.spell)
			setTimeout(()=>{
				console.log('test?')
				//@ts-ignore
			let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
        	new_state.push(data.spell)
			setSpells(new_state)
		},1000)
		})

		socket.on('client_del_spell',function(data:any){
			setTimeout(()=>{
				//@ts-ignore
			let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.spell.id)
			new_state.splice(index,1)
			setSpells(new_state)
		},1000)
		})

		socket.on('client_update_target',function(data:any){
			let spell_id = data.id
			localStorage.setItem(`${projectkey}target_list${spell_id}`, JSON.stringify(data.target))
			localStorage.setItem(`${projectkey}main_list${spell_id}`, JSON.stringify(data.main))
		})

		socket.on('client_roundstart',function(data:any){
			let new_state = data.initiative
			let sort = data.sort
			let on_deck = data.ondeck
			setInit(new_state)
			setSort(sort)
			setOndeck(on_deck)
		})
	}, [])


	return (

		<Container>
		
			<Row>
			<Col>
				<ReactSortable group="initiative" list={init_list} setList={setInit} onUpdate={update_order}>
					{init_list != null
						? init_list.map((item:InitiativeLine) => {
								return <Alert key={item.id} style={{backgroundColor:`${item.cmark ? '#97fbb2': 'white'}`}}><Accordion><InitRecord init_rec={item}/></Accordion></Alert>;
						  })
						: []}
				</ReactSortable>
				<br></br>
				{sorted ? <><Button onClick={() => send_init()}>Send Initiative to Discord</Button>
					<br></br>
					<br></br>
				<Button onClick={() => previous_turn()}>Previous</Button><Button onClick={() => next_turn()}>Next</Button></>
				
				
				:[]}
				
				<Button onClick={() => sort_list()}>Sort Initiative</Button>
				<br></br>
				<br></br>
				<Row><InitForm/></Row>
			</Col>
			<Col>
					{spell_list != null
						? spell_list.map((item:SpellLine) => {
								return <Row key={item.id}><SpellRecord change_color={change_color} spell_rec={item} /></Row>;
						  })
						: []}
				{spell_list != null ? <><Button onClick={() => send_spells()}>Send Spells to Discord</Button>
				<br></br>
				<br></br>
				</>
				:[]}
				<Row><SpellForm char_data={init_list} handle_submit={spell_submit}/></Row>
			</Col>
			</Row>
		</Container>
	);
}
