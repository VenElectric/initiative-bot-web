import { ItemInterface, ReactSortable,SortableEvent,MoveEvent, Sortable} from "react-sortablejs"
import { MultiDrag, Swap } from "sortablejs";
import React, {useEffect,useContext,useRef,useState,createRef} from 'react'
import {Row,Col,Badge,Card,Button,InputGroup} from 'react-bootstrap'
import { InitiativeLine,SpellLine,status_effects,TargetData } from "../Interfaces/Interfaces";
import { ErrorBoundary } from "./ErrorBoundary";
import useLocalStorage from "../Hooks/useLocaleStorage";
import {InitContext} from "../Context/InitContext"
import { SpellContext } from "../Context/SpellContext";
import { SocketContext } from "../Context/SocketContext";
import { GiTrousers } from "react-icons/gi";

interface SpellRec{
    id: string|number
    name:string;
    color:string;
    status_effects: status_effects[]
}

Sortable.mount(new MultiDrag());
export default function SpellTarget({spell_rec,spell_id,spell_name,spell_effect,show_data}:{spell_rec:any,spell_id:string,spell_name:string,spell_effect:string,show_data:boolean}) {
    const socket = useContext(SocketContext);
    const projectkey = 'initiativebot'
    const { spell_list,update_spell_effect,remove_spell_effect} = useContext(SpellContext);
    const {init_list,remove_status_effect,new_target,char_list} = useContext(InitContext)
    
    // @ts-ignore
	const target_list = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`)) || [];
	// @ts-ignore
    const main_list = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`)) || [];
	const [target,setTarget] = useLocalStorage(`target_list${spell_id}`, target_list);
	const [char,setChar] = useLocalStorage(`main_list${spell_id}`, main_list);
	// const [target,setTarget] = useState([] as TargetData[])
	// const [char,setChar] = useState([] as TargetData[])

    const [mounted,setMount] = useState(true)
    

    useEffect(()=> {
        console.log(mounted,'mounted')
        console.log(spell_id)
        return () => {
            setMount(false)
            console.log(spell_id)
            console.log(mounted,'unmounting')
          }
    })
	
	useEffect(()=> {
        // @ts-ignore
        let target_init = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`)) || [];
	    // @ts-ignore
        let main_init = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`)) || [];
        setTimeout(()=>{
            
            let char_data = []
            let target_data = []
            if (target_init.length === 0 && main_init.length === 0 && spell_id !== undefined){
                let spell_index = spell_list.map((item:SpellLine)=> item.id).indexOf(spell_id)
                if(spell_list[spell_index].user_ids.length !== 0){
                    for (let y in spell_list[spell_index].user_ids){
                        let init_index = init_list.map((item:InitiativeLine) => item.id).indexOf(spell_list[spell_index].user_ids[y])
                        target_data.push({id:init_list[init_index].id,name:init_list[init_index].name,status_effects:init_list[init_index].status_effects})
                    }
                }
                console.log('initialize data if both are 0')
            for (let x in init_list){
                let index = target_data.map((item:any)=> item.id).indexOf(init_list[x].id)
                if (index < 0){
                    char_data.push({id:init_list[x].id,name:init_list[x].name,status_effects:init_list[x].status_effects})
                }
               
            }
            setTarget(target_data)
            setChar(char_data)
        }
        
    
        },100)

        setTimeout(()=>{
            if (spell_id !== undefined) {

                console.log('it might be this.')
              // @ts-ignore
              let target_new = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
              // @ts-ignore
              let main_new =JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
              
                setChar(main_new)
                setTarget(target_new)
            }
        },500)
    
    },[spell_id])

    useEffect(()=>{
        setTimeout(()=>{
        //@ts-ignore
        let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
        //@ts-ignore
        let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
       
        setChar(main_state)
        setTarget(target_state)
    },500) 
    },[init_list])
    
    useEffect(()=>{
        socket.on('client_update_target',function(data:any){
        setTimeout(()=>{
            //@ts-ignore
            let target_state = JSON.parse(localStorage.getItem(`${projectkey}target_list${spell_id}`))
            //@ts-ignore
            let main_state = JSON.parse(localStorage.getItem(`${projectkey}main_list${spell_id}`))
           
            setChar(main_state)
            setTarget(target_state)
         
        },500) })
    },[])
	

    const remove_all_targets = () => {

        for(let x = 0;x<target.length;x++){
            remove_status_effect(x,target,spell_id)
        }
        setChar([...char,...target]) 
        setTarget([])
    }

    const remove_all_char = () => {
        for(let x = 0;x<char.length;x++){
            new_target(x,char,spell_id,spell_name,spell_effect)
        }
        setTarget([...target,...char]) 
        setChar([])
    }
    console.log(show_data)

    return (
        <>
        
           <Col>
            <Card style={{height:'100%'}} className='screenbg'>
            <Card.Header style={{fontSize:'.8rem'}}>
                
            <InputGroup className="mb-3">
							<InputGroup.Text className='spellinputtext' id="inputGroup-sizing-default">
                            Target Group
							</InputGroup.Text>
                            <Button disabled={show_data} size="sm" className='screenbutsm' onClick={() => remove_all_targets()}>Remove All</Button>
            </InputGroup>
            </Card.Header>

                <Card.Body style={{height:'100%'}}>                                                                                                                   
            <ReactSortable list={target} setList={setTarget} group="target" fallbackOnBody={true} swapThreshold={1} multiDrag={true} onAdd={(e) =>  {new_target(e.oldIndex,char,spell_id,spell_name,spell_effect);update_spell_effect(e.oldIndex,char,spell_id)}} onRemove={(e) => {remove_status_effect(e.oldIndex,target,spell_id);remove_spell_effect(e.oldIndex,target,spell_id)}}>
                {target != null && !show_data ? target.map((item:SpellRec) => {
                return <Badge key={item.id} className='targetstyle'>{item.name}</Badge>}):[]}
            </ReactSortable>
            </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card style={{height:'100%'}} className='screenbg'>
            <Card.Header style={{fontSize:'.8rem'}}>
            <InputGroup className="mb-3">
							<InputGroup.Text className='spellinputtext' id="inputGroup-sizing-default">
                            List of Targets
                            </InputGroup.Text>
                            <Button disabled={show_data} size="sm" className='screenbutsm' onClick={() => remove_all_char()}>Add All</Button>
                            </InputGroup>
            </Card.Header>
            
                <Card.Body style={{height:'100%'}}>
            <ReactSortable list={char} setList={setChar} group="target" fallbackOnBody={true} swapThreshold={1} multiDrag={true}>
                {!show_data ? char.map((item:SpellRec) => {
                return <Badge key={item.id} className='targetstyle'>{item.name}</Badge> }):[]}
            </ReactSortable>
            </Card.Body>
            </Card>
            </Col>
        </>
    )
}
