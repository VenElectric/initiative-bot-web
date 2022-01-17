import { createContext, useState, useContext, useEffect } from "react";
import { SpellObject, SetSpellType } from "../Interfaces/initiative";
import { SpellContextEnums } from "../Interfaces/ContextEnums";
import { SpellContextFunctions } from "./SpellContextFunctions";
import { weapon_of_logging } from "../Utils/LoggingClass";
import { Socket } from "socket.io-client";
import { spellReceiver } from "../services/SocketReceiver";

const SpellContext = createContext<SpellObject[]>([]);

const UpdateSpells = createContext<SetSpellType | undefined>(undefined);

export const GetSpellContext = () => {
  return useContext(SpellContext);
};

export const GetSetSpellContext = () => {
  return useContext(UpdateSpells);
};

const SpellProvider = ({
  sessionId,
  children,
  socket,
}: {
  sessionId: string;
  children: any;
  socket: Socket;
}) => {
  const [spells, setSpells] = useState<SpellObject[]>([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    SpellContextFunctions.INITIAL_SPELLS(sessionId)
      .then((spells: SpellObject[]) => {
        setSpells(spells);
      })
      .catch((error: any) => {
        weapon_of_logging.CRITICAL(
          error.name,
          error.message,
          error.stack,
          {},
          sessionId
        );
        setSpells([]);
      });
    setTimeout(() => {
      weapon_of_logging.INFO(
        SpellContextEnums.INITIAL_SPELLS,
        "grabbing initial spells",
        spells,
        sessionId
      );
      setLoad(false);
    }, 3000);
    return () => {
      setLoad(true);
    };
  }, []);

  useEffect(() => {
    spellReceiver(socket, setSpells, spells,sessionId);
  }, []);

  return (
    <>
      {!load ? (
        <div>Loading...</div>
      ) : (
        <SpellContext.Provider value={spells}>
          <UpdateSpells.Provider value={setSpells}>
            {children}
          </UpdateSpells.Provider>
        </SpellContext.Provider>
      )}
    </>
  );
};

export default SpellProvider;
