/**
 * Toutes les fonctions propres à un tableau dans notre jeu.
 * Cette classe n'est pas à utiliser directement, elle doit être extend !
 */
 class Tableau extends Phaser.Scene{
   
    /**
     *
     * @param {String} key identifiant de la scène à jouer
     */
    constructor(key) {
        super(key);
    }

    /**
     * Par défaut on charge un fond et le player
     */
     
    preload(){
        this.load.image('Blood', 'assets/Blood.png');
        this.load.audio('piece', 'assets/sounds/piece.mp3');
        this.load.audio('mort', 'assets/sounds/mort.mp3');
        this.load.audio('jojo', 'assets/sounds/jojo.mp3');

        this.load.spritesheet('yasuo2',
            'assets/yasuo2.png',
            { frameWidth: 58, frameHeight: 79 }
            );
       
        this.load.spritesheet('iddle',
            'assets/iddle.png',
            { frameWidth: 63, frameHeight: 80 }
        );
        this.load.spritesheet('iddle2',
            'assets/iddle2.png',
            { frameWidth: 63, frameHeight: 80 }
        );
        
    }
    
    create(){
        this.jumpCount=0;
        //musique
        this.mort = this.sound.add('mort');
        this.jojo = this.sound.add('jojo');
        this.piece = this.sound.add('piece');

        var musicConfig = {
            mute : false,
            volume : 0,
            rate : 1,
            detune : 0,
            seek : 0,
            loop : true,
            delay : 0
        }
        
        this.jojo.play(musicConfig);

        Tableau.current=this;
        this.sys.scene.scale.lockOrientation("landscape")
        console.log("On est sur "+this.constructor.name+" / "+this.scene.key);

       
        /**
         * Le ciel en fond
         * @type {Phaser.GameObjects.Image}
         */
        this.sky=this.add.image(0, 0, 'ciel').setOrigin(0,0);
        this.sky.displayWidth=14*64;
        this.sky.setScrollFactor(0,0);
        /**
         * Le joueur
         * @type {Player}
         */
        this.player=new Player(this,0,400);
        this.blood=this.add.sprite(this.sys.canvas.width/2,this.sys.canvas.height/2,"Blood")
        this.blood.displayWidth=64;
        this.blood.displayHeight=64;
        this.blood.visible=false;
        

        
        
       this.KeyDash = this.input.keyboard.addKey('SPACE');
      // this.PressJump = this.input.keyboard.addKey('ArrowUp');
       
      
        
    }
    update(){
        super.update();
        this.player.move();

       // this.canDoubleJump();
        //appel du dash
        if (Phaser.Input.Keyboard.JustDown(this.KeyDash)){
            //this.player.dash = true;
            this.player.dash();
            this.gravity();
            this.player.setTint(0xff0000);
            this.cameras.main.shake(200,0.004,true,); 
            return true;
                 
         }
         else{
            this.player.setTint(0xffffff);
        
           
             
         }


         
        
    }
    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'anim est finie
     */
     gravity(){
        this.player.body.allowGravity=false;
        this.time.addEvent({
            delay: 100,
            callback: ()=>{
                this.player.body.allowGravity=true;
            },
            loop: false
        })
    }

    
   
   

    saigne(object,onComplete){
        let me=this;
        me.blood.visible=true;
        me.blood.rotation = Phaser.Math.Between(0,6);
        me.blood.x=object.x;
        me.blood.y=object.y;
        me.tweens.add({
            targets:me.blood,
            duration:200,
           
            displayHeight:{
                from:40,
                to:70,
            },
            displayWidth:{
                from:40,
                to:70,
                
            },
            onComplete: function () {
                me.blood.visible=false;
                onComplete();
            }
        })
    }
    
    
    

    ramasserEtoile (player, star)
    {
        star.disableBody(true, true);
        ui.gagne();
        
        
        //va lister tous les objets de la scène pour trouver les étoies et vérifier si elles sont actives
        let totalActive=0;
        for(let child of this.children.getChildren()){
            if(child.texture && child.texture.key==="star"){
                if(child.active){
                    totalActive++;
                   
                    var musicConfig = {
                        mute : false,
                        volume : 0.01,
                        rate : 1,
                        detune : 0,
                        seek : 0,
                        loop : false,
                        delay : 0
                    }
                    
                    this.piece.play(musicConfig);
                }
            }
        }
        if(totalActive===0){
            this.win();
        }
    }

    
    rammasserBonusUn (player, bonus)
    {
        bonus.disableBody(true, true);
        ui.gagne();
        
        this.rammasserBonusUn=true;
        if( this.rammasserBonusUn == true){
           //this.cameras.main.setZoomIn(2);
            var cam = this.cameras.main;
                cam.setZoom(3000); 
            cam.pan(4000, 500, 8000, 'Power2');
            //cam.zoomTo(1, 2);
            this.cameras.main.flash(200,255,162,0);
            this.player.scale += 0.4;
            this.player.setGravityY(1200);
            //this.player.AccelerationX += 400;
            //this.player.setAccelerationX(-800);
            //this.setMaxVelocity(800);
           
            
        }
        this.cameras.main.setZoom(1);
       
    }

    /**
     * Aïeee ça fait mal
     * @param player
     * @param spike
     */
    hitSpike (player, spike)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.scene.restart();

    }
    
    /**
     * Quand on touche un monstre
     * si on le touche par en haut on le tue, sinon c'est lui qui nous tue
     * @param {Player} player
     * @param {Phaser.Physics.Arcade.Sprite} monster
     
     */
    
    hitMonster(player, monster,){
        let me=this;
        if(monster.isDead !== true){ //si notre monstre n'est pas déjà mort
            if(
               
                // si le player descend
                player.body.velocity.y > 0
                
                
                // et si le bas du player est plus haut que le monstre
                && player.getBounds().bottom < monster.getBounds().top+30
                
            ){
                ui.gagne();
                monster.isDead=true;
                
                this.mort.play(); 
                
                this.cameras.main.shake(200,0.015,true,);
                monster.disableBody(true,true);//plus de collisions
                this.saigne(monster,function(){
                    //à la fin de la petite anim...ben il se passe rien :)
                })
                //notre joueur rebondit sur le monstre
                player.directionY=500;

                
            }else{
                //le joueur est mort
                if(!me.player.isDead){
                    this.mort.play();
                    this.jojo.stop();
                    me.player.isDead=true;
                    me.player.visible=false;
                    //ça saigne...
                    this.cameras.main.flash(500,300,0,0);
                    me.saigne(me.player,function(){
                        
                        //à la fin de la petite anim, on relance le jeu
                        
                        me.blood.visible=false;
                       // me.player.anims.play('turn');
                        me.player.isDead=false;
                        me.scene.restart();
                        
                    })

                }


            }
        }

    }

    

    /**
     * Pour reset cette scène proprement
     * @private
     */
    _destroy(){
        this.player.stop();
        this.scene.stop();
    }

    /**
     * Quand on a gagné
     */
    win(){
        Tableau.suivant();
        localStorage.removeItem("checkPoint");
        this.jojo.stop();
    }
    /**
     * Va au tableau suivant
     */
    static suivant(){
        let ceSeraLaSuivante=false;
        let nextScene=null;
        if(Tableau.current){
            for(let sc of game.scene.scenes){
                if(sc.scene.key !== "ui"){
                    if(!nextScene){
                        if(ceSeraLaSuivante){
                            nextScene=sc;
                        }
                        if(sc.scene.key === Tableau.current.scene.key){
                            ceSeraLaSuivante=true;
                        }
                    }
                }
            }
        }
        if(!nextScene){
            nextScene = game.scene.scenes[0];
        }
        Tableau.goTableau(nextScene);
    }

    static goTableau(tableau){
        if(Tableau.current){
            Tableau.current._destroy();
        }
        game.scene.start(tableau);
    }


}

/**
 * Le tableau en cours
 * @type {null|Tableau}
 */
Tableau.current=null;