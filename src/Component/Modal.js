import {useRef} from 'react';
import "../CSS/Modal.css"

export default function Modal(props)
{
    const modalRef = useRef(null);

    function modalOn()
    {
       modalRef.current.style.display = "flex"; 
    }

    function modalOff(e)
    {
        //if clicking outside of the modal stop displaying modal
        if(e.target == modalRef.current)
        {
            modalRef.current.style.display = "none";
        }
    }


    return (
        <>
            {/*Modal launching button*/}
            <button onClick={modalOn}>
                {props.buttonText}
            </button>

            <div ref={modalRef} className="modalBackground" onClick={modalOff}>
                <div>
                    {props.children}
                </div>
            </div>
        </>
    );
}