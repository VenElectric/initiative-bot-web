import { effect, reactive } from "vue";
import {
  CharacterStatus,
  InitiativeObject,
  SpellObject,
  StatusEffect,
  CharacterStatusFirestore,
  ServerSpellObject,
} from "../Interfaces/initiative";
import {
  CollectionTypes,
  InitiativeObjectEnums,
  SpellObjectEnums,
} from "../Interfaces/ContextEnums";
import { EmitTypes, SocketData } from "../Interfaces/EmitTypes";
import { io } from "socket.io-client";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { Character, CharacterPickListEvent } from "./types";
import { v4 as uuidv4 } from "uuid";
import {
  isDoubleArray,
  isInitiativeObjectArray,
  isSpellObjectArray,
} from "../Utils/TypeChecking";
import serverLogger from "../Utils/LoggingClass";
import { StoreEnums, LoggingTypes } from "../Interfaces/LoggingTypes";

const sessionData = reactive({
  initiativeList: [] as InitiativeObject[],
  isSorted: false,
  spells: [] as SpellObject[],
  sessionId: "",
  socket: io("localhost:8000"),
});

const spellsDoubleArray = (
  item: CharacterStatusFirestore
): CharacterStatus[][] => {
  serverLogger(
    LoggingTypes.debug,
    `updating characterId object to [][]`,
    StoreEnums.spellsDoubleArray
  );
  const doubleArray = [];
  doubleArray[0] = item.source;
  doubleArray[1] = item.target;
  return doubleArray;
};

const alltoFalse = (): void => {
  serverLogger(
    LoggingTypes.debug,
    `setting isCurrent for all records to false`,
    StoreEnums.alltoFalse
  );
  sessionData.initiativeList.forEach((item: InitiativeObject, index) => {
    sessionData.initiativeList[index].isCurrent = false;
  });
};

const updateId = (id: string): void => {
  serverLogger(LoggingTypes.info, `updating sessionId`, StoreEnums.updateId);
  sessionData.sessionId = id;
};

const roomSetup = (): void => {
  serverLogger(LoggingTypes.debug, `joining room`, StoreEnums.roomSetup);
  sessionData.socket.emit("create", sessionData.sessionId);
};

const updateSorted = (isSorted: boolean): void => {
  serverLogger(
    LoggingTypes.debug,
    `updating isSorted to: ${isSorted}`,
    StoreEnums.updateSorted
  );
  sessionData.isSorted = isSorted;
};

const updateAll = (
  collectionType: CollectionTypes,
  data: InitiativeObject[] | SpellObject[]
): void => {
  serverLogger(
    LoggingTypes.info,
    `updating all ${collectionType}`,
    StoreEnums.updateAll
  );
  if (collectionType === CollectionTypes.INITIATIVE) {
    if (isInitiativeObjectArray(data)) {
      sessionData.initiativeList = data;
      serverLogger(
        LoggingTypes.info,
        `update complete ${collectionType}`,
        StoreEnums.updateAll
      );
      return;
    }
  }
  if (collectionType === CollectionTypes.SPELLS) {
    if (isSpellObjectArray(data)) {
      serverLogger(
        LoggingTypes.info,
        `update complete ${collectionType}`,
        StoreEnums.updateAll
      );
      sessionData.spells = data;
    }
  }
};

const getInitial = (): void => {
  serverLogger(
    LoggingTypes.info,
    `first fetch initiative`,
    StoreEnums.getInitial
  );
  sessionData.socket.emit(
    "GET_INITIAL",
    {
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.INITIATIVE,
    },
    (query: any) => {
      sessionData.initiativeList = query.initiativeList;
      sessionData.isSorted = query.isSorted;
      serverLogger(
        LoggingTypes.info,
        `initiative store updated`,
        StoreEnums.getInitial
      );
    }
  );
};

