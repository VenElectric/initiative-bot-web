import { reactive } from "vue";
import {
  CharacterStatus,
  InitiativeObject,
  SpellObject,
  StatusEffect,
} from "../Interfaces/initiative";
import { CollectionTypes } from "../Interfaces/ContextEnums";
import { EmitTypes, SocketData } from "../Interfaces/EmitTypes";
import { io, Socket } from "socket.io-client";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { Character, CharacterPickListEvent } from "./types";
import { v4 as uuidv4 } from "uuid";

const sessionData = reactive({
  initiativeList: [] as InitiativeObject[],
  isSorted: false,
  spells: [] as SpellObject[],
  sessionId: "",
  socket: io("localhost:8000"),
});

const updateId = (id: string): void => {
  sessionData.sessionId = id;
};

const getInitial = (): void => {
  console.info("First into function");
  sessionData.socket.emit(
    "GET_INITIAL",
    {
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
    },
    (query: any) => {
      sessionData.initiativeList = query.initiativeList;
      sessionData.isSorted = query.isSorted;
    }
  );
};

const getInitialSpells = (): void => {
  sessionData.socket.emit(
    "GET_SPELLS",
    {
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.SPELLS,
    },
    (query: any) => {
      console.log(query);
      sessionData.spells = query.spells;
    }
  );
};

const updateCharacter = (
  ObjectType: string,
  toUpdate: any,
  docId: string
): void => {
  const options = {
    ObjectType: ObjectType,
    toUpdate: toUpdate,
    CollectionType: CollectionTypes.INITIATIVE,
    sessionId: sessionData.sessionId,
    id: docId,
  };
  console.log(options);
  sessionData.socket.emit(EmitTypes.UPDATE_ITEM, options, (data: any) => {
    console.info(data);
  });
};

const addCharacter = (data: Character, roll: boolean, npc: boolean): void => {
  const characterId = String(uuidv4());
  let diceroll;
  if (roll) {
    const newRoll = new DiceRoll(`d20+${String(data.initiativeModifier)}`);
    diceroll = Number(newRoll.total);
  } else {
    diceroll = data.initiative;
  }

  // construct the object
  const newData = {
    id: characterId,
    characterName: data.characterName,
    initiative: Number(diceroll),
    initiativeModifier: Number(data.initiativeModifier),
    isCurrent: false,
    roundOrder: 0,
    isNpc: npc,
    statusEffects: [],
  };

  sessionData.initiativeList.push(newData);

  if (sessionData.spells !== []) {
    sessionData.spells.forEach((spell: SpellObject) => {
      spell.characterIds[0].push({
        characterName: newData.characterName,
        characterId: newData.id,
      });
    });

    sessionData.socket.emit(
      EmitTypes.UPDATE_ALL,
      {
        payload: sessionData.spells,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
      } as SocketData,
      (data: any) => {
        console.info(data);
      }
    );
  }

  sessionData.socket.emit(
    EmitTypes.CREATE_NEW,
    {
      payload: newData as InitiativeObject,
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
    } as SocketData,
    (data: any) => {
      console.info(data);
    }
  );
};

const removeCharacter = (index: number, id: string): void => {
  sessionData.initiativeList.splice(index, 1);
  for (const spell of sessionData.spells) {
    const indexZero = spell.characterIds[0]
      .map((item: CharacterStatus) => item.characterId)
      .indexOf(id);
    const indexOne = spell.characterIds[1]
      .map((item: CharacterStatus) => item.characterId)
      .indexOf(id);

    spell.characterIds.splice(indexZero != -1 ? indexZero : indexOne, 1);
  }
  console.log(sessionData.spells);
  sessionData.socket.emit(
    EmitTypes.DELETE_ONE,
    {
      payload: [],
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
      docId: id,
    } as SocketData,
    (data: any) => {
      console.info(data);
    }
  );
  sessionData.socket.emit(
    EmitTypes.UPDATE_ALL,
    {
      payload: sessionData.spells,
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.SPELLS,
    },
    (data: any) => {
      console.info(data);
    }
  );
};

const addSpell = (data: any): void => {
  const id = uuidv4();
  console.log(data);

  const newData = {
    durationTime: data.durationTime,
    durationType: data.durationType,
    effectName: data.effectName,
    effectDescription: data.effectDescription,
    id: id,
    characterIds: [] as CharacterStatus[][],
  };
  sessionData.initiativeList.forEach((item: InitiativeObject) => {
    newData.characterIds[0].push({
      characterName: item.characterName,
      characterId: item.id,
    });
  });
  sessionData.spells.push(newData);

  sessionData.socket.emit(
    EmitTypes.CREATE_NEW,
    {
      payload: newData as SpellObject,
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.SPELLS,
    } as SocketData,
    (data: any) => {
      console.info(data);
    }
  );
};

const updateSpell = (data: {
  effectName: string;
  effectDescription: string;
  durationTime: number;
  durationType: string;
  index: number;
}): void => {
  sessionData.spells[data.index].effectName = data.effectName;
  sessionData.spells[data.index].effectDescription = data.effectDescription;
  sessionData.spells[data.index].durationTime = data.durationTime;
  sessionData.spells[data.index].durationType = data.durationType;
  console.log("spellUpdate");
  const options = {
    payload: sessionData.spells[data.index],
    collectionType: CollectionTypes.SPELLS,
    sessionId: sessionData.sessionId,
    docId: sessionData.spells[data.index].id,
  };
  sessionData.socket.emit(EmitTypes.UPDATE_RECORD, options, (data: any) => {
    console.info(data);
  });
};

