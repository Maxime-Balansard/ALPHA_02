class Bonus extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, "piece")
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setBodySize(this.body.width,this.body.height+46);
       
        rammasserBonusUn (player, bonus)
        {
            bonus.disableBody(true, true);
            ui.gagne();
            this.rammasserBonusUn=true;
            if( this.rammasserBonusUn == true){
                this.cameras.main.flash(1000,255,162,0);
                this.player.scale += 0.4;
                this.player.setGravityY(1200)
                this.player.plusVite();
                
               
    
            }
            
           
        }
      
   
    
    }
}