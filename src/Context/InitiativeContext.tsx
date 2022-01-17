import { createContext, useState, useContext, useEffect } from "react";
import {
  InitiativeObject,
  SetInitiativeType,
  SetSortType,
} from "../Interfaces/initiative";
import { weapon_of_logging,errorCheck } from "../Utils/LoggingClass";
import { SessionFunctionTypes, EmitTypes } from "../Interfaces/EmitTypes";
import { initiativeReceiver } from "../services/SocketReceiver";
import { Socket } from "socket.io-client";
import { InitiativeContextEnums, CollectionTypes } from "../Interfaces/ContextEnums";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import { emitData } from "../Utils/SocketEmit";
import { isInitiativeObject, isSessionData } from "../services/server";
import useLocalStorage from "../Hooks/useLocaleStorage";

const InitiativeContext = createContext<InitiativeObject[]>([]);

const UpdateInitiative = createContext<SetInitiativeType | undefined>(
  undefined
);

const SortContext = createContext(false);

const UpdateSort = createContext<SetSortType | undefined>(undefined);

export const GetInitiativeContext = () => {
  return useContext(InitiativeContext);
};

export const GetSortContext = () => {
  return useContext(SortContext);
};

export const GetSetInitiativeContext = () => {
  return useContext(UpdateInitiative);
};
export const GetSetSortContext = () => {
  return useContext(UpdateSort);
};

const InitiativeProvider = ({
  children,
  sessionId,
  socket
}: {
  children: any;
  sessionId: string;
  socket: Socket;
}) => {
  const [initiativeList, setInitiative] = useLocalStorage<InitiativeObject[]>("initiative",JSON.stringify(sessionId),[]);
  const [isSorted, setSort] = useLocalStorage("isSorted",JSON.stringify(sessionId),false);
  const [load, setLoad] = useState(false);
  let session = localStorage.getItem("sessionId")

  interface InitialReturn {
    initiative: InitiativeObject[];
    isSorted: boolean;
  }

  async function INITIAL_INIT(
    sessionId: string
  ): Promise<void> {
    let sessionData;
   
   
    try {
      if (sessionId != null) {
        await emitData(
          socket,
          EmitTypes.GET_INITIAL,
          sessionId,
          async (data:any) => {
            try{
            
            setSort(data.isSorted)
            setInitiative(data.initiativeList)
          }
            catch(error){
              setSort(data.isSorted)
              console.info("there was an error geting is sorted or initiative")
              if (error instanceof Error){
                weapon_of_logging.WARN(error.name,error.message,error.stack,sessionId)
              }
            }
          },
          {},
          CollectionTypes.INITIATIVE
        );
          weapon_of_logging.INFO(
            "sessionData",
            "none",
            "successful set state",
            JSON.stringify(sessionId)
          );
        
      }
    } catch (error) {
     
      errorCheck(
        error,
        "there was an uncaught error",
        sessionId,
        [LoggingTypes.ERROR, LoggingTypes.DEBUG]
      );
    }
  }

  useEffect(() => {
    if (session != null){
      INITIAL_INIT(session)
      .then(() => {
        weapon_of_logging.DEBUG(InitiativeContextEnums.INITIAL_INIT,"retrieved data from server for initiative and sort","data retrieve",sessionId)
      })
      .catch((error: any) => {
        weapon_of_logging.DEBUG(InitiativeContextEnums.INITIAL_INIT,error.message,error.stack,sessionId)
        weapon_of_logging.CRITICAL(
          error.name,
          error.message,
          error.stack,
          {},
          sessionId
        );
      });
    setTimeout(() => {
      if (sessionId != null){
        weapon_of_logging.INFO(
          SessionFunctionTypes.GET_INITIAL_INIT,
          "grabbing initial init",
          initiativeList,
          sessionId
        );
        weapon_of_logging.DEBUG(InitiativeContextEnums.INITIAL_INIT,"set load to false","none",sessionId)
      }
      setLoad(true);
    }, 3000);
    return () => {
      setLoad(false);
    };
  }
    }
    , []);

  useEffect(() => {
    initiativeReceiver(socket, setInitiative, initiativeList,sessionId);
  },[])

  return (
    <>
      {!load ? (
        <div>Loading...</div>
      ) : (
        <InitiativeContext.Provider value={initiativeList}>
          <UpdateInitiative.Provider value={setInitiative}>
            <SortContext.Provider value={isSorted}>
              <UpdateSort.Provider value={setSort}>
                {children}
              </UpdateSort.Provider>
            </SortContext.Provider>
          </UpdateInitiative.Provider>
        </InitiativeContext.Provider>
      )}
    </>
  );
};

export default InitiativeProvider;
