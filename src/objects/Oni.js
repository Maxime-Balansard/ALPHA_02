class Oni extends ObjetEnnemi{
    /**
     *
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "oni");
        this.setDisplaySize(64,64);
        this.setBodySize(this.body.width,this.body.height);
        this.setOffset(0,0);
        this.dir = 1;
        this.isAlive = true;

        this.body.allowGravity=true;
        //this.setBodySize(this.body.width,this.body.height);
        //this.setDisplaySize(64,64);
        this.setCollideWorldBounds(true);
        this.setBounce(0);

        this.setDepth(102);
        scene.time.addEvent({ delay: 100, callback: this.mouv, callbackScope: this, loop: true });

    }




    mouv(){
        this.direction();

        if(this.isAlive) {
            if (this.scene.player.x > this.x - 300 && this.scene.player.x < this.x + 300 ) {

                this.setVelocityX(130 * this.dir);

            }
            else{
                this.setVelocityX(0);
            }
        }
    }

    direction(){
        if (this.x < this.scene.player.x)
        {
            this.dir = 1;
        }
        else if (this.x > this.scene.player.x)
        {
            this.dir = -1;
        }
    }
}