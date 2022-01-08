import React, { createContext, useState} from "react";
import { v4 as uuid_v4 } from "uuid";
import useLocalStorage from "../Hooks/useLocaleStorage";
import { sort_init } from "../services/init_funcs";
import { get_init } from "../services/server_requests";
import { DiceRoll } from "rpg-dice-roller";
import { InitiativeLine } from "../Interfaces/Interfaces";
import { socket } from "./SocketContext";
import {EmitTypes} from "../Interfaces/EmitTypes";

const projectkey = "initiativebot";

// @ts-ignore
const character_list = localStorage.getItem(`${projectkey}character`) != null ? JSON.parse(localStorage.getItem(`${projectkey}character`)) : [];
export const InitContext = createContext(character_list);

const InitContextProvider = (props: any) => {
  const sessionId = localStorage.getItem("sessionId");

  // initialize localstorage
  const [init_list, setInit] = useLocalStorage(
    "character",
    [] as InitiativeLine[]
  );
  const [sorted, setSort] = useLocalStorage("character_sort", false);
  const [ondeck, setOndeck] = useLocalStorage("character_ondeck", 0);
  const [char_list, setList] = useState(
    init_list.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        status_effects: item.status_effects,
      };
    })
  );

  // grab intitiative data from the database
  const load_init = async () => {
    let init_data = await get_init(sessionId);
    console.log(init_data);
    try {
      if (init_data.init_list.length === 0 || init_data.init_list === []) {
        // if no data is returned, then set init as an empty array.
        // other data should be there because the session is initiated through the discord bot
        setInit([]);
        setSort(init_data.initial.on_deck || false);
        setOndeck(init_data.initial.sort || 0);
        localStorage.setItem("channel_id", init_data.initial.channel_id);
      } else {
        // if there is data, sort the list and load it
        let sorted_list = await sort_init(init_data.init_list, false);
        setInit(sorted_list);
        setOndeck(init_data.initial.on_deck);
        setSort(init_data.initial.sort);
        localStorage.setItem("channel_id", init_data.initial.channel_id);
      }
    } catch (error) {
      setInit([]);
      console.log(error);
    }
  };

  // when the initiative list is changed (drag and drop) updated the line order
  const update_order = () => {
    setTimeout(() => {
      //@ts-ignore
      let new_state = JSON.parse(localStorage.getItem(`${projectkey}character`));
      for (let x = 0; x < new_state.length; x++) {
        new_state[x].line_order = x + 1;
      }

      socket.emit(
        "server_init",
        {
          room: sessionId,
          sort: sorted,
          on_deck: ondeck,
          initiative: new_state,
        },
        (answer: any) => {
          console.log(answer);
        }
      );
    }, 1000);
  };

  // add in a new initiative
  const add_init = (e: any) => {
    let charid = String(uuid_v4());
    let init: number = 0;

    // roll a dice if the user wants the bot to do it for them
    if (e.target[3].value === "0") {
      init = Number(e.target[2].value);
    }
    if (e.target[3].value === "1") {
      let diceroll = new DiceRoll(`d20+${e.target[4].value}`);
      console.log(diceroll.total);
      init = diceroll.total;
    }
    // construct the initiative object
    let new_data = {
      id: charid,
      name: e.target[0].value,
      init: Number(init),
      init_mod: Number(e.target[4].value),
      cmark: false,
      line_order: 0,
      npc: e.target[1].value,
      status_effects: [],
    };

    // reset the form
    let init_form = document.getElementById("init-form");
    if (init_form) (init_form as HTMLFormElement).reset();

    // change all current marks to false (since we need to resort initiative)
    if (sorted) {
      for (let item of init_list) {
        item.cmark = false;
      }
    }
    // if the sorted state is true, change it to false since we've added in a new intiaitive
    setSort(false);
    // add to inititiative list and character list (for spells)
    setInit([...init_list, new_data]);
    setList([
      ...char_list,
      {
        id: new_data.id,
        name: new_data.name,
        status_effects: new_data.status_effects,
      },
    ]);

    // make sure to add in the new initiative record to all spell's main lists.
    //@ts-ignore
    let spells = JSON.parse(localStorage.getItem(`${projectkey}spell_list`));
    for (let record of spells) {
      //@ts-ignore
      let main_init = JSON.parse(localStorage.getItem(`${projectkey}main_list${record.id}`));
      main_init.push({
        id: new_data.id,
        name: new_data.name,
        status_effects: new_data.status_effects,
      });
      localStorage.setItem(
        `${projectkey}main_list${record.id}`,
        JSON.stringify(main_init)
      );
    }

    socket.emit("server_add_init", {
      room: sessionId,
      sort: false,
      initiative: new_data,
    });
  };

  const remove_status_effect = (
    id: string,
    target: any,
    spell_id: string,
    char: any
  ) => {
    let target_index = id;
    let targetid = target[target_index].id;
    let new_target = [...init_list];
    let new_index = new_target.map((item: any) => item.id).indexOf(targetid);
    let effect_index = new_target[new_index].status_effects
      .map((item: any) => item.id)
      .indexOf(spell_id);
    new_target[new_index].status_effects.splice(effect_index, 1);
    setInit(new_target);

    socket.emit("server_update_init", {
      room: sessionId,
      initiative: new_target[new_index],
      id: targetid,
      index: new_index,
    });

    setTimeout(() => {
      //@ts-ignore
      let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`));
      //@ts-ignore
      let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`));

      socket.emit(
        "server_update_target",
        {
          room: sessionId,
          target: target_state,
          main: main_state,
          id: spell_id,
        },
        (answer: any) => {
          console.log(answer);
        }
      );
    }, 1000);
  };

  const new_target = (
    id: string,
    char: any,
    spell_id: string,
    spell_name: string,
    spell_effect: string
  ) => {
    console.log("on add?");
    let target_index = id;
    let targetid = char[target_index].id;
    let new_target = [...init_list];
    console.table(new_target);
    let new_index = new_target.map((item: any) => item.id).indexOf(targetid);

    new_target[new_index].status_effects.push({
      id: spell_id,
      name: spell_name,
      effect: spell_effect,
    });
    setInit(new_target);

    socket.emit("server_update_init", {
      room: sessionId,
      initiative: new_target[new_index],
      id: targetid,
      index: new_index,
    });

    setTimeout(() => {
      //@ts-ignore
      let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`));
      //@ts-ignore
      let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`));

      socket.emit(
        "server_update_target",
        {
          room: sessionId,
          target: target_state,
          main: main_state,
          id: spell_id,
        },
        (answer: any) => {
          console.log(answer);
        }
      );
    }, 1000);
  };

  const remove_init = (id: string) => {
    let new_state = [...init_list];
    let char_state = [...char_list];
    let index = new_state.map((item: any) => item.id).indexOf(id);
    let charindex = char_state.map((item: any) => item.id).indexOf(id);
    new_state.splice(index, 1);
    char_state.splice(charindex, 1);
    setList(char_state);
    setInit(new_state);
    console.log(sessionId);
    socket.emit("server_remove_init", { room: sessionId, id: id });
  };

  const next_turn = () => {
    let new_state = [...init_list];
    let current = new_state.map((item: any) => item.line_order).indexOf(ondeck);
    console.log(current);
    let next: number;
    let prev: number = 0;
    let emit_deck: number = 0;

    if (ondeck === init_list.length) {
      console.info(ondeck, "===");
      next = 1;
      prev = current - 1;
      new_state[prev].cmark = false;
      new_state[current].cmark = true;
      emit_deck = next;
      setOndeck(next);
    }
    if (ondeck < init_list.length && ondeck > 1) {
      console.info(ondeck, "< and >");
      next = ondeck + 1;
      console.info(next);
      prev = current - 1;
      new_state[prev].cmark = false;
      new_state[current].cmark = true;
      emit_deck = next;
      setOndeck(next);
    }
    if (ondeck === 1) {
      console.info(ondeck, "===1");
      next = ondeck + 1;
      prev = init_list.length - 1;
      console.info(init_list.length);
      new_state[prev].cmark = false;
      new_state[current].cmark = true;
      emit_deck = next;
      setOndeck(next);
    }

    setInit(new_state);
    let emit_data = [...new_state];
    let channel_id = localStorage.getItem("channel_id");
    socket.emit("server_init", {
      room: sessionId,
      sort: sorted,
      on_deck: emit_deck,
      initiative: emit_data,
    });
    socket.emit("server_next", {
      channel_id: channel_id,
      next: new_state[current].name,
    });
  };

  const previous_turn = () => {
    let new_state = [...init_list];
    let next = new_state.map((item: any) => item.line_order).indexOf(ondeck);
    console.log(next);
    let current: number;
    let prev: number = 0;
    let emit_deck: number = 0;

    if (ondeck === 2) {
      console.info(ondeck, "===");
      current = 0;
      prev = init_list.length - 1;
      new_state[prev].cmark = true;
      new_state[current].cmark = false;
      emit_deck = 1;
      setOndeck(1);
    }
    if (ondeck <= init_list.length && ondeck > 2) {
      console.info(ondeck, "< and >");
      current = next - 1;
      console.info(next);
      prev = current - 1;
      new_state[prev].cmark = true;
      new_state[current].cmark = false;
      emit_deck = current + 1;
      setOndeck(current + 1);
    }
    if (ondeck === 1) {
      current = init_list.length - 1;
      console.info(next);
      prev = current - 1;
      new_state[prev].cmark = true;
      new_state[current].cmark = false;
      emit_deck = init_list.length;
      setOndeck(init_list.length);
    }

    setInit(new_state);
    let emit_data = [...new_state];
    let channel_id = localStorage.getItem("channel_id");
    socket.emit(
      "server_init",
      {
        room: sessionId,
        sort: sorted,
        on_deck: emit_deck,
        initiative: emit_data,
      },
      (answer: any) => {
        console.log(answer);
      }
    );
    socket.emit("server_prev", {
      channel_id: channel_id,
      prev: new_state[prev].name,
    });
    console.log("prev turn");
  };

  async function ROUND_START() {
    socket.emit(EmitTypes.ROUND_START, sessionId,(data:any) => {
        setInit(data.initiativeList);
        setSort(data.isSorted);
        setOndeck(data.onDeck);
    })
  }

  async function resort() {
    let sorted_init = await sort_init(init_list, false);
    setInit(sorted_init);
    socket.emit(
      "server_init",
      {
        room: sessionId,
        sort: sorted,
        on_deck: ondeck,
        initiative: sorted_init,
      },
      (answer: any) => {
        console.log(answer);
      }
    );
  }

  const set_current = (id: string) => {
    let new_state = [...init_list];
    let index = new_state.map((item: any) => item.id).indexOf(id);
    let line_order = new_state[index].line_order;
    let ondeck_find = line_order === init_list.length ? 1 : line_order + 1;

    for (let x = 0; x < new_state.length; x++) {
      new_state[x].cmark = false;
    }
    new_state[index].cmark = true;
    setOndeck(ondeck_find);
    setInit(new_state);
    let emit_data = [...new_state];
    socket.emit(
      "server_init",
      {
        room: sessionId,
        sort: true,
        on_deck: ondeck_find,
        initiative: emit_data,
      },
      (answer: any) => {
        console.log(answer);
      }
    );
  };

  async function reroll_init(id: string) {
    let new_state = [...init_list];
    for (let x = 0; x < new_state.length; x++) {
      new_state[x].cmark = false;
    }
    let index = new_state.map((item: any) => item.id).indexOf(id);
    let diceroll = new DiceRoll(`d20+${new_state[index].init_mod}`);
    new_state[index].init = diceroll.total;
    let sorted_init = await sort_init(new_state, false);
    setInit(sorted_init);
    let emit_data = [...sorted_init];
    socket.emit(
      "server_init",
      { room: sessionId, sort: false, on_deck: 0, initiative: emit_data },
      (answer: any) => {
        console.log(answer);
      }
    );
  }

  const send_init = () => {
    let channel_id = localStorage.getItem("channel_id");
    socket.emit("server_show_init", {
      room: sessionId,
      channel_id: channel_id,
    });
  };

  return (
      //@ts-ignore
    <InitContext.Provider value={{
        resort,
        load_init,
        send_init,
        char_list,
        setList,
        init_list,
        setInit,
        setSort,
        add_init,
        next_turn,
        previous_turn,
        ROUND_START,
        remove_init,
        remove_status_effect,
        new_target,
        sorted,
        set_current,
        reroll_init,
        setOndeck,
        update_order,
      }}
    >
      {props.children}
    </InitContext.Provider>
  );
};

export default InitContextProvider;
