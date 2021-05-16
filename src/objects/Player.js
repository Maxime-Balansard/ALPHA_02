class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, "player")
        scene.add.existing(this)
        this.factorSpeed=1;
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setGravityY(1200)
        this.setBodySize(this.body.width,this.body.height+46);
       this.setOffset(15, 0)
        this.scale= 0.9;
      
   
    

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('yasuo2', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('yasuo2', { start: 9, end: 16}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'stance',
            frames: this.anims.generateFrameNumbers('iddle', { start: 0, end: 7  }),
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('iddle2', { start: 7, end: 0  }),
            frameRate: 8,

            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'yasuo2', frame: 8 } ],
            frameRate: 20
        });

        this._directionX=0;
        this._directionY=0;

    }

    set directionX(value){
        this._directionX=value;
    }
    set directionY(value){
        this._directionY=value;
    }

    /**
     * arrête le joueur
     */
    stop(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.setAccelerationX(0);
        this.directionY=0;
        this.directionX=0;
    }
    move(){

        this.sens=1;
        //console.log(this.sens*this.factorSpeed)
        switch (true){
            case this._directionX<0:
               // console.log("a")
                this.sens=-1;
                this.setVelocityX(this.sens*300*this.factorSpeed);
               //this.setFriction(-1,1);
                //autre deplacement ( le perso accelere) mais bug avec le saut le pp peut pas sauter
               /*this.setAccelerationX(-200);
                 this.setMaxVelocity(-800);*/
                
               // this.setFrictionX(0.5);
                this.anims.play('left', true);
                break;
            case this._directionX>0:
               // console.log("b")
                this.sens=1;    
                this.setVelocityX(this.sens*300*this.factorSpeed);
               // this.setFriction(300);
                 //autre deplacement ( le perso accelere) mais bug avec le saut le pp peut pas sauter
               /*this.setAccelerationX(200);
                this.setMaxVelocity(800);*/
                
                this.anims.play('right', true);
                break;
            default:
              //  console.log("c")
                this.setVelocityX(0);
                this.setAccelerationX(0);
                
               this.anims.play('turn');
                this.anims.play(this.sens===-1 ? 'back' : 'stance' ,true);
        }

        if(this._directionY<0){
            if(this.body.blocked.down || this.body.touching.down){
                this.setVelocityY(-650);
            }
        }


    }

 /*   doublejump(){
        var onTheGround = this.player.body.touching.down;

        
        if (onTheGround) {
            this.jumps = 2;
            this.jumping = false;
        }
    
       
        if (this.jumps > 0 && this.upInputIsActive(ArrowUp)) {
            this.player.body.velocityY= -650;
            this.jumping = true;
        }
    
       
        if (this.jumping && this.upInputReleased()) {
            this.jumps--;
            this.jumping = false;
        }
    };*/

        

    
    
    
     dash(){
        this.posX = this.x;
        this.posY = this.y;

        var direct;
        //this.setVelocityX(3000);

        if (this._directionX < 0 || this.sens===-1) { 
            direct = this.posX - 5;
        } else if (this._directionX > 0 || this.sens===1) {
            direct = this.posX + 5;
        }
        if (direct < this.posX) {
            this.animGauche();
            this.setVelocityX(-600);
        
        } else if (direct > this.posX) {
            this.animDroite();
            this.setVelocityX(600);
            
        }

       /* if (this._directionY < 0 || this.sens===-1) { 
            direct = this.posY - 5;
        } else if (this._directionY> 0 || this.sens===1) {
            direct = this.posY + 5;
        }
        if (direct < this.posY) {
            
            this.animBas();
        
        } else if (direct > this.posY) {
            this.animHaut();
            
        }*/

    }

    animDroite(){
    
        Tableau.current.tweens.timeline({
            targets: Tableau.current.player.body.velocity,
            ease: 'Circ.easeInOut',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 50,
            loop: 0,
            tweens: [
                {
                    targets: Tableau.current.player.body.velocity,
                    x: 3000
                },
                {
                    targets: Tableau.current.player.body.velocity,
                    x: 0
                }
            ]
        });
        
     
             
  }
 
    animGauche(){
        Tableau.current.tweens.timeline({
            targets: Tableau.current.player.body.velocity,
            ease: 'Circ.easeInOut',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 50,
            loop: 0,
            tweens: [
                {
                    targets: Tableau.current.player.body.velocity,
                    x: -3000
                },
                {
                    targets: Tableau.current.player.body.velocity,
                    x: 0
                }
            ]
        });
    }


    

 
    
}