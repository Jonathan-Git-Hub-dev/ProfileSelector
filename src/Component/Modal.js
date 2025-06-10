import {useRef} from 'react';
import "../CSS/Modal.css"

export default function Modal(props)
{
    //const modalRef = useRef(null);

    function modalOn()
    {
        props.func();
       //modalRef.current.style.display = "flex";
    }

    function modalOff(e)
    {
        if(props.clickOff)
        {
            //if clicking outside of the modal stop displaying modal
            if(e.target == props.passedRef.current)
            {
                //modalRef.current.style.display = "none";
                props.passedRef.current.style.display = "none";
            }
        }
    }


    return (
        <>
            {/*Modal launching button*/}
            <button className="modalButton" onClick={modalOn}>
                {props.buttonText}
            </button>

            <div ref={props.passedRef} className="modalBackground" onClick={modalOff}>
                <div>
                    {props.children}
                </div>
            </div>
        </>
    );
}