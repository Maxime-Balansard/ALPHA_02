class TableauTiled extends Tableau{
   

     constructor()
    {
        super("Niveau01");
    }
    preload() {
        super.preload();
        
        // ------pour TILED-------------
        // nos images
        this.load.image('tiles', 'assets/tilemaps/SpriteSheet.png');
        this.load.image('plat128', 'assets/plat128.png');
        this.load.image('oni', 'assets/oni.png');
        this.load.image('star', 'assets/piece.png');
        this.load.image('logo1', 'assets/logo1.png');
        this.load.image('rouge', 'assets/rouge.png');
        this.load.image('rose', 'assets/rose.png');

        this.load.image('test', 'assets/test.jpg');


        this.load.image('yokai1', 'assets/yokai1.png');
        this.load.image('night', 'assets/ciel.png');

        //les données du tableau qu'on a créé dans TILED
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/NiveauTuto3.json');
        //on y trouve notre étoiles et une tête de mort
        this.load.atlas('particles', 'assets/particles/particles.png', 'assets/particles/particles.json');
       
    }
    create() {
        
        super.create();
        //on en aura besoin...
        let ici=this;

        //video
        
       

        //--------chargement de la tile map & configuration de la scène-----------------------

        //notre map
        this.map = this.make.tilemap({ key: 'map' });
        //nos images qui vont avec la map
        this.tileset = this.map.addTilesetImage('SpriteSheet','tiles');

        //on agrandit le champ de la caméra du coup
        let largeurDuTableau=this.map.widthInPixels;
        let hauteurDuTableau=this.map.heightInPixels;
        this.physics.world.setBounds(0, 0, largeurDuTableau,  hauteurDuTableau);
        this.cameras.main.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        //---- ajoute les plateformes simples ----------------------------
        this.solides = this.map.createLayer('solides', this.tileset, 0, 0);
        this.lave = this.map.createLayer('lave', this.tileset, 0, 0);
        this.derriere = this.map.createLayer('derriere', this.tileset, 0, 0);
        this.devant = this.map.createLayer('devant', this.tileset, 0, 0);
        this.devant2 = this.map.createLayer('devant2', this.tileset, 0, 0);

        
        this.lave.setCollisionByExclusion(-1, true);
        this.solides.setCollisionByExclusion(-1, true);
       
        //----------------bonus 1------------------------
       this.bonus = this.physics.add.group({
            allowGravity: false,
            immovable: true,
            bounceY:0
        });
        this.bonusObjects = this.map.getObjectLayer('bonus')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.bonusObjects.forEach(bonusObjects => {
            //this.rammasserBonusUn()
            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let bonus = this.bonus.create(bonusObjects.x+32, bonusObjects.y+32 ,'star');
            
           
        });
        //----------les étoiles (objets) ---------------------

        // c'est un peu plus compliqué, mais ça permet de maîtriser plus de choses...
        this.stars = this.physics.add.group({
            allowGravity: true,
            immovable: false,
            bounceY:0
        });
        this.starsObjects = this.map.getObjectLayer('stars')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.starsObjects.forEach(starObject => {
            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let star = this.stars.create(starObject.x+32, starObject.y+32 , 'particles','star');
        });
        //----------les monstres volants (objets tiled) ---------------------

        let monstersContainer=this.add.container();
        this.flyingMonstersObjects = this.map.getObjectLayer('flyingMonsters')['objects'];
        // On crée des montres volants pour chaque objet rencontré
        this.flyingMonstersObjects.forEach(monsterObject => {
            let monster=new MonsterFly(this,monsterObject.x,monsterObject.y);
            monstersContainer.add(monster);
        });
        //-----------------oni----------------------
        let monstersContainer1=this.add.container();
        this.oniObjects = this.map.getObjectLayer('oni')['objects'];
        // On crée des zombies pour chaque objet rencontré
        this.oniObjects.forEach(monsterObject => {
            let monster=new MonsterSol(this,monsterObject.x,monsterObject.y);
            monstersContainer1.add(monster);
            
        });


        //check c fait ---------------------------------
        this.checkPoints = this.physics.add.staticGroup();
        this.checkPointsObjects = this.map.getObjectLayer('checkPoints')['objects'];
        //on crée des checkpoints pour chaque objet rencontré
        this.checkPointsObjects.forEach(checkPointObject => 
        {
            console.log('chekPointObject', checkPointObject);
            let point=this.checkPoints.create(checkPointObject.x,checkPointObject.y,'star');
            point.checkPointObject=checkPointObject;
        });

        //--------effet sur la lave------------------------

        this.laveFxContainer=this.add.container();
        this.lave.forEachTile(function(tile){ //on boucle sur TOUTES les tiles de lave pour générer des particules
            if(tile.index !== -1){ //uniquement pour les tiles remplies
                //on va créer des particules
                let props={
                    frame: [
                        //'star', //pour afficher aussi des étoiles
                        'death-white'
                    ],
                    frequency:200,
                    lifespan: 2000,
                    quantity:2,
                    x:{min:-32,max:32},
                    y:{min:-12,max:52},
                    tint:[  0xC11A05,0x883333,0xBB5500,0xFF7F27 ],
                    rotate: {min:-10,max:10},
                    speedX: { min: -10, max: 10 },
                    speedY: { min: -20, max: -30 },
                    scale: {start: 0, end: 1},
                    alpha: { start: 1, end: 0 },
                    blendMode: Phaser.BlendModes.ADD,
                };
                let props2={...props}; //copie props sans props 2
                props2.blendMode=Phaser.BlendModes.MULTIPLY; // un autre blend mode plus sombre

                //ok tout est prêt...ajoute notre objet graphique
                let laveParticles = ici.add.particles('particles');

                //ajoute le premier émetteur de particules
                laveParticles.createEmitter(props);
                //on ne va pas ajouter le second effet émetteur mobile car il consomme trop de ressources
                if(!ici.isMobile) {
                    laveParticles.createEmitter(props2); // ajoute le second
                }
                // positionne le tout au niveau de la tile
                laveParticles.x=tile.pixelX+32;
                laveParticles.y=tile.pixelY+32;
                ici.laveFxContainer.add(laveParticles);

                //optimisation (les particules sont invisibles et désactivées par défaut)
                //elles seront activées via update() et optimizeDisplay()
                laveParticles.pause();
                laveParticles.visible=false;
                //on définit un rectangle pour notre tile de particules qui nous servira plus tard
                laveParticles.rectangle=new Phaser.Geom.Rectangle(tile.pixelX,tile.pixelY,64,64);

            }

        })

        //--------allez on se fait un peu la même en plus simple mais avec les étoiles----------

        let starsFxContainer=ici.add.container();
        this.stars.children.iterate(function(etoile) {
            let particles=ici.add.particles("particles","star");
            let emmiter=particles.createEmitter({
                tint:[  0xFF8800,0xFFFF00,0x88FF00,0x8800FF ],
                rotate: {min:0,max:360},
                scale: {start: 0.8, end: 0.5},
                alpha: { start: 1, end: 0 },
                blendMode: Phaser.BlendModes.ADD,
                speed:40
            });
            etoile.on("disabled",function(){
                emmiter.on=false;
            })
            emmiter.startFollow(etoile);
            starsFxContainer.add(particles);
        });

       
        //----------débug---------------------
        
        //pour débugger les collisions sur chaque layer
        let debug=this.add.graphics().setAlpha(this.game.config.physics.arcade.debug?0.75:0);
        if(this.game.config.physics.arcade.debug === false){
            debug.visible=false;
        }
        //débug solides en vers
        this.solides.renderDebug(debug,{
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(0, 255, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        });
        //debug lave en rouge
        this.lave.renderDebug(debug,{
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        });


        //---------- parallax ciel (rien de nouveau) -------------

        //on change de ciel, on fait une tileSprite ce qui permet d'avoir une image qui se répète
        this.sky=this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'night'
        );
        this.sky2=this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'night'
        );
        this.sky.setOrigin(0,0);
        this.sky2.setOrigin(0,0);
        this.sky.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        this.sky2.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
       

        //this.add.sprite(2000, 500, 'oni');
            
        let logo1= this.add.image(200, 500, 'logo1');
       
        var particles1 = this.add.particles('rose');
   var rect = new Phaser.Geom.Rectangle(100, 420, 50, 50);
    particles1.createEmitter({
        x: 50, y: 50,
        moveToX: {min:700,max:2500},
        moveToY: {min:300,max:600},
        rotate: {min:-10,max:360},
        lifespan: 10000,
       // alpha:0.5,
        quantity: 2,
        frequency: 500,
        delay: 100,
        depth:10,
        scale: { start: 8, end: 0.5},
        //blendMode: 'ADD',
        emitZone: { source: rect } 
    });
    var particles2 = this.add.particles('rouge');
     var rect1 = new Phaser.Geom.Rectangle(100, 420, 50, 50);
    particles2.createEmitter({
        x: 50, y: 50,
        moveToX: {min:700,max:2500},
        moveToY: {min:600,max:300},
        rotate: {min:-10,max:360},
        lifespan: 10000,
        quantity: 2,
        frequency: 500,
        delay: 100,
        depth:10,
        scale: { start: 8, end: 0.5},
        //blendMode: 'ADD',
        emitZone: { source: rect1} 
    });
    //----exemple pou faire ensorte qu'un image appraisse quand on aprroche ou non  
    
    
    
    

        //----------collisions---------------------

        //quoi collide avec quoi?
        //this.physics.add.collider(this.platforms, this.stars);
        this.physics.add.collider(this.player,this.platforms);
        this.physics.add.collider(this.player, this.solides);
        this.physics.add.collider(this.stars, this.solides);
        this.physics.add.collider(this.bonus, this.solides);
        //si le joueur touche une étoile dans le groupe...
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this);
        this.physics.add.overlap(this.player, this.bonus, this.rammasserBonusUn, null, this);
        //quand on touche la lave, on meurt
        this.physics.add.collider(this.player, this.lave,this.hitSpike,null,this);

        //--------- Z order -----------------------

        //on définit les z à la fin
        let z=1000; //niveau Z qui a chaque fois est décrémenté.
        debug.setDepth(z--);
        this.checkPoints.setDepth(z--);
        this.blood.setDepth(z--);
        monstersContainer.setDepth(z--);
        monstersContainer1.setDepth(z--);
        logo1.setDepth(z--);
        particles1.setDepth(z--);
        particles2.setDepth(z--);
        this.stars.setDepth(z--);
    this.bonus.setDepth(z--);
        starsFxContainer.setDepth(z--);
        this.devant2.setDepth(z--);
        this.devant.setDepth(z--);
        this.solides.setDepth(z--);
        this.laveFxContainer.setDepth(z--);
        this.lave.setDepth(z--);
        this.player.setDepth(z--);
        this.derriere.setDepth(z--);
        this.sky2.setDepth(z--);
        this.sky.setDepth(z--);

        //on touche un check
        
        this.physics.add.overlap(this.player, this.checkPoints, function(player, checkPoint)
        {
            ici.saveCheckPoint(checkPoint.checkPointObject.name);
        }, null, this);
        this.restoreCheckPoint();
    }


