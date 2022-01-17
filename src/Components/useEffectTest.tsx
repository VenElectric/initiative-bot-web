import { Button } from "react-bootstrap"
import { useContext, useEffect } from "react";
import { SocketContext } from "../Context/SocketContext";
// Custom toggle for initiative accordion
export default function useEffectTest() {

    const socket = useContext(SocketContext);
    
    useEffect(() => {
        
        socket.on("test", )
        return () => {

        }
    }, [])
    return (
        <>
            <Button className='screenbut'>I am a test</Button>
        </>
    )
}