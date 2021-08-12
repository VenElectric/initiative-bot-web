import { useEffect,useState,useContext,useRef } from "react";
import { InitiativeLine } from "../Interfaces/Interfaces";
import {TiDeleteOutline} from 'react-icons/ti'
import {BsArrowUpDown} from "react-icons/bs";
import {
	Accordion,
	InputGroup,
	FormControl,
	Button,
    Row,
	Card,
	Col,
	Form
} from "react-bootstrap";
import EffectsContainer from "./EffectsContainer";
import { InitContext } from "../Context/InitContext";
import CustomToggleIcon from "./CustomToggleIcon";

export default function InitRecord({init_rec}: {init_rec:InitiativeLine}) {

	const {remove_init,set_current,reroll_init,init_list,setInit,char_list,setList} = useContext(InitContext)

	const [record,setRecord] = useState(init_rec)

	useEffect(()=> {
		let index = init_list.map((item:any)=> item.id).indexOf(record.id)
		let new_state = [...init_list]

		setRecord(new_state[index])
		
	},[init_list])
	

	async function init_roll(){
		await reroll_init(record.id)
		let new_state:InitiativeLine;
		let record_index = init_list.map((item:any)=> item.id).indexOf(record.id)
		new_state = {...init_list[record_index]}
		setRecord(new_state)
	}

	function change_handler(key:string,value:any){
		let new_state = record
		//@ts-ignore
		new_state[key] = value
		setRecord(new_state)
		let new_init = [...init_list]
		let new_char = [...char_list]
		let init_index = init_list.map((item:any) => item.id).indexOf(record.id)
		let char_index = new_char.map((item:any) => item.id).indexOf(record.id)
		new_init[init_index] = {...record}
		new_char[char_index] = {id:record.id,name:record.name,status_effects:record.status_effects}
		setInit(new_init)
		setList(new_char)
	}

	return (
		<>
		
		<Card style={{width:'100%'}} className='spellcard'>
					<Card.Header style={{alignItems:'center',width:'100%'}}>
						
							<Row>
							<InputGroup className='mb-2' size='sm' style={{fontSize:'1.5rem',alignItems:'center',marginInlineEnd:'.50rem'}}>
								
							<InputGroup.Text style={{fontSize:'1rem',height:'1.8rem'}} className='initrecordinputtext'><BsArrowUpDown/></InputGroup.Text>
							<Button className='screenbut' id="button-addon1" onClick={() => set_current(record.id)}>
      							Current
    						</Button>
							<TiDeleteOutline style={{color:'#33ff00'}} onClick={() => remove_init(record.id)}/>
								<FormControl
								className='screeninput'
								
								aria-label="Default"
								aria-describedby="inputGroup-sizing-default"
								value={record.name}
								onChange={(e) => change_handler('name',e.target.value)}
								style={{width:'20%'}}
							/>
							
						<CustomToggleIcon eventKey={record.id}></CustomToggleIcon>
						</InputGroup>
						
						</Row>
					</Card.Header>
					<Accordion.Collapse eventKey={record.id}>
					<Card.Body>
						<InputGroup className="mb-3" size='sm'>
							<InputGroup.Text className='initrecordinputtext' id="inputGroup-sizing-default">
								Initiative Total
							</InputGroup.Text>
							<FormControl
							className='screeninput'
								aria-label="Default"
								aria-describedby="inputGroup-sizing-default"
								value={record.init}
								onChange={(e) => change_handler('init',e.target.value)}
							/>
							<Button onClick={() => init_roll()} className='screenbut' id="button-addon2">
								Reroll
							</Button>
						</InputGroup>
						<InputGroup className="mb-3" size='sm'>
							<InputGroup.Text className='initrecordinputtext' id="inputGroup-sizing-default">
								Initiative Modifier
							</InputGroup.Text>
							<FormControl
							className='screeninputnobut'
								aria-label="Default"
								aria-describedby="inputGroup-sizing-default"
								value={record.init_mod}
								onChange={(e) => change_handler('init_mod',e.target.value)}
							/>
						</InputGroup>
						</Card.Body>
						</Accordion.Collapse>
				</Card>	
				<Row><EffectsContainer init_rec={record} /></Row>
				
		</>
	);
}
