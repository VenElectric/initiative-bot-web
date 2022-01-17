import {useState} from "react";
import SpellInfo from "./SpellInfo";
import SpellRecordList from "./SpellRecordList";
import RecordProvider from "../Context/RecordContext";
import { SpellObject } from "../Interfaces/initiative";
import { GetSpellContext } from "../Context/SpellContext";

export default function SpellWrapper({ sessionId }: { sessionId: string }) {
    const spells = GetSpellContext();

    
  return (
    <>
      <div>
        <SpellRecordList sessionId={sessionId} />
      </div>
      <div>
        
          <SpellInfo sessionId={sessionId} />
      </div>
    </>
  );
}
