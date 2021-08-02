import React,{ useRef, useState ,setState, useEffect} from 'react'
import EdiText from 'react-editext'
import { MdDeleteForever } from 'react-icons/md'
import { GiCrossbow,GiSandsOfTime} from 'react-icons/gi'
import { GoAlert } from 'react-icons/go'
import {StyledEdiText} from './edittext'
import { iconthemes} from './icontext'
import '../index.css';

const InitLine = ({init, onDelete,update_init,OnSave}) => {
    
    const[id_state,setId] = useState(init.id)
    // const [mycurrent,currState] = useState(init.cmark)
    // const[readys,rState] = useState(init.rmark)
    // const[delays,dState] = useState(init.dmark)
   
    
    return (
        
        <>
            <StyledEdiText
            showButtonsOnHover 
            type='text'
            value={init.Name}
            onSave={(e) => OnSave(e,init.id)}
            className='init-line'
            id={init.id}
            // update_init({'id':{id_state},'data':{'Name':this.value}})
            // editing={editing}
            />
          
            <button className='init' onClick={() =>  {
            update_init(({'id':id_state,'data':{cmark:!init.cmark}}))}} style={{backgroundColor:'black'}}><GiCrossbow style={{color:`${init.cmark ? iconthemes.current: iconthemes.init}`}}/></button>
           
            <button className='init' onClick={() =>  {
            update_init(({'id':id_state,'data':{dmark:!init.dmark}}))}
            } style={{backgroundColor:'black'}}><GiSandsOfTime style={{ color:`${init.dmark ? iconthemes.delay: iconthemes.init}`}}/></button>
           
            <button className='init' onClick={() => {
            update_init(({'id':id_state,'data':{rmark:!init.rmark}}))}
            } style={{backgroundColor:'black'}}><GoAlert style={{color:`${init.rmark ? iconthemes.ready: iconthemes.init}`}} /></button>
            
            <MdDeleteForever className='delete' style={{color:'red' }} onClick={() => onDelete(init.id)}/>
            
        </>
    )
}
// onChange={() => toggle(init.id,'current')}
// className={isActive ? 'GoAlert active': null}
export default InitLine