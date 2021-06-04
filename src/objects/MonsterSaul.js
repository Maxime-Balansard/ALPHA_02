class MonsterSaul extends ObjetEnnemi{
    /**
     *
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "caillou2");
        //pas de gravité
        this.body.allowGravity=false;
        this.setCollideWorldBounds(true);
        this.disableBody(true, false);
        this.setBodySize(this.body.width,this.body.height);
        this.scene.events.on('update', (time, delta) => { this.update(time, delta)} );
//définir les propriété que l'on va utiliser dans notre animation

        // X
        this.originalX=x;
        this.minX=x;
        this.maxX=x;

        // Y
        this.originalY=y;
        this.minY=y ;
        this.maxY=y-20;

        // on applique les propriété du début de l'animation
        this.x=this.minX;
        this.y=this.minY;
        this.alpha=0;
        let me=this;

        //on fait apparaitre notre objet avec un petit delay, puis on lance l'animation
        //ceci a pour effet de décaler les animations pour ce même objet
        scene.tweens.add({
            targets:this,
            duration:100,
            delay:Math.random()*1000,
            alpha:{
                startDelay:Math.random()*1000,
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
                duration: 2000,
                ease: 'Quad.easeInOut',
                yoyo: -1,
                repeat:-1,
                //hold:1500,
            }
        });
    }


}