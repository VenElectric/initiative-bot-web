import React,{useState,setState} from 'react'
import styled from 'styled-components'
import {Form,InputGroup,FormControl,Button,OverlayTrigger,Popover,Tooltip} from 'react-bootstrap';

const FormSubmit = ({name1,name2,name3,handleSubmit}) =>{

   const initial = {fields:{spell:'',target:'',duration:''}}
   const [val,valState] = useState(initial)
   
   const handleChange = (evt) => {
      
      valState((prevState)=>({fields:{ [evt.target.name]: evt.target.value }}));
   }

   
   
  
    return (

       <>
       <Form onSubmit={(e) => {handleSubmit(e); valState(initial)}}>
          
       <Form.Label htmlFor="inlineFormInput" visuallyHidden>
         Spell Name
       </Form.Label>
       <Form.Control
         className="mb-2"
         id="inlineFormInput"
         placeholder="Spell name"
       />
       <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
         Target
       </Form.Label>
       <InputGroup className="mb-2">
       <OverlayTrigger key='1' placement='top' overlay={
             <Tooltip id={`1`}>
                Who is the spell targeting? (Party, Self, etc.)
                </Tooltip>
         }>
         <InputGroup.Text>?</InputGroup.Text>
         </OverlayTrigger>
         <FormControl id="inlineFormInputGroup" placeholder="Target" />
       </InputGroup>
       <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
         Duration
       </Form.Label>
       <InputGroup className="mb-2">
         <FormControl id="inlineFormInputGroup" placeholder="Duration" />
       </InputGroup>
       
       <Button type="submit" className="mb-2">
         Submit
       </Button>
 </Form>
     
       </>
       )
    }

   //  <form onSubmit={(e) => {handleSubmit(e); valState(initial)}}>
   //  <label>{name1}:</label>
   //   <input type='text' name={name1} value={val.fields.spell} onChange={handleChange}/>
   //   <br/>
   //   <label className='label-form'><div className="spanform">{name2}:</div></label>
   //   <input type='text' name={name2} value={val.fields.target} onChange={handleChange}/>
   //   <br/>
   //   <label className='label-form'><div className="spanform">{name3}:</div></label>
   //   <input type='text' name={name3} value={val.fields.duration} onChange={handleChange}/>
   //   <br/>
   //   <input type="submit" value="Submit" />
   //   </form>

    export default FormSubmit