/*
    apparitionTexte(){

        if(this.player.x<1900){
            //this.tuto_dash.alpha=1;
            Tableau.current.tweens.add({
                targets: Tableau.current.oni,
                alpha:1,
                duration: 100,
                ease: 'Sine.easeInOut',

            })
        }else if(this.player.x>=2100){
            //this.tuto_dash.alpha=0;
            Tableau.current.tweens.add({
                targets: Tableau.current.oni,
                alpha:0,
                duration: 100,
                ease: 'Sine.easeInOut',

            })
        }
    }
*/



    /**
     * Permet d'activer, désactiver des éléments en fonction de leur visibilité dans l'écran ou non
     */
    optimizeDisplay(){
        
        //return;
        let world=this.cameras.main.worldView; // le rectagle de la caméra, (les coordonnées de la zone visible)

        // on va activer / désactiver les particules de lave
        for( let particule of this.laveFxContainer.getAll()){ // parcours toutes les particules de lave
            if(Phaser.Geom.Rectangle.Overlaps(world,particule.rectangle)){
                //si le rectangle de la particule est dans le rectangle de la caméra
                if(!particule.visible){
                    //on active les particules
                    particule.resume();
                    particule.visible=true;
                }
            }else{
                //si le rectangle de la particule n'est PAS dans le rectangle de la caméra
                if(particule.visible){
                    //on désactive les particules
                    particule.pause();
                    particule.visible=false;
                }
            }
        }

       
    }



    // Ne pas oublier de nommer chaques checkpoints sur Tiled
    saveCheckPoint(checkPointName)
    {
        if (localStorage.getItem("checkPoint") !== checkPointName)
        {
            console.log("on atteint le checkpoint", checkPointName);
            localStorage.setItem("checkPoint", checkPointName);

         
        }
    } 


    restoreCheckPoint()
    {
        let storedCheckPoint=localStorage.getItem("checkPoint")
        console.log("check", storedCheckPoint);
        if(storedCheckPoint)
        {
            this.checkPointsObjects.forEach(checkPointObject => 
            {
                if(checkPointObject.name === storedCheckPoint)
                {
                    this.player.setPosition(checkPointObject.x, checkPointObject.y-64);//+432);
                    //console.log("on charge le checkpoint", checkPointName);
                }
            });
        }
    }



    moveParallax(){
        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        this.sky.tilePositionX=this.cameras.main.scrollX*0.6;
        this.sky.tilePositionY=this.cameras.main.scrollY*0.6;
        this.sky2.tilePositionX=this.cameras.main.scrollX*0.7+100;
        this.sky2.tilePositionY=this.cameras.main.scrollY*0.7+100;
    }


    update(){
        super.update();
        this.moveParallax();

        //optimisation
        //teste si la caméra a bougé
        let actualPosition=JSON.stringify(this.cameras.main.worldView);
        if(
            !this.previousPosition
            || this.previousPosition !== actualPosition
        ){
            this.previousPosition=actualPosition;
            this.optimizeDisplay();
        }
        
    }




}

