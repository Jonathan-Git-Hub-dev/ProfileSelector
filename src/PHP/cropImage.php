<?php 
header("Access-Control-Allow-Origin: *");//can be changed to be more specific

//echo "crop here". $_POST["u"];

//if(isset($_FILES['file']))
//{ 
    $file = $_FILES['file'];

    $fileName = $_FILES['file']['name'];

    $fileTempName = $_FILES['file']['tmp_name'];
    $fileSize = $_FILES['file']['size'];
    $fileError = $_FILES['file']['error'];
    $fileType = $_FILES['file']['type'];
    
    /*$fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));

    $allowed = array('jpg', 'jpeg');

    if(in_array($fileActualExt, $allowed))
    {*/
      if($fileError === 0)
      {
          //temporary save 
          //$newName = "../a1/src/ProfilePic/UsersProfilePic." . $fileActualExt;
          $newName="./temp.jpg";
          if(!move_uploaded_file($fileTempName, $newName))
          {
            //finish("-1");
          }

          //reload image for reformating
          $im = imagecreatefromjpeg($newName);
          if(!$im)
          {
            //finish("-1");
          }

          //$s = min(imagesx($im), imagesy($im)); 
          $x = $_POST['x'];
          $y = $_POST['y'];
          $c = $_POST['c'];
          
          $im2 = imagecrop($im, ['x' => $x, 'y' => $y, 'width' => $c, 'height' => $c]); 
          if(!$im2)
          {
            ///finish("-1");
          }

          $im3 = imagescale ( $im2 , 200 , 200 );
          if(!$im3)
          {
            //finish("-1");
          }
          
          $newFN = "./temp.jpeg";
          if(!imagejpeg($im3, $newFN, 100))
          {
            //finish("-1");
          }
      }
      /*else
      {
        finish("-1");//ranodm number
      }*/
    /*}
    else
    {
      finish("-6");//random number
    }*/

/*}
else
{
  finish("-8");
}*/

