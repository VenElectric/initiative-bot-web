import React,{useContext} from "react";
import {
	Form,
	OverlayTrigger,
	Tooltip,
	InputGroup,
	FormControl,
	Button,
} from "react-bootstrap";
import { InitContext } from "../Context/InitContext";
import { SocketContext } from "../Context/SocketContext";

export default function InitForm() {

	const {add_init} = useContext(InitContext)
	const socket = useContext(SocketContext);
	return (
		<div>
			<Form onSubmit={add_init} id='init-form'>
				<Form.Label htmlFor="inlineFormInput" visuallyHidden>
					Character Name
				</Form.Label>
				<Form.Control
					className="mb-2"
					id="inlineFormInput"
					placeholder="Character Name"
				/>
				<InputGroup className="mb-2">
					<OverlayTrigger
						key="1"
						placement="top"
						overlay={
							<Tooltip id={`0`}>
								Player Character or Non Player Character?
							</Tooltip>
						}
					>
						<InputGroup.Text>?</InputGroup.Text>
					</OverlayTrigger>
					<Form.Label htmlFor="inlineFormInput" visuallyHidden>
						Character Type
					</Form.Label>
					<Form.Select className="me-sm-2" id="inlineFormCustomSelect">
						<option value="0">PC</option>
						<option value="1">NPC</option>
					</Form.Select>
				</InputGroup>
				<Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
					Initiative
				</Form.Label>
				<InputGroup className="mb-2">
					<OverlayTrigger
						key="1"
						placement="top"
						overlay={
							<Tooltip id={`1`}>Your total initiative. D20+Modifier</Tooltip>
						}
					>
						<InputGroup.Text>?</InputGroup.Text>
					</OverlayTrigger>
					<FormControl
						id="inlineFormInputGroup"
						placeholder="Initiative Total"
					/>
					<Form.Label htmlFor="inlineFormInput" visuallyHidden>
						Roll For Me
					</Form.Label>
					<Form.Select className="me-sm-2" id="inlineFormCustomSelect">
						<option value="0">Player provides initiative</option>
						<option value="1">Dice Bot rolls for Initiative</option>
					</Form.Select>
				</InputGroup>
				<Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
					Modifier
				</Form.Label>
				<InputGroup className="mb-2">
					<OverlayTrigger
						key="2"
						placement="top"
						overlay={
							<Tooltip id={`2`}>
								The modifier you add to your intitiave roll.
							</Tooltip>
						}
					>
						<InputGroup.Text>?</InputGroup.Text>
					</OverlayTrigger>
					<FormControl
						id="inlineFormInputGroup"
						placeholder="Initiative Modifier"
					/>
				</InputGroup>

				<Button type="submit" className="mb-2">
					Submit
				</Button>
			</Form>
		</div>
	);
}
