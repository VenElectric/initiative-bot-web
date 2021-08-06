import React,{useContext,useEffect,useState,useRef} from "react";
import { Container, Row,Card,Button,Col,Accordion,Alert,ListGroup,Modal } from "react-bootstrap";
import { SpellLine, InitiativeLine,TargetData } from "../Interfaces/Interfaces";
import InitRecord from "./InitRecord";
import SpellRecord from "./SpellRecord";
import { ReactSortable } from "react-sortablejs";
import SpellForm from "./SpellForm";
import InitForm from "./InitForm";
import { InitContext } from "../Context/InitContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { SpellContext } from "../Context/SpellContext";
import { SocketContext } from "../Context/SocketContext";
import {TiDeleteOutline,TiPlus} from 'react-icons/ti'
import useLocalStorage from "../Hooks/useLocaleStorage";

export default function SessionPage() {

	const projectkey = 'initiativebot'
	const {load_init,init_list,add_init,setInit,sorted,sort_list,next_turn,previous_turn,setSort,setOndeck,update_order,send_init,char_list} = useContext(InitContext)
	const {load_spells,spell_list,spell_submit,change_color,setSpells,send_spells,remove_spell} = useContext(SpellContext)
	const socket = useContext(SocketContext);
	let mounted = useRef(true)

	mounted.current = true
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

	useEffect(()=> {
	if (mounted.current){
		console.log('mounted')
		load_spells()
		load_init()
	}
		return () => {
		  console.log('unmounted')
		  mounted.current=false
		  
		}
	  },[load_spells,load_init])


	// spell target and main target lists
	// // @ts-ignore
	// const target_list = JSON.parse(localStorage.getItem(`${projectkey}target_list${record.id}`)) || [];
	// // @ts-ignore
	const [record, setRecord] = useState({} as SpellLine);

	function spell_click(id:string){
		
		let index = spell_list.map((item:SpellLine) => item.id).indexOf(id)
		setRecord(spell_list[index])
		setShowdata(false)
	}

	function handle_spell_submit(e:any) {
		e.preventDefault();
		spell_submit(e)
		spellClose()
	}

	function handle_init_submit(e: any){
		e.preventDefault();
		add_init(e)
		spellClose()
	}

	const [show_data,setShowdata] = useState(true)
	const [spellshow,Setshow] = useState({} as SpellLine)

	const [initMod,setInitMod] = useState(false)
	const [spellMod,setSpellMod] = useState(false)

	const initClose = () => setInitMod(false);
	const initOpen = () => setInitMod(true);
	
	const spellClose = () => setSpellMod(false);
	const spellOpen = () => setSpellMod(true);

	return (
		<>

		<Container fluid>
		<Row className='justify-content-md-center listfeed'><Col ><h1 style={{alignContent:'center',textAlign:'center'}}><Alert className='initbotheader'>Initiative Bot</Alert></h1></Col></Row>
			<Row className="justify-content-md-center">
			<Col md={3} className='bordercol'>
			<div className='mainborder'>
				<Row ><h2>Initiative</h2><Button className='screenbutborder' onClick={() => initOpen()}><TiPlus></TiPlus></Button></Row>
				<br></br>
				<ReactSortable group="initiative" list={init_list} setList={setInit} onUpdate={update_order}>
					{init_list != null
						? init_list.map((item:InitiativeLine) => {
								return <Alert key={item.id} style={{borderStyle:`${item.cmark ? 'double': 'none'}`,borderColor:`${item.cmark ? '#33ff00': 'black'}`,borderWidth:'10px'}}><Accordion className='initrecord'><InitRecord init_rec={item}/></Accordion></Alert>;
						  })
						: []}
				</ReactSortable>
				<br></br>
				{sorted ? <><Button className='screenbutborder' onClick={() => send_init()}>Send Initiative to Discord</Button>
					<br></br>
					<br></br>
				<Button className='screenbutborder' onClick={() => previous_turn()}>Previous</Button><Button className='screenbutborder' onClick={() => next_turn()}>Next</Button></>
				
				
				:[]}
				
				<Button className='screenbutborder' onClick={() => sort_list()}>Sort Initiative</Button>
				</div>
				<br></br>
				<br></br>
				<Modal show={initMod} onHide={initClose}><InitForm handle_submit={handle_init_submit}/></Modal>
			</Col>
			<Col xs='auto' className='bordercol'><div className='inbetweenborder'></div></Col>
			<Col md={2} className='bordercol'>
			<div className='mainborder'>
			<Row ><h2>Spells</h2><Button onClick={() => spellOpen()} className='screenbutborder'><TiPlus></TiPlus></Button></Row>
			<ListGroup variant="flush">
				{spell_list != null
						? spell_list.map((item:SpellLine) => {
								return <ListGroup.Item key={item.id} action onClick={(e) => spell_click(item.id)}>{item.name}<TiDeleteOutline style={{float:'right'}} onClick={() => remove_spell(item.id)}/></ListGroup.Item>;
						  })
						: []}
			</ListGroup>
			{spell_list != null ? <><br></br><Button className='screenbutborder' onClick={() => send_spells()}>Send Spells to Discord</Button>
				</>
				:[]}
			</div>
			</Col>
			<Col xs='auto' className='bordercol'><div className='inbetweenborder-two'></div></Col>
			<Col md={3} className='bordercol'>
			<div className='mainborder'>
				{/* @ts-ignore*/}
				<SpellRecord change_color={change_color} record={record} show_data={show_data} setRecord={setRecord}/>
				</div>
				<Modal show={spellMod} onHide={spellClose}><SpellForm handle_submit={handle_spell_submit} /></Modal>
			</Col>
			</Row>
		</Container>
		</>
	);
}


{/* <div className='mainborder'>
					{spell_list != null
						? spell_list.map((item:SpellLine) => {
								return <Row key={item.id} style={{marginBottom:'10px'}}><SpellRecord change_color={change_color} spell_rec={item} /></Row>;
						  })
						: []}
				{spell_list != null ? <><Button onClick={() => send_spells()}>Send Spells to Discord</Button>
				<br></br>
				<br></br>
				</>
				:[]}
				</div>
				<Row><SpellForm char_data={init_list} handle_submit={spell_submit}/></Row> */}