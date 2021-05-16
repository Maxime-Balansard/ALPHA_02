class video extends Phaser.Scene {  
    
    preload ()
    {
        
        this.load.video('ripo', 'assets/ripo.mp4', 'loadeddata', false, true);
        this.load.audio('ripo-sound', 'assets/sounds/ripo-sound.mp3');
    }  
  
    create()
    {
        this.sound= this.sound.add('ripo-sound');
        var musicConfig = {
            mute : false,
            volume : 0.3,
            rate : 1,
            detune : 0,
            seek : 0,
            loop : true,
            delay : 0
        }
        
        this.sound.play(musicConfig);

         var Video = this.add.video(448, 224, 'ripo');
        Video.setDisplaySize(1920,1080);
        Video.play(true);
        
        Video.setDepth(40);
        Video.setLoop(false);
        Video.setPaused(false);



        this.input.keyboard.on('keydown-ENTER', function () 
        {
            this.sound.stop(musicConfig);
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
            {
    
                this.game.scene.start("niveau01");
                
            })
        }, this);
    }

}