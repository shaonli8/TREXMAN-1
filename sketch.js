var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var man, manImage;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var water, waterImage;

localStorage["HighestScore"] = 0;

function preload(){
 // trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
 // trex_collided = loadAnimation("trex_collided.png");
  
  manImage = loadAnimation("runningimage1.png","runningimage2.png")
  man_st_Image = loadAnimation("runningimage1.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  waterImage = loadImage("water.png")
}

function setup() {
  createCanvas(600, 200);
  
  man = createSprite(50,180,20,50);
  
  man.addAnimation("running",manImage);
  man.addAnimation("collided",man_st_Image);
  //trex.addAnimation("collided", trex_collided);
  man.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
 // man.debug = true;
  
  
  if (gameState===PLAY){
    background(200);
    text("Score: "+ score, 500,50);
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -4;
  
    if(keyDown("space")) {
      man.velocityY = -12;
    }
  
    man.velocityY = man.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(frameCount===100){
      spawnWater();
      cloudsGroup.destroyEach()
      obstaclesGroup.destroyEach()
      ground.destroy()
      man.velocityX = 2
      gameState = WIN
    }

    man.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(man)){
        gameState = END;
    }
    drawSprites();
  }
  else if (gameState === END) {
    background(150);
    gameOver.visible = true;
    restart.visible = true;
    man.changeAnimation("collided",man_st_Image);
    ground.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
    drawSprites();
  }
  else if(gameState===WIN){
    background(150)
    textSize(20);
    fill("white");
    text("WATER FOUND..YOU WIN!!",160,100)
    
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);

    gameOver.visible = false;
    restart.visible = false;

    // if(mousePressedOver(restart)) {
    //   reset();
    // }
    //ground.velocityX = 0;
    //man.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
  
    obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);

    drawSprites();
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = man.depth;
   man.depth = man.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  man.changeAnimation("running",manImage);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
}

function spawnWater () {   
    water = createSprite(500,100,40,10);
    water.scale =0.3
    water.addImage(waterImage);
    water.lifetime = -1;
}