var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var foodObj;

   function preload()
   {
      dogImg=loadImage("dogImg.png");
      dogImg1=loadImage("dogImg1.png");
   } 

   //Function to set initial environment 
   function setup() 
   {
      database=firebase.database();
     createCanvas(500,500); 

     foodObj = new Food();
     
     dog=createSprite(250,300,150,150);
     dog.addImage(dogImg);
     dog.scale=0.15; 

     foodStock=database.ref('Food'); 
     foodStock.on("value",readStock);

     feed=createButton("Feed the dog");
     feed.position(200,45);
     feed.mousePressed(feedDog);
   
     addFood=createButton("Add Food");
     addFood.position(300,45);
     addFood.mousePressed(addFoods);

     textSize(20); 
   } 
   // function to display UI
  function draw() 
     {
      background(46,139,87);
      foodObj.display();
    
      fedTime = database.ref('FeedTime');
      fedTime.on("value",function(data){
      lastFed = data.val();
    });
     
      fill(255,255,254);
      textSize(15);
      if(lastFed>=12)
      {
        text("Last Feed : "+ lastFed%12 + " PM", 350,30);
       }else if(lastFed==0)
       {
         text("Last Feed : 12 AM",350,30);
       }else
       {
         text("Last Feed : "+ lastFed + " AM", 350,30);
       }
     
      drawSprites();
    }

 //Function to read values from DB 
    function readStock(data)
{
   foodS=data.val();
   foodObj.updateFoodStock(foodS);
} 

//function to update food stock and last fed time
function feedDog()
{
   dog.addImage(dogImg1);
 
   foodObj.updateFoodStock(foodObj.getFoodStock()-1);
   database.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime:hour()
   })
}


//function to add food in stock
function addFoods()
{
   foodS++;
   database.ref('/').update
   ({
     Food:foodS
   })
 }

//Function to write values in DB
function writeStock(x)
{
   if(x<=0){ x=0; 
}
 else
{ 
   x=x-1; 
} 
  database.ref('/').update({ Food:x })
}