const getInitialSpells = (): void => {
  serverLogger(
    LoggingTypes.info,
    `first fetch spells`,
    StoreEnums.getInitialSpells
  );
  sessionData.socket.emit(
    "GET_SPELLS",
    {
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.SPELLS,
    },
    (query: { spells: ServerSpellObject[] }) => {
      query.spells.forEach((spell: ServerSpellObject) => {
        sessionData.spells.push({
          id: spell.id,
          effectName: spell.effectName,
          effectDescription: spell.effectDescription,
          durationTime: spell.durationTime,
          durationType: spell.durationType,
          characterIds: spellsDoubleArray(spell.characterIds),
        });
      });
      serverLogger(
        LoggingTypes.info,
        `spell store updated`,
        StoreEnums.getInitialSpells
      );
    }
  );
};

const updateCharacterRecord = (
  initiative: InitiativeObject,
  isReset: boolean
): void => {
  if (isReset) {
    serverLogger(
      LoggingTypes.debug,
      `resetting isCurrent for all records to false`,
      StoreEnums.updateCharacterRecord
    );
    alltoFalse();
  }
  serverLogger(
    LoggingTypes.debug,
    `updating initiative Ojbect`,
    StoreEnums.updateCharacterRecord,
    initiative.id
  );
  const initIndex = sessionData.initiativeList
    .map((record: InitiativeObject) => record.id)
    .indexOf(initiative.id);
  sessionData.initiativeList[initIndex] = initiative;
  serverLogger(
    LoggingTypes.debug,
    `update complete`,
    StoreEnums.updateCharacterRecord,
    initiative.id
  );
};

const updateCharacterItem = (
  ObjectType: InitiativeObjectEnums,
  toUpdate: any,
  index: number,
  emit: boolean,
  docId?: string
): void => {
  if (docId) {
    if (emit) {
      serverLogger(
        LoggingTypes.debug,
        `emitting update`,
        StoreEnums.updateCharacterItem,
        docId
      );
      sessionData.socket.emit(EmitTypes.UPDATE_ITEM, {
        ObjectType: ObjectType,
        toUpdate: toUpdate,
        collectionType: CollectionTypes.INITIATIVE,
        sessionId: sessionData.sessionId,
        docId: docId,
      });
    }
  }
  serverLogger(
    LoggingTypes.debug,
    `updating characteritem in store`,
    StoreEnums.updateCharacterItem,
    docId
  );
  switch (ObjectType) {
    case InitiativeObjectEnums.characterName:
      sessionData.initiativeList[index].characterName = toUpdate;
      break;
    case InitiativeObjectEnums.initiative:
      sessionData.initiativeList[index].initiative = toUpdate;
      break;
    case InitiativeObjectEnums.initiativeModifier:
      sessionData.initiativeList[index].initiativeModifier = toUpdate;
      break;
    case InitiativeObjectEnums.isCurrent:
      sessionData.initiativeList[index].isCurrent = toUpdate;
      break;
    case InitiativeObjectEnums.roundOrder:
      sessionData.initiativeList[index].roundOrder = toUpdate;
      break;
  }
};

