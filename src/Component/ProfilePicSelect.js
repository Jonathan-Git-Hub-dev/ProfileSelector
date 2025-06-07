import {useRef, useState, useEffect} from 'react';
import "../CSS/ProfilePicSelect.css"
//import logo from '../im2.jpg';//import logo from '../im.avif';
import Modal from './Modal.js';
import $ from 'jquery';

export default function ProfilePicSelect(props)
{
    const focusing = useRef(null);//left distance, right distance scale
    //const displaySize = useRef(8);

    useEffect(()=>{
        //console.log("will this infinite loop");
        //var element = document.getElementById('container'); /* This is your div */

        //focus on last bit
        if(focusing.current == null)
        {
            modalHoldImageRef.current.scrollTop = (modalHoldImageRef.current.scrollHeight - modalHoldImageRef.current.clientHeight) / 2;
            modalHoldImageRef.current.scrollLeft = (modalHoldImageRef.current.scrollWidth - modalHoldImageRef.current.clientWidth) / 2;
        }
        else
        {

            console.log("doing move");
            let h = (modalHoldImageRef.current.scrollHeight - 2 * screanSize());
            let px = h*focusing.current[0] - 2 * screanSize();

            let w = (modalHoldImageRef.current.scrollWidth - 2 * screanSize());
            let pxw = w*focusing.current[1] - 2 * screanSize();

            modalHoldImageRef.current.scrollTop = px;
            modalHoldImageRef.current.scrollLeft = pxw;
        }
    });
    const modalHoldImageRef = useRef(null);

    const dominent = useRef(false);

    //const [slide, setSlide] = useState(20);
    const [image, setImage] = useState(null);
    //const [imageSize, setImageSize] = useState({border: "solid 2px blue"});
    const [sizing, setSizing] = useState({});


    function getImage()
    {
        document.getElementById("file").click();
    }

    function imageSelected()
    {
        //check if changed to relevant data type
      var image = document.getElementById("file").files[0];

      var reader = new FileReader();

      reader.onload = function(e)
      {
        //console.log(reader.result);
        setImage(e.target.result);//saves image for displaying

        //getting image dimensions
        var image = new Image();

        image.src = reader.result;

        image.onload = function() {
            //alert(image.width);
            //console.log("width: " + image.width + " height: " + image.height);
            //setImageSize([image.width, image.height]);
            
            if(image.width> image.height)
            {
                dominent.current = true;
                setSizing({minHeight: screanSize() * 4 + "px", maxHeight: screanSize() * 4 + "px"});
            }
            else//height greater
            {
                setSizing({minWidth: screanSize() * 4 + "px", maxWidth: screanSize() * 4 + "px"});
            }
        };
      }

      reader.readAsDataURL(image);
    }

    function screanSize()
    {
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let ScreenMin = Math.min(vw, vh)
        return ScreenMin/10;
    }

    function saveImage()
    {
        //console.log("files");
        var file_data = $('#file').prop('files')[0];   
        var form_data = new FormData();                  
        form_data.append('file', file_data);
        
        let ScreenMin = screanSize;
        
        //finding position of the circle in the image for later cropping
        //console.log("Cirlce size: " + ScreenMin * 0.4);
        //console.log("Distance from top: " + (modalHoldImageRef.current.scrollTop));// - (ScreenMin * 0.1)));
        //console.log("Distance from left: " + (modalHoldImageRef.current.scrollLeft));// - (ScreenMin * 0.1)));

        form_data.append('c', ScreenMin * 4);
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

    }

    function prin()
    {
        //console.log("doing");
    }

    return (
        <Modal func={getImage} buttonText="launch modal">
            <div className="profilePicSelectContent">
                    <div ref={modalHoldImageRef} className="profilePicSelectHoldImage">
                        <div className="profilePicSelectCircle"></div>
                        {image ? <img className="profilePicSelectImageStyle" src={image} style={sizing}></img> : <></>}
                    </div>
                    
                    
                
                    <input type="range" defaultValue="1" min="1" max="60" className="slider" id="myRange" onChange={(e)=>{
                        //console.log(screanSize());
                        //console.log(e.target.value);
                        let size;
                        //if(Number(e.target.value) == 4)
                        //{
                           // size = 4;
                        //}
                        //else
                        //{
                            size = 4 + (Number(e.target.value)-1)/5;
                        //}

                        
                        //console.log(size)
                        let size2 = size * screanSize();
                
                        let a = modalHoldImageRef.current.scrollTop + screanSize()*2;
                        let b = modalHoldImageRef.current.scrollHeight - screanSize()*2;
                        let c = modalHoldImageRef.current.scrollLeft + screanSize()*2;
                        let d = modalHoldImageRef.current.scrollWidth - screanSize()*2;

                        focusing.current= [a/b,c/d];
                        //console.log("old height was: " + (modalHoldImageRef.current.scrollHeight - 2 * screanSize()));
                        
                        if(dominent.current == true)
                        {
                            //console.log("new height will be: " + size2);
                            setSizing({minHeight: size2 + "px", maxHeight: size2 + "px"});
                            //setSizing({minHeight: 1000 + "px", maxHeight: 1000 + "px", });
                        }
                        else//height greater
                        {
                            setSizing({minWidth: size2 + "px", maxWidth: size2 + "px"});
                            //setSizing({minWidth: 1000 + "px", maxWidth: 1000 + "px"});
                        }
                    }}/>
                    
                    
                    <button onClick={saveImage}>php</button>
                    <input type="file" id="file" onChange={imageSelected} accept="image/jpg, image/jpeg" hidden/>
                        
            </div>
        </Modal>
    );
}