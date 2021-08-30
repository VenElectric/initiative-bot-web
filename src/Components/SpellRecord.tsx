import { useState, useRef, useContext, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { SpellLine, InitiativeLine } from "../Interfaces/Interfaces";
import SpellTarget from "./SpellTarget";
import { InitContext } from "../Context/InitContext";
import { SpellContext } from "../Context/SpellContext";
import { SocketContext } from "../Context/SocketContext";
import useLocalStorage from "../Hooks/useLocaleStorage";
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
  record,
  change_color,
  show_data,
  setRecord
}: {
  record: SpellLine;
  change_color: any;
  show_data: boolean;
  setRecord: any;
}) {
  const { spell_list, setSpells } = useContext(SpellContext);
  const socket = useContext(SocketContext);
  
  

 
  

  function change_handler(key: string, e: any) {
    // handle value changes for spell record
    let new_state = record;
    //@ts-ignore
    new_state[key] = e.target.value;
    setRecord(new_state);
    let new_spells = [...spell_list];
    let spell_index = spell_list.map((item: any) => item.id).indexOf(record.id);
    new_spells[spell_index] = { ...record };
    setSpells(new_spells);
    let session_id = localStorage.getItem('session_id')
    
    socket.emit('server_update_spell',{room:session_id,spell:new_spells[spell_index]})
  }


  
  return (
   <>
      <h3>Spell Info</h3>
      <Card className="spellcard">
        <Form>
          <Card.Header>
            <InputGroup className="mb-2" size="sm">
              <FormControl
                className="screeninputnobut"
                disabled={show_data}
                aria-label="Spell Name"
                aria-describedby="basic-addon1"
                defaultValue={record.name ? record.name : ""}
                onChange={(e) => change_handler("name", e)}
              />
            </InputGroup>
          </Card.Header>
          <Card.Body>
            <Row>
              <InputGroup size="sm">
                <InputGroup.Text id="basic-addon1" className="spellinputtext">
                  Duration
                </InputGroup.Text>
                <FormControl
                  className="screeninput"
                  disabled={show_data}
                  aria-label="Duration"
                  aria-describedby="basic-addon1"
                  defaultValue={
                    record.duration_num
                  }
                  onChange={(e) => change_handler("duration_num", e)}
                />

                <Form.Select
                  disabled={show_data}
                  id="inlineFormCustomSelect"
                  value={
                    String(record.duration_type)
                  }
                  onChange={(e) => change_handler("duration_type", e)}
                >
                  <option value="0">Choose...</option>
									<option value="1">Round(s)</option>
									<option value="2">Minute(s)</option>
									<option value="3">Hour(s)</option>
									<option value="4">Day(s)</option>
									<option value="5">Month(s)</option>
                </Form.Select>
              </InputGroup>
            </Row>
            <br></br>
            <Row>
              <InputGroup size="sm">
                <InputGroup.Text id="basic-addon1" className="spellinputtext">
                  Effect
                </InputGroup.Text>
                <FormControl
                  className="screeninputnobut"
                  disabled={show_data}
                  aria-label="Effect"
                  aria-describedby="basic-addon1"
                  defaultValue={record.effect ? record.effect : ""}
                  onChange={(e) => change_handler("effect", e)}
                />
              </InputGroup>
            </Row>
            <br></br>
            <Row style={{ height: "100%" }} md={2}>
              <SpellTarget
                show_data={show_data}
                spell_rec={record}
                spell_name={record.name}
                spell_id={record.id}
                spell_effect={record.effect}
              />
            </Row>
          </Card.Body>
        </Form>
      </Card>
    </>
  );
}
