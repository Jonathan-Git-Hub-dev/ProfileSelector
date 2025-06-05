import {useRef} from 'react';
import "../CSS/modal.css"
import logo from '../im.avif';

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
                <div className="modalInner" onMouseDown={(e)=>{
                    e.preventDefault();
                    console.log("down");
                }}>
                    
                    <img src={logo}></img>
                    {/*props.children*/}
                    <div className="circle"></div>
                </div>
            </div>
        </>
    );
}