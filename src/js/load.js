
const load = {
    init : function(){
        customGame.stage.backgroundColor = '#4f382b';
        customGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.tvshowJson = require('../json/tvshow.json');
        this.objectsJson = require('../json/objects.json');
        this.televisionJson = require('../json/television.json');
        this.tableSofaJson = require('../json/tableSofa.json');
        this.wallJson = require('../json/wall.json');
        this.sitJson = require('../json/sit.json');
        this.standJson = require('../json/stand.json');
        this.standJson2 = require('../json/stand2.json');
        this.stallJson = require('../json/stall.json');
        this.indescribeJson = require('../json/indescribe.json');
        this.articleJson1 = require('../json/article1.json');
        this.articleJson2 = require('../json/article2.json');
        this.articleJson3 = require('../json/article3.json');
        this.articleJson4 = require('../json/article4.json');
        this.eggJson1 = require('../json/egg1.json');
        this.eggJson2 = require('../json/egg2.json');
        this.resultObjectJson = require('../json/resultObject.json');
    },
    preload : function(){
        customGame.load.onFileComplete.add(this.loadProgress , this);
        customGame.load.onLoadComplete.addOnce(this.loadComplete , this);

        this.loadResources();
    },
    loadResources : function(){
        customGame.load.crossOrigin = 'anonymous';
  
        customGame.load.image('popup' , 'dist/img/sprite.popup.png');
        customGame.load.image('startBg' , 'dist/img/startBg.jpg');
        customGame.load.image('startBtn' , 'dist/img/startBtn.png');
        customGame.load.image('startTitle' , 'dist/img/startTitle.png');
        customGame.load.image('startTV' , 'dist/img/startTV.png');
        customGame.load.image('startFamily' , 'dist/img/startFamily.png');
        customGame.load.image('startTVLight' , 'dist/img/startTVLight.png');
        customGame.load.image('tvfamily' , 'dist/img/tvfamily.jpg');
        customGame.load.image('wall1.png' , 'dist/img/wall1.jpg');
        customGame.load.image('wall2.png' , 'dist/img/wall2.jpg');
        customGame.load.image('wall3.png' , 'dist/img/wall3.jpg');
        customGame.load.image('wall4.png' , 'dist/img/wall4.jpg');
        customGame.load.image('white' , 'dist/img/white.jpg');
        customGame.load.image('orange' , 'dist/img/orange.jpg');
        customGame.load.image('resultBottom' , "https://img30.360buyimg.com/cms/jfs/t1/8466/13/12879/22390/5c3c451cE591c483e/00627c32d7a9d7b8.jpg");
        customGame.load.image('resultObject1' , 'dist/img/resultObject1.png');
        customGame.load.image('upload_loading' , 'dist/img/upload_loading.gif');
        customGame.load.atlasJSONHash('tvshow' , 'dist/img/tvshow.png' , '' , this.tvshowJson);
        customGame.load.atlasJSONHash('objects' , 'dist/img/objects.png' , '' , this.objectsJson);
        customGame.load.atlasJSONHash('television' , 'dist/img/television.png' , '' , this.televisionJson);
        customGame.load.atlasJSONHash('tableSofa' , 'dist/img/tableSofa.png' , '' , this.tableSofaJson);
        customGame.load.atlasJSONHash('wall' , 'dist/img/wall.png' , '' , this.wallJson);
        customGame.load.atlasJSONHash('sit' , 'dist/img/sit.png' , '' , this.sitJson);
        customGame.load.atlasJSONHash('stand' , 'dist/img/stand.png' , '' , this.standJson);
        customGame.load.atlasJSONHash('stand2' , 'dist/img/stand2.png' , '' , this.standJson2);
        customGame.load.atlasJSONHash('stall' , 'dist/img/stall.png' , '' , this.stallJson);
        customGame.load.atlasJSONHash('indescribe' , 'dist/img/indescribe.png' , '' , this.indescribeJson);
        customGame.load.atlasJSONHash('article1' , 'dist/img/article1.png' , '' , this.articleJson1);
        customGame.load.atlasJSONHash('article2' , 'dist/img/article2.png' , '' , this.articleJson2);
        customGame.load.atlasJSONHash('article3' , 'dist/img/article3.png' , '' , this.articleJson3);
        customGame.load.atlasJSONHash('article4' , 'dist/img/article4.png' , '' , this.articleJson4);
        customGame.load.atlasJSONHash('egg1' , 'dist/img/egg1.png' , '' , this.eggJson1);
        customGame.load.atlasJSONHash('egg2' , 'dist/img/egg2.png' , '' , this.eggJson2);
        customGame.load.atlasJSONHash('resultObject' , 'dist/img/resultObject.png' , '' , this.resultObjectJson);
    },
    loadProgress : function(progress){
        $('.J_loading .progress').text(`${progress}%`)
    },
    loadComplete : function(){
        customGame.state.start('Play');
        $('.J_loading').hide();
    },
    create : function(){

    }
}

module.exports = load;