class MonsterYokai extends ObjetEnnemi{
    /**
     *
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "yokaiRed");
        //pas de gravité
        this.body.allowGravity=false;
        this.setBodySize(40,40);//réduit le hit
        this.setBounceX(1);
        this.body.setMaxVelocityX(150)
        this.setVelocityX(-150);
        this.setCollideWorldBounds(true);
        this.setDepth(10);
        //définir les propriété que l'on va utiliser dans notre animation

        // X
        this.originalX=x;
        this.minX=x-400;
        this.maxX=x+800;

        // Y
        this.originalY=y;
        this.minY=y -64;
        this.maxY=height-128;

        // on applique les propriété du début de l'animation
        this.x=this.minX;
        this.y=this.minY;
        this.alpha=0;
        let me=this;

        //on fait apparaitre notre objet avec un petit delay, puis on lance l'animation
        //ceci a pour effet de décaler les animations pour ce même objet
        scene.tweens.add({
                targets:this,
                duration:5000,
                delay:Math.random()*1000,
                alpha:{
                    startDelay:Math.random()*5000,
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
                to:this.y-30, //on monte de 20 px
                duration: 1000,// une  seconde pour monter (et donc la même chose pour descendre)
                ease: 'Sine.easeInOut', //courbe d'accélération/décélération
                yoyo: -1, // de haut en bas, puis de bas en haut
                repeat:-1 //se répète à l'infini

            }
            
        });
    }

    update(){
        //fait changer de sens notre oiseau
        if(this.body){
            if(this.body.velocity.x<0){
                this.flipX=false;
            }else{
                this.flipX=true;
            }
        }

    }


}