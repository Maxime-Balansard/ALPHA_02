class TableauTiled extends Tableau {


    constructor() {
        super("Niveau01");
    }

    preload() {
        super.preload();

        // ------pour TILED-------------
        // nos images
        this.load.image('tiles', 'assets/tilemaps/SpriteSheet.png');
        this.load.image('plat128', 'assets/plat128.png');
        this.load.image('oni', 'assets/oni.png');
        this.load.image('plat64', 'assets/plat64.png');
        this.load.image('star', 'assets/piece.png');
        this.load.image('chek1', 'assets/chek.png');
        this.load.image('logo1', 'assets/logo1.png');
        this.load.image('casque', 'assets/casque.png');

        this.load.image('ile', 'assets/iles.png');

        this.load.image('caillou1', 'assets/caillou1.png');
        this.load.image('caillou2', 'assets/caillou2.png');

        this.load.image('Red', 'assets/red.png');
        this.load.image('rosed', 'assets/rosed.png');

        this.load.image('orange', 'assets/sparkOrange.png');
        this.load.image('rougeF', 'assets/sparkRougeF.png');
        this.load.image('jaune', 'assets/sparkJaune.png');
        this.load.image('rouge', 'assets/spark.png');

        this.load.image('tutoDash', 'assets/tutoDash1.png');
        this.load.image('tutoDoubleSaut', 'assets/tutoDoubleSaut1.png');
        this.load.image('tutoSaut', 'assets/tutoSaut1.png');


        this.load.image('test', 'assets/test.jpg');


        this.load.image('yokai1', 'assets/yokai1.png');
        this.load.image('ciel', 'assets/ciel.png');
        this.load.image('nuage', 'assets/nuage.png');

        //les données du tableau qu'on a créé dans TILED
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/NiveauTuto3.json');
        //on y trouve notre étoiles et une tête de mort
        this.load.atlas('particles', 'assets/particles/particles.png', 'assets/particles/particles.json');


        this.load.spritesheet('chute1',
            'assets/chuteGR.png',
            {frameWidth: 192, frameHeight: 640}
        );

        this.load.spritesheet('portail1',
            'assets/portail.png',
            {frameWidth: 128, frameHeight:250 }
        );
    }

    create() {

        super.create();
        //on en aura besoin...
        let ici = this;
        this.isTexte = 0;
        this.isTexte1 = 0;
        this.isTexte2 = 0;
        var cam = this.cameras.main;
        //this.isTexte1 = 0;
        //video


        //--------chargement de la tile map & configuration de la scène-----------------------

        //notre map
        this.map = this.make.tilemap({key: 'map'});
        //nos images qui vont avec la map
        this.tileset = this.map.addTilesetImage('SpriteSheet', 'tiles');

        //on agrandit le champ de la caméra du coup
        let largeurDuTableau = this.map.widthInPixels;
        let hauteurDuTableau = this.map.heightInPixels;
        this.physics.world.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.cameras.main.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8, -90, 30);

        //---- ajoute les plateformes simples ----------------------------
        this.solides = this.map.createLayer('solides', this.tileset, 0, 0);
        this.solideMonster = this.map.createLayer('solideMonster', this.tileset, 0, 0);
        this.lave = this.map.createLayer('lave', this.tileset, 0, 0);
        //this.light = this.map.createLayer('light', this.tileset, 0, 0);
        this.derriere3 = this.map.createLayer('derriere3', this.tileset, 0, 0);
        this.derriere1 = this.map.createLayer('derriere1', this.tileset, 0, 0);
        this.derriere2 = this.map.createLayer('derriere2', this.tileset, 0, 0);
        this.derriere = this.map.createLayer('derriere', this.tileset, 0, 0);
        this.devant = this.map.createLayer('devant', this.tileset, 0, 0);
        this.devant2 = this.map.createLayer('devant2', this.tileset, 0, 0);


        this.lave.setCollisionByExclusion(-1, true);
        this.solides.setCollisionByExclusion(-1, true);
        this.solideMonster.setCollisionByExclusion(-1, true);
        //this.solideMonster.setCollisionByProperty({collides:true});


        this.plightContainer = this.add.container();
        this.lightContainer = this.add.container();
        this.monstersContainer = this.add.container();
        this.caillouContainer = this.add.container();
        this.cailloulContainer = this.add.container();
        //---------------light--------------------
        ici.plight = ici.map.getObjectLayer('lights')['objects'];
        ici.plight.forEach(plightObjects => {
            let light = new Light(this, plightObjects.x + 16, plightObjects.y - 10).setDepth(9999);
            light.addLight(this, 255, 100, 100, 100, 0.5, 0.04, false);
            this.plightContainer.add(light);
        });
        //----------------bonus 1------------------------
        this.bonus = this.physics.add.group({
            allowGravity: false,
            immovable: true,
            bounceY: 0
        });


        //---------------light2-------------------
        ici.alight = ici.map.getObjectLayer('lightChek')['objects'];
        ici.alight.forEach(alightObjects => {
            let alight = new Light(this, alightObjects.x, alightObjects.y).setDepth(9999);
            alight.addLight(this, 178, 12, 15, 300, 0.5, 0.05, false);
            this.lightContainer.add(alight);
        });
        //----------------bonus 1------------------------
        this.bonus = this.physics.add.group({
            allowGravity: false,
            immovable: true,
            bounceY: 0
        });


        this.bonusObjects = this.map.getObjectLayer('bonus')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.bonusObjects.forEach(bonusObjects => {
            //this.rammasserBonusUn()
            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let bonus = this.bonus.create(bonusObjects.x + 32, bonusObjects.y + 32, '');


        });


        this.arrete = this.physics.add.group({
            allowGravity: false,
            immovable: true,
            bounceY: 0
        });
        this.arreteObjects = this.map.getObjectLayer('arrete')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.arreteObjects.forEach(arreteObjects => {

            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let arrete = this.arrete.create(arreteObjects.x, arreteObjects.y, '');

        });
        //----------les étoiles (objets) ---------------------

        // c'est un peu plus compliqué, mais ça permet de maîtriser plus de choses...
        this.stars = this.physics.add.group({
            allowGravity: false,
            immovable: false,
            bounceY: 0
        });
        this.starsObjects = this.map.getObjectLayer('stars')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.starsObjects.forEach(starObject => {
            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let star = this.stars.create(starObject.x , starObject.y , 'star');
        });


        this.pierre = this.physics.add.group({
            allowGravity: true,
            immovable: false,
            bounceY: 0
        });
        this.pierreObjects = this.map.getObjectLayer('pierre')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.pierreObjects.forEach(pierreObjects => {
            // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let pierre = this.pierre.create(pierreObjects.x, pierreObjects.y,  'casque');
        });


        ici.OniObjects = ici.map.getObjectLayer('Oni')['objects'];
        // On crée des montres volants pour chaque objet rencontré
        ici.OniObjects.forEach(monsterObject => {
            let monster = new Oni(this, monsterObject.x, monsterObject.y);
            this.monstersContainer.add(monster);
            this.physics.add.collider(monster, this.solides);
            this.physics.add.collider(monster, this.solideMonster);

        });



        ici.CaillouObjects = this.map.getObjectLayer('caillou')['objects'];
        // On crée des zombies pour chaque objet rencontré
        ici.CaillouObjects.forEach(CaillouObjects => {
            let Caillou=new MonsterSol(this,CaillouObjects.x,CaillouObjects.y);
            this.caillouContainer.add(Caillou);

        });


        ici.CailloulObjects = this.map.getObjectLayer('cailloul')['objects'];
        // On crée des zombies pour chaque objet rencontré
        ici.CailloulObjects.forEach(CailloulObjects => {
            let Cailloul=new MonsterSaul(this,CailloulObjects.x,CailloulObjects.y);
            this.cailloulContainer.add(Cailloul);

        });

        //check c fait ---------------------------------
        this.checkPoints = this.physics.add.staticGroup();
        this.checkPointsObjects = this.map.getObjectLayer('checkPoints')['objects'];
        //on crée des checkpoints pour chaque objet rencontré
        this.checkPointsObjects.forEach(checkPointObject => {
            console.log('chekPointObject', checkPointObject);
            let point = this.checkPoints.create(checkPointObject.x, checkPointObject.y, 'chek1');
            point.checkPointObject = checkPointObject;
        });

        //--------effet sur la lave------------------------

        this.laveFxContainer = this.add.container();
        this.lave.forEachTile(function (tile) { //on boucle sur TOUTES les tiles de lave pour générer des particules
            if (tile.index !== -1) { //uniquement pour les tiles remplies
                //on va créer des particules
                let props = {
                    frame: [
                        //'star', //pour afficher aussi des étoiles
                        'death-white'
                    ],
                    frequency: 200,
                    lifespan: 2000,
                    quantity: 2,
                    x: {min: -32, max: 32},
                    y: {min: -12, max: 52},
                    tint: [0xC11A05, 0x883333, 0xBB5500, 0xFF7F27],
                    rotate: {min: -10, max: 10},
                    speedX: {min: -10, max: 10},
                    speedY: {min: -20, max: -30},
                    scale: {start: 0, end: 1},
                    alpha: {start: 1, end: 0},
                    blendMode: Phaser.BlendModes.ADD,
                };
                let props2 = {...props}; //copie props sans props 2
                props2.blendMode = Phaser.BlendModes.MULTIPLY; // un autre blend mode plus sombre

                //ok tout est prêt...ajoute notre objet graphique
                let laveParticles = ici.add.particles('particles');

                //ajoute le premier émetteur de particules
                laveParticles.createEmitter(props);
                //on ne va pas ajouter le second effet émetteur mobile car il consomme trop de ressources
                if (!ici.isMobile) {
                    laveParticles.createEmitter(props2); // ajoute le second
                }
                // positionne le tout au niveau de la tile
                laveParticles.x = tile.pixelX + 32;
                laveParticles.y = tile.pixelY + 32;
                ici.laveFxContainer.add(laveParticles);

                //optimisation (les particules sont invisibles et désactivées par défaut)
                //elles seront activées via update() et optimizeDisplay()
                laveParticles.pause();
                laveParticles.visible = false;
                //on définit un rectangle pour notre tile de particules qui nous servira plus tard
                laveParticles.rectangle = new Phaser.Geom.Rectangle(tile.pixelX, tile.pixelY, 64, 64);

            }

        })

        //--------allez on se fait un peu la même en plus simple mais avec les étoiles----------




        //----------débug---------------------

        //pour débugger les collisions sur chaque layer
        let debug = this.add.graphics().setAlpha(this.game.config.physics.arcade.debug ? 0.75 : 0);
        if (this.game.config.physics.arcade.debug === false) {
            debug.visible = false;
        }
        //débug solides en vers
        this.solides.renderDebug(debug, {
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(0, 255, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        });
        //debug lave en rouge
        this.lave.renderDebug(debug, {
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        });


        //---------- parallax ciel (rien de nouveau) -------------

        //on change de ciel, on fait une tileSprite ce qui permet d'avoir une image qui se répète
        this.sky = this.add.tileSprite(
            this.sys.canvas.width * -1,
            this.sys.canvas.height * -1,
            this.sys.canvas.width * 3,
            this.sys.canvas.height * 3,

            'ciel'
        );
        this.sky2 = this.add.tileSprite(
            this.sys.canvas.width * -2,
            this.sys.canvas.height * -2,
            this.sys.canvas.width * 3,
            this.sys.canvas.height * 3,
            'ile'
        );

        this.sky3 = this.add.tileSprite(
            this.sys.canvas.width * -1,
            this.sys.canvas.height * -1,
            this.sys.canvas.width * 3,
            this.sys.canvas.height * 3,
            'nuage'
        );


        this.sky.setOrigin(0, 0);
        this.sky2.setOrigin(0, 0);
        this.sky3.setOrigin(0, 0);
        this.sky.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        this.sky2.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        this.sky3.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra


        this.anims.create({
            key: 'eau',
            frames: this.anims.generateFrameNumbers('chute1', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.maChute = this.add.sprite(3460, 750, 'chute1').play('chute1', true).setDepth(999999);

        this.maChute.anims.play('eau', true);


        this.maChute1 = this.add.sprite(7420, 787, 'chute1').play('chute1', true).setDepth(999999);

        this.maChute1.anims.play('eau', true);

        this.anims.create({
            key: 'zoom',
            frames: this.anims.generateFrameNumbers('portail1', {start: 0, end: 7}),
            frameRate:  9,
            repeat: -1
        });

        this.monPortail = this.add.sprite(9577, 176, 'portail1').play('portail1', true).setDepth(999999);

        this.monPortail.anims.play('zoom', true);


        this.pnj = this.add.sprite(2500, 550, 'tutoSaut').setAlpha(0);
        this.pnj1 = this.add.sprite(4100, 550, 'tutoDoubleSaut').setAlpha(0);
        this.pnj2 = this.add.sprite(6450, 750, 'tutoDash').setAlpha(0);
        // this.pnj2=this.add.sprite(2200, 650, 'tutoDash1').setAlpha(0);


       var particles10 = this.add.particles('rosed');
        var rect1 = new Phaser.Geom.Rectangle(650, 400, 50, 50);
        particles10.createEmitter({
            x: 50, y: 50,
            moveToX: {min: 1500, max: 2500},
            moveToY: {min: 300, max: 600},
            rotate: {min: -10, max: 360},
            lifespan: 10000,
            // alpha:0.5,
            quantity: 3,
            frequency: 500,
            delay: 100,
            depth: 10,
            scale: {start: 0.6, end: 0.2},
            //blendMode: 'ADD',
            emitZone: {source: rect1}
        });

       var particles11 = this.add.particles('Red');
        var rect2 = new Phaser.Geom.Rectangle(650, 420, 50, 50);
        particles11.createEmitter({
            x: 50, y: 50,
            moveToX: {min: 1500, max: 2500},
            moveToY: {min: 600, max: 300},
            rotate: {min: -10, max: 360},
            lifespan: 10000,
            quantity: 3,
            frequency: 500,
            delay: 100,
            depth: 10,
            scale: {start: 0.6, end: 0.2},
            //blendMode: 'ADD',
            emitZone: {source: rect2}
        });

        //----exemple pou faire ensorte qu'un image appraisse quand on aprroche ou non
        let doorLight = [];
        doorLight[0] = this.add.pointlight(9560, 100, 0, 250, 0.3).setDepth(99999999);
        doorLight[1] = this.add.pointlight(9560, 180, 0, 250, 0.3).setDepth(99999999);
        doorLight[2] = this.add.pointlight(9560, 260, 0, 250, 0.3).setDepth(99999999);
        doorLight.forEach(p => {
            p.attenuation = 0.04;
            p.color.setTo(255, 100, 100);

            this.tweens.add({
                targets: p,
                duration: 2000,
                repeat: -1,
                yoyo: true,
                delay: 1000,
                alpha: {
                    startdeDelay: 0,
                    from: 0.5,
                    to: 0.9
                }
            })
        })

        let ChekLight = [];
        ChekLight[0] = this.add.pointlight(2144, 710, 0, 50, 0.7).setDepth(9999999);
        ChekLight[1] = this.add.pointlight(3872.13, 710, 0, 50, 0.7).setDepth(9999999);
        ChekLight[2] = this.add.pointlight(4992, 522, 0, 50, 0.7).setDepth(9999999);
        ChekLight[3] = this.add.pointlight(3648.25, 295, 0, 50, 0.7).setDepth(9999999);
        ChekLight[4] = this.add.pointlight(6496.41, 870, 0, 50, 0.7).setDepth(9999999);
        ChekLight[5] = this.add.pointlight(7200, 360, 0, 50, 0.7).setDepth(9999999);
        ChekLight.forEach(q => {
            q.attenuation = 0.05;
            q.color.setTo(149, 11, 209);

            this.tweens.add({
                targets: q,
                duration: 1000,
                repeat: -1,
                yoyo: true,
                delay: 500,
                alpha: {
                    startdeDelay: 0,
                    from: 0.5,
                    to: 1
                }
            })
        })


        var particles2 = this.add.particles('jaune');
        var rect = new Phaser.Geom.Rectangle(9600, 80, 50, 150);
        particles2.createEmitter({
            x: 50, y: 100,
            moveToX: {min: 9000, max: 8000},
            moveToY: {min: 100, max: 400},
            rotate: {min: -10, max: 360},
            lifespan: 5000,
            alpha: 0.5,
            quantity: 2,
            frequency: 200,
            delay: 100,
            //depth: 10,
            scale: {start: 1.5, end: 0.2},
            //blendMode: 'ADD',
            emitZone: {source: rect}
        });


        var particles3 = this.add.particles('rouge');
        var rect = new Phaser.Geom.Rectangle(9600, 80, 50, 150);
        particles3.createEmitter({
            x: 50, y: 50,
            moveToX: {min: 9000, max: 8500},
            moveToY: {min: 100, max: 400},
            rotate: {min: -10, max: 360},
            lifespan: 4000,
            alpha: 0.5,
            quantity: 2,
            frequency: 200,
            delay: 100,
            //depth: 10,
            scale: {start: 1.5, end: 0.2},
            //blendMode: 'ADD',
            emitZone: {source: rect}
        });

        var particles4 = this.add.particles('rougeF');
        var rect = new Phaser.Geom.Rectangle(9600, 80, 50, 150);
        particles4.createEmitter({
            x: 50, y: 100,
            moveToX: {min: 9000, max: 8800},
            moveToY: {min: 100, max: 400},
            rotate: {min: -10, max: 360},
            lifespan: 2000,
            alpha: 0.5,
            quantity: 1,
            frequency: 200,
            delay: 100,
           // depth: 10,
            scale: {start: 1.5, end: 0.5},
            //blendMode: 'ADD',
            emitZone: {source: rect}
        });


        //----------collisions---------------------

        //quoi collide avec quoi?
        //this.physics.add.collider(this.platforms, this.stars);


        this.physics.add.collider(this.player, this.solides);
        this.physics.add.collider(this.stars, this.solides);
        this.physics.add.collider(this.bonus, this.solides);
        this.physics.add.collider(this.pierre, this.solides);
        this.physics.add.collider(this.arrete, this.solides);
        //si le joueur touche une étoile dans le groupe...
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this);

        this.physics.add.overlap(this.player, this.pierre, this.rammasse, null, this);
        this.physics.add.overlap(this.player, this.bonus, this.rammasserBonusUn, null, this);

        this.physics.add.overlap(this.player, this.arrete, this.stoped, null, this);

        //quand on touche la lave, on meurt
        this.physics.add.collider(this.player, this.lave, this.hitSpike, null, this);

        //--------- Z order -----------------------

        //on définit les z à la fin
        let z = 1000; //niveau Z qui a chaque fois est décrémenté.
        debug.setDepth(z--);


        this.blood.setDepth(z--);
        //monstersContainer.setDepth(z--);

        this.pierre.setDepth(z--);
        this.monstersContainer.setDepth(z--);
        this.caillouContainer.setDepth(z--);
        this.cailloulContainer.setDepth(z--);
        //this.pnj1.setDepth(z--);
        this.devant2.setDepth(z--);
        this.devant.setDepth(z--);
        particles2.setDepth(z--);
        particles3.setDepth(z--);
        particles4.setDepth(z--);
        this.solides.setDepth(z--);
        this.player.setDepth(z--);
        this.checkPoints.setDepth(z--);
        this.pnj.setDepth(z--);
        this.pnj1.setDepth(z--);
        this.pnj2.setDepth(z--);
        this.laveFxContainer.setDepth(z--);
        this.lave.setDepth(z--);
        this.derriere.setDepth(z--);
        particles10.setDepth(z--);
        particles11.setDepth(z--);
        this.derriere1.setDepth(z--);
        this.derriere2.setDepth(z--);
        this.derriere3.setDepth(z--);
        this.sky3.setDepth(z--);
        this.sky2.setDepth(z--);
        this.sky.setDepth(z--);
        this.solideMonster.setDepth(z--);
        this.arrete.setDepth(z--);
        this.bonus.setDepth(z--);
        this.stars.setDepth(z--);


        //on touche un check

        this.physics.add.overlap(this.player, this.checkPoints, function (player, checkPoint) {
            ici.saveCheckPoint(checkPoint.checkPointObject.name);
        }, null, this);
        this.restoreCheckPoint();
    }


    apparitionTexte() {

        if (this.player.x > 2100 && this.isTexte == 0) {
            this.isTexte++;
            this.tweens.add({
                targets: this.pnj,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 0,
                    to: 1
                }
            })
        } else if (this.player.x > 3000 && this.isTexte == 1) {
            this.isTexte++;
            this.tweens.add({
                targets: this.pnj,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 1,
                    to: 0
                }
            })
        }

    }

    apparitionTexte1() {

        if (this.player.x > 3600 && this.isTexte1 == 0) {
            this.isTexte1++;
            this.tweens.add({
                targets: this.pnj1,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 0,
                    to: 1
                }
            })
        } else if (this.player.x > 5000 && this.isTexte1 == 1) {
            this.isTexte1++;
            this.tweens.add({
                targets: this.pnj1,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 1,
                    to: 0
                }
            })
        }
    }


    apparitionTexte2() {

        if (this.player.x > 6100 && this.isTexte2 == 0) {
            this.isTexte2++;
            this.tweens.add({
                targets: this.pnj2,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 0,
                    to: 1
                }
            })
        } else if (this.player.x > 7000 && this.isTexte2 == 1) {
            this.isTexte2++;
            this.tweens.add({
                targets: this.pnj2,
                duration: 3000,
                yoyo: false,
                delay: 200,
                alpha: {
                    startDelay: 0,
                    from: 1,
                    to: 0
                }
            })
        }
    }


    /**
     * Permet d'activer, désactiver des éléments en fonction de leur visibilité dans l'écran ou non
     */
    optimizeDisplay() {

        //return;
        let world = this.cameras.main.worldView; // le rectagle de la caméra, (les coordonnées de la zone visible)

        // on va activer / désactiver les particules de lave
        for (let particule of this.laveFxContainer.getAll()) { // parcours toutes les particules de lave
            if (Phaser.Geom.Rectangle.Overlaps(world, particule.rectangle)) {
                //si le rectangle de la particule est dans le rectangle de la caméra
                if (!particule.visible) {
                    //on active les particules
                    particule.resume();
                    particule.visible = true;
                }
            } else {
                //si le rectangle de la particule n'est PAS dans le rectangle de la caméra
                if (particule.visible) {
                    //on désactive les particules
                    particule.pause();
                    particule.visible = false;
                }
            }
        }


    }


    // Ne pas oublier de nommer chaques checkpoints sur Tiled
    saveCheckPoint(checkPointName) {
        if (localStorage.getItem("checkPoint") !== checkPointName) {
            console.log("on atteint le checkpoint", checkPointName);
            localStorage.setItem("checkPoint", checkPointName);


        }
    }


    restoreCheckPoint() {
        let storedCheckPoint = localStorage.getItem("checkPoint")
        console.log("check", storedCheckPoint);
        if (storedCheckPoint) {
            this.checkPointsObjects.forEach(checkPointObject => {
                if (checkPointObject.name === storedCheckPoint) {
                    this.player.setPosition(checkPointObject.x, checkPointObject.y - 64);//+432);
                    //console.log("on charge le checkpoint", checkPointName);
                }
            });
        }
    }


    moveParallax() {
        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        this.sky.tilePositionX = this.cameras.main.scrollX * 0.6;
        this.sky.tilePositionY = this.cameras.main.scrollY * 0.6;
        this.sky2.tilePositionX = this.cameras.main.scrollX * 0.4;
        this.sky2.tilePositionY = this.cameras.main.scrollY * 0.4;
        this.sky3.tilePositionX = this.cameras.main.scrollX * 0.6;
        this.sky3.tilePositionY = this.cameras.main.scrollY * 0.6;

    }


    update() {
        super.update();
        this.moveParallax();
        this.apparitionTexte();
        this.apparitionTexte1();
        this.apparitionTexte2();
        //optimisation
        //teste si la caméra a bougé
        let actualPosition = JSON.stringify(this.cameras.main.worldView);
        if (
            !this.previousPosition
            || this.previousPosition !== actualPosition
        ) {
            this.previousPosition = actualPosition;
            this.optimizeDisplay();
        }

    }


}