const startDrag = (evt: DragEvent, index: number): void => {
  if (evt.dataTransfer !== null) {
    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemIndex", String(index));
  }
};

const dragOver = (evt: DragEvent): void => {
  evt.preventDefault();
};

const dragEnter = (evt: DragEvent): void => {
  console.log(evt, "dragEnter");
};

const onDrop = (evt: DragEvent, index: number): void => {
  if (evt.dataTransfer !== null) {
    const itemIndex = Number(evt.dataTransfer.getData("itemIndex"));
    console.log(itemIndex);
    const toMove = { ...sessionData.initiativeList[itemIndex] };
    console.log(toMove);
    if (toMove) {
      sessionData.initiativeList.splice(itemIndex, 1);
      sessionData.initiativeList.splice(index, 0, toMove);
    }
  }
};

function addStatusEffects(index: number) {
  sessionData.initiativeList.forEach((init: InitiativeObject) => {
    init.statusEffects.push({
      spellName: sessionData.spells[index].effectName,
      id: sessionData.spells[index].id,
      effectDescription: sessionData.spells[index].effectDescription,
    });
  });
}

function removeStatusEffects(index: number) {
  sessionData.initiativeList.forEach((init: InitiativeObject) => {
    const statusIndex = init.statusEffects
      .map((item: StatusEffect) => item.id)
      .indexOf(sessionData.spells[index].id);
    init.statusEffects.splice(statusIndex, 1);
  });
}

const changeAllCharacterStatus = (index: number, moveTo: string): void => {
  try {
    if (moveTo === "target") {
      sessionData.spells[index].characterIds[0] = [
        ...sessionData.spells[index].characterIds[1],
      ];
      sessionData.spells[index].characterIds[0] = [];
      addStatusEffects(index);
    }
    if (moveTo === "source") {
      sessionData.spells[index].characterIds[1] = [
        ...sessionData.spells[index].characterIds[0],
      ];
      sessionData.spells[index].characterIds[1] = [];
      removeStatusEffects(index);
    }

    sessionData.socket.emit(
      EmitTypes.UPDATE_ALL,
      {
        payload: sessionData.spells,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
      },
      (data: any) => {
        console.log(data);
      }
    );
    sessionData.socket.emit(
      EmitTypes.UPDATE_ALL,
      {
        payload: sessionData.initiativeList,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.INITIATIVE,
      },
      (data: any) => {
        console.log(data);
      }
    );
  } catch (error) {
    console.warn(error);
  }
};

const changeOneCharacterStatus = (
  e: CharacterPickListEvent,
  index: number,
  moveTo: string
): void => {
  if (e.items[0] === undefined) return;
  try {
    if (moveTo === "target") {
      const spellIndex = sessionData.spells[index].characterIds[0]
        .map((item: CharacterStatus) => item.characterId)
        .indexOf(e.items[0].characterId);
      sessionData.spells[index].characterIds[1].push(
        sessionData.spells[index].characterIds[0][spellIndex]
      );
      sessionData.spells[index].characterIds[0].splice(spellIndex, 1);
      addStatusEffects(index);
    }
    if (moveTo === "source") {
      const spellIndex = sessionData.spells[index].characterIds[1]
        .map((item: CharacterStatus) => item.characterId)
        .indexOf(e.items[0].characterId);
      sessionData.spells[index].characterIds[0].push(
        sessionData.spells[index].characterIds[1][spellIndex]
      );
      sessionData.spells[index].characterIds[1].splice(spellIndex, 1);
      removeStatusEffects(index);
    }

    sessionData.socket.emit(
      EmitTypes.UPDATE_RECORD,
      {
        payload: sessionData.spells[index],
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
        docId: sessionData.spells[index].id,
      },
      (data: any) => {
        console.log(data);
      }
    );
  } catch (error) {
    console.warn(error);
  }
};

const roundStart = (): void => {
  sessionData.socket.emit(
    EmitTypes.ROUND_START,
    {
      payload: [],
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
      docId: "",
    },
    (data: InitiativeObject[]) => {
      sessionData.initiativeList = data;
    }
  );
};

const reSort = (): void => {
  sessionData.socket.emit(
    EmitTypes.RESORT,
    {
      payload: [],
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
      docId: "",
    },
    (data: InitiativeObject[]) => {
      sessionData.initiativeList = data;
    }
  );
};

const getInitiative = (): InitiativeObject[] => {
  return sessionData.initiativeList;
};

const getSpells = (): SpellObject[] => {
  return sessionData.spells;
};

const getSorted = (): boolean => {
  return sessionData.isSorted;
};

const setCurrent = (index: number) => {
  sessionData.initiativeList.forEach((item: InitiativeObject) => {
    item.isCurrent = false;
  });
  sessionData.initiativeList[index].isCurrent = true;

  sessionData.socket.emit(
    EmitTypes.UPDATE_ALL,
    {
      payload: sessionData.initiativeList,
      collectionType: CollectionTypes.INITIATIVE,
      sessionId: sessionData.sessionId,
    },
    (data: any) => {
      console.log(data);
    }
  );
};

export default {
  store: sessionData,
  updateId,
  getInitial,
  getInitialSpells,
  updateCharacter,
  addCharacter,
  removeCharacter,
  getSpells,
  addSpell,
  startDrag,
  dragOver,
  dragEnter,
  onDrop,
  updateSpell,
  changeAllCharacterStatus,
  changeOneCharacterStatus,
  roundStart,
  getInitiative,
  getSorted,
  reSort,
  setCurrent,
};
