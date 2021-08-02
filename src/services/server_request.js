import axios from "axios";

async function get_request(session_id,request){

}

async function call_command(session_id,command){
    
}


function random_d20(num){

    let arrd20 = []
    // roll d20s num times.
    for (let z = 0; z < num; z++){
        // we need a minimum of 1 (0 is not an option on a d20) and a maximum of 20 (using 20 instead of 21 would give us 1-19)
        let myroll = Math.floor(Math.random() * (21 - 1) + 1)
        arrd20.push(myroll)
    }
    // each value for Set needs to be unique. So if there are duplicate rolls, 
    //the length of this array will be less than the length of the dupes array passed to this function
    let uniqueroll = [...new Set(arrd20)];
    return uniqueroll
}



export async function sort_init(init_list,sorted){


if (!sorted){
// look for duplicate initiative and initiative modifiers. Add them to a dupes array
let dupes = [];

// loop i number of times = the length of init_list
    for (let i = 0; i < init_list.length; i++) {
        // now loop through every record in init_list matching it with the current iteration of init_list[i]
        // I.E. first we look at init_list[i=0] and compare that to record x of init_list
        for (let x in init_list){
            // we want to only check values that are not init_list[i], so we check that against the unique ID of each record.
            // we don't use name, since there's a possibility that we could have similarly named characters. 
            if (init_list[x].id !== init_list[i].id){
                console.log('init_list')
                // only add to dupes array if both the initiative and init_mod are the same. If the initiative is similar, but the init_mod is not, the sort later will handle that.
                if (init_list[x].initiative === init_list[i].initiative && init_list[x].init_mod === init_list[i].init_mod){
                    console.log('Dupe Added')
                    dupes.push(init_list[i])
                    break
                }
                else{
                    continue
                }
            }
            // if the ids are the same, don't bother!
            if (init_list[x].id === init_list[i].id){
                continue 
            }
        }
    }

    // if no dupes, proceed, else we need to find out who goes before who by rolling a d20
    try{
        if (dupes.length === 0){
            console.log('Ok!')
        }
        else{
            let rolls = []
            let mylen = 0
            // while the number of dupes is less than the dupes array length, keep rolling until all dupes have been handled
            while(mylen < dupes.length){
                rolls = random_d20(dupes.length)
                mylen = rolls.length
            }
            

            // iterate through the dupes list
            for (let z = 0; z < dupes.length;z++){
                //next iterate through init_list and match the id of the dupe with the id of init_list using .map and index of
                // we have to use .map + indexOf because this is an object. using .indexof on init_list will return -1 even though the id is there
                // because indexof is looking for an array of single values. Not an array of objects.
                let dupe_index = init_list.map((item) => item.id).indexOf(dupes[z].id)
                // divide the roll total by 100 
                let resultdec = Number(rolls[z]/100)
                // get the init_mod from the record in init_list
                let newnum = Number(init_list[dupe_index].init_mod)
                // add the roll/100 to the init_mod
                let total = Number (newnum+resultdec)
                // change the init_mod to the new total
                init_list[dupe_index].init_mod = total
                // reset values for next iteration
                newnum = 0
                resultdec = 0
                total = 0
            }
        }
    }
    catch (error){
        console.log(error)
    }
    // now the sorting
    // we're comparing if init of a > or < b
    // if a.init > b.init then leave them in the same place
    // if a.init < b.init then sort b before a
    // the same principle applies for init_mod
    //@ts-ignore
    init_list.sort((a,b) => {
        // we're sorting by init.
        if (a.init > b.init) return -1;
        if (a.init < b.init) return 1;
        // and also sorting by the init_mod
        if (a.init_mod > b.init_mod) return -1;
        if (a.init_mod < b.init_mod) return 1;
    });
    init_list[0].cmark = true

    // loop through init_list and add ordering for easier sorting later. 
    for (let v = 0; v < init_list.length; v++){
        init_list[v].line_order = Number(v+1)
    }
}
if (sorted){
    init_list.sort(function (a, b) {
        if (a.line_order > b.line_order) return -1;
        if (a.line_order < b.line_order) return 1;
    });
}

    // do what you will with the list to show to your players!
    console.log(init_list)
    return init_list

}