const addCharacter = (data: Character, roll: boolean, npc: boolean): void => {
  serverLogger(
    LoggingTypes.debug,
    `changing all isCurrent to false`,
    StoreEnums.addCharacter
  );
  alltoFalse();
  sessionData.isSorted = false;
  const characterId = String(uuidv4());
  let diceroll;
  if (roll) {
    const newRoll = new DiceRoll(`d20+${String(data.initiativeModifier)}`);
    diceroll = Number(newRoll.total);
    serverLogger(
      LoggingTypes.debug,
      `rolling for player Total: ${diceroll}`,
      StoreEnums.addCharacter,
      characterId
    );
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

  serverLogger(
    LoggingTypes.debug,
    `adding initiative to the store`,
    StoreEnums.addCharacter,
    characterId
  );

  sessionData.initiativeList.push(newData);
  if (sessionData.spells.length > 0) {
    serverLogger(
      LoggingTypes.debug,
      `adding new character to spells characterIds lists`,
      StoreEnums.addCharacter,
      characterId
    );
    sessionData.spells.forEach((spell: SpellObject) => {
      if (isDoubleArray(spell.characterIds)) {
        spell.characterIds[0].push({
          characterName: newData.characterName,
          characterId: newData.id,
        });
      }
    });

    serverLogger(
      LoggingTypes.debug,
      `emitting Spell List`,
      StoreEnums.addCharacter
    );
    sessionData.socket.emit(EmitTypes.UPDATE_ALL, {
      payload: sessionData.spells,
      sessionId: sessionData.sessionId,
      collectionType: CollectionTypes.SPELLS,
      resetOnDeck: false,
    } as SocketData);
  }
  serverLogger(
    LoggingTypes.debug,
    `emitting new character`,
    StoreEnums.addCharacter,
    characterId
  );
  sessionData.socket.emit(EmitTypes.CREATE_NEW, {
    payload: newData as InitiativeObject,
    sessionId: sessionData.sessionId,
    collectionType: CollectionTypes.INITIATIVE,
  } as SocketData);
};

const reRoll = (index: number) => {
  const modifier = sessionData.initiativeList[index].initiativeModifier;
  const newRoll = new DiceRoll(`d20+${String(modifier)}`);
  serverLogger(
    LoggingTypes.debug,
    `reroll complete, updating character`,
    StoreEnums.reRoll
  );
  updateCharacterItem(
    InitiativeObjectEnums.initiative,
    newRoll.total,
    index,
    true,
    sessionData.initiativeList[index].id
  );
  serverLogger(
    LoggingTypes.info,
    `update character complete`,
    StoreEnums.reRoll
  );
};

const removeCharacter = (index: number, id: string, emit: boolean): void => {
  sessionData.isSorted = false;
  sessionData.initiativeList.splice(index, 1);
  serverLogger(
    LoggingTypes.info,
    `character removed, sort reset`,
    StoreEnums.removeCharacter,
    id
  );
  if (sessionData.spells.length > 0) {
    for (const [spellIndex, spell] of sessionData.spells.entries()) {
      const indexZero = spell.characterIds[0]
        .map((item: CharacterStatus) => item.characterId)
        .indexOf(id);
      const indexOne = spell.characterIds[1]
        .map((item: CharacterStatus) => item.characterId)
        .indexOf(id);
      const finalIndex = indexZero != -1 ? indexZero : indexOne;
      if (indexZero != -1 && indexOne == -1) {
        serverLogger(
          LoggingTypes.debug,
          `removing character from spell.characterIds at indexZero`,
          StoreEnums.removeCharacter,
          spell.id
        );
        sessionData.spells[spellIndex].characterIds[0].splice(finalIndex, 1);
      } else if (indexZero == -1 && indexOne != -1) {
        serverLogger(
          LoggingTypes.debug,
          `removing character from spell.characterIds at indexOne`,
          StoreEnums.removeCharacter,
          spell.id
        );
        sessionData.spells[spellIndex].characterIds[1].splice(finalIndex, 1);
      }
    }
  }

  if (emit) {
    setTimeout(() => {
      serverLogger(
        LoggingTypes.debug,
        `emitting ${EmitTypes.DELETE_ONE}`,
        StoreEnums.removeCharacter,
        id
      );
      sessionData.socket.emit(EmitTypes.DELETE_ONE, {
        payload: [],
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.INITIATIVE,
        docId: id,
      } as SocketData);
      serverLogger(
        LoggingTypes.debug,
        `emitting ${EmitTypes.UPDATE_ALL} for spells`,
        StoreEnums.removeCharacter,
        id
      );
      sessionData.socket.emit(EmitTypes.UPDATE_ALL, {
        payload: sessionData.spells,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
        resetOnDeck: false,
      });
    }, 200);
  }
};

const removeSpell = (index: number, id: string, emit: boolean): void => {
  serverLogger(
    LoggingTypes.debug,
    `removing status effects from all characters this spell`,
    StoreEnums.removeSpell,
    id
  );
  removeStatusEffects(index);
  setTimeout(() => {
    serverLogger(
      LoggingTypes.debug,
      `removing spell`,
      StoreEnums.removeSpell,
      id
    );
    sessionData.spells.splice(index, 1);
    if (emit) {
      serverLogger(
        LoggingTypes.debug,
        `removing status effects from all characters this spell`,
        StoreEnums.removeSpell,
        id
      );
      serverLogger(
        LoggingTypes.debug,
        `emitting ${EmitTypes.UPDATE_ALL} for initiative`,
        StoreEnums.removeSpell
      );
      serverLogger(
        LoggingTypes.debug,
        `isSorted is: ${sessionData.isSorted}`,
        StoreEnums.removeSpell
      );
      sessionData.socket.emit(EmitTypes.UPDATE_ALL, {
        payload: sessionData.initiativeList,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.INITIATIVE,
        resetOnDeck: false,
        isSorted: sessionData.isSorted,
      });
      serverLogger(
        LoggingTypes.debug,
        `emitting ${EmitTypes.DELETE_ONE} for spell`,
        StoreEnums.removeSpell,
        id
      );
      sessionData.socket.emit(EmitTypes.DELETE_ONE, {
        payload: [],
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
        docId: id,
      } as SocketData);
    }
  }, 200);
};

const addSpell = (data: any): void => {
  const id = uuidv4();
  serverLogger(
    LoggingTypes.debug,
    `creating spell object`,
    StoreEnums.addSpell,
    id
  );
  const newData = {
    durationTime: data.durationTime,
    durationType: data.durationType,
    effectName: data.effectName,
    effectDescription: data.effectDescription,
    id: id,
    characterIds: [[], []] as CharacterStatus[][],
  };
  serverLogger(
    LoggingTypes.debug,
    `adding characters to spell characterIds`,
    StoreEnums.addSpell,
    id
  );
  sessionData.initiativeList.forEach((item: InitiativeObject) => {
    newData.characterIds[0].push({
      characterName: item.characterName,
      characterId: item.id,
    });
  });
  sessionData.spells.push(newData);
  serverLogger(
    LoggingTypes.debug,
    `spell added to store, emitting ${EmitTypes.CREATE_NEW}`,
    StoreEnums.addSpell,
    id
  );

  sessionData.socket.emit(EmitTypes.CREATE_NEW, {
    payload: newData as SpellObject,
    sessionId: sessionData.sessionId,
    collectionType: CollectionTypes.SPELLS,
  } as SocketData);
};

const updateSpell = (
  effectName: string,
  effectDescription: string,
  durationTime: number,
  durationType: string,
  index: number,
  emit: boolean,
  characterIds?: CharacterStatus[][]
): void => {
  serverLogger(
    LoggingTypes.debug,
    `updating spell`,
    StoreEnums.updateSpell,
    sessionData.spells[index].id
  );
  sessionData.spells[index].effectName = effectName;
  sessionData.spells[index].effectDescription = effectDescription;
  sessionData.spells[index].durationTime = durationTime;
  sessionData.spells[index].durationType = durationType;
  if (characterIds) {
    sessionData.spells[index].characterIds = characterIds;
  }
  if (emit) {
    serverLogger(
      LoggingTypes.debug,
      `emitting ${EmitTypes.CREATE_NEW} for new spell`,
      StoreEnums.updateSpell,
      sessionData.spells[index].id
    );
    const options = {
      payload: sessionData.spells[index],
      collectionType: CollectionTypes.SPELLS,
      sessionId: sessionData.sessionId,
      docId: sessionData.spells[index].id,
    };
    sessionData.socket.emit(EmitTypes.UPDATE_RECORD, options);
  }
};

const updateSpellItem = (
  ObjectType: SpellObjectEnums,
  toUpdate: any,
  index: number
): void => {
  serverLogger(
    LoggingTypes.debug,
    `updating spell item ${ObjectType}`,
    StoreEnums.updateSpellItem,
    sessionData.spells[index].id
  );
  switch (ObjectType) {
    case SpellObjectEnums.effectName:
      sessionData.spells[index].effectName = toUpdate;
      break;
    case SpellObjectEnums.effectDescription:
      sessionData.spells[index].effectDescription = toUpdate;
      break;
    case SpellObjectEnums.durationType:
      sessionData.spells[index].durationType = toUpdate;
      break;
    case SpellObjectEnums.durationTime:
      sessionData.spells[index].durationTime = toUpdate;
      break;
    case SpellObjectEnums.characterIds:
      sessionData.spells[index].characterIds = toUpdate;
      break;
  }
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
    const toMove = { ...sessionData.initiativeList[itemIndex] };
    if (toMove) {
      sessionData.initiativeList.splice(itemIndex, 1);
      sessionData.initiativeList.splice(index, 0, toMove);
      sessionData.initiativeList.forEach((item: InitiativeObject, index) => {
        sessionData.initiativeList[index].roundOrder = index + 1;
      });
      serverLogger(
        LoggingTypes.debug,
        `drop complete, initiativeList order updating`,
        StoreEnums.onDrop
      );
      setTimeout(() => {
        serverLogger(
          LoggingTypes.debug,
          `emitting ${EmitTypes.UPDATE_ALL} after drop completion`,
          StoreEnums.onDrop
        );
        sessionData.socket.emit(EmitTypes.UPDATE_ALL, {
          payload: sessionData.initiativeList,
          sessionId: sessionData.sessionId,
          collectionType: CollectionTypes.INITIATIVE,
          resetOnDeck: true,
          isSorted: sessionData.isSorted,
        });
      }, 500);
    }
  }
};

