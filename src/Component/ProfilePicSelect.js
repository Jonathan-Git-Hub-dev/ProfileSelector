import {useRef, useState} from 'react';
import "../CSS/ProfilePicSelect.css"
//import logo from '../im2.jpg';//import logo from '../im.avif';
import Modal from './Modal.js';
import $ from 'jquery';

export default function ProfilePicSelect(props)
{
    const modalHoldImageRef = useRef(null);
    const [image, setImage] = useState(null);

    function sendToServer()
    {
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let ScreenMin = Math.min(vw, vh);
        
        //finding position of the circle in the image for later cropping
        console.log("Cirlce size: " + ScreenMin * 0.4);
        console.log("Distance from top: " + (modalHoldImageRef.current.scrollTop));// - (ScreenMin * 0.1)));
        console.log("Distance from left: " + (modalHoldImageRef.current.scrollLeft));// - (ScreenMin * 0.1)));

    }

    function getImage()
    {
        document.getElementById("file").click();
    }

    function imageSelected()
    {
        console.log("image");

        //check if changed to relevant data type
      var image = document.getElementById("file").files[0];

      var reader = new FileReader();

      reader.onload = function(e)
      {
        setImage(e.target.result);
      }

      reader.readAsDataURL(image);
    }

    return (
        <Modal buttonText="launch modal">
            <div className="profilePicSelectContent">
                    <div ref={modalHoldImageRef} className="profilePicSelectHoldImage">
                        <div className="profilePicSelectCircle"></div>
                        <img className="profilePicSelectImageStyle" src={image}></img>
                    </div>
                    <button onClick={sendToServer}>Print size</button>
                    <button onClick={getImage}>choose image</button>
                    <button onClick={()=>{
                        console.log("files");
                        var file_data = $('#file').prop('files')[0];   
                        var form_data = new FormData();                  
                        form_data.append('file', file_data);
                        

                        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
                        let ScreenMin = Math.min(vw, vh);
                        
                        //finding position of the circle in the image for later cropping
                        //console.log("Cirlce size: " + ScreenMin * 0.4);
                        //console.log("Distance from top: " + (modalHoldImageRef.current.scrollTop));// - (ScreenMin * 0.1)));
                        //console.log("Distance from left: " + (modalHoldImageRef.current.scrollLeft));// - (ScreenMin * 0.1)));

                        form_data.append('c', ScreenMin * 0.4);
                        form_data.append('x', (modalHoldImageRef.current.scrollLeft));
                        form_data.append('y', (modalHoldImageRef.current.scrollTop));
                        

                        $.ajax({
                            url: "http://localhost/profile/src/PHP/cropImage.php",
                            dataType: 'text',  // <-- what to expect back from the PHP script, if anything
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: form_data,                         
                            type: 'post'
                        })
                        .done(function(data)
                        {
                            console.log(data);
                        })
                        .fail(function(data){
                            console.log("Ajax error:\n" + data);
                        });

                    }}>php</button>
                    <input type="file" id="file" onChange={imageSelected} accept="image/jpg, image/jpeg" hidden/>
                        
            </div>
        </Modal>
    );
}