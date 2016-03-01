window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
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
        game.load.image('jar1','assets/jars/one.png');
      //  game.load.audio();
        
    }
    
    //enemies
    var player, firefly;
    var flies, enemies, cursors, lids;
    var frog, toad, spider;
    var bat, rat, bird;
    var lid;
    var score =0;
    var scoreText, stateText, stateText2;
    var emitter;    
    var strikes = 0;
    var heart, heart1,heart2;
    
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
        
        
       stateText = game.add.text(game.world.centerX,game.world.centerY,' ',     { font: '50px Arial', fill: '#950' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        
        stateText2 = game.add.text(game.world.centerX,game.world.centerY,' ',    { font: '50px Arial', fill: '#950' });
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
        lids.makeParticles(['lid']);
        lids.start(false, 14000, 40);
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
    score += 1; //increase score of firefly 
    scoreText.text = score + '/100 fireflies';
   
        // Removes the star from the screen
    firefly.kill();
   // player = game.add.sprite(200,600,'jar1');
   //     game.add.sprite(200,600,'jar1');
  //  game.add.image('firefly');  
    game.add.sprite('firefly');
    
    //  Add and update the score
    
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
  }
    
    
};
