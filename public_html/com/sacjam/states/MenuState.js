function MenuState()
{
  //this will be for all the audio
  var menuMusic;
  
  var background;

  this.setup = function()
  {
    menuMusic = new Howl({urls:['assets/menuState.mp3', 'assets/menuState.ogg'], autoplay:false});
    menuMusic.play();
    
    background = new jaws.Sprite( { image:jaws.assets.get("assets/menuState.png"), x:0, y:0 } );
    
    //default way browser handles keyboard controls sucks! Override that bad boy :-D
    jaws.preventDefaultKeys( ["space"] );
  };

  this.update = function()
  {
      if( jaws.pressed( "space" ) )
      {
        menuMusic.stop();
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