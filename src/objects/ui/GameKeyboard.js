/**
 * Un objet qui écoute les touches du clavier et mouvements sur le pad et qui influent le déplacement du joueur
 */
class GameKeyboard extends Phaser.GameObjects.Container{
    constructor(scene, x, y) {
        super(scene, x, y)
        scene.add.existing(this);

       /* this.KeyDash = this.input.keyboard.addKey('SPACE');

        if (Phaser.Input.Keyboard.JustDown(this.KeyDash)){
           
            this.player.dash();
            this.cameras.main.shake(200,0.003,true,);
           
        }*/
    
      /*  scene.input.keyboard.on('keydown-SPACE', function(event){   
            if (dash()){
            this.cameras.main.shake(200,0.003,true,);
            this.player.setTint(0xff0000);
            console.log('dqsf');
            }
        
           
        });*/
        
        this.cursors = scene.input.keyboard.createCursorKeys();
       
        scene.input.keyboard.on('keydown', function(kevent){
            if(Tableau.current && Tableau.current.player){
            switch (kevent.key){
                case "ArrowRight":
                    Tableau.current.player.directionX=1;
                    
                    break;

                case "ArrowLeft":
                    Tableau.current.player.directionX=-1;
                   
                    break;

                case "ArrowUp":
                    Tableau.current.player.directionY=-1;

                    break;

                case "ArrowDown":
                    Tableau.current.player.directionY=1;
                    break;

                case " ":
                    Tableau.current.player.dash();
                    Tableau.current.player.attaque();
                    console.log('spaceOf')
                    break;
                
                }
        
            }
        });
        scene.input.keyboard.on('keyup', function(kevent){
            //console.log(kevent)
            if(Tableau.current && Tableau.current.player){
            switch (kevent.key){
                case "ArrowRight":
                    Tableau.current.player.directionX=0;
                    
                    break;

                case "ArrowLeft":
                    Tableau.current.player.directionX=0;
                    
                    break;

                case "ArrowUp":
                    Tableau.current.player.directionY=0;
                    break;

                case "ArrowDown":
                    Tableau.current.player.directionY=0;
                    break;




            }
        }
        });


    }
  


}