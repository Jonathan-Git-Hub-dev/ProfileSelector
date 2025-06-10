<?php 
header("Access-Control-Allow-Origin: *");//can be changed to be more specific

if(//making sure all relvant variables have been sent
  !isset($_FILES['file']) ||
  !isset($_POST['y_ratio']) ||
  !isset($_POST['x_ratio']) ||
  !isset($_POST['y_percentage']) ||
  !isset($_POST['x_percentage'])
) {
  header('HTTP/1.1 500 Undeclared Variables');
  return;
}

//get file
$fileName = $_FILES['file']['name'];
$fileError = $_FILES['file']['error'];
$fileType = $_FILES['file']['type'];

//only working with jpeg
$fileExt = explode('.', $fileName);
$fileActualExt = strtolower(end($fileExt));
$allowed = array('jpg', 'jpeg');
if(!in_array($fileActualExt, $allowed))
{
  header('HTTP/1.1 500 Uncompatable image');
  return;
}

//error loading the file from frontend
if($fileError !== 0)
{
  header('HTTP/1.1 500 File upload error');
  return;
}

//converting image into workable format
$im = imagecreatefromjpeg($_FILES['file']['tmp_name']);
if(!$im)
{
  header('HTTP/1.1 500 Php function error');
  return;
}

$y_start = $_POST['y_ratio'];//percentage of height of image from top where new image starts
$x_start = $_POST['x_ratio'];
$y_percentage = $_POST['y_percentage'];//percentage of the height of the image that new image uses
$x_percentage = $_POST['x_percentage'];

//makeing sure crop values make sense (connot have more than 100%)
if($y_start + $y_percentage > 100 || $x_start + $x_percentage > 100)
{
  header('HTTP/1.1 500 Vairiable format error');
  return;
}

//convert percentages into pixels
$size_x = imagesx($im);//original image size
$size_y = imagesy($im); 
$px_size_y = ceil($size_y*$y_percentage);//size of part of image we are keeping
$px_size_x = ceil($size_x*$x_percentage);
$px_start_y = floor($y_start*$size_y);//index we are keepig from
$px_start_x = floor($x_start*$size_x);

//maybe impossible but make sure image has dimensions
if($size_x < 1 || $size_y < 1)
{
  header('HTTP/1.1 500 Vairiable format error');
  return;
}

//crop
$im = imagecrop($im, ['x' => $px_start_x, 'y' => $px_start_y, 'width' => $px_size_x, 'height' => $px_size_y]); 
if(!$im)
{
  header('HTTP/1.1 500 Php function error');
  return;
}

// could use imagescale($image , $sz1 , $sz2) to size image to constant size

//saving image
$newFN = "./temp.jpg";
if(!imagejpeg($im, $newFN, 100))
{
  header('HTTP/1.1 500 Php function error');
  return;
}