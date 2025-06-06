import {useRef} from 'react';
import "../CSS/modal.css"
import logo from '../im2.jpg';
//import logo from '../im.avif';
export default function Test(props)
{
    const modalRef = useRef(null);
    const modalHoldImageRef = useRef(null);

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
                    <div ref={modalHoldImageRef} className="modalHoldImage">
                        <div className="circle"></div>
                        <img className="imageStyle" src={logo}></img>
                    </div>
                    <button onClick={()=>{
                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
                        //console.log("Height: " + vh + ",Width: " +vw);
                    
                        let ScreenMin = Math.min(vw, vh);                      
                        console.log("Cirlce size: " + ScreenMin * 0.4);
                        console.log("Distance from top: " + (modalHoldImageRef.current.scrollTop));// - (ScreenMin * 0.1)));
                        console.log("Distance from left: " + (modalHoldImageRef.current.scrollLeft));// - (ScreenMin * 0.1)));
                        //modalRef.current
                        //console.log("Client height" + modalHoldImageRef.current.clientHeight);
                        //console.log("Scroll height" + modalHoldImageRef.current.scrollHeight);
                        //console.log("Scroll Top" + modalHoldImageRef.current.scrollTop);
                        //console.log("Top left corner X,Y: " + +"," +);
                    }}>Print size</button>
                </div>
            </div>
        </>
    );
}