function addStatusEffects(index: number) {
  serverLogger(
    LoggingTypes.debug,
    `adding spell effect to all characters`,
    StoreEnums.addStatusEffects,
    sessionData.spells[index].id
  );
  sessionData.initiativeList.forEach((init: InitiativeObject) => {
    init.statusEffects.push({
      spellName: sessionData.spells[index].effectName,
      id: sessionData.spells[index].id,
      effectDescription: sessionData.spells[index].effectDescription,
    });
  });
}

function removeStatusEffects(spellIndex: number) {
  serverLogger(
    LoggingTypes.debug,
    `removing spell effect from all characters`,
    StoreEnums.removeStatusEffects,
    sessionData.spells[spellIndex].id
  );
  for (const [initIndex, init] of sessionData.initiativeList.entries()) {
    const statusIndex = sessionData.initiativeList[initIndex].statusEffects
      .map((item: StatusEffect) => item.id)
      .indexOf(sessionData.spells[spellIndex].id);
    if (statusIndex >= 0) {
      sessionData.initiativeList[initIndex].statusEffects.splice(
        statusIndex,
        1
      );
    }
  }
}

function addStatusEffect(
  spellName: string,
  spellId: string,
  effectDescription: string,
  characterIndex: number
): void {
  serverLogger(
    LoggingTypes.debug,
    `adding spell effect to one character`,
    StoreEnums.addStatusEffect,
    sessionData.initiativeList[characterIndex].id
  );
  sessionData.initiativeList[characterIndex].statusEffects.push({
    spellName: spellName,
    id: spellId,
    effectDescription: effectDescription,
  });
}

