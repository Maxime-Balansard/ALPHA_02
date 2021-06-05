class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player")
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.dirX = 1;
        this.estEnTrainDAttaquer = false;
        this.rechargeSonCoup = false;

        this.setCollideWorldBounds(true)
        this.setGravityY(1500)
        this.setBodySize(this.body.width, this.body.height+60);
        this.setOffset(32, 35)
            //this.scale = 0.9;
        this.simpleJump = false;
        this.doubleJump = false;
        this.waitForDoubleJump = false;
        this.controlLock= false;
        this.isDash = false;
        this.isSaut = false;
        this.isTombe = false;

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
            frames: this.anims.generateFrameNumbers('iddlAP', {start: 11, end:21 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('iddlAP', {start: 10, end: 0}),
            frameRate: 10,

            repeat: -1
        });

        this.anims.create({
            key: 'dash01',
            frames: this.anims.generateFrameNumbers('dash1.0', {start: 0, end:1 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'dash02',
            frames: this.anims.generateFrameNumbers('dash2.0', {start: 1, end:0 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'saut1',
            frames: [{ key: 'saut', frame:0}],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'saut20',
            frames: [{ key: 'saut2', frame:0}],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'chutePerso1',
            frames: this.anims.generateFrameNumbers('chutePerso', {start: 0, end:3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'chutePerso20',
            frames: this.anims.generateFrameNumbers('chutePerso2', {start: 0, end:3 }),
            frameRate: 10,
            repeat: -1
        });



      /*  this.on('animationcomplete',function () {
            if(this.anims.currentAnim.key === 'saut1'){
                this.isSaut= false;
            }
        });*/

        this.on('animationcomplete',function () {
            if(this.anims.currentAnim.key === 'dash01'){
                this.isDash= false;
            }
        });

        this.on('animationcomplete',function () {
            if(this.anims.currentAnim.key === 'dash02'){
                this.isDash= false;
            }
        });

       /* this.on('animationcomplete',function () {
            if(this.anims.currentAnim.key === 'chutePerso1'){
                this.isTombe= false;
            }
        });*/


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

        this.body.velocity.y = Math.min(1000, Math.max(-1000, this.body.velocity.y));

    if(this.isDash){
        if(this.sens === 1){
            this.anims.play('dash01', true);
        }else if (this.sens === -1)
            this.anims.play('dash02', true);
    }

        if (!this.controlLock){
        switch (true) {
            case this._directionX < 0:
                this.sens = -1;
                this.setVelocityX(this.sens * 240 * this.speedFactor);
                this.vitesse = 1;
                if(!this.isDash ){
                this.anims.play('left', true);
                }
                break;
            case this._directionX > 0:
                this.sens = 1;
                this.setVelocityX(this.sens * 240 * this.speedFactor);
                this.vitesse = 1;
                if(!this.isDash ){
                this.anims.play('right', true);
                }
                break;


            default:
                this.vitesse = 0;
                this.setVelocityX(0);
                this.anims.play(this.sens === -1 ? 'back' : 'stance', true);
                //this.anims.play('turn');

        }

            if(this.body.velocity.y > 0){
                if(this.sens === 1){
                    this.anims.play('chutePerso1', true);
                }else if (this.sens === -1)
                    this.anims.play('chutePerso20', true);
            }




           if( this.body.velocity.y < 0 ) {

              /* setTimeout(function() {
                   Tableau.current.cameras.main.shake(300,0.002,true);
               }, 2000);*/

               if(this.sens === 1){
                   this.anims.play('saut1', true);
               }else if (this.sens === -1)
                   this.anims.play('saut20', true);
           }


            if( this.body.velocity.y < 950 ) {
                Tableau.current.cameras.main.shake(3000,0.010,true);

            }

//console.log(this.body.velocity.y);

        if (this.body.blocked.down)
        {
            this.simpleJump = false;
            this.doubleJump = false;
            this.waitForDoubleJump = false;


            if (this._directionY < 0)
            {
                   // console.log('saut');
                    this.setVelocityY(-600);
                    this.simpleJump = true;


            }
        }
        else
        {
            if (this.simpleJump && this._directionY>=0)
            {
                this.waitForDoubleJump = true;
            }

            if (this._directionY < 0 && this.waitForDoubleJump) {
                //console.log("je veux sauter");
                if (this.simpleJump && !this.doubleJump) {
                    //console.log('double saut');
                    this.setVelocityY(-600);
                    this.doubleJump = true;

                }
            }
        }
        }else{
            this.setVelocityX(0);
            this.anims.play('stance', true);


        }



        //console.log(this.jumpCount);
        //console.log(this.doubleJump);



    }





    dash() {
   this.isDash = true;



        //permet de dasher en étant immobile
        if (this.rechargeSonCoup === false) {
            Tableau.current.cameras.main.shake(70,0.010);
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
            Tableau.current.epee.setPosition(this.x + (100 * this.sens), this.y+40 );
            setTimeout(function () {
                Tableau.current.player.estEnTrainDAttaquer = false;
                Tableau.current.epee.setPosition(-1000, -1000);
            }, 200);
            setTimeout(function () {
                Tableau.current.player.rechargeSonCoup = false;
                //console.log("j'ai fini maman");
            }, 500);
        }
    }



}

