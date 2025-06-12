import {useRef, useState, useEffect} from 'react';
import "../CSS/ProfilePicSelect.css"
import Modal from './Modal.js';
import $ from 'jquery';

export default function ProfilePicSelect(props)
{
    

    const focusing = useRef(null);//center of image for both the x and y axcis as a percentage
    const childRef = useRef(null);//used to display the modal
    const down = useRef(false);//tracks if user is dragging the image
    const range = useRef(null);//input slider for image size
    const modalHoldImageRef = useRef(null);//pointer to div holding image
    const inputImage = useRef(null);
    const originalSize= useRef([0,0]);//holds the original size of the image (before zoom applied)

    const [image, setImage] = useState(null);//inage user choose as profile picture
    const [sizing, setSizing] = useState({});//passed into to image style to resize image on zoom


    useEffect(()=>{
        //focusing on certain part of image on every rerender
        if(focusing.current == null)//first rerender so focus on center
        {
            //console.log("doing initial focus");
            modalHoldImageRef.current.scrollTop = (modalHoldImageRef.current.scrollHeight - modalHoldImageRef.current.clientHeight) / 2;
            modalHoldImageRef.current.scrollLeft = (modalHoldImageRef.current.scrollWidth - modalHoldImageRef.current.clientWidth) / 2;
        }
        else//focus on what user was focusing on last render
        {
            //make old centre pixel new centre pixel
            let height_px = modalHoldImageRef.current.scrollHeight;
            let top_distance = height_px * focusing.current[0] - 2 * screanSize();
            let width_px = modalHoldImageRef.current.scrollWidth;// - 2 * screanSize());
            let left_distance = width_px * focusing.current[1] - 2 * screanSize();

            //doing the scrolling
            modalHoldImageRef.current.scrollTop = top_distance;
            modalHoldImageRef.current.scrollLeft = left_distance;
        }
    });
    

    function getImage()//when modal clicked on get user's picture
    {
        inputImage.current.click();
    }

    function resizeImage()//calculates images size depending on zoom slider
    {
        //40% of screen size plus slider zoom
        let units = 4 + (Number(range.current.value)-1)/5;
        let size_px = units * screanSize();
        
        //differnet sizinf scema dependant on if image is height or width dominant
        if(originalSize.current[0] > originalSize.current[1])
        {
            let ratio = originalSize.current[0] / originalSize.current[1]; 
            let dominant_size_px = size_px * ratio;
            setSizing({minHeight: size_px + "px", maxHeight: size_px + "px",
                     minWidth: dominant_size_px + "px", maxWidth: dominant_size_px + "px"} );
        }
        else//height greater
        {
            let ratio = originalSize.current[1] / originalSize.current[0]; 
            let dominant_size_px = size_px * ratio;
            setSizing({minWidth: size_px + "px", maxWidth: size_px + "px", 
                minHeight: dominant_size_px + "px", maxHeight: dominant_size_px + "px"});
        }
    }

    function scrnche()
    {
        console.log("changed please remove later");
        //image needs to be resized
        resizeImage();
    }

    function imageSelected()
    {
        //make user user didnt cancel
        if(inputImage.current.value == "")
        {
            console.log("no data passed in");
            return;
        }
        
        //display editing screen
        childRef.current.style.display = "flex";

        
        console.log("setting up change");
        window.addEventListener("resize", scrnche);
        
        //load image
        var image = inputImage.current.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = function(e)
        {
            setImage(e.target.result);//saves image for displaying

            //getting image dimensions
            var image = new Image();
            image.src = reader.result;
            image.onload = function() {
                //save size for later
                originalSize.current=[image.width, image.height];
                
                if(image.width> image.height)//setting image size for display
                {
                    let ratio = originalSize.current[0] / originalSize.current[1]; 
                    let largeSide = 4*screanSize()*ratio;
                    setSizing({minHeight: screanSize() * 4 + "px", maxHeight: screanSize() * 4 + "px",
                        minWidth: largeSide + "px", maxWidth: largeSide + "px"});
                }
                else//height greater
                {
                    let ratio = originalSize.current[1] / originalSize.current[0]; 
                    let largeSide = 4*screanSize()*ratio;
                    setSizing({minWidth: screanSize() * 4 + "px", maxWidth: screanSize() * 4 + "px",
                        minHeight: largeSide + "px", maxHeight: largeSide + "px"});
                }
            };
        }
    }

    function screanSize()//returns size of screen devided by 10
    {
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let ScreenMin = Math.min(vw, vh)
        return ScreenMin/10;
    }

    function closeModal()//reoves modal from screen
    {
        //hide modal and reset inputs
        childRef.current.style.display = "none";
        range.current.value = 1;
        document.getElementById("file").value = "";

        //removing
        console.log("removing chage event listener");
        window.removeEventListener("resize", scrnche);
        console.log("removing chage event listener2");
    }

    function saveImage()//send image to backend
    {
        //calculating which portion fo image user has selected
        let height_px = (modalHoldImageRef.current.scrollHeight);
        let top_start = modalHoldImageRef.current.scrollTop;
        let top_start_ratio = top_start/ height_px;
        let displayed_height = (screanSize()*4)/height_px;
        let width_px = (modalHoldImageRef.current.scrollWidth);
        let left_start = modalHoldImageRef.current.scrollLeft;
        let left_start_ratio = left_start/ width_px;
        let displayed_width = (screanSize()*4)/width_px;

        //structuring post data
        let file_data = inputImage.current.files[0];
        let form_data = new FormData();                  
        form_data.append('file', file_data);
        form_data.append('y_ratio', top_start_ratio);
        form_data.append('x_ratio', left_start_ratio);
        form_data.append('y_percentage', displayed_height);
        form_data.append('x_percentage', displayed_width);

        //using ajax to comunicate with backend
        $.ajax({
            url: "http://localhost/profile/src/PHP/cropImage.php",
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,                         
            type: 'post'
        })
        .done(function(data)
        {
            //on success close input modal
            closeModal();
        })
        .fail(function(data){
            console.log("Error");
        });

    }

    function zoom()
    {
        //find where user has focus image for refocusing after zoom             
        let focus_y_px = modalHoldImageRef.current.scrollTop+ screanSize()*2;
        let y_px = modalHoldImageRef.current.scrollHeight;
        let focus_x_px = modalHoldImageRef.current.scrollLeft + screanSize()*2;
        let x_px = modalHoldImageRef.current.scrollWidth;// - screanSize()*2;

        focusing.current= [focus_y_px / y_px, focus_x_px / x_px];
                              
        //calculate new size 
        resizeImage();
    }

    //tracks dragging on image to scroll
    function mouseDownFunc(e)
    {
        e.preventDefault();
        down.current=true;
    }

    function mouseUpFunc(e)
    {
        e.preventDefault();
        down.current=false;
    }
    function mouseMoveFunc(e)
    {
        if(!down.current)
        {//ignore is mouse is not held down
            return;
        }
        e.preventDefault();

        //scroll to new position
        let scroll_y= modalHoldImageRef.current.scrollTop - e.movementY;
        modalHoldImageRef.current.scrollTop = scroll_y;
        let scroll_x= modalHoldImageRef.current.scrollLeft - e.movementX;
        modalHoldImageRef.current.scrollLeft = scroll_x;
    }


    return (
        <Modal func={getImage} passedRef={childRef} displayButton={false} buttonText="Upload profile picture">
            {/*Image input activated on opening*/}
            <input type="file" id="file" ref={inputImage} onChange={imageSelected} accept="image/jpg, image/jpeg" hidden/>
            <div className="profilePicSelectFrame">
                <div>
                    {/*Displaying user's chosen image*/}
                    <div ref={modalHoldImageRef} className="profilePicSelectImageHold">
                        <img src={image} className="profilePicSelectImage"
                            style={sizing}
                            onMouseDown={mouseDownFunc}
                            onMouseUp={mouseUpFunc}
                            onMouseLeave={mouseUpFunc}
                            onMouseMove={mouseMoveFunc}
                        />
                    </div>
                    {/*Image taget circle*/}
                    <div className="profilePicSelectTargetHold">
                        <div className="profilePicSelectTarget" />
                    </div>
                </div>

                {/*inputs*/}
                <div className="profilePicSelectInputs">        
                    <input type="range" defaultValue="1" min="1" max="60" className="profilePicSelectSlider" ref={range} onChange={zoom}/>
                    <div className="profilePicSelectButtons">            
                        <button className="profilePicSelectButton" onClick={saveImage}>php</button>
                        <button className="profilePicSelectButton" onClick={closeModal}>cancel</button>
                    </div>             
                </div>                             
            </div>
        </Modal>
    );
}