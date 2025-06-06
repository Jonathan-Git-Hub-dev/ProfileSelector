import {useRef} from 'react';
import "../CSS/ProfilePicSelect.css"
import logo from '../im2.jpg';//import logo from '../im.avif';
import Modal from './Modal.js';

export default function ProfilePicSelect(props)
{
    const modalHoldImageRef = useRef(null);

    return (
        <Modal buttonText="launch modal">
            <div className="profilePicSelectContent">
                    <div ref={modalHoldImageRef} className="profilePicSelectHoldImage">
                        <div className="profilePicSelectCircle"></div>
                        <img className="profilePicSelectImageStyle" src={logo}></img>
                    </div>
                    <button onClick={()=>{
                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
                        let ScreenMin = Math.min(vw, vh);
                        
                        //finding position of the circle in the image for later cropping
                        console.log("Cirlce size: " + ScreenMin * 0.4);
                        console.log("Distance from top: " + (modalHoldImageRef.current.scrollTop));// - (ScreenMin * 0.1)));
                        console.log("Distance from left: " + (modalHoldImageRef.current.scrollLeft));// - (ScreenMin * 0.1)));
                    }}>Print size</button>
            </div>
        </Modal>
    );
}