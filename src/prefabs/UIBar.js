class UIBar {
    constructor(scene, x, y, borderKey, backFillKey, color) {
        this.backfill = scene.add.sprite(x,y,backFillKey).setOrigin(0.5,0).setDepth(4);
        this.fill = scene.add.rectangle(this.backfill.x-(this.backfill.width/2)+2, 
                                        this.backfill.y+(this.backfill.height/2), 
                                        this.backfill.width-6, this.backfill.height*0.6, 
                                        color).setOrigin(0,0.5).setDepth(4);
        //this.fill = scene.add.rectangle(scene,-(this.backfill.width/2), this.backfill.y, this.backfill.width, , color).setOrigin(0,0.5).setDepth(4);
        this.border = scene.add.sprite(x,y,borderKey).setOrigin(0.5,0).setDepth(4);
    }


    update(x, y){
       this.backfill.setPosition(x,y);
       this.fill.setPosition(this.backfill.x-(this.backfill.width/2)+2,
                             this.backfill.y+(this.backfill.height/2));
       this.fill.setSize(this.fill.width,this.fill.height);
       // this.fill.setPosition(this.backfill.x-(this.backfill.width/2), this.backfill.y); 
       this.border.setPosition(x,y);
    }
}