function GameOverState()
{
  var gameOverMusic;
  
  var background;

  this.setup = function()
  {
    gameOverMusic = new Howl({urls:['assets/menuState.mp3', 'assets/menuState.ogg'], autoplay:false});
    gameOverMusic.play();
    
    background = new jaws.Sprite( { image:jaws.assets.get( "assets/gameOverState.png" ), x:0, y:0 } );
    
    //default way browser handles keyboard controls sucks! Override that bad boy :-D
    jaws.preventDefaultKeys( ["space"] );
  };

  this.update = function()
  {
      if( jaws.pressed( "space" ) )
      {
        gameOverMusic.stop();
        
        jaws.switchGameState( PlayState );
      }
   
    
      fps.innerHTML   = "";
      life.innerHTML  = "";
      score.innerHTML = "";
  };

  this.draw = function()
  {
    jaws.clear();
    
    background.draw();
  };
};