import { TiDeleteOutline } from "react-icons/ti";
import { BsArrowUpDown } from "react-icons/bs";
import {
  Accordion,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Alert,
  Form
} from "react-bootstrap";
import CustomToggleIcon from "./CustomToggleIcon";
import { InitiativeObjectEnums } from "../Interfaces/ContextEnums";
import { isInitiativeObject } from "../services/server";
import { InitiativeObject,InitiativeFunctionTypes } from "../Interfaces/initiative";
import { useState, useEffect } from "react";

export default function InitRecord({ sessionId, contextFunctions, initiative }: { sessionId: string, contextFunctions: InitiativeFunctionTypes, initiative: InitiativeObject }) {
  let borderStyle = "none"
  let borderColor = "black"

  if (initiative !== undefined && isInitiativeObject(initiative)) {
    borderStyle = initiative.isCurrent ? "solid" : "none";
    borderColor = initiative.isCurrent ? "#33ff00" : "black";
  }
  const [record,setRecord] = useState(initiative)

  

  
 

  return (
    <>
      {record !== undefined && isInitiativeObject(record) ? (
        <Form>
        <Alert
          key={record.id}
          style={{
            borderStyle: `${borderStyle}`,
            borderColor: `${borderColor}`,
            borderWidth: "3px",
          }}
        >
          <Accordion className="initrecord">
            <Card style={{ width: "100%" }} className="spellcard">
              <Card.Header style={{ alignItems: "center", width: "100%" }}>
                <Row>
                  <InputGroup
                    className="mb-2"
                    size="sm"
                    style={{
                      fontSize: "1.5rem",
                      alignItems: "center",
                      marginInlineEnd: ".50rem",
                    }}
                  >
                    <InputGroup.Text
                      style={{ fontSize: "1rem", height: "1.8rem" }}
                      className="initrecordinputtext"
                    >
                      <BsArrowUpDown />
                    </InputGroup.Text>
                    <Button
                      className="screenbut"
                      id="button-addon1"
                      onClick={() =>
                        contextFunctions.SET_CURRENT_TURN(
                          sessionId,
                          record.id
                        )
                      }
                    >
                      Current
                    </Button>
                    <TiDeleteOutline
                      style={{ color: "#33ff00" }}
                      onClick={() =>
                        contextFunctions.DELETE_INITIATIVE(
                          sessionId,
                          record.id
                        )
                      }
                    />
                    <FormControl
                      className="screeninput"
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      value={record.characterName}
                      onChange={(e) =>
                        contextFunctions.UPDATE_INITIATIVE(
                          sessionId,
                          InitiativeObjectEnums.characterName,
                          record,
                          setRecord,
                          e.target.value // string
                        )}
                      style={{ width: "20%" }}
                    />

                    <CustomToggleIcon eventKey={record.id}></CustomToggleIcon>
                  </InputGroup>
                </Row>
              </Card.Header>
              <Accordion.Collapse eventKey={record.id}>
                <Card.Body>
                  <InputGroup className="mb-3" size="sm">
                    <InputGroup.Text
                      className="initrecordinputtext"
                      id="inputGroup-sizing-default"
                    >
                      Initiative Total
                    </InputGroup.Text>
                    <FormControl
                      className="screeninput"
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      value={String(record.initiative)}
                      onChange={(e) =>
                        contextFunctions.UPDATE_INITIATIVE(
                          sessionId,
                          InitiativeObjectEnums.initiative,
                          record,
                          setRecord,
                          Number(e.target.value) // number
                        )
                      }
                    />
                    <Button
                      onClick={() =>
                        contextFunctions.RE_ROLL(sessionId, record)
                      }
                      className="screenbut"
                      id="button-addon2"
                    >
                      Reroll
                    </Button>
                  </InputGroup>
                  <InputGroup className="mb-3" size="sm">
                    <InputGroup.Text
                      className="initrecordinputtext"
                      id="inputGroup-sizing-default"
                    >
                      Initiative Modifier
                    </InputGroup.Text>
                    <FormControl
                      className="screeninputnobut"
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      value={String(record.initiativeModifier)}
                      onChange={(e) =>
                        contextFunctions.UPDATE_INITIATIVE(
                          sessionId,
                          InitiativeObjectEnums.initiativeModifier,
                          record,
                          setRecord,
                          Number(e.target.value) // number
                        )
                      }
                    />
                  </InputGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Row>
              {/* <EffectsContainer initiative={record} /> */}
            </Row>
          </Accordion>
        </Alert>
        </Form>
      ) : (
        []
      )}
    </>
  );
}
