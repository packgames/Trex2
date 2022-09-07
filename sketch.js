//Variáveis de estado de jogo
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Variáveis de personagem e cenário
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, restart;

//Pontuação
var score=0;

//Variáveis de sons
var jumpSound, dieSound, checkPointSound;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
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

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup() {

  //Tamanho da tela
  createCanvas(windowWidth,windowHeight);

  //Sprite trex
  trex = createSprite(50,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //Chão
  ground = createSprite(200,height-200,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //Sprites gameover e restart
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(width/2,height/2-50);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  //Chão invisível
  invisibleGround = createSprite(200,height-180,400,10);
  invisibleGround.visible = false;
  
  //Grupos de nuvens e obstáculos
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
}

function draw() {
  console.log (trex.y)
  background(255);

  //Textos da tela
  textSize(15);
  fill("blue");
  text("Score: "+ score, width-200,50);
  text("DESENVOLVIDO POR:",30,height-90);
  fill("black");
  text("Vítor Spinola",30,height-70);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
    
    //mudar a animação do trex
    trex.changeAnimation("running", trex_running);
    
    //Pulo do trex
    if((touches.length>0 || keyDown("SPACE")) && trex.y >= height/2 - 100) {
      jumpSound.play();
      trex.velocityY = -10;
      touches = [];
    }

    //Gravidade do trex
    trex.velocityY = trex.velocityY + 0.8
    
    //Solo infinito
    if (ground.x < width/2+100){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);

    //Gerar nuvens e obstáculo
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
    }
  //FIM DO ESTADO PLAY
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //definir a velocidade de cada objeto do jogo para 0
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //mudar a animação do trex
    trex.changeAnimation("collided",trex_collided);
    
    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 ||mousePressedOver(restart)) {
      reset();
    }
  //FIM DO ESTADO END
  }
  drawSprites();

//FIM DA FUNÇÃO DRAW
}

function spawnClouds() {
  //Código para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+50,height/10,40,10);
    cloud.y = Math.round(random(80,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = -5;
    
     //atribua tempo de vida à variável
    cloud.lifetime = width/cloud.velocityX;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  //Código para reiniciar jogo
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width+30,height-210,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //gerar obstáculos aleatórios
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
    
    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/obstacle.velocityX;

    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

