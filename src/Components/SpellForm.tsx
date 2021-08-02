import React from "react";
import {
	Form,
	OverlayTrigger,
	Tooltip,
	InputGroup,
	FormControl,
	Button,
} from "react-bootstrap";
import {InitiativeLine} from '../Interfaces/Interfaces'

export default function SpellForm({handle_submit,char_data}:{handle_submit:VoidFunction,char_data:InitiativeLine[]}) {
	return (
		<div>
			<Form onSubmit={handle_submit} id='spell-form'>
				<Form.Label htmlFor="inlineFormInput" visuallyHidden>
					Spell Name
				</Form.Label>
				<Form.Control
					className="mb-2"
					id="inlineFormInput"
					placeholder="Spell name"
				/>
				{/* <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
					Target
				</Form.Label>
				<InputGroup className="mb-2">
					<OverlayTrigger
						key="1"
						placement="top"
						overlay={
							<Tooltip id={`1`}>
								Who is the spell targeting?
							</Tooltip>
						}
					>
						<InputGroup.Text>?</InputGroup.Text>
					</OverlayTrigger>
								<Form.Select className="me-sm-2" id="inlineFormCustomSelect">
									<option value="0">Choose Target</option>
									<option value="1">Party</option>
                                    {char_data != null ? char_data.map((current:InitiativeLine)=> {
                                        return <option key={current.id} value={current.id}>{current.name}</option>
                                    }):[]}
								</Form.Select>
				</InputGroup> */}
				<InputGroup className="mb-2">
				<OverlayTrigger
						key="2"
						placement="top"
						overlay={
							<Tooltip id={`2`}>
								Poison, Strength Drain, etc.
							</Tooltip>
						}
					>
                <InputGroup.Text id="basic-addon1">Effect</InputGroup.Text>
				</OverlayTrigger>
								<FormControl
									placeholder="Effect"
									aria-label="Effect"
									aria-describedby="basic-addon1"
								/>
								</InputGroup>
				<Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
					Duration
				</Form.Label>
				<InputGroup className="mb-2">
                <InputGroup.Text id="basic-addon1">Duration</InputGroup.Text>
								<FormControl
									placeholder="Duration"
									aria-label="Duration"
									aria-describedby="basic-addon1"
								/>
								<Form.Select className="me-sm-2" id="inlineFormCustomSelect">
									<option value="0">Choose...</option>
									<option value="1">Round(s)</option>
									<option value="2">Minute(s)</option>
									<option value="3">Day(s)</option>
									<option value="4">Month(s)</option>
								</Form.Select>
				</InputGroup>

				<Button type="submit" className="mb-2">
					Submit
				</Button>
			</Form>
		</div>
	);
}
