import { ItemInterface, ReactSortable,SortableEvent,MoveEvent, Sortable} from "react-sortablejs"
import { MultiDrag, Swap } from "sortablejs";
import React, {useEffect,useContext,useRef} from 'react'
import {Row,Col,Badge,Card,Button} from 'react-bootstrap'
import { InitiativeLine,status_effects } from "../Interfaces/Interfaces";
import { ErrorBoundary } from "./ErrorBoundary";
import useLocalStorage from "../Hooks/useLocaleStorage";
import {InitContext} from "../Context/InitContext"
import { SocketContext } from "../Context/SocketContext";

interface SpellRec{
    id: string|number
    name:string;
    color:string;
    status_effects: status_effects[]
}

Sortable.mount(new MultiDrag());
export default function SpellTarget({spell_rec,spell_id,spell_color,spell_name}:{spell_rec:any,spell_id:string,spell_color:string,spell_name:string}) {
    const socket = useContext(SocketContext);
    const projectkey = 'initiativebot'
    const {init_list,remove_status_effect,new_target,char_list} = useContext(InitContext)
    // @ts-ignore
    const target_list = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`)) || []
    // @ts-ignore
    const main_list = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`)) || []
    const [target,setTarget] = useLocalStorage(`target_list${spell_id}`, target_list);
    const [char,setChar] = useLocalStorage(`main_list${spell_id}`, main_list);

    let mounted = useRef(true)
	// return () => {
	// 	mountedRef = false
    // }

    useEffect(()=>{
        socket.on('client_update_target',function(data:any){
        setTimeout(()=>{
            //@ts-ignore
            let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
            //@ts-ignore
            let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
           
            setChar(main_state)
            setTarget(target_state)
         
        },1000) })
    },[])

    useEffect(()=> {
        console.log(char.length)
        if(mounted.current){
            setTimeout(()=>{
                let char_data = []
                if (char.length === 0 && target.length === 0){
                for (let x in init_list){
                    char_data.push({id:init_list[x].id,name:init_list[x].name,color:init_list[x].color,status_effects:init_list[x].status_effects})
                }
                setChar(char_data)
            }},1000)
        }

        return () => {
            mounted.current = false
        }
    },[])

    useEffect(()=>{

        if(mounted.current){
            let new_main = [...char]
            let list_length = target.length + char.length
                console.log(list_length)
            if (list_length < init_list.length){
                for (let x in char_list){
                    let char_index = char.map((item:any) => item.id).indexOf(char_list[x].id)
                    console.log(char_index)
                    if (char_index < 0){
                        new_main.push({...char_list[x]})
                    }
                }
                console.log(new_main)
            setChar(new_main)
            }
        }
        
        return () => {
            mounted.current = false
        }
        
    },[char_list])

    useEffect(()=> {
        if(mounted.current){
            let new_main = [...char]
            let new_target = [...target]
    
            for (let x in char_list){
                let target_index = target.map((item:any) => item.id).indexOf(char_list[x].id)
                let char_index = char.map((item:any) => item.id).indexOf(char_list[x].id)
                if (target_index >= 0 && char_index < 0){
                    new_target[target_index].name = char_list[x].name
                }
                if (char_index >= 0 && target_index < 0){
                    new_main[char_index].name = char_list[x].name
                }
            }
            setChar(new_main)
            setTarget(new_target)
        }
        
        return () => {
            mounted.current = false
        }

    },[char_list.name])



    // useEffect(() => {
    //     console.log('use effect')
    //     let init_length = init_list.length
    //     let char_data = [...char]
    //     let _target_data = [...target]
    //     let new_char:any[] = []
    //     let new_target:any[] = []
    //     let total_length = char_data.length + _target_data.length
    // async function update_char(char_array:any){
    //     try{
    //         for (let z=0;z < char_array.length;z++){
    //             let init_index = init_list.map((item:any) => item.id).indexOf(char_array[z].id)
    //             if (init_index < 0){
    //                 char_array.splice(z,1)
    //             }
    //         }
    //         return char_array
    //     }
    //     catch(error){
    //         console.info(error)
    //     }
    // }
    // async function update_target(tar_array:any){
    //     for(let y=0; y < tar_array.length; y++){
    //         let init_index = init_list.map((item:any) => item.id).indexOf(tar_array[y].id)
    //         console.log(init_index)
    //         if (init_index < 0){
    //             tar_array.splice(y,1)
    //         }
    //         if (init_index === 0){
    //             continue
    //         }
    //     }
    //     return tar_array
    // }



    // if (total_length > init_length){
    //     console.trace('use effect >')
    //     console.log('>')
    //     Promise.all([
    //         update_char(char_data),
    //         update_target(_target_data)
    //     ]).then(function (results){
    //         console.trace(results)
    //         for (let x in results[0]){
    //             new_char.push(results[0][x])
    //         }
    //        for(let y in results[1]){
    //         new_target.push(results[0][y])
    //        }
    //        setChar(new_char)
    //         setTarget(new_target)
    //     })
    // }
    // if (total_length < init_list.length){
    //     console.trace('use effect <')
    //     console.log('<')
    //     for(let x in init_list){
    //         let target_index = target.map((item:any) => item.id).indexOf(init_list[x].id)
    //         let char_index = char.map((item:any) => item.id).indexOf(init_list[x].id)
    //         if (char_index < 0 && target_index < 0){
    //           char_data.push({id:init_list[x].id,name:init_list[x].name,color:init_list[x].color,status_effects:init_list[x].status_effects})
    //         }
            
    //      }
    //      console.trace(char_data)
    //     setChar(char_data)
    // }
    
    // }, [init_list])

    // useEffect(() => {
    //     let _target_data = [...target]
    //     let char_data = [...char]
    //     console.log('change?')
    //         for(let x in init_list){
    //             let target_index = target.map((item:any) => item.id).indexOf(init_list[x].id)
    //             let char_index = char.map((item:any) => item.id).indexOf(init_list[x].id)
    //             if (char_index < 0 && target_index > 0){
    //               _target_data[target_index] = init_list[x]
    //             }
    //             if (char_index > 0 && target_index < 0){
    //               char_data[char_index] = init_list[x]
    //             }
    //          }

    //     setChar(char_data)
    //     setTarget(_target_data)
    // },[init_list])

    const remove_all_targets = () => {

        for(let x = 0;x<target.length;x++){
            remove_status_effect(x,target,spell_id)
        }
        setChar([...char,...target]) 
        setTarget([])
    }

    const remove_all_char = () => {
        for(let x = 0;x<char.length;x++){
            new_target(x,char,spell_id,spell_name,spell_color)
        }
        setTarget([...target,...char]) 
        setChar([])
    }

    return (
        <Row>
            <Col>
            <Card>
            <Card.Header>Target Group<Button size="sm" style={{float:'right'}} onClick={() => remove_all_targets()}>Remove All</Button></Card.Header>

                <Card.Body>                                                                                                                   
            <ReactSortable list={target} setList={setTarget} group="target" fallbackOnBody={true} swapThreshold={1} multiDrag={true} onAdd={(e) =>  new_target(e.oldIndex,char,target,spell_id,spell_color,spell_name)} onRemove={(e) => remove_status_effect(e.oldIndex,target,spell_id)}>
                {target != null ? target.map((item:SpellRec) => {
                return <Badge key={item.id} style={{backgroundColor:`${item.color}`}}>{item.name}</Badge>}):[]}
            </ReactSortable>
            </Card.Body>
            </Card>
            </Col>
            <Col> 
            <Card>
            <Card.Header>List of Targets<Button size="sm" style={{float:'right'}}  onClick={() => remove_all_char()}>Add All to Target List</Button></Card.Header>
            
                <Card.Body>
            <ReactSortable list={char} setList={setChar} group="target" fallbackOnBody={true} swapThreshold={1} multiDrag={true}>
                {char.map((item:SpellRec) => {
                return <Badge key={item.id} style={{backgroundColor:`${item.color}`}}>{item.name}</Badge> })}
            </ReactSortable>
            </Card.Body>
            </Card>
            </Col>
        </Row>
    )
}
