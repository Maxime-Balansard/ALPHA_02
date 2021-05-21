class ObjetEnnemi extends ObjetPhysique{
    /**
     * Quand Player touche cet objet, il a perdu
     * @param {Tableau} scene
     * @param {Number} x
     * @param {Number} y
     * @param {string} image
     */
    constructor(scene, x, y,image) {
        super(scene, x, y,image);
        this.isDead = false;
        scene.physics.add.overlap(
            scene.player,
            this,
            scene.hitMonster,
            null,
            scene,
           
        );
        scene.physics.add.overlap(
            scene.epee,
            this,
            scene.etPaf,
            null,
            scene
        );
    }
}