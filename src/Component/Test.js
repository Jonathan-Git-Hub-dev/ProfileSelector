import {useRef} from 'react';
import "../CSS/modal.css"
import logo from '../im2.jpg';

export default function Test(props)
{
    const modalRef = useRef(null);

    function prin()
    {
        console.log("butotn");
    }

    return (
        <>
            <button onClick={()=>{
                modalRef.current.style.display = "flex";
                //console.log(modalRef);
            }}>Modal</button>
            <div ref={modalRef} className="appModal" onClick={(e)=>{
                if(e.target == modalRef.current)
                {
                    //console.log("out");
                    modalRef.current.style.display = "none";
                }
                else
                {
                    //console.log("in");
                }
                //console.log("modal stuff");
                //console.log(e.target);
            }}>
                <div className="modalContent">
                    <div className="modalHoldImage">
                        <div className="circle"></div>
                        <img src={logo}></img>
                    </div>
                    <button onClick={()=>{
                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
                        console.log("Height: " + vh + ",Width: " +vw);
                    }}>Print size</button>
                    


                </div>
            </div>
        </>
    );
}