import { ReactSortable } from "react-sortablejs";
import { InitiativeObject,InitiativeFunctionTypes } from "../Interfaces/initiative";
import { Modal } from "react-bootstrap";
import InitRecord from "./InitRecord";
import {
  GetInitiativeContext,
  GetSetInitiativeContext,
} from "../Context/InitiativeContext";
import SortButton from "./SortButton";

// Custom toggle for initiative accordion
export default function InitiativeRecords({
  sessionId,
  contextFunctions,
}: {
  sessionId: string;
  contextFunctions: InitiativeFunctionTypes;
}) {
  const initiativeList = GetInitiativeContext();
  const setInitiative = GetSetInitiativeContext();

  return (
    <>
      {initiativeList !== [] ? (
        <ReactSortable
          group="initiative"
          list={initiativeList}
          setList={setInitiative}
          onUpdate={(e: any) => {
            contextFunctions.UPDATE_ORDER(e, sessionId);
          }}
        >
         {initiativeList.map((record: InitiativeObject) => {
                return (
                 
                    <InitRecord
                      initiative={record}
                      sessionId={sessionId}
                      contextFunctions={contextFunctions}
                      key={record.id}
                    />
                  
                );
              })}
        </ReactSortable>
      ) : (
        []
      )}
      <SortButton sessionId={sessionId} contextFunctions={contextFunctions}></SortButton>
      {/* <Modal show={initMod} onHide={initClose}>
             <InitForm handle_submit={handle_init_submit} />
             </Modal>     */}
    </>
  );
}