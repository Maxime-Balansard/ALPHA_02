/**
 * Toutes les fonctions propres à un tableau dans notre jeu.
 * Cette classe n'est pas à utiliser directement, elle doit être extend !
 */
class Tableau extends Phaser.Scene {

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

    preload() {
        this.load.image('Blood', 'assets/Blood.png');
        //this.load.image('ciel', 'assets/ciel.png');
        this.load.image('coup', 'assets/coup.png');
        this.load.audio('piece', 'assets/sounds/piece.mp3');
        this.load.audio('mort', 'assets/sounds/mort.mp3');
        this.load.audio('jojo', 'assets/sounds/jojo.mp3');


        this.load.spritesheet('persoSprite',
            'assets/persoSprite.png',
            {frameWidth: 128, frameHeight: 128}
        );

        this.load.spritesheet('iddlAP',
            'assets/iddlAP.png',
            {frameWidth: 128, frameHeight: 128}
        );

        this.load.spritesheet('dash1.0',
            'assets/dash1.png',
            {frameWidth: 128, frameHeight: 128}
        );
        this.load.spritesheet('dash2.0',
            'assets/dash2.png',
            {frameWidth: 128, frameHeight: 128}
        );

    }

    create() {
        this.jumpCount = 0;
        //musique
        this.mort = this.sound.add('mort');
        this.jojo = this.sound.add('jojo');
        this.piece = this.sound.add('piece');

        var musicConfig = {
            mute: false,
            volume: 0,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.jojo.play(musicConfig);

        Tableau.current = this;
        this.sys.scene.scale.lockOrientation("landscape")
        console.log("On est sur " + this.constructor.name + " / " + this.scene.key);


        /**
         * Le ciel en fond
         * @type {Phaser.GameObjects.Image}
         */
       // this.sky = this.add.image(0, 0, 'ciel').setOrigin(0, 0);
        //this.sky.displayWidth = 14 * 64;
       // this.sky.setScrollFactor(0, 0);
        this.epee = new Attack(this, -1000, -1000);
        /**
         * Le joueur
         * @type {Player}
         */


        this.player = new Player(this, 3500, 300);
        this.blood = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "Blood")
        this.blood.displayWidth = 64;
        this.blood.displayHeight = 64;
        this.blood.visible = false;


    }

    update() {
        super.update();
        this.player.move();


    }


    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'anim est finie
     */

    saigne(object, onComplete) {
        let me = this;
        this.physics.pause();
        this.cameras.main.shake(2000, 0.0080, true);
        me.blood.visible = true;
        me.blood.rotation = Phaser.Math.Between(0, 6);
        me.blood.x = object.x;
        me.blood.y = object.y;
        me.tweens.add({
            targets: me.blood,
            duration: 200,

            displayHeight: {
                from: 40,
                to: 70,
            },
            displayWidth: {
                from: 40,
                to: 70,

             },
            onComplete: function () {
                me.blood.visible = false;
                onComplete();
            }
        })
    }


    ramasserEtoile(player, star) {
        star.disableBody(true, true);
        ui.gagne();


        //va lister tous les objets de la scène pour trouver les étoies et vérifier si elles sont actives
        let totalActive = 0;
        for (let child of this.children.getChildren()) {
            if (child.texture && child.texture.key === "star") {
                if (child.active) {
                    totalActive++;

                    var musicConfig = {
                        mute: false,
                        volume: 0.01,
                        rate: 1,
                        detune: 0,
                        seek: 0,
                        loop: false,
                        delay: 0
                    }

                    this.piece.play(musicConfig);
                }
            }
        }
        if (totalActive === 0) {
            this.win();
        }
    }


    rammasserBonusUn(player, bonus) {
        bonus.disableBody(true, true);
        ui.gagne();
        var cam = this.cameras.main;
        //this.rammasserBonusUn = true;
        //if (this.rammasserBonusUn === true) {
        this.player.controlLock = true;
            cam.pan(10000, 500, 6000, 'Cubic.easeInOut');

            cam.zoomTo(0.5, 5000);

            let p = this.player;
            setTimeout(function() {
                cam.zoomTo(1, 2000);
                p.controlLock = false;
            }, 6000);

        }


    /**
     *
     * @param Attack
     * @param {ObjetEnnemi} monster
     */

    etPaf(Attack, monster) {

       // console.log("touche");
        //this.player.estEnTrainDAttaquer = true;


        monster.isDead = true; //ok le monstre est mort
        monster.disableBody(true, true);//plus de collisions
        this.cameras.main.shake(200, 0.006, true,); //Screen Shaker


    }

    /**
     * Aïeee ça fait mal
     * @param player
     * @param spike
     */
    hitSpike(player, spike) {
        this.physics.pause();
        var cam = this.cameras.main;
        player.anims.play('turn');
        cam.setZoom(2);
        cam.fadeOut(1000, 0, 0, 0)
        cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.restart();
        })
    }

    /**
     *
     * @param Attack
     * @param {ObjetEnnemi} monster
     */

    hitMonster(player, monster,) {
        let me = this;

                //le joueur est mort
                if (!me.player.isDead) {
                    this.mort.play();
                    this.jojo.stop();
                    me.player.isDead = true;
                    me.player.visible = false;
                    //ça saigne...
                    me.saigne(me.player, function () {

                        //à la fin de la petite anim, on relance le jeu


                        me.blood.visible = false;
                        // me.player.anims.play('turn');
                        me.player.isDead = false;
                        me.scene.restart();

                    })

        }

    }


    /**
     * Pour reset cette scène proprement
     * @private
     */
    _destroy() {
        this.player.stop();
        this.scene.stop();
    }

    /**
     * Quand on a gagné
     */
    win() {
        Tableau.suivant();
        localStorage.removeItem("checkPoint");
        this.jojo.stop();
    }

    /**
     * Va au tableau suivant
     */
    static suivant() {
        let ceSeraLaSuivante = false;
        let nextScene = null;
        if (Tableau.current) {
            for (let sc of game.scene.scenes) {
                if (sc.scene.key !== "ui") {
                    if (!nextScene) {
                        if (ceSeraLaSuivante) {
                            nextScene = sc;
                        }
                        if (sc.scene.key === Tableau.current.scene.key) {
                            ceSeraLaSuivante = true;
                        }
                    }
                }
            }
        }
        if (!nextScene) {
            nextScene = game.scene.scenes[0];
        }
        Tableau.goTableau(nextScene);
    }

    static goTableau(tableau) {
        if (Tableau.current) {
            Tableau.current._destroy();
        }
        game.scene.start(tableau);
    }


}

/**
 * Le tableau en cours
 * @type {null|Tableau}
 */
Tableau.current = null;