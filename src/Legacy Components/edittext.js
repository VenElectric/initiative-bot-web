import EdiText from 'react-editext'
import styled from 'styled-components'


const StyledEdiText = styled(EdiText)`

button {

  border-radius: 5px;

}

button[editext="edit-button"] {
   
  color: #000;

  margin-left: 10px;

}

button[editext="save-button"] {

  width: 50px;

  &:hover {

    background: greenyellow;

  }

}

button[editext="cancel-button"] {

  &:hover {

    background: crimson;

    color: #fff;

  }

}

input, textarea {

    font: 10px;
  background: #1D2225;

  color: #F4C361;

  font-weight: bold;

  border-radius: 5px;

}
div[editext='view']{
    font-size: 10px;
    max-width: 20px;
}
div[editext="view-container"], div[editext="edit-container"] {

  background: #6293C3;

  padding: 10px;

  border-radius: 5px;

  color: #fff;

  max-width: 175px;

}
`

export {StyledEdiText}