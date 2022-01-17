import React from "react";
import { Button } from "react-bootstrap";
import {
  GetSortContext,
} from "../Context/InitiativeContext";
import { InitiativeFunctionTypes } from "../Interfaces/initiative";


export default function SortButton({ sessionId,contextFunctions }: { sessionId: string, contextFunctions:InitiativeFunctionTypes}) {
  const isSorted = GetSortContext();
  return (
    <div>
      {isSorted ? (
        <>
          <Button
            className="screenbutborder"
            onClick={() =>
              contextFunctions.DISCORD_INITIATIVE(sessionId)
            }
          >
            Send Initiative to Discord
          </Button>

          <br></br>
          <br></br>

          <Button
            className="screenbutborder"
            onClick={() => contextFunctions.PREVIOUS(sessionId)}
          >
            Previous
          </Button>

          <Button
            className="screenbutborder"
            onClick={() => contextFunctions.NEXT(sessionId)}
          >
            Next
          </Button>
        </>
      ) : (
        []
      )}

      {isSorted ? (
        <Button className="screenbutborder" onClick={() => contextFunctions.RESORT(sessionId)}>
          Sort Initiative
        </Button>
      ) : (
        <Button className="screenbutborder" onClick={() => contextFunctions.ROUND_START(sessionId)}>
          Sort Initiative
        </Button>
      )}
    </div>
  );
}
