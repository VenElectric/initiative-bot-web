import { createContext, useContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { InitiativeObject, SetRecordType, SpellObject } from "../Interfaces/initiative";
import { SocketContext } from "./SocketContext";
import useLocalStorage from "../Hooks/useLocaleStorage";

const RecordContext = createContext<InitiativeObject | SpellObject | undefined>(undefined);
const UpdateRecord = createContext<SetRecordType | undefined>(undefined);

export const GetRecordContext = () => {
  return useContext(RecordContext);
};

export const GetSetRecordContext = () => {
  return useContext(UpdateRecord);
};

const RecordProvider = ({
  children,
  item,
  sessionId
}: {
  children: any;
  item: InitiativeObject | SpellObject;
  sessionId: string;
}) => {

  const [record, setRecord] = useState(item)

  useEffect(() => {
    console.info("remounting")
    return () => {
      console.info("unmounting")
    };
  })

  return (
    <RecordContext.Provider value={record}>
      <UpdateRecord.Provider value={setRecord}>
      {children}
      </UpdateRecord.Provider>
    </RecordContext.Provider>
  );
};

export default RecordProvider;
