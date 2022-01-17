import InitiativeProvider from "../Context/InitiativeContext";
import SpellProvider from "../Context/SpellContext";
import SpellRecordList from "./SpellRecordList";
import InitiativeRecords from "./InitiativeRecords";
import SpellInfo from "./SpellInfo";
import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";
import InitiativeContextFunctions from "./InitiativeContextFunctions";
import SpellWrapper from "./SpellWrapper";
import {Row,Alert} from "react-bootstrap";

export default function MainSessionPage({sessionId}: {sessionId:string}) {
  const socket = useContext(SocketContext);
  console.info(sessionId, "main session page.js")

  return (
    <>
    <Row className="justify-content-md-center listfeed">
        <h1 className="title-content">
           <Alert className="initbotheader">Dungeon Bot</Alert>
         </h1>
       </Row>
       <br></br>
       <br></br>
      <InitiativeProvider sessionId={sessionId} socket={socket}>
        {/* <SpellProvider sessionId={sessionId} socket={socket}> */}
        
          <InitiativeContextFunctions sessionId={sessionId}></InitiativeContextFunctions>
          {/* <SpellWrapper sessionId={sessionId}></SpellWrapper> */}
        {/* </SpellProvider> */}
      </InitiativeProvider>
    </>
  );
}
