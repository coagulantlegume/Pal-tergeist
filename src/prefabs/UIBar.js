class UIBar {
    constructor(scene, x, y, color, depth) {
        this.backfill = scene.add.sprite(x,y, 'barBackFill').setOrigin(0.5,0).setDepth(depth);
        // create the colored bar that'll represent the levels of something
        this.fill = scene.add.rectangle(this.backfill.x-(this.backfill.width/2)+2, 
                                        this.backfill.y+(this.backfill.height/2), 
                                        this.backfill.width-6, this.backfill.height*0.6, 
                                        color).setOrigin(0,0.5).setDepth(depth);
        this.border = scene.add.sprite(x,y,'barBorder').setOrigin(0.5,0).setDepth(depth);
    }


    update(x, y){
       this.backfill.setPosition(x,y);

       //Set the levels look
       this.fill.setPosition(this.backfill.x-(this.backfill.width/2)+2,
                             this.backfill.y+(this.backfill.height/2));
       this.fill.setSize(this.fill.width,this.fill.height);

       this.border.setPosition(x,y);
    }
}