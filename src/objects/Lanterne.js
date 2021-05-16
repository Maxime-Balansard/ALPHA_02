class Lanterne extends ObjetEnnemi{
    /**
     *
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "lanterne1");
        //pas de gravité
        this.body.allowGravity=false;
        //gestion de la taille
        this.setDisplaySize(64,64);
        this.setBodySize(this.body.width -32,this.body.height-32);
        this.setDepth(10)
        //définir les propriété que l'on va utiliser dans notre animation

        // X
        this.originalX=x;
        this.minX=x-200;
        this.maxX=x+200;

        // Y
        this.originalY=y;
        this.minY=y -64;
        this.maxY=height-100;

        // on applique les propriété du début de l'animation
        this.x=this.minX;
        this.y=this.minY;
        this.alpha=0;
        let me=this;

        //on fait apparaitre notre objet avec un petit delay, puis on lance l'animation
        //ceci a pour effet de décaler les animations pour ce même objet
        scene.tweens.add({
                targets:this,
                duration:200,
                delay:Math.random()*8000,
                alpha:{
                    startDelay:Math.random()*8000,
                    from:0,
                    to:1,
                },
                onComplete: function () {
                    me.start();
                }
            })

    }

    start(){
        this.scene.tweens.add({
            targets: this,
            y: {
                from: this.minY,
                to:this.maxY,
                duration: 1300,
                ease: 'Back.easeInOut',
                yoyo: -1,
                repeat:-1
            }
        });
    }

}