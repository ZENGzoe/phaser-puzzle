const play = {
    keyNum : 0, //用于识别人物或物件的唯一id
    resultObject : {
            'egg3.jpg' : '那些年你最爱的插卡游戏，\n如今还能与我大战三百回合吗？',
            'egg14.jpg' : '小时候你抢着要点我，现在\n你有多久没见过我啦？',
            'egg19.jpg' : '恭喜发财，红包拿来~',
            'egg0.jpg' : '随着我这个老古董一起消失的\n是你抖腿的童年啊～',
            'television.jpg' : '我一直在变，不变的是守在\n我跟前看春晚的一家人。',
            'article26.jpg' : '无论身在何方，一声铃响\n总有家人守在电话旁。',
            'article30.jpg' : '那些年我守护过热水的温度，\n也希望能替你守护家的温暖。',
            'article28.jpg' : '还记得那些年你趴在我面前\n听的宝贝磁带么？',
            'article29.jpg' : '童年的幸福总是来得很轻易，\n比如围着小太阳吃烤红薯。',
            'sofatable3.jpg' : '在外姿势拼演技，在家姿势\n比实力'
    },
    selectResultObject : ['television.png'],
    resultObjectKey : ['egg3.jpg','egg14.jpg','egg19.jpg','egg0.jpg','television.jpg','article26.jpg','article30.jpg','article28.jpg','article29.jpg','sofatable3.jpg'],
    fourContentPos : [
        {
            left : 325 ,
            top : 90
        },{
            left : 580,
            top : 90,
        },{
            left : 325,
            top:250
        },{
            left : 580,
            top:250
        }
    ],
    init : function(){
        this.gameWidthHf = customGame.width / 2;
        this.gameHeightHf = customGame.height / 2;
        this.gameWidth = customGame.width;
        this.gameHeight = customGame.height;

        this.judgePhone();
        this.bindEvent();
        this.bindScaleEvent();
    },
    bindScaleEvent : function(){
        this.isOnTarget = false;    //判断是否按了当前选中元素的缩放按钮
        this.onScaleTarget = null;      //选中元素
        this.objectscaleRate = null;        //通过滑动位置计算出得缩放倍数
        this.onScaleTargetValue = null;     //选中元素当前的缩放倍数

        customGame.input.addMoveCallback(function(e){
            if(!this.isOnTarget) return;

            const currentMoveX = arguments[1] == 0 ? 1 : arguments[1];
            const currentMoveY = arguments[2] == 0 ? 1 : arguments[2];

            if(!this.objectscaleRate){
                this.objectscaleRate = currentMoveX / currentMoveY;
                return;
            }
            const currentRate = currentMoveX / currentMoveY;
            //元素的缩放要以上一次缩放后的倍数被基础进行缩放
            let scaleRate = currentRate / this.objectscaleRate - 1 + this.onScaleTargetValue;
            scaleRate = scaleRate <= 0.25 ? 0.25 : scaleRate >=2 ? 2 : scaleRate;
            this.onScaleTarget.scale.set(scaleRate);

            const dashLine = this.selectWrap.bitmapDatas;
            const onScaleTarget = this.onScaleTarget;
            const scaleBtn = this.selectWrap.getChildAt(1);

            const offsetNum = 10 , 
                  width = onScaleTarget.width,
                  height = onScaleTarget.height, 
                  offsetX = -width/2 ,
                  offsetY = -height / 2,
                  boxWidth = width + 2*offsetNum , 
                  boxHeight = height + 2*offsetNum; 
            //元素需要缩放，编辑框只缩放尺寸，不缩放按钮和虚线实际大小，因此每次缩放都要重新绘制虚线框
            dashLine.clear(0,0,this.selectWrap.width , this.selectWrap.height);
            dashLine.resize(width + 2*offsetNum , height + 2*offsetNum)
            this.selectWrap.x = onScaleTarget.x + offsetX - offsetNum, 
            this.selectWrap.y = onScaleTarget.y + offsetY - offsetNum;
            scaleBtn.x = this.selectWrap.width - 30;

            dashLine.ctx.shadowColor = '#a93e26';
            dashLine.ctx.shadowBlur = 20;
            dashLine.ctx.shadowOffsetX = 0;
            dashLine.ctx.shadowOffsetY = 0;
            dashLine.ctx.beginPath();
            dashLine.ctx.lineWidth = 6;
            dashLine.ctx.strokeStyle = 'white';
            dashLine.ctx.setLineDash([12 , 12]);
            dashLine.ctx.moveTo(0,0);
            dashLine.ctx.lineTo(boxWidth , 0);
            dashLine.ctx.lineTo(boxWidth , boxHeight);
            dashLine.ctx.lineTo(0 , boxHeight);
            dashLine.ctx.lineTo(0,0);
            dashLine.ctx.stroke();
            dashLine.ctx.closePath();
        } , this);
        customGame.input.onUp.add(function(){
            this.isOnTarget = false;
            this.onScaleTarget = null;
            this.objectscaleRate = null;
            this.onScaleTargetValue = null;
        } , this);
    },
    bindEvent : function(){
        const _this = this;
        $('.J_popup.over .btn_iknow').click(() => {
            $('.J_popup').removeClass('over').hide();
        })
        $('.J_popup.over .close').click(() => {
            $('.J_popup').removeClass('over').hide();
        })
        $('.J_finish .replay').click(() => {
            customGame.renderer.resize(750, this.gameHeight);
            $('.J_finish').hide();
            $('.J_finish .result').css({ opacity : 0});
            $('.J_finish .btm').css({opacity : 0});
            $('.J_finish .load').show();
            _this.resultBottom.visible = false;
            _this.editGroup.visible = true;
        })
    },
    judgePhone : function(){
        // iPhone X、iPhone XS
        this.isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
        // iPhone XS Max
        this.isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
        // iPhone XR
        this.isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;

        this.isIPhoneXX = (this.isIPhoneX || this.isIPhoneXSMax || this.isIPhoneXR);
    },
    create : function(){
        if(this.editGroup) return;

         //编辑页
        this.createEditPage();
        this.showEditTab();

        customGame.physics.startSystem(Phaser.Physics.ARCADE);
    },
    showEditTab : function(){
        const tabHeight = this.isIPhoneXX ? 117 : 80;
        customGame.add.tween(this.editTabWrap).to({ y : this.gameHeight - tabHeight} , 400 , Phaser.Easing.Linear.None , true , 0 , 0 , false);
        customGame.add.tween(this.editContent).to({ y : this.gameHeight - 350 - tabHeight} , 400 , Phaser.Easing.Linear.None , true , 0 , 0 , false);
    },
    createEditPage : function(){
        this.mobilityGroup = customGame.add.group();    //用于存放游戏中的物件

        this.createWall();      //创建墙
        this.createTableSofa('sofatable1.png');     //创建沙发
        this.createTelevision('television1.png');   //创建电视机
        this.createEditWrap();          //创建编辑面板
    },    
    createWall : function(){
        const wall = customGame.add.sprite(0,this.gameHeightHf + 80,'wall1.png');

        wall.anchor.set(0 , 0.5);
        wall.name = 'wall';
        wall.inputEnabled = true;
        wall.events.onInputDown.add( this.deleteCurrentWrap , this);

        this.mobilityGroup.add(wall);
    },
    createTableSofa : function(spriteName){
        const tableSofa = customGame.add.sprite(this.gameWidthHf , this.gameHeightHf + 20, 'tableSofa' , spriteName );

        tableSofa.anchor.set(0.5,0.5);
        tableSofa.name = 'tableSofa';
        tableSofa.keyNum = this.keyNum++;

        this.bindObjectSelected(tableSofa);
        this.tableSofa = tableSofa;
        this.mobilityGroup.add(tableSofa);
    },
    bindObjectSelected : function(target){
        target.inputEnabled = true;
        target.input.enableDrag(false , true);
        //绘制编辑框
        target.events.onDragStart.add(this.objectSelected , this ); 
        target.events.onDragUpdate.add(this.objectDragUpdate , this );
    },
    createTelevision : function(spriteName){
        const televisionTop = this.isIPhoneXX ? 317 : 280;
        const television = customGame.add.sprite(this.gameWidthHf , this.gameHeight - televisionTop , 'television' , spriteName );

        television.anchor.set(0.5,0.5);
        television.name = 'television';
        television.keyNum = this.keyNum++;

        this.bindObjectSelected(television);
        this.television = television;
        this.mobilityGroup.add(television);
    },
    clickTableSofa : function(){
        this.deleteCurrentWrap();
        this.mobilityGroup.bringToTop(this.tableSofa);
    },
    deleteCurrentWrap : function(){
        this.selectWrap && this.selectWrap.destroy();
        this.selectWrap = null;
    },
    objectSelected : function(e, p){
        if(e.name == 'wall' || e.name == this.selectedObject) return;
        //如果点击的元素是当前选中元素，则不进行任何操作
        if(this.selectWrap && e.keyNum == this.selectWrap.keyNum) return;
        //去掉当前选中元素状态
        this.deleteCurrentWrap();

        const offsetNum = 10 , 
              width = e.width,
              height = e.height, 
              offsetX = -width/2 ,
              offsetY = -height / 2,
              boxWidth = width + 2*offsetNum , 
              boxHeight = height + 2*offsetNum; 
        
        const dashLine = customGame.add.bitmapData(width + 2*offsetNum , height + 2*offsetNum);
        const wrap = customGame.add.image(e.x + offsetX - offsetNum, e.y + offsetY - offsetNum, dashLine)
        wrap.name = 'wrap';
        wrap.keyNum = e.keyNum;

        //绘制虚线
        dashLine.ctx.shadowColor = '#a93e26';
        dashLine.ctx.shadowBlur = 20;
        dashLine.ctx.beginPath();
        dashLine.ctx.lineWidth = 6;
        dashLine.ctx.strokeStyle = 'white';
        dashLine.ctx.setLineDash([12 , 12]);
        dashLine.ctx.moveTo(0,0);
        dashLine.ctx.lineTo(boxWidth , 0);
        dashLine.ctx.lineTo(boxWidth , boxHeight);
        dashLine.ctx.lineTo(0 , boxHeight);
        dashLine.ctx.lineTo(0,0);
        dashLine.ctx.stroke();
        dashLine.ctx.closePath();
        wrap.bitmapDatas = dashLine;

        //删除按钮
        const close = customGame.add.sprite(- 27, -23,'objects','close.png');
        close.inputEnabled = true;
        close.events.onInputDown.add(this.deleteObject , this , null , e , e._frame.name);
        wrap.addChild(close);
        //放大按钮
        const scale = customGame.add.sprite(boxWidth - 27 , -23 , 'objects' , 'scale.png');
        scale.inputEnabled = true;
        scale.events.onInputDown.add(function(ev , pt){
            //判断用户是否要缩放元素
            this.isOnTarget = true;
            this.onScaleTarget = e;
            this.onScaleTargetValue = e.scale.x;
        } , this);
        
        wrap.addChild(scale);
        this.selectWrap = wrap;
    },
    deleteObject : function(e , p , target , key){
        if(target.key ==  'television'){
            this.television = null;
            this.tvGroup.getByName('selected').destroy();
        }else if(target.key == 'tableSofa'){
            this.tableSofa = null;
            this.tbSofaGroup.getByName('selected').destroy();
        }
        target.destroy();
    
        this.deleteCurrentWrap();
        this.removeDeleteObject(key);
    },
    createEditWrap : function(){
        this.editGroup = customGame.add.group();
        this.createNewyear();           //创建新年快乐框
        this.createEditContent();       //创建tab内容
        this.createEditTab();           //创建tab标题
        this.createFinishBtn();         //创建完成按钮

        this.editGroup.setAll('inputEnabled' , true);
    },
    createFinishBtn : function(){
        const finishBtnTop = this.isIPhoneXX ? this.gameHeight-779 : this.gameHeight -742;
        const finishBtn = customGame.add.sprite(this.gameWidth - 155, finishBtnTop, 'objects' , 'finish.png');

        finishBtn.inputEnabled = true;
        finishBtn.input.enableDrag();
        finishBtn.input.allowHorizontalDrag = false;
        finishBtn.input.allowVerticalDrag = true;
        finishBtn.input.dragDistanceThreshold = 10;
        finishBtn.events.onDragUpdate.add(this.isDragFinish , this);
        finishBtn.events.onInputUp.add(this.finishPuzzle , this);
        
        this.finishBtnTop = finishBtnTop + 150;
        this.finishBtn = finishBtn;
        this.editGroup.add(finishBtn);
    },
    isDragFinish : function(e){
        this.isDraggingFinishBtn = true;

        if(e.y <= 0){
            e.y = 0;
        }else if(e.y >= this.finishBtnTop){
            e.y = this.finishBtnTop;
        }
    },
    finishPuzzle : function(){
        if(this.isDraggingFinishBtn){
            this.isDraggingFinishBtn = false;
            return;
        }
        //显示结果页
        $('.J_finish').show();
        //删除编辑框
        this.deleteCurrentWrap();
        //隐藏选择元素面板
        this.editGroup.visible = false;
        //创建底部结果二维码等
        this.createResultBottom();
        //隐藏选择元素面板和创建底部结果二维码需要时间，需要间隔一段时候后再生成长图
        setTimeout(() => {
            this.uploadImage();
        } , 100);
    },
    uploadImage : function(){
        const dataUrl = customGame.canvas.toDataURL('image/jpeg' , 0.7);
        //todo 可以在此将图片上传到服务器再更新到结果页
        this.showResult(dataUrl);
    },
    showResult : function(src){
        $('.J_finish .result').attr('src' , src).css({ opacity : 1});
        $('.J_finish .btm').css({opacity : 1});
        $('.J_finish .load').hide();
    },
    createResultBottom : function(){
        const newyearHeight = this.isIPhoneXX ? 160 : 105;
        const extendHeight = newyearHeight + 80;
        
        customGame.renderer.resize(750, this.gameHeight + 285 - extendHeight);

        //创建底部结果
        const resultBottom = customGame.add.sprite( 0 , this.gameHeight - extendHeight , 'resultBottom');
        let result = this.selectResultObject.length == 0 ? this.resultObjectKey[Math.floor(Math.random() * this.resultObjectKey.length)]: this.selectResultObject[Math.floor(Math.random() * this.selectResultObject.length)];
        result = result.replace('png' , 'jpg');
        result = result.replace(/television[1234]{1}/ , 'television');
        const wd = this.resultObject[result];
        const resultObject = customGame.add.sprite(17 , 18 , 'resultObject' , result);
        const wdText = customGame.add.text(359 , 83 , wd , { font : '24px' , fill : '#754b44' , align : 'left' });
        wdText.anchor.set(0.5);

        resultBottom.addChild(resultObject);
        resultBottom.addChild(wdText);
        this.resultBottom = resultBottom;
    },
    createNewyear : function(){
        const isIPhoneXX = this.isIPhoneXX;
        const editHeight = isIPhoneXX ? 260 : 170,
              newYearTop = isIPhoneXX ? 40 : 12,
              newYearHeight = isIPhoneXX ? 160 : 105;
        const newYearWrap = customGame.add.graphics(0 , this.gameHeight - editHeight);
        const newYear = customGame.add.sprite(this.gameWidthHf , newYearTop , 'objects' , 'newyear.png');

        newYear.anchor.set(0.5 , 0);
        newYearWrap.beginFill(0xFFFFFF);
        newYearWrap.drawRect(0,0,this.gameWidth , newYearHeight);
        newYearWrap.addChild(newYear);
        newYearWrap.visible = false;

        this.editGroup.add(newYearWrap);
        this.newYearWrap = newYearWrap;
    },
    createEditTab : function(){
        const editTabTop = this.isIPhoneXX ?  117 : 80;
              
        const editTabWrap = customGame.add.sprite(0, this.gameHeight + 350 , 'objects' , 'wrap.png'),
              editTabWrapGroup = customGame.add.group(editTabWrap),
              selected = customGame.add.sprite(0 , -21 , 'objects' , 'selected.png'),
              furniture = customGame.add.sprite(40 , 15 , 'objects' , 'furniture.png'),
              post = customGame.add.sprite(545 , 15 , 'objects' , 'post.png'),
              object = customGame.add.sprite(224 , 15 , 'objects' , 'object.png'),
              egg = customGame.add.sprite(380 , 15 , 'objects' , 'egg.png'),
              arrow = customGame.add.sprite(684.5 , 47.5 , 'objects' , 'arrow.png'),
              arrowWrap = customGame.add.graphics();
        
        arrowWrap.beginFill(0xffffff);
        arrowWrap.drawRect(660,0,90,80);
        arrowWrap.alpha = 0;
        arrowWrap.name = 'arrowWrap';
        selected.name = 'tabSelected';
        furniture.name = 'furniture';
        post.name = 'post';
        object.name = 'object';
        egg.name = 'egg';
        
        arrow.anchor.set(0.5);
        editTabWrapGroup.addMultiple([selected,furniture,post,object,egg,arrow,arrowWrap]);
        editTabWrapGroup.setAll('inputEnabled' , true);
        editTabWrapGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.handleEditTabClick , this);

        this.editGroup.add(editTabWrap);
        this.editTabWrap = editTabWrap;
        this.editArrow = arrow;
        this.editTabWrapGroup = editTabWrapGroup;
    },
    handleEditTabClick : function(e){
        const target = e.name || '';
        let selectedLeft = 0;

        if(target == '' || target == 'tabSelected'){
            return;
        }

        if(target == 'arrowWrap'){
            this.dealEditContent();
            return;
        }

        switch(target){
            case 'furniture' :
                this.furnitureContent.visible = true;
                this.postContent && (this.postContent.visible = false);
                this.articleContent && (this.articleContent.visible = false);
                this.eggContent && (this.eggContent.visible = false);
                selectedLeft = 0;
                break ;
            case 'post' :
                this.furnitureContent.visible = false;
                if(this.postContent){
                    this.postContent.visible = true;
                }else{
                    this.createPostContent();
                }
                this.articleContent && (this.articleContent.visible = false);
                this.eggContent && (this.eggContent.visible = false);
                selectedLeft = 485;
                break;
            case 'object' :
                this.furnitureContent.visible = false;
                this.postContent && (this.postContent.visible = false);
                if(this.articleContent){
                    this.articleContent.visible = true;
                }else{
                    this.createArticleContent();
                }
                this.eggContent && (this.eggContent.visible = false);
                selectedLeft = 165;
                break;
            case 'egg' :
                this.furnitureContent.visible = false;
                this.postContent && (this.postContent.visible = false);
                this.articleContent && (this.articleContent.visible = false);
                if(this.eggContent){
                    this.eggContent.visible = true;
                }else{
                    this.createEggContent();
                }
                selectedLeft = 323;
                break;
        }
        this.editTabWrapGroup.getByName('tabSelected').x = selectedLeft;
        this.showEditContent();
    },
    dealEditContent : function(){
        if(this.editContent.visible){
            this.hideEditContent();
            return;
        }
        this.showEditContent();
    },
    showEditContent : function(){
        const isIPhoneXX = this.isIPhoneXX;
        this.editContent.visible = true;
        this.newYearWrap.visible = true;
        this.editTabWrap.y = isIPhoneXX ? this.gameHeight - 117 : this.gameHeight - 80;
        customGame.add.tween(this.editArrow).to({ angle : 0 } , 100 , Phaser.Easing.Linear.None , true , 0 ,0 );
    },
    hideEditContent : function(){
        const isIPhoneXX = this.isIPhoneXX;
        const editTabTop = isIPhoneXX ? 117 : 80,
              finishBtnTop = isIPhoneXX ? 212 : 122;

        this.editContent.visible = false;
        this.newYearWrap.visible = true;
        this.editTabWrap.y = this.gameHeight - editTabTop;
        customGame.add.tween(this.editArrow).to({ angle : 180 } , 100 , Phaser.Easing.Linear.None , true , 0 ,0 );
    },
    createEditContent : function(){
        const maskHeight = this.isIPhoneXX ? (this.gameHeight - 467) : (this.gameHeight - 430);
        const editContent = customGame.add.graphics(0 , this.gameHeight); 
        //遮罩
        const mask = customGame.add.graphics(0, maskHeight);    
        mask.beginFill(0x000000);
        mask.drawRect(0,0,this.gameWidth , 467); 
        //tab内容背景
        editContent.beginFill(0xffffff);
        editContent.drawRect(0,0,this.gameWidth , 350);
        editContent.mask = mask;

        this.editGroup.add(editContent);
        this.editContent = editContent;

        this.createFurnitureContent();
    },
    createEggContent : function(){
        const eggContent = customGame.add.group(this.editContent);
        const eggSpriteSheet = {
            number : 26,
            info : [
                {name : 'egg1' , spriteSheetName : 'egg' , number : 11 , startNum : 0},
                {name : 'egg2' , spriteSheetName : 'egg' , number :  15, startNum : 11},
            ]
        };

        const specialSize = {
            'egg0.png' : 0.25,
            'egg1.png' : 0.3,
            'egg2.png' : 0.3,
            'egg4.png' : 0.7,
            'egg5.png' : 0.7,
            'egg6.png' : 0.7,
            'egg7.png' : 0.4,
            'egg8.png' : 0.35,
            'egg9.png' : 0.4,
            'egg10.png' : 0.4,
            'egg11.png' : 0.4,
            'egg12.png' : 0.3,
            'egg13.png' : 0.7,
            'egg16.png' : 0.55,
            'egg17.png' : 0.55,
            'egg18.png' : 0.6,
            'egg19.png' : 0.6,
            'egg20.png' : 0.4,
        };

        this.createEditListDetail(eggSpriteSheet , 0.5 , eggContent , 123 , 145 , 48 , 50 , 60 , 50 , 0 , 750 , specialSize , 4);
        this.addScrollHandler(eggContent);  
        this.eggContent = eggContent;
    },
    createArticleContent : function(){
        const articleContent = customGame.add.group(this.editContent);

        const articleSpriteSheet = {
            number : 46,
            info : [
                {name : 'article1' , spriteSheetName : 'article' , number : 11 , startNum : 0},
                {name : 'article2' , spriteSheetName : 'article' , number : 15 , startNum : 11},
                {name : 'article3' , spriteSheetName : 'article' , number : 11 , startNum : 26},
                {name : 'article4' , spriteSheetName : 'article' , number : 9 , startNum : 37},
            ]
        };

        const specialSize = {
            'article1.png' : 0.35,
            'article2.png' : 0.35,
            'article3.png' : 0.33,
            'article8.png' : 0.35,
            'article12.png' : 0.6,
            'article13.png' : 0.5,
            'article14.png' : 0.5,
            'article16.png' : 0.5,
            'article19.png' : 0.5,
            'article21.png' : 0.5,
            'article22.png' : 0.5,
            'article23.png' : 0.5,
            'article24.png' : 0.3,
            'article25.png' : 0.3,
            'article26.png' : 0.5,
            'article27.png' : 0.3,
            'article28.png' : 0.3,
            'article29.png' : 0.3,
            'article30.png' : 0.5,
            'article31.png' : 0.45,
            'article32.png' : 0.5,
            'article33.png' : 0.5,
            'article35.png' : 0.3,
            'article36.png' : 0.5,
            'article38.png' : 0.25,
            'article39.png' : 0.25,
            'article40.png' : 0.4,
            'article41.png' : 0.4,
            'article42.png' : 0.45,
            'article43.png' : 0.4,
            'article44.png' : 0.5,
            'article45.png' : 0.5
        }

        this.createEditListDetail(articleSpriteSheet , 0.4 , articleContent , 123 , 145 , 48 , 80 , 60 , 53 , 0 , 750 , specialSize , 4);
        this.addScrollHandler(articleContent);
        this.articleContent = articleContent;
    },
    createPostContent : function(){
        const postContent = customGame.add.group(this.editContent);
        
        //左侧背景
        const leftTab = customGame.add.graphics(0,0);
        const leftTabGroup = customGame.add.group(leftTab)
        leftTab.beginFill(0xfff7e0);
        leftTab.drawRect(0,0,155 , 350);

        //左侧选中背景
        const selected = customGame.add.graphics(0,0);
        selected.beginFill(0xffffff);
        selected.drawRect(0,0,155,70);
        selected.name = 'selected';
        
        //左侧文字
        const text = customGame.add.text(155/2 , 23 , "站姿\n坐姿\n瘫姿\n不可描述" , {font : "24px" , fill : "#a55344" , align : "center"});
        text.lineSpacing = 35;
        text.anchor.set(0.5 , 0);

        //左侧文字区域
        this.createLeftBarSpan(4 ,leftTabGroup );

        //左侧切换事件
        leftTabGroup.setAll('inputEnabled' , true);
        leftTabGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.switchPost , this);

        //右侧sprite合集
        const standSpriteSheet = {
            number : 12,
            info : [
                { name : 'stand' , spriteSheetName : 'stand' , number : 8 , startNum : 0} , 
                { name : 'stand2' , spriteSheetName : 'stand' , number : 4 , startNum : 8}
            ]
        };
        const sitSpriteSheet = { name : 'sit', spriteSheetName : 'sit' , number : 12};
        const stallSpriteSheet = { name : 'stall' , spriteSheetName : 'stall' , number : 13};
        const indescribeSpriteSheet = { name : 'indescribe' , spriteSheetName : 'indescribe' , number : 12};

        // 右侧合集
        const standGroup = customGame.add.group();
        const sitGroup = customGame.add.group();
        const stallGroup = customGame.add.group();
        const indescribeGroup = customGame.add.group();

        //右侧生成
        const stallSpecialSize = {
            'stall0.png' : 0.35,
            'stall9.png' : 0.35,
            'stall12.png' : 0.8
        };
        const standSpecialSize = {
            'stand8.png' : 0.6,
            'stand9.png' : 0.6,
            'stand10.png' : 0.6,
            'stand11.png' : 0.6,
        }  
        this.createEditListDetail(standSpriteSheet , 0.37 , standGroup , 105 , 220 , 25 , 20 , 40 , 17 , 160 , 590 , standSpecialSize , 4);
        this.createEditListDetail(sitSpriteSheet , 0.42 , sitGroup , 105 , 220, 25 , 20, 40 , 17, 160 , 590 , null , 4);
        this.createEditListDetail(stallSpriteSheet , 0.4 , stallGroup , 170 , 194, 25 , 15, 33 , 30, 160, 590 , stallSpecialSize , 3);
        this.createEditListDetail(indescribeSpriteSheet , 0.4 , indescribeGroup , 105 , 220, 25 , 20, 40 , 17, 160 , 590 , null , 4);

        //右侧添加滑动事件
        this.addScrollHandler(standGroup);
        this.addScrollHandler(sitGroup);
        this.addScrollHandler(stallGroup);
        this.addScrollHandler(indescribeGroup);

        leftTabGroup.addMultiple([selected,text]);
        postContent.addMultiple([leftTab,sitGroup,standGroup,stallGroup,indescribeGroup])

        this.postContent = postContent;
        this.postLeftTab = leftTabGroup;
        this.sitGroup = sitGroup;
        this.standGroup = standGroup;
        this.stallGroup = stallGroup;
        this.indescribeGroup = indescribeGroup;

        this.standGroup.visible = true;
        this.sitGroup.visible = false;
        this.stallGroup.visible = false;
        this.indescribeGroup.visible = false;
    },
    switchPost : function(e){
        const item = e.name || '';
        if(!item) return;

        let selectedTop = 0;

        switch(item){
            case 'text0' :
                selectedTop = 0;
                this.standGroup.visible = true;
                this.sitGroup.visible = false;
                this.stallGroup.visible = false;
                this.indescribeGroup.visible = false;
                break;
            case 'text1' :
                selectedTop = 70;
                this.standGroup.visible = false;
                this.sitGroup.visible = true;
                this.stallGroup.visible = false;
                this.indescribeGroup.visible = false;
                break;
            case 'text2' :
                selectedTop = 140;
                this.standGroup.visible = false;
                this.sitGroup.visible = false;
                this.stallGroup.visible = true;
                this.indescribeGroup.visible = false;
                break;
            case 'text3' :
                selectedTop = 210;
                this.standGroup.visible = false;
                this.sitGroup.visible = false;
                this.stallGroup.visible = false;
                this.indescribeGroup.visible = true;
        }
       this.postLeftTab.getByName('selected').y = selectedTop;
    },
    /**
     * 
     * @param {*} spriteSheet  spriteSheet雪碧图信息
     * @param {*} scaleRate    图像显示的缩放
     * @param {*} group        新建图像存放的组
     * @param {*} spriteWidth  图像显示区域尺寸的宽度
     * @param {*} spriteHeight 图像显示区域尺寸的高度
     * @param {*} verticalW     图像显示区域的横向间距
     * @param {*} horizentalH   图像显示区域的纵向间距
     * @param {*} startX        整块图像区域的x偏移量
     * @param {*} startY        整块图像区域的y偏移量
     * @param {*} groupleft     左侧tab的宽度
     * @param {*} groupWidth    整块区域的宽度
     * @param {*} specialSize   特殊元素的缩放尺寸，由于元素的尺寸缩放标准不一，因此需要设置特殊元素的缩放尺寸
     * @param {*} verticalNum   列项数量
     */
    createEditListDetail : function(spriteSheet , scaleRate , group , spriteWidth , spriteHeight , verticalW , horizentalH , startX , startY , groupleft ,groupWidth , specialSize , verticalNum){
        let { name , spriteSheetName , number } = spriteSheet; 
        const hv = number % verticalNum == 0 ? number : number + (verticalNum-number%verticalNum);
        const box = customGame.add.graphics(groupleft,0,group);
        box.beginFill(0xffffff);
        box.drawRect(0,0,groupWidth,startY + (spriteHeight + horizentalH) * parseInt(hv/verticalNum) + horizentalH);        
        box.name = 'box';

        //由于元素的体积过大，部分元素集不能都合并成一张雪碧图，因此需要区分合并成一张和多张都情况
        if(spriteSheet.info){
            let i = 0;
            spriteSheet.info.map((item , index) => {
                let { name , spriteSheetName , number} = item;
                for(let j = 0 ; j < number ; j++){
                    createOne(i, name , spriteSheetName);
                    i++;
                }
            })
        }else{
            for(let i = 0 ;  i < number ; i++ ){
                createOne(i, name , spriteSheetName)
            }
        }
        
        function createOne(i , name , spriteSheetName){
            const x = startX + (spriteWidth+verticalW) * (i%verticalNum) + spriteWidth/2,
                  y = startY + (spriteHeight + horizentalH) * parseInt(i/verticalNum) + spriteHeight/2;  
            const item = customGame.add.sprite(x , y , name , `${spriteSheetName}${i}.png`);

            let realScaleRate = scaleRate;

            if(spriteWidth/item.width >= 1.19){
                realScaleRate = 1;
            }
            if(specialSize && specialSize[`${spriteSheetName}${i}.png`]){
                realScaleRate = specialSize[`${spriteSheetName}${i}.png`];
            }
            item.anchor.set(0.5);
            item.scale.set(realScaleRate);
            item.inputEnabled = true;
            box.addChild(item);
            
            const wrapData = {
                minX : x - spriteWidth/2,
                maxX : x + spriteWidth/2,
                minY : y - spriteHeight/2,
                maxY : y + spriteHeight/2
            }
            
            if(box.wrapData){
                box.wrapData.push(wrapData);
            }else{
                box.wrapData = [wrapData];
            }
        }

    },
    addScrollHandler : function(target){
        let isDrag = false; //判断是否滑动的标识
        let startY , endY , startTime , endTime;
        const box = target.getByName('box');
        box.inputEnabled = true;
        box.input.enableDrag();
        box.input.allowHorizontalDrag = false;  //禁止横向滑动
        box.input.allowVerticalDrag = true;     //允许纵向滑动
        box.ignoreChildInput = true;            //忽略子元素事件
        box.input.dragDistanceThreshold = 10;       //滑动阈值
        //允许滑动到底部的最高值
        const maxBoxY = -(box.height - 350);       
        //给父元素添加物理引擎
        customGame.physics.arcade.enable(box);

        box.events.onDragUpdate.add(function(){
            //滑到顶部，禁止继续往下滑
            if(box.y > 100){
                box.y = 100;
            }else if(box.y < maxBoxY - 100){
                //滑到底部，禁止继续往上滑
                box.y = maxBoxY - 100;
            }
            endY = arguments[3];
            endTime = +new Date();
        } , this);
        box.events.onDragStart.add(function(){
            console.log('start')
            isDrag = true;
            startY = arguments[3];
            startTime = +new Date();
            if(this.currentScrollBox){
                //如果当前有其他正在滑动的元素，取消滑动
                this.currentScrollBox.body.velocity.y = 0;
                this.currentScrollBox = null;
            }
            
        } , this);
        box.events.onDragStop.add(function(){
            console.log('stop')
            isDrag = false;
            //指定可以点击滑动的区域
            box.hitArea = new Phaser.Rectangle(0,-box.y,box.width,box.height + box.y);
            //向下滑动到极限，给极限到最值位置动画
            if(box.y > 0){
                box.hitArea = new Phaser.Rectangle(0, 0 , box.width , box.height);
                customGame.add.tween(box).to({ y : 0} , 100 , Phaser.Easing.Linear.None, true , 0 , 0);
                return;
            }
            //向上滑动到极限，给极限到最值位置动画
            if(box.y < maxBoxY){
                box.hitArea = new Phaser.Rectangle(0, -maxBoxY , box.width , box.height - maxBoxY);
                customGame.add.tween(box).to({ y : maxBoxY} , 100 , Phaser.Easing.Linear.None , true , 0, 0);
                return;
            }
            //模拟滑动停止父元素仍滑动到停止的惯性
            //根据用户的滑动距离和滑动事件计算元素的惯性滑动速度
            const velocity = (Math.abs(Math.abs(endY) - Math.abs(startY)) / (endTime - startTime)) * 40;
            //scrollFlag标识父元素是向上滑动还是向下滑动
            if(endY > startY){// 向下
                box.body.velocity.y = velocity;
                box.scrollFlag = 'down';
            }else if(endY < startY){ //向上
                box.body.velocity.y = -velocity;
                box.scrollFlag = 'up';
            }   
            this.currentScrollBox = box;         
        } , this);
        box.events.onInputUp.add(function(e , p ){
            console.log('up')
            if(isDrag) return;

            const curX = p.position.x - e.previousPosition.x;
            const curY = p.position.y - e.previousPosition.y;
            //根据点击区域，判断用户点击的是哪个元素
            const idx = e.wrapData.findIndex((val , index , arr) => {
                return curX >= val.minX && curX <= val.maxX && curY >= val.minY && curY <= val.maxY;
            })
            if(idx == -1) return;
            const children = e.children[idx];
            //添加新元素到画面
            this.addNewMobilityObject(children.key , children._frame.name);
        } , this);
    },
    addNewMobilityObject : function(key , name){
        const resultObject = ['egg3.png' , 'egg14.png' , 'egg19.png' , 'egg0.png' , 'article26.png' , 'article30.png' , 'article28.png','article29.png'];

        if(resultObject.indexOf(name) !== -1){
            this.selectResultObject.push(name);
        }

        //默认新元素的位置在屏幕居中位置取随机值
        const randomPos = 30 * Math.random();
        const posX = Math.random() > 0.5 ? this.gameWidthHf + randomPos : this.gameWidthHf - randomPos;
        const posY = Math.random() > 0.5 ? this.gameHeightHf + randomPos : this.gameHeightHf - randomPos;
        const newOne = customGame.add.sprite(posX , posY , key , name);

        newOne.anchor.set(0.5);
        newOne.keyNum = this.keyNum++;

        this.mobilityGroup.add(newOne);
        //绑定选中元素
        this.bindObjectSelected(newOne);
        //让新建元素成为当前选中元素
        this.objectSelected(newOne);
    },
    objectDragUpdate : function(target){
        if(!this.selectWrap) return;
        const width = target.width;
        const height = target.height;
        const offsetX = -width/2 ;
        const offsetY = -height / 2;
        const offsetNum = 10;

        this.selectWrap.x = target.x + offsetX - offsetNum, 
        this.selectWrap.y = target.y + offsetY - offsetNum
    },
    createLeftBarSpan : function(num , group){
        for(let i = 0 ; i < num ; i++){
            const item = customGame.add.graphics(0,0);
            item.beginFill(0x000000);
            item.drawRect(0,70*i , 155 , 74);
            item.alpha = 0;
            item.name = `text${i}`;
            group.add(item);
        }
    },
    createFurnitureContent : function(){
        const furnitureContent = customGame.add.group(this.editContent);
        const leftTab = customGame.add.graphics(0,0);
        const leftTabGroup = customGame.add.group(leftTab);
        const selected = customGame.add.graphics(0,0);
        const textStyle = { font : "24px" , fill : "#a55344" , align : "center"};
        const text = customGame.add.text(155/2 , 23 , "电视\n桌子&沙发\n墙面&地板" , textStyle);

        //左侧文字
        text.lineSpacing = 35;
        text.anchor.set(0.5 ,0);

        //左侧背景和选中背景
        leftTab.beginFill(0xfff7e0);
        leftTab.drawRect(0,0,155 , 350);
        selected.beginFill(0xffffff);
        selected.drawRect(0,0,155,70);
        selected.name = 'selected';

        furnitureContent.add(leftTab);
        leftTabGroup.addMultiple([selected,text]);

        this.createLeftBarSpan(3 ,leftTabGroup );
        
        //右侧内容
        const tvSpriteSheet = ['television1.png','television2.png','television3.png','television4.png'],
              tableSofaSheet = ['sofatable1.png','sofatable2.png','sofatable3.png','sofatable4.png'],
              walls = ['wall1.png' , 'wall2.png' , 'wall3.png' , 'wall4.png'];

        const tvGroup = customGame.add.group(),
              tbSofaGroup = customGame.add.group(),
              wallGroup = customGame.add.group();

        this.createFourContent('television',tvSpriteSheet , tvGroup , 143);
        this.createFourContent('tableSofa' , tableSofaSheet , tbSofaGroup , 158);
        this.createFourContent('wall' ,walls , wallGroup, 169);

        tvGroup.setAll('inputEnabled' , true);
        tvGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.changeFurnitureDetail , this , null , /television(\d)\.png/, tvGroup , 'television' , 1 );
        tbSofaGroup.setAll('inputEnabled' , true);
        tbSofaGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.changeFurnitureDetail , this , null , /sofatable(\d)\.png/ , tbSofaGroup , 'tableSofa' , 1 );
        wallGroup.setAll('inputEnabled' , true);
        wallGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.changeFurnitureDetail , this , null , /wall(\d)\.png/ , wallGroup , 'wall' , null);

        furnitureContent.add(tvGroup);
        furnitureContent.add(tbSofaGroup);
        furnitureContent.add(wallGroup);

        tbSofaGroup.visible = false;
        wallGroup.visible = false;

        leftTabGroup.setAll('inputEnabled' , true);
        leftTabGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.switchFurniture , this);

        this.furnitureLeftTab = leftTabGroup;
        this.furnitureContent = furnitureContent;
        this.tvGroup = tvGroup;
        this.tbSofaGroup = tbSofaGroup;
        this.wallGroup = wallGroup;
    },
    changeFurnitureDetail : function(e , p ,reg , group , element ,type){
        const mobilityGroup = this.mobilityGroup;
        const target = e._frame;
        if(!target || target.name == 'ctSelected.png') return;

        const num = target.name.match(reg)[1],
              {left , top} = this.fourContentPos[num - 1];
        let selected = group.getByName('selected');
        
        if(!selected){
            selected = customGame.add.sprite(left , top , 'objects' , 'ctSelected.png');
            selected.anchor.set(0.5);
            selected.name = 'selected';
            group.add(selected);
        }
        
        selected.x = left;
        selected.y = top;

        if(type !== 1){
            mobilityGroup.getByName(element).loadTexture(target.name);
            return;
        }

        if(target.name == 'sofatable3.png'){
            this.selectResultObject.push(target.name);
        }else if(/sofatable/.test(target.name)){
            this.removeDeleteObject('sofatable3.png');
        }
        if(mobilityGroup.getByName(element)){
            mobilityGroup.getByName(element).frameName = target.name;
            mobilityGroup.getByName(element).keyNum = this.keyNum++;
        }else{
            if(element == 'television'){
                this.createTelevision(target.name);
                this.selectResultObject.push(target.name);
            }else{
                this.createTableSofa(target.name);
            }
        }
        
        this.objectSelected(mobilityGroup.getByName(element)); 
        
    },
    removeDeleteObject : function(name){
        name = name.replace(/television[1234]{1}/ , 'television');
        const idx = this.selectResultObject.indexOf(name);

        if(idx == -1) return;
        this.selectResultObject.splice(idx,1);
    },
    switchFurniture : function(e){
        const item = e.name || '';
        if(!item) return;

        let selectedTop = 0;

        switch(item){
            case 'text0' :
                selectedTop = 0;
                this.tvGroup.visible = true;
                this.tbSofaGroup.visible = false;
                this.wallGroup.visible = false;
                break;
            case 'text1' :
                selectedTop = 70;
                this.tvGroup.visible = false;
                this.tbSofaGroup.visible = true;
                this.wallGroup.visible = false;
                break;
            case 'text2' :
                selectedTop = 140;
                this.tvGroup.visible = false;
                this.tbSofaGroup.visible = false;
                this.wallGroup.visible = true;
                break;
        }
       this.furnitureLeftTab.getByName('selected').y = selectedTop;
    },
    createFourContent : function(spriteName,spriteSheet , groupWrap , width){
        const pos = this.fourContentPos;
        spriteSheet.map((sprite , index) => {
            const {left , top} = pos[index];
            const item = spriteName ? customGame.add.sprite(left , top ,spriteName , sprite) : customGame.add.sprite(left , top ,sprite);
            item.anchor.set(0.5);
            item.scale.set(width / item.width);
            groupWrap.add(item);
        })

        const selectedItem = customGame.add.sprite(pos[0].left , pos[0].top , 'objects' , 'ctSelected.png');
        selectedItem.anchor.set(0.5);
        selectedItem.name = 'selected';
        groupWrap.add(selectedItem);
    },
    dealScrollObject : function(){
        if(this.currentScrollBox && this.currentScrollBox.body.velocity.y !== 0){
            const currentScrollBox = this.currentScrollBox,
                  height = currentScrollBox.height,
                  width = currentScrollBox.width;

            const maxBoxY = -(height - 350);
            if(currentScrollBox.y > 0){
                currentScrollBox.hitArea = new Phaser.Rectangle(0, 0 , width , height);
                customGame.add.tween(currentScrollBox).to({ y : 0} , 100 , Phaser.Easing.Linear.None, true , 0 , 0);
                currentScrollBox.body.velocity.y = 0;
                return;
            }
            if(currentScrollBox.y < maxBoxY){
                currentScrollBox.hitArea = new Phaser.Rectangle(0, -maxBoxY , width , height - maxBoxY);
                customGame.add.tween(currentScrollBox).to({ y : maxBoxY} , 100 , Phaser.Easing.Linear.None , true , 0, 0);
                currentScrollBox.body.velocity.y = 0;
                return;
            }
            currentScrollBox.hitArea = new Phaser.Rectangle(0,-currentScrollBox.y,width,height + currentScrollBox.y);
            if(currentScrollBox.scrollFlag == 'up'){
                currentScrollBox.body.velocity.y += 1.5;
                if(currentScrollBox.body.velocity.y >= 0){
                    currentScrollBox.body.velocity.y = 0;
                }
            }else if(currentScrollBox.scrollFlag == 'down'){
                currentScrollBox.body.velocity.y -= 1.5;
                if(currentScrollBox.body.velocity.y <= 0){
                    currentScrollBox.body.velocity.y = 0;
                }
            }
        }
    },
    update() {
        this.editGroup && customGame.world.bringToTop(this.editGroup);
        this.editTabWrapGroup && customGame.world.bringToTop(this.editTabWrapGroup);
        this.editTabWrap && customGame.world.bringToTop(this.editTabWrap);
        this.resultBottom && customGame.world.bringToTop(this.resultBottom);
        this.selectWrap && customGame.world.moveDown(this.selectWrap);
        this.mobilityGroup && customGame.world.moveDown(this.mobilityGroup);
        this.bottomObjectGroup && customGame.world.moveDown(this.bottomObjectGroup); 

        this.dealScrollObject();
    },
}

module.exports = play;