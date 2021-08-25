import { GiClick } from 'react-icons/gi'
import { useAccordionButton,Button } from 'react-bootstrap';

export default function CustomToggleIcon({ eventKey }:{eventKey:any}) {

        const decoratedOnClick = useAccordionButton(eventKey)
      
    return (
        <>
            <Button className='screenbut' onClick={decoratedOnClick}><GiClick style={{paddingLeft:'.25rem',marginLeft:'1rem'}}/></Button>
        </>
    )
}
