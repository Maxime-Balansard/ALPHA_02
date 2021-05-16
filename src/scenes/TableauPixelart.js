class TableauPixelart extends Tableau{

    preload() {
        super.preload();
        this.load.image('star', 'assets/piece.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('sol', 'assets/sol4000.1.png');
        this.load.image('devant', 'assets/devant.png');
        this.load.image('bat', 'assets/bat.png');
        
        
        this.load.image('plat64', 'assets/plat64.png');
        this.load.image('plat128', 'assets/plat128.png');
        this.load.image('rayon', 'assets/rayonv4.png');

        this.load.image('course', 'assets/course.png');
        this.load.image('fleur', 'assets/fleur.png');
        this.load.image('rouge', 'assets/rouge.png');
        this.load.image('rose', 'assets/rose.png');


        this.load.image('montagne', 'assets/montagne.png');
        this.load.image('ciel', 'assets/ciel.png');
        this.load.image('bam', 'assets/bam.png');
        this.load.image('bambou1', 'assets/bambou1.png');
        this.load.image('logo1', 'assets/logo1.png');

        //monstres
        this.load.image('yokai1', 'assets/yokai1.png');
        this.load.image('oni', 'assets/oni.png');
        this.load.image('lanterne1', 'assets/lanterne1.png');
        this.load.image('yokaiRed', 'assets/yokaiRed.png');

        //sounds
        this.load.audio('jojo', 'assets/sounds/jojo.mp3');
        
    }
    create() {
        super.create();

      
        //on définit la taille du tableau
        let largeurDuTableau=4000;
        let hauteurDuTableau=448; //la hauteur est identique au cadre du jeu
        this.cameras.main.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.physics.world.setBounds(0, 0, largeurDuTableau,  hauteurDuTableau);

        this.cameras.main.startFollow(this.player, false, 0.05, 0.05);


         //des plateformes etoiles player
         this.platforms = this.physics.add.staticGroup();
         this.platforms.create(2270, 320, 'ground').setDisplaySize(290,20).refreshBody();
         this.platforms.create(2270, 225, 'ground').setDisplaySize(230,14).refreshBody();
           //1er tableau
         this.platforms.create(300,300,'plat64').setBodySize(60,8).setDepth(10);
         this.platforms.create(600,300,'plat128').setBodySize(128,10).setDepth(10);
           //2eme tableau
        this.platforms.create(1150,300,'plat128').setBodySize(128,10).setDepth(10);
        this.platforms.create(1600,300,'plat128').setBodySize(128,10).setDepth(10);
        this.platforms.create(1300,220,'plat64').setBodySize(60,8).setDepth(10);
        this.platforms.create(1450,220,'plat64').setBodySize(60,8).setDepth(10);
        this.platforms.create(1375,120,'plat64').setBodySize(60,8).setDepth(10);
        //3eme tableau
        this.platforms.create(2020,300,'plat64').setBodySize(60,8).setDepth(10);
        this.platforms.create(2520,300,'plat64').setBodySize(60,8).setDepth(10);
        //4eme tableau
        this.platforms.create(2935,270,'plat128').setBodySize(128,10).setDepth(10);
        this.platforms.create(3365,270,'plat128').setBodySize(128,10).setDepth(10);
        this.platforms.create(3150,140,'plat128').setBodySize(128,10).refreshBody().setDepth(10);

        this.platforms.create(2950,170,'plat64').setBodySize(60,8).setDepth(10);
        this.platforms.create(3150,300,'plat64').setBodySize(60,8).setDepth(10);
        this.platforms.create(3350,170,'plat64').setBodySize(60,8).setDepth(10);
        
        

        //quelques étoiles 
        
        let largeur=128;
        this.stars=this.physics.add.group();
        //1er tableau
      /*  this.stars.create(300,0,"star").setCollideWorldBounds(true).setBounce(0.4);
        this.stars.create(450,300,"star").setCollideWorldBounds(true);
        this.stars.create(600,0,"star").setCollideWorldBounds(true).setBounce(0.4);*/
         //2eme tableau
         this.stars.create(1150,200,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(1600,200,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(1375,100,"star").setCollideWorldBounds(true).setBounce(0.4);
         //3eme tableau
         this.stars.create(2200,100,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(2340,100,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(2270,250,"star").setCollideWorldBounds(true).setBounce(0.4);

         this.stars.create(2200,350,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(2340,350,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(2270,350,"star").setCollideWorldBounds(true).setBounce(0.4);
         //4eme tableau
         this.stars.create(2925,250,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(3150,280,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(3375,250,"star").setCollideWorldBounds(true).setBounce(0.4);

         this.stars.create(3125,120,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(3175,120,"star").setCollideWorldBounds(true).setBounce(0.4);
         this.stars.create(4000,120,"star").setCollideWorldBounds(true).setBounce(0.4);

         for(let posX=3500;posX<4000;posX+=50){
            let etoileY=350+Math.sin(posX);
            let star=this.stars.create(posX ,etoileY,"star");
            star.body.allowGravity=true;
        }
         
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this); 
        this.physics.add.collider(this.player,this.platforms);
        this.physics.add.collider(this.platforms, this.stars);

        
       this.bonus=this.physics.add.group();
        this.bonus.create(500,0,"star").setCollideWorldBounds(true).setBounce(0.4);
        this.physics.add.overlap(this.player, this.bonus, this.rammasserBonusUn, null, this);
        
       
        let maison=this.physics.add.sprite(2110,height-318,"bat");
        maison.setDisplaySize(320,256)//taille de l'objet
        maison.setOrigin(0,0);//pour positionner plus facilement
        maison.body.allowGravity=0; //la gravité n'a pas d'effet ici
        maison.setImmovable(true); //ne bouge pas quand on rentre dedans
        
        

        let sol=this.physics.add.sprite(0,height-64,"sol");
        sol.setDisplaySize(largeurDuTableau,64)//taille de l'objet
        sol.setBodySize(4000,60)
        sol.setOrigin(0,0);//pour positionner plus facilement
        sol.body.allowGravity=0; //la gravité n'a pas d'effet ici
        sol.setImmovable(true); //ne bouge pas quand on rentre dedans
        this.physics.add.collider(this.player, sol);//le joueur rebondit dessus
        this.physics.add.collider(this.stars, sol);
        this.physics.add.collider(this.bonus, sol);//les étoiles rebondissent dessus
        



        
      
        
        this.sky=this.add.tileSprite(
                0,
                0,
                this.sys.canvas.width,
                this.sys.canvas.height,
                'bambou1'
            );
            this.sky.setOrigin(0,0);
            this.sky.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
            this.sky.setDepth(11);

            this.sky2=this.add.tileSprite(
                0,
                0,
                this.sys.canvas.width,
                this.sys.canvas.height,
                'bam'
            );
            this.sky2.setScrollFactor(0);
            this.sky2.setOrigin(0,0);
            this.sky2.setDepth(6);

            this.sky3=this.add.tileSprite(
                0,
                0,
                this.sys.canvas.width,
                this.sys.canvas.height,
                'montagne'
            );
            this.sky3.setOrigin(0,0);
            this.sky3.setScrollFactor(0);
            this.sky3.setDepth(5);
            
            this.sky4=this.add.tileSprite(
                0,
                0,
                this.sys.canvas.width,
                this.sys.canvas.height,
                'ciel'
            );
            this.sky4.setOrigin(0,0);
            this.sky4.setScrollFactor(0);
        
          
    // ombre

    
       /*this.rayon1=this.add.tileSprite(500, 0, 700, 448, 'ras');
        this.rayon1.setOrigin(0,0);
        this.rayon1.blendMode= 'ADD';*/

    

    
    /*var particles = this.add.particles('course');
        var emitter = particles.createEmitter({
            frequency:10,
            lifespan: 1500,
            quantity:1,
            gravityY: -50,
            angle: { min: -100, max: 300 },
            //y:{min:0,max:0}, 
            rotate: {min:-10,max:360},
            setBodySize:-5,
            tint:[  0xC11A05,0x883333,0xBB5500,0xFF7F27 ],
            // alpha: { start: 1, end: 0 },
            speed: 10,
            //maxParticles: 0.1,
            scale: { start: 1, end: 0 },

            follow: this.player
            //blendMode: 'ADD'
        }); */
        let logo1= this.add.image(200, 100, 'logo1');
        logo1.setDepth(11)

       
      
        
       
        


    var particles1 = this.add.particles('rose');
   var rect = new Phaser.Geom.Rectangle(0, 0, 50, 50);
    particles1.createEmitter({
        x: 50, y: 50,
        speed: 10,
        moveToX: {min:1000,max:1500},
        moveToY: {min:300,max:50},
        rotate: {min:-10,max:360},
        lifespan: 8000,
       // alpha:0.5,
        quantity: 15,
        frequency: 700,
        delay: 100,
        depth:10,
        scale: { start: 5, end: 0.5},
        //blendMode: 'ADD',
        emitZone: { source: rect } 
      
    });
    var particles2 = this.add.particles('rouge');
     var rect1 = new Phaser.Geom.Rectangle(0, 0, 50, 50);
    particles2.createEmitter({
        x: 50, y: 50,
        speed: 10,
        moveToX: {min:1000,max:1500},
        moveToY: {min:50,max:300},
        rotate: {min:-10,max:360},
        lifespan: 8000,
        quantity: 15,
        frequency: 700,
        delay: 100,
        scale: { start: 5, end: 0.5},
        //blendMode: 'ADD',
        emitZone: { source: rect1} 
    });
   
     

    //fait passer les éléments devant le ciel
    this.stars.setDepth(10)
    this.bonus.setDepth(10)
    sol.setDepth(10)
    maison.setDepth(9)
    this.player.setDepth(10)
    this.blood.setDepth(10)
    //this.rayon1.setDepth(11)


    //monstres
        //tout les tableaux
   /*     new MonsterYokai(this,400,300);
        //1er tableau 
        new MonsterSol(this,200,416);*/
        //2eme tableau
        new MonsterSol(this,1100,416);
        new MonsterFly(this,1100,200);
        new MonsterFly(this,1200,100);
        //3eme tableau
        new Lanterne(this,2400,120);
       
        new Lanterne(this,2540,120);
        //4eme tableau
        //new Lanterne(this,3350,120);
        new MonsterFly(this,2900,250);
        new MonsterFly(this,3000,120);
        new MonsterSol(this,2900,416);

  
    }
    update(){
        super.update();
        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
       
      this.sky3.tilePositionX=this.cameras.main.scrollX*0.25
        this.sky3.tilePositionY=this.cameras.main.scrollY

        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        this.sky.tilePositionX=this.cameras.main.scrollX*1.5
        this.sky.tilePositionY=this.cameras.main.scrollY

        //le deuxième ciel se déplace moins vite pour accentuer l'effet
       this.sky4.tilePositionX=this.cameras.main.scrollX*0.25
        this.sky4.tilePositionY=this.cameras.main.scrollY

        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        this.sky2.tilePositionX=this.cameras.main.scrollX*0.5
        this.sky2.tilePositionY=this.cameras.main.scrollY


    }

}