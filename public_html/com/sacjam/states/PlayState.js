function PlayState()
{
  //Player movement constant values
  var POSITION_RIGHT = "right";
  var POSITION_LEFT  = "left";
  var POSITION_UP    = "up";
  var POSITION_DOWN  = "down";
  
  var TYPE_PLAYER = "player";
  var TYPE_SHAPE  = "shape";
  var TYPE_LIFE   = "life";
  
  
  //these will hold the coordinates for each 
  var newShapeX;
  var newShapeY;
  
  var player;
  var viewPort;
  var bullets;
  var pause;
  
  var levelMusic;
  
  //ths is the sound when you touch a green square
  var collectedGreenSound;

  this.setup = function()
  {
    shapes = [];
    
    pause = false;
    
    
    levelMusic = new Howl( {urls:['assets/playState.mp3', 'assets/playState.ogg'], autoplay:false} );
    levelMusic.play();
    
    collectedGreenSound = new Howl( {urls:['assets/collectedGreen.mp3', 'assets/collectedGreen.ogg'], volume:0.2, autoplay:false} );
    
    
    viewPort = new jaws.Viewport( {max_x: 5000, max_y: 5000} );
    
    player = new jaws.Sprite( { image:jaws.assets.get("assets/bullet.png"), scale:0.5, anchor:"center", x:1500, y:2500 } );
    player.currentPosistion = POSITION_RIGHT;
    player.type             = TYPE_PLAYER;
    player.hasMoved         = false;
    player.life             = 100;
    player.score            = 0;
   
   
    player.vx = 10;
    player.vy = 10;
    
    //First particle generated when character moved will spawn here
    newShapeX = player.x + 5;
    newShapeY = player.y + 5;
    
    
    //default way browser handles keyboard controls sucks! Override that bad boy :-D
    jaws.preventDefaultKeys( ["right", "left", "up", "down"] );
  };

  this.update = function()
  {
    if(!pause)
    {
      this.updateShapes();
      this.updatePlayer();

      fps.innerHTML      = "FPS   " + jaws.game_loop.fps;
      life.innerHTML     = "LIFE  " + player.life;
      score.innerHTML    = "SCORE " + player.score;
    }
  };

  this.draw = function()
  {
    jaws.clear();

    viewPort.apply(function()
    {
      player.draw();

      for( var i = 0; i < shapes.length; i++)
       shapes[i].draw();
    });
  };
  
  this.updatePlayer = function()
  {
    //First we need to update the player controls
    if( jaws.pressed( POSITION_RIGHT ) ) { player.x += player.vx; player.currentPosistion = POSITION_RIGHT; player.hasMoved = true; }
    if( jaws.pressed( POSITION_LEFT  ) ) { player.x -= player.vx; player.currentPosistion = POSITION_LEFT;  player.hasMoved = true; }
    if( jaws.pressed( POSITION_UP    ) ) { player.y -= player.vy; player.currentPosistion = POSITION_UP;    player.hasMoved = true; }
    if( jaws.pressed( POSITION_DOWN  ) ) { player.y += player.vy; player.currentPosistion = POSITION_DOWN;  player.hasMoved = true; }
    
    viewPort.centerAround( player );
    
   
    jaws.collideOneWithMany( player, shapes ).forEach( function( shape, index )
    {
      if( shape.type !== TYPE_LIFE ) player.life--;
      else
        {
          collectedGreenSound.play();
          player.score++;
          return;
        }
      
      if( player.life <= 0 )
      {
        levelMusic.stop();
        
        jaws.switchGameState( GameOverState );
      }
      
      shapes.splice( index, 1 );
    });  
  }; 
  
  this.updateShapes = function()
  {
    if( player.hasMoved === true )
    {
      //This will make sure we keep spawning a new shape behind player in controlled fashion
      setTimeout( function()
      {
        var randomNumber = Math.random() * 10;
        
        if( randomNumber > 5 )
        {
          var shape = new jaws.Sprite( { image:jaws.assets.get("assets/life.png"), scale:0.5, x:newShapeX, y:newShapeY } );

          shape.type = TYPE_LIFE;
        }
        else
        {
          var shape = new jaws.Sprite( { image:jaws.assets.get("assets/enemy.png"), scale:0.5, x:newShapeX, y:newShapeY } );

          shape.type = TYPE_SHAPE;
        }
          
        shapes.push( shape );

      }, 1000);
    }
    
    for( var i = 0; i < shapes.length; i++)
    {
      switch( player.currentPosistion )
      {
        case POSITION_RIGHT: 
          shapes[i].x += 5;
          newShapeY = player.y - 5;
          break;
        case POSITION_LEFT: 
          newShapeX = player.x + 5;
          shapes[i].x -= 5;  
          break;
        case POSITION_UP:    
          newShapeX = player.x - 5;
          newShapeY = player.y - 5;
      
          shapes[i].y -= 5;  
          break;
        case POSITION_DOWN:  
          newShapeX = player.x + 5;
          newShapeY = player.y + 5;
          
          shapes[i].y += 5; 
          break;
      }
    }
  };
}