class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player")
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.dirX = 1;
        this.estEnTrainDAttaquer = false;
        this.rechargeSonCoup = false;

        this.setCollideWorldBounds(true)
        this.setGravityY(1200)
        this.setBodySize(this.body.width, this.body.height+60);
        this.setOffset(32, 35)
            //this.scale = 0.9;
        this.doubleJump = false;
        this.jumpCount = 0;

        this.speedFactor = 1;
        this.vitesse = 0;


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('persoSprite', {start: 9, end: 0}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('persoSprite', {start: 12, end: 21}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'stance',
            frames: this.anims.generateFrameNumbers('iddlAP', {start: 11, end:22 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('iddlAP', {start: 10, end: 0}),
            frameRate: 10,

            repeat: -1
        });


       this.anims.play('stance');
        this._directionX = 0;
        this._directionY = 0;

    }

    set directionX(value) {
        this._directionX = value;
    }

    set directionY(value) {
        this._directionY = value;
    }

    /**
     * arrête le joueur
     */
    stop() {
        this.setVelocityX(0);
        this.setVelocityY(0);

        this.directionY = 0;
        this.directionX = 0;
    }

    move() {

        //this.sens=1;
        this.body.velocity.y = Math.min(800, Math.max(-800, this.body.velocity.y));

        switch (true) {
            case this._directionX < 0:
                this.sens = -1;
                this.setVelocityX(this.sens * 240 * this.speedFactor);
                this.vitesse = 1;
                this.anims.play('left', true);
                break;
            case this._directionX > 0:
                this.sens = 1;
                this.setVelocityX(this.sens * 240 * this.speedFactor);
                this.vitesse = 1;
                this.anims.play('right', true);
                break;
            default:
                this.vitesse = 0;
                this.setVelocityX(0);
                this.anims.play(this.sens === -1 ? 'back' : 'stance', true);
                //this.anims.play('turn');

        }

        if (this._directionY < 0 && !this.doubleJump) {

            this.setVelocityY(-400);
            this.jumpCount += 1;
            if (!this.body.blocked.down && this.jumpCount >= 20 && !this.doubleJump) {
                //console.log('hello');
                this.setVelocityY(-500);
                this.doubleJump = true;
            }

        }
        //console.log(this.jumpCount);
        //console.log(this.doubleJump);


        if (this.body.blocked.down) {
            this.doubleJump = false;
            this.jumpCount = 0;
        }


    }


    /*dash(){
        console.log('coucou');

       this.setTint(0xff0000);

       let direction = -1;

       Tableau.current.tweens.timeline({
           targets: Tableau.current.player.body.velocity,
           ease: 'Circ.easeInOut',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
           duration: 50,
           loop: 0,
           tweens: [
               {
                   targets: Tableau.current.player.body.velocity,
                   x: 3000 *direction
               },
               {
                   targets: Tableau.current.player.body.velocity,
                   x: 0
               }
           ]
       });

       /**this.posX = this.x;
       this.posY = this.y;
       var direct;


       this.scene.cameras.main.shake(200,0.004,true,);

       if (this._directionX < 0 || this.sens===-1) {
           direct = this.posX - 5;
       } else if (this._directionX > 0 || this.sens===1) {
           direct = this.posX + 5;
       }
       if (direct < this.posX) {
           this.animGauche();
       } else if (direct > this.posX) {
           this.animDroite();
       }*/


    /* animDroite(){
         console.log('dash droite')




   }*/


    dash() {

        //permet de dasher en étant immobile
        if (this.rechargeSonCoup === false) {
            Tableau.current.cameras.main.flash(500);
            this._directionX = this.sens;
            this.speedFactor = 1;
            this.speedFactorMax = 1;


            if (this.speedFactor >= this.speedFactorMax) {
                this.speedFactor = 1;
            }

            let me = this;

            //permet de dire que si le perso est immobile etqu'il dash, il redevient immobile à la fin du dash
            if (this.vitesse === 0) {
                setTimeout(function () {
                    me.speedFactor = 0;
                    me._directionX = 0;
                }, 150)
            }
            //permet de faire revenir à la vitesse normale après un dash quand le perso est en mouvement
            if (this._directionX > 0 || this._directionX < 0) {
                setTimeout(function () {
                    me.speedFactor = 1;
                }, 150)
            }


            console.log('dash');
            this.posX = this.x;
            this.posY = this.y;
            var dir;

            if (this._directionX < 0 || this.sens === -1) { //sens===-1 pour dasher dans le sens ou on regarde quand on est immobile
                dir = this.posX - 5;
            } else if (this._directionX > 0 || this.sens === 1) {
                dir = this.posX + 5;
            }

            if (dir < this.posX) {
                this.scene.tweens.add({
                    targets: this,
                    speedFactor: '+=3',
                    ease: 'Circ.easeInOut',
                    duration: 100,
                });


                //console.log('dash à gauche');
            } else if (dir > this.posX) {
                this.scene.tweens.add({
                    targets: this,
                    speedFactor: '+=3',
                    ease: 'Circ.easeInOut',
                    duration: 100,
                });


                //console.log('dash à droite');
            }

        }


    }

    attaque() {

        if (this.rechargeSonCoup === false) {
            this.rechargeSonCoup = true;
            //console.log("att 2 sec, je viens de frapper!");
            Tableau.current.epee.setPosition(this.x + (100 * this.sens), this.y);
            setTimeout(function () {
                Tableau.current.player.estEnTrainDAttaquer = false;
                Tableau.current.epee.setPosition(-1000, -1000);
            }, 200);
            setTimeout(function () {
                Tableau.current.player.rechargeSonCoup = false;
                //console.log("j'ai fini maman");
            }, 1500);
        }
    }


}