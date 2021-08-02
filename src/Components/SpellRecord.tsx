import { useState,useRef,useContext } from "react";
import { MdDeleteForever } from "react-icons/md";
import { SpellLine, InitiativeLine } from "../Interfaces/Interfaces";
import SpellTarget from "./SpellTarget";
import { InitContext } from "../Context/InitContext";
import {SpellContext} from '../Context/SpellContext'
import {
	Container,
	Card,
	ListGroup,
	InputGroup,
	FormControl,
	Form,
	Col,
	Row,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

export default function SpellRecord({
	spell_rec,
	change_color
}: {
	spell_rec: SpellLine;
	change_color:any
}) {
	const {update_status_color} = useContext(InitContext)
	const {remove_spell,spell_list,setSpells} = useContext(SpellContext)

	const [record,setRecord] = useState(spell_rec)

	function select_handler(e:any){
		console.log(e.target.value)
	}

	function change_handler(key:string,e:any){
		let new_state = record
		//@ts-ignore
		new_state[key] = e.target.value
		setRecord(new_state)
		let new_init = [...spell_list]
		let init_index = spell_list.map((item:any) => item.id).indexOf(record.id)
		new_init[init_index] = {...record}
		setSpells(new_init)
	}
	return (
		<Container>
			<Card>
				<Card.Body>
					<Form>
						<Card.Title>
						<InputGroup className="mb-2">
						<MdDeleteForever style={{color:'red'}} onClick={() => remove_spell(spell_rec.id)}/>
						<Form.Control
								type="color"
								id="exampleColorInput"
								defaultValue={spell_rec.color}
								title="Choose your color"
								onChange={(e) => {change_color(e,spell_rec.id);update_status_color(e,spell_rec.id)}}
							/>
								<OverlayTrigger
									key="1"
									placement="top"
									overlay={
										<Tooltip id={`1`}>Choose a status effect color</Tooltip>
									}
								>
									<InputGroup.Text>?</InputGroup.Text>
								</OverlayTrigger>
							<FormControl
								placeholder="Spell Name"
								aria-label="Spell Name"
								aria-describedby="basic-addon1"
								value={spell_rec.name}
								onChange={(e) => change_handler('name',e)}
							/>
							</InputGroup>
						</Card.Title>
						<Row>
							<ListGroup className="float-left col-4">
								<ListGroup.Item>
									<InputGroup className="mb-3">
										<InputGroup.Text id="basic-addon1">
											Duration
										</InputGroup.Text>
										<FormControl
											placeholder="Duration"
											aria-label="Duration"
											aria-describedby="basic-addon1"
											value={spell_rec.duration_num}
											onChange={(e) => change_handler('duration_num',e)}
										/>
										<Form.Select
											className="me-sm-2"
											id="inlineFormCustomSelect"
											defaultValue={spell_rec.duration_type}
											onChange={(e) => change_handler('duration_type',e)}
										>
											<option value="0">Choose...</option>
											<option value="1">Round(s)</option>
											<option value="2">Minute(s)</option>
											<option value="3">Day(s)</option>
											<option value="4">Month(s)</option>
										</Form.Select>
									</InputGroup>
								</ListGroup.Item>
								<ListGroup.Item>
									<InputGroup className="mb-3">
										<InputGroup.Text id="basic-addon1">Effect</InputGroup.Text>
										<FormControl
											placeholder="Effect"
											aria-label="Effect"
											aria-describedby="basic-addon1"
											value={spell_rec.effect}
											onChange={(e) => change_handler('effect',e)}
										/>
									</InputGroup>
								</ListGroup.Item>
							</ListGroup>
							<Col className="col-8 float-right">
								<SpellTarget spell_rec={spell_rec} spell_name={spell_rec.name} spell_id={spell_rec.id} spell_color={spell_rec.color}/>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}
