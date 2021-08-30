import React,{useContext,useEffect,useState,useRef} from "react";
import { Container, Row,Button,Col,Accordion,Alert,ListGroup,Modal,ToastContainer,Toast } from "react-bootstrap";
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

export default function SessionPage() {

	const projectkey = 'initiativebot'
	const {resort,load_init,init_list,add_init,setInit,sorted,sort_list,next_turn,previous_turn,setSort,setOndeck,update_order,send_init} = useContext(InitContext)
	const {load_spells,spell_list,spell_submit,change_color,setSpells,send_spells,remove_spell} = useContext(SpellContext)
	const socket = useContext(SocketContext);
	let mounted = useRef(true)

	const [showA, setShowA] = useState(false);
 

  	const toggleShowA = () => setShowA(!showA);

	mounted.current = true
	useEffect(() => {
		socket.on('client_init',function(data:any){
			// used for updating initiative
			setInit([...data.initiative])
			setSort(data.sort)
			setOndeck(data.ondeck)
		})

		socket.on('client_add_init',function(data:any){
			// called when new initiative is added to the list
			setTimeout(()=>{
				//@ts-ignore
				let old_data =  JSON.parse(localStorage.getItem(`${projectkey}character`))
				old_data.push(data.initiative)
				setInit(old_data)
				setSort(data.sort)
			},1000)
		})

		socket.on('client_update_init',function(data:any){
			// when values are updated in an initiative record
			let new_init = data.initiative as InitiativeLine
			let init_index = init_list.map((item:any) => item.id).indexOf(new_init.id)
			let new_state = [...init_list]
			new_state[init_index] = new_init
			setInit(new_state)
		})

		socket.on('client_remove_init',function(data:any){
			// when an initiative record is removed
			setTimeout(()=>{
			//@ts-ignore
			let new_state =  JSON.parse(localStorage.getItem(`${projectkey}character`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.id)
			new_state.splice(index,1)
			setInit(new_state)
		},1000)
		})

		socket.on('client_update_spell',function(data:any){
			// when values are updated for a spell effect
			setTimeout(()=>{
				//@ts-ignore
			let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.spell.id)
			new_state[index] = {...data.spell}
			setSpells(new_state)
		},1000)
		})


		socket.on('add_spell',function(data:any){
			// add a new spell
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
			// when spell is deleted
			setTimeout(()=>{
				//@ts-ignore
			let new_state = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
        	let index = new_state.map((item:any) => item.id).indexOf(data.id)
			new_state.splice(index,1)
			setSpells(new_state)
		},1000)
		})

		socket.on('client_update_target',function(data:any){
			// called whenever the target list is updated for a spell effect. 
			// The main list holds a list of characters not targeted by the spell
			// target list holds a list of characters that are targeted by the spell
			let spell_id = data.id
			localStorage.setItem(`${projectkey}target_list${spell_id}`, JSON.stringify(data.target))
			localStorage.setItem(`${projectkey}main_list${spell_id}`, JSON.stringify(data.main))
		})

		socket.on('client_roundstart',function(data:any){
			// start rounds/game start
			let new_state = data.initiative
			let sort = data.sort
			let on_deck = data.ondeck
			setInit(new_state)
			setSort(sort)
			setOndeck(on_deck)
		})

		socket.on('save_complete',function(data:any){
			// show pop up when data is aved
			toggleShowA()
		})
	}, [])

	useEffect(()=> {
	if (mounted.current){
		// load spells and initiative from db
		load_spells()
		load_init()
		
	}
		return () => {
		  mounted.current=false
		}
	  },[load_spells,load_init])


	const [record, setRecord] = useState({} as SpellLine);

	function spell_click(id:string){
		// click on spell name to show spell info
		let index = spell_list.map((item:SpellLine) => item.id).indexOf(id)
		// spell record updated so that info window updates whenever you click a different spell
		setRecord(spell_list[index])
		setShowdata(false)
	}

	function handle_spell_submit(e:any) {
		// handle adding new spell
		e.preventDefault();
		spell_submit(e)
		spellClose()
	}

	function handle_init_submit(e: any){
		// handle adding new initiative
		e.preventDefault();
		add_init(e)
		initClose()
	}

	function save_data(){
		// grab the data from local storage, send to server to save in db
		//@ts-ignore
		let init_data = JSON.parse(localStorage.getItem(`${projectkey}character`))
		console.table(init_data)
		//@ts-ignore
		let spell_data = JSON.parse(localStorage.getItem(`${projectkey}spell_list`))
		console.table(spell_data)
		//@ts-ignore
		let ondeck = localStorage.getItem(`${projectkey}character_ondeck`)
		// React was most likely adding in escape characters to these values so they need to be removed when sending to db
		ondeck?.replace('/','')
		ondeck?.replace('"','')
		console.log(ondeck)
		//@ts-ignore
		let sort = localStorage.getItem(`${projectkey}character_sort`)
		sort?.replace('/','')
		sort?.replace('"','')
		let session_id = localStorage.getItem('session_id')

		if (init_data !== [] && spell_data !== []){
			socket.emit('server_save',{spells:spell_data,init:init_data,room:session_id,ondeck:ondeck,sort:Boolean(sort)})
		}
	}

	const [show_data,setShowdata] = useState(true)
	const [spellshow,Setshow] = useState({} as SpellLine)

	const [initMod,setInitMod] = useState(false)
	const [spellMod,setSpellMod] = useState(false)

	// modal form functions 
	const initClose = () => setInitMod(false);
	const initOpen = () => setInitMod(true);
	
	const spellClose = () => setSpellMod(false);
	const spellOpen = () => setSpellMod(true);

	
 

	return (
		<>
		<ToastContainer  position="middle-center">
          <Toast show={showA} onClose={toggleShowA} className="p-3 ">
            <Toast.Header closeButton={true}>
            </Toast.Header>
            <Toast.Body>Save Complete</Toast.Body>
          </Toast>
        </ToastContainer>
		<br></br>
<Row className='justify-content-md-center listfeed'><h1 style={{alignContent:'center',textAlign:'center'}}><Alert className='initbotheader'>Dungeon Bot</Alert></h1></Row>
<br></br>
<br></br>
<Row className='justify-content-md-center listfeed'><Button className='screenbutborder' onClick={()=> save_data()}>Save Data</Button></Row>
		<Container fluid>
		<br></br>
		<br></br>
			<Row md={10} className="justify-content-md-center">
			<Col lg={3} md={7} className='bordercol'>
			<div className='mainborder'>
				<Row ><h2>Initiative</h2><Button className='screenbutborder' onClick={() => initOpen()}><TiPlus></TiPlus></Button></Row>
				<br></br>
				{init_list ?
				<ReactSortable group="initiative" list={init_list} setList={setInit} onUpdate={update_order}>
				{init_list
					? init_list.map((item:InitiativeLine) => {
							return <Alert key={item.id} style={{borderStyle:`${item.cmark ? 'solid': 'none'}`,borderColor:`${item.cmark ? '#33ff00': 'black'}`,borderWidth:'3px'}}><Accordion className='initrecord'><InitRecord init_rec={item}/></Accordion></Alert>;
					  })
					: []}
			</ReactSortable>
			:[]}
				
				<br></br>
				{sorted ? <><Button className='screenbutborder' onClick={() => send_init()}>Send Initiative to Discord</Button>
					<br></br>
					<br></br>
				<Button className='screenbutborder' onClick={() => previous_turn()}>Previous</Button><Button className='screenbutborder' onClick={() => next_turn()}>Next</Button></>
				
				
				:[]}
				
				{sorted ? <Button className='screenbutborder' onClick={() => resort()}>Sort Initiative</Button>:<Button className='screenbutborder' onClick={() => sort_list()}>Sort Initiative</Button>}
				</div>
				<br></br>
				
				<Modal show={initMod} onHide={initClose}><InitForm handle_submit={handle_init_submit}/></Modal>
			</Col>
			<Col xs='auto' className='bordercol'><div className='inbetweenborder'></div></Col>
			<Col lg={2} md={6} className='bordercol'>
			<div className='mainborder'>
			<Row ><h2>Spells</h2><Button onClick={() => spellOpen()} className='screenbutborder'><TiPlus></TiPlus></Button></Row>
			<ListGroup variant="flush">
				{spell_list != null
						? spell_list.map((item:SpellLine) => {
								return <ListGroup.Item key={item.id}><Button className='listbuttonborder' onClick={(e) => spell_click(item.id)}>{item.name}</Button><TiDeleteOutline onClick={() => remove_spell(item.id)} style={{float:'right'}}/></ListGroup.Item>;
						  })
						: []}
			</ListGroup>
			{spell_list != null ? <><br></br><Button className='screenbutborder' onClick={() => send_spells()}>Send Spells to Discord</Button>
				</>
				:[]}
			</div>
			<br></br>
			</Col>
			
			<Col xs='auto' className='bordercol'><div className='inbetweenborder-two'></div></Col>
			
			<Col lg={3} md={7} className='bordercol'>
			<div className='infoborder'>
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


