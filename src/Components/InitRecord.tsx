import { useEffect,useState,useContext,useRef } from "react";
import { InitiativeLine } from "../Interfaces/Interfaces";
import { MdDeleteForever } from "react-icons/md";
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

	const {remove_init,set_current,reroll_init,init_list,setInit} = useContext(InitContext)


	// useEffect(() => {
	// 	//@ts-ignore
	// 	let rec_data = [...init_list]
	// 	let index = rec_data.map((item:any) => item.id).indexOf(init_rec.id)
	// 	// rec_data[index].status_effects
	// 	setRecord(new_data)
	// 	setInit(new_data)

	// }, [init_list])
	const [record,setRecord] = useState(init_rec)
	let mounted = useRef(true)
	
	// useEffect(()=>{
		
	// if (mounted.current){
	// 	setTimeout(()=>{
	// 		let new_state:InitiativeLine;
	// 		let record_index = init_list.map((item:any)=> item.id).indexOf(record.id)
	// 		new_state = {...init_list[record_index]}
	// 		setRecord(new_state)
	// 	},500)
	// }
	// return () => {
	// 	mounted.current = false
	// 	console.log(mounted.current)
    // }
	// },[init_list])

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
		let init_index = init_list.map((item:any) => item.id).indexOf(record.id)
		new_init[init_index] = {...record}
		setInit(new_init)
	}

	return (
		<>
		
		<Card style={{width:'100%'}}>
					<Card.Header style={{alignItems:'center',width:'100%'}}>
						
							<Row>
							<InputGroup className="mb-3" style={{height:'1.25rem',fontSize:'1.5rem',alignItems:'center',marginInlineEnd:'.50rem'}}>
								
							<InputGroup.Text id="inputGroup-sizing-sm"><BsArrowUpDown/></InputGroup.Text>
							<Button variant="outline-secondary" id="button-addon1" size='sm' onClick={() => set_current(record.id)}>
      							Current
    						</Button>
							<MdDeleteForever style={{color:'red'}} onClick={() => remove_init(record.id)}/>
								<FormControl
								size="sm"
								aria-label="Default"
								aria-describedby="inputGroup-sizing-default"
								value={record.name}
								onChange={(e) => change_handler('name',e.target.value)}
								style={{width:'20%',marginLeft:'1rem'}}
							/>
							
						<CustomToggleIcon eventKey={record.id}></CustomToggleIcon>
						</InputGroup>
						
						</Row>
					</Card.Header>
					<Accordion.Collapse eventKey={record.id}>
					<Card.Body>
						<InputGroup className="mb-3">
							<InputGroup.Text id="inputGroup-sizing-default">
								Initiative Total
							</InputGroup.Text>
							<FormControl
								aria-label="Default"
								aria-describedby="inputGroup-sizing-default"
								value={record.init}
								onChange={(e) => change_handler('init',e.target.value)}
							/>
							<Button onClick={() => init_roll()} variant="outline-secondary" id="button-addon2">
								Reroll
							</Button>
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Text id="inputGroup-sizing-default">
								Initiative Modifier
							</InputGroup.Text>
							<FormControl
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
