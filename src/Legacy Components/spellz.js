import { useState } from 'react'
import EdiText from 'react-editext'

export default function SpellLine({item,onSave}) {
   const [editing, setEditing] = useState(false)

    return (
       <>
        
        <td><EdiText
         type='text'
         value={item.spell_name}
         onSave={(e) => onSave({'spell_name':e},item.id)}
         editOnViewClick={true}
         />
         </td>

        <td>
        <EdiText
         type='text'
         value={item.duration}
         onSave={(e) => onSave({'duration':e},item.id)}
         editOnViewClick={true}
         />
         </td>
        <td>
        <EdiText
         type='text'
         value={item.target}
         onSave={(e) => onSave({'target':e},item.id)}
         editOnViewClick={true}
         />
           </td>
           
       </>
       )
    }