class UIBar {
    constructor(scene, x, y, color, depth) {
        this.backfill = scene.add.sprite(x,y, 'barBackFill').setOrigin(0.5,0).setDepth(depth);
        // create the colored bar that'll represent the levels of something
        this.maxWidth = this.backfill.width-6;
        this.fill = scene.add.rectangle(this.backfill.x-(this.backfill.width/2)+2, 
                                        this.backfill.y+(this.backfill.height/2), 
                                        this.maxWidth, this.backfill.height*0.6, 
                                        color).setOrigin(0,0.5).setDepth(depth);
        this.border = scene.add.sprite(x,y,'barBorder').setOrigin(0.5,0).setDepth(depth);


    }


    update(x, y, percentage){
       this.backfill.setPosition(x,y);

       //Set the levels look
       this.fill.setPosition(this.backfill.x-(this.backfill.width/2)+2,
                             this.backfill.y+(this.backfill.height/2));
       this.fill.setSize(this.maxWidth*percentage,this.fill.height);

       this.border.setPosition(x,y);
    }

    setAlpha(alphaNum){
        this.backfill.setAlpha(alphaNum);
        this.fill.setAlpha(alphaNum);
        this.border.setAlpha(alphaNum);
    }
}