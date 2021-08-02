import SessionPage from "./Components/SessionPage";
import {useLocation} from "react-router-dom"
import { useEffect,useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import InitContextProvider from "./Context/InitContext";
import SpellContextProvider from "./Context/SpellContext";
import {SocketContext} from './Context/SocketContext'


// const socket = io('http://localhost:8000');




function App() {
  // const location = useLocation();
  // const sessionid = new URLSearchParams(location.search).get('session_id')
  const socket = useContext(SocketContext);
  const sessionid = '723744588346556419'
  
useEffect(() => {
  
  socket.emit('create', String(sessionid));
  return () => {
    socket.disconnect()
  }
}, [])



  return (
    <InitContextProvider>
      <SpellContextProvider>
    <div className="App">
     {sessionid != null ? <SessionPage></SessionPage>:<div>Page for Discord Bot</div>}
     </div>
     </SpellContextProvider>
     </InitContextProvider>
  );
}

export default App;
