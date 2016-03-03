window.onload = function() {    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    //the garden can lighten up with each new firefly that is caught
    
    function preload() {
        game.load.image('night','assets/night1.png');
        game.load.image('player','assets/jar5.png',43,83,1);
        game.load.image('firefly','assets/firefly3.png');
        game.load.image('spider','assets/spider2.png');
        game.load.image('lid','assets/lid2.png');
        game.load.image('heart','assets/heart1.png');
        game.load.audio('background','assets/audio/forest.mp3');
        game.load.audio('song1','assets/audio/explosion.mp3');
        game.load.audio('song2','assets/audio/star.mp3');
        game.load.image('night2','assets/night2.png');
    }
    
    //enemies
    var player, firefly;
    var music;
    var music2;
    var music4;    
    var flies, enemies, cursors, lids; //groups
    var spider;
    var lid;
    var score =0;
    var scoreText, stateText, stateText2;
    var emitter;    
    var strikes = 0;
    var heart, heart1,heart2;
    var afterPic;
    
    function create() {
      
        //background
        game.add.sprite(0, 0, 'night');
        game.physics.startSystem(Phaser.Physics.ARCADE);      
        
        //the jar aka the player of the game
        player = game.add.sprite(200,600,'player');       
        game.physics.arcade.enable(player);    
        
        player.body.collideWorldBounds = true;
            
           //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();        
        
        //enemies
        spider = game.add.sprite('spider');
        
        firefly = game.add.sprite('firefly');
        lid = game.add.sprite('lid'); //ends game when 100 are collected
    
        //  The score
        scoreText = game.add.text(16, 16, '0/100 fireflies', { fontSize: '40px', fill: '#750' }); 
       
        //these are the lives for the game
        heart = game.add.sprite(16,50,'heart');
        heart1 = game.add.sprite(55,50,'heart');
        heart2 = game.add.sprite(95,50,'heart');
        
        
       stateText = game.add.text(game.world.centerX,game.world.centerY,' ',     { font: '50px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        
        stateText2 = game.add.text(game.world.centerX,game.world.centerY,' ',    { font: '50px Arial', fill: '#fff' });
        stateText2.anchor.setTo(0.5, 0.5);
        stateText2.visible = false;
        
        //falling fireflies to catch
        flies = game.add.emitter(game.world.centerX, -200 , 200);
        flies.setYSpeed(-50,-1000);
        flies.makeParticles(['firefly']);
        flies.start(false, 14000, 40);
        
        //falling spiders to catch
        enemies = game.add.emitter(game.world.centerX,-200,200);
        enemies.setYSpeed(-300,-5000);
        enemies.makeParticles(['spider']);
        enemies.start(false, 14000, 40);
               
        //falling lid to catch
        lids = game.add.emitter(game.world.centerX,-200,200);
        lids.setYSpeed(10,-5000);
        
        //songs:
        music = game.add.audio('background');
        music.play();
        
        
    }
    
    function update() {
      //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        
        //jar gets filled with fireflies, they don't collide
        game.physics.arcade.overlap(player, flies, collectFirefly, null, this);
        game.physics.arcade.overlap(player, lids,checkLid, null, this);
        game.physics.arcade.overlap(player, enemies, enemyHitsPlayer, null, this);
    
        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -500;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 500;
            player.animations.play('right');
        }
        else
        {   //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
       
    }
     
    function collectFirefly (player, firefly) {
    if(score==100){
        score = score;
    }
    else{
         score += 1; //increase score of firefly 
    }
       
    scoreText.text = score + '/100 fireflies';
    
        // Removes the star from the screen
    firefly.kill();
    music2 = game.add.audio('song2');
    music2.play();    
    game.add.sprite('firefly');    
    if(score>90){
          lids.makeParticles(['lid']);
          lids.start(false, 14000, 40);
    }
       
    }
    
    function checkLid(player,lid){
        if(score==100 || score>100){
           game.paused=true;
           stateText2.visible =true;
           stateText2.text="YAY you Won! \n Click here to play Again!"
           game.input.onTap.addOnce(restart,this);
        }
        else{
            game.physics.arcade.collide(player, lids);
        }
    }
    
    function enemyHitsPlayer (player,spider) {
        music4 = game.add.audio('song1');
        music4.play();
        strikes +=1;
        spider.kill();
       
        if (strikes==1){
            heart.kill();            
        }
        if (strikes==2){
            heart1.kill();
        }
        if(strikes==3){
            heart2.kill();
        }
        //make noise
        if(strikes>3){
            game.paused = true;
            spider.kill();
            stateText.visible = true;
            stateText.text="GAME OVER! \n Click here to restart";
            game.input.onTap.addOnce(restart,this);   
        }   
    }
   
  function restart () {    
    //resets the score count, unpauses game  
      score = 0;
      strikes=0;
      game.paused = false;
      stateText2.visible=false;
      stateText.visible = false;
      //revive lives
      heart.revive();
      heart1.revive();
      heart2.revive();
      lids.stop();
   //     game.add.sprite(0, 0, 'night');
      
  }
     function render(){
         game.debug.soundInfo(music,20,32);
    }
    
};