function removeStatusEffect(spellId: string, characterIndex: number): void {
  serverLogger(
    LoggingTypes.debug,
    `removing spell effect from one character`,
    StoreEnums.removeStatusEffect,
    sessionData.initiativeList[characterIndex].id
  );
  const spellIndex = sessionData.initiativeList[characterIndex].statusEffects
    .map((status: StatusEffect) => status.id)
    .indexOf(spellId);
  sessionData.initiativeList[characterIndex].statusEffects.splice(
    spellIndex,
    1
  );
}

const changeAllCharacterStatus = (index: number, moveTo: string): void => {
  serverLogger(
    LoggingTypes.debug,
    `changing all characters to ${moveTo}`,
    StoreEnums.changeAllCharacterStatus,
    sessionData.spells[index].id
  );
  try {
    if (moveTo === "target") {
      sessionData.spells[index].characterIds[0] = [
        ...sessionData.spells[index].characterIds[1],
      ];
      sessionData.spells[index].characterIds[0] = [];
      addStatusEffects(index);
      serverLogger(
        LoggingTypes.debug,
        `update complete, moved to target`,
        StoreEnums.changeAllCharacterStatus,
        sessionData.spells[index].id
      );
    }
    if (moveTo === "source") {
      sessionData.spells[index].characterIds[1] = [
        ...sessionData.spells[index].characterIds[0],
      ];
      sessionData.spells[index].characterIds[1] = [];
      removeStatusEffects(index);
      serverLogger(
        LoggingTypes.debug,
        `update complete, moved to source`,
        StoreEnums.changeAllCharacterStatus,
        sessionData.spells[index].id
      );
    }
    serverLogger(
      LoggingTypes.debug,
      `emitting ${EmitTypes.UPDATE_ALL} for spells`,
      StoreEnums.changeAllCharacterStatus,
      sessionData.spells[index].id
    );
    sessionData.socket.emit(
      EmitTypes.UPDATE_ALL,
      {
        payload: sessionData.spells,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
        resetOnDeck: false,
      },
      (data: any) => {
        console.log(data);
      }
    );
    serverLogger(
      LoggingTypes.debug,
      `emitting ${EmitTypes.UPDATE_ALL} for initiative`,
      StoreEnums.changeAllCharacterStatus,
      sessionData.spells[index].id
    );
    sessionData.socket.emit(
      EmitTypes.UPDATE_ALL,
      {
        payload: sessionData.initiativeList,
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.INITIATIVE,
        resetOnDeck: false,
        isSorted: sessionData.isSorted,
      },
      (data: any) => {
        console.log(data);
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      serverLogger(
        LoggingTypes.alert,
        error.message,
        StoreEnums.changeAllCharacterStatus,
        sessionData.spells[index].id
      );
    }
  }
};

const changeOneCharacterStatus = (
  e: CharacterPickListEvent,
  index: number,
  moveTo: string
): void => {
  if (e.items[0] === undefined) return;
  const characterId = e.items[0].characterId;
  const characterIndex = sessionData.initiativeList
    .map((item: InitiativeObject) => item.id)
    .indexOf(characterId);
  serverLogger(
    LoggingTypes.info,
    `changing one character status. moveTo: ${moveTo}`,
    StoreEnums.changeOneCharacterStatus,
    characterId
  );
  try {
    if (isDoubleArray(sessionData.spells[index].characterIds)) {
      if (moveTo === "target") {
        const spellIndex = sessionData.spells[index].characterIds[0]
          .map((item: CharacterStatus) => item.characterId)
          .indexOf(e.items[0].characterId);
        sessionData.spells[index].characterIds[1].push(
          sessionData.spells[index].characterIds[0][spellIndex]
        );
        sessionData.spells[index].characterIds[0].splice(spellIndex, 1);
        addStatusEffect(
          sessionData.spells[index].effectName,
          sessionData.spells[index].id,
          sessionData.spells[index].effectDescription,
          characterIndex
        );
        serverLogger(
          LoggingTypes.info,
          `status effect moved to target complete`,
          StoreEnums.changeOneCharacterStatus,
          characterId
        );
      }
      if (moveTo === "source") {
        const spellIndex = sessionData.spells[index].characterIds[1]
          .map((item: CharacterStatus) => item.characterId)
          .indexOf(e.items[0].characterId);
        sessionData.spells[index].characterIds[0].push(
          sessionData.spells[index].characterIds[1][spellIndex]
        );
        sessionData.spells[index].characterIds[1].splice(spellIndex, 1);
        removeStatusEffect(sessionData.spells[index].id, characterIndex);
        serverLogger(
          LoggingTypes.info,
          `status effect moved to soure complete`,
          StoreEnums.changeOneCharacterStatus,
          characterId
        );
      }
    }
    serverLogger(
      LoggingTypes.info,
      `emitting ${EmitTypes.UPDATE_RECORD} for spell`,
      StoreEnums.changeOneCharacterStatus,
      sessionData.spells[index].id
    );
    sessionData.socket.emit(
      EmitTypes.UPDATE_RECORD,
      {
        payload: sessionData.spells[index],
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.SPELLS,
        docId: sessionData.spells[index].id,
      },
      (data: any) => {
        console.log(data, "response from function");
      }
    );
    serverLogger(
      LoggingTypes.info,
      `emitting ${EmitTypes.UPDATE_RECORD} for initiative`,
      StoreEnums.changeOneCharacterStatus,
      characterId
    );
    sessionData.socket.emit(
      EmitTypes.UPDATE_RECORD,
      {
        payload: sessionData.initiativeList[characterIndex],
        sessionId: sessionData.sessionId,
        collectionType: CollectionTypes.INITIATIVE,
        docId: characterId,
      },
      (data: any) => {
        console.log(data, "respose from function");
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      serverLogger(
        LoggingTypes.alert,
        error.message,
        StoreEnums.changeOneCharacterStatus,
        sessionData.spells[index].id
      );
    }
  }
};

const roundStart = (): void => {
  serverLogger(
    LoggingTypes.info,
    `emitting ${EmitTypes.ROUND_START} for initiative`,
    StoreEnums.roundStart
  );
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
      sessionData.isSorted = true;
      serverLogger(
        LoggingTypes.info,
        `roundstart complete, updated store data for initiative and isSorted: ${sessionData.isSorted}`,
        StoreEnums.roundStart
      );
    }
  );
};

const reSort = (): void => {
  serverLogger(
    LoggingTypes.info,
    `emitting ${EmitTypes.RESORT} for initiative`,
    StoreEnums.reSort
  );
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
      console.info(sessionData.initiativeList);
      serverLogger(
        LoggingTypes.info,
        `resort complete, updated store data for initiative and isSorted`,
        StoreEnums.reSort
      );
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

const setCurrent = (index: number): void => {
  serverLogger(
    LoggingTypes.info,
    `resetting isSorted for all initiative`,
    StoreEnums.setCurrent,
    sessionData.initiativeList[index].id
  );
  alltoFalse();
  sessionData.initiativeList[index].isCurrent = true;
  serverLogger(
    LoggingTypes.info,
    `reset complete. update to initiative record complete. emitting ${EmitTypes.UPDATE_ALL}`,
    StoreEnums.setCurrent,
    sessionData.initiativeList[index].id
  );
  sessionData.socket.emit(EmitTypes.UPDATE_ALL, {
    payload: sessionData.initiativeList,
    collectionType: CollectionTypes.INITIATIVE,
    sessionId: sessionData.sessionId,
    resetOnDeck: true,
    isSorted: sessionData.isSorted,
  });
};

const nextTurn = (): void => {
  serverLogger(
    LoggingTypes.info,
    `emitting ${EmitTypes.NEXT}`,
    StoreEnums.nextTurn
  );
  sessionData.socket.emit(EmitTypes.NEXT, {
    payload: [],
    sessionId: sessionData.sessionId,
    collectionType: CollectionTypes.INITIATIVE,
  });
};

const previousTurn = (): void => {
  serverLogger(
    LoggingTypes.info,
    `emitting ${EmitTypes.PREVIOUS}`,
    StoreEnums.nextTurn
  );
  sessionData.socket.emit(EmitTypes.PREVIOUS, {
    payload: [],
    sessionId: sessionData.sessionId,
    collectionType: CollectionTypes.INITIATIVE,
  });
};

const toDiscord = (collectionType: CollectionTypes): void => {
  try {
    serverLogger(
      LoggingTypes.info,
      `emitting ${EmitTypes.DISCORD} for ${collectionType}`,
      StoreEnums.toDiscord
    );
    sessionData.socket.emit(EmitTypes.DISCORD, {
      payload: [],
      sessionId: sessionData.sessionId,
      collectionType: collectionType,
    });
  } catch (error) {
    if (error instanceof Error) {
      serverLogger(LoggingTypes.alert, error.message, StoreEnums.toDiscord);
    }
  }
};

const resetAll = (emit: boolean): void => {
  sessionData.initiativeList = [];
  sessionData.spells = [];
  serverLogger(
    LoggingTypes.info,
    `initiative and spells reset`,
    StoreEnums.resetAll
  );
  if (emit) {
    serverLogger(
      LoggingTypes.info,
      `emitting ${EmitTypes.DELETE_ALL}`,
      StoreEnums.resetAll
    );
    sessionData.socket.emit(EmitTypes.DELETE_ALL, sessionData.sessionId);
  }
};

export default {
  store: sessionData,
  updateId,
  getInitial,
  getInitialSpells,
  updateCharacterItem,
  updateCharacterRecord,
  addCharacter,
  removeCharacter,
  getSpells,
  addSpell,
  startDrag,
  dragOver,
  dragEnter,
  onDrop,
  updateSpell,
  updateSpellItem,
  changeAllCharacterStatus,
  changeOneCharacterStatus,
  roundStart,
  getInitiative,
  getSorted,
  reSort,
  setCurrent,
  nextTurn,
  previousTurn,
  toDiscord,
  roomSetup,
  updateAll,
  removeSpell,
  spellsDoubleArray,
  resetAll,
  reRoll,
  alltoFalse,
  updateSorted,
};
