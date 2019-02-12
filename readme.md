# 如何用Phaser实现一个全家福拼图h5

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/02.jpg)


[一、Phaser介绍](#一、Phaser介绍) 
[二、整体框架搭建](#二、整体框架搭建) 
[三、资源加载](#三、资源加载) 
[四、游戏逻辑](#四、游戏逻辑)
[五、完成](#五、完成)
[六、总结](#六、总结)
[参考文档](#参考文档)

最近用Phaser做了一个全家福拼图h5的项目，这篇文章将会从零开始讲解如何用Phaser实现，最终效果如下：

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/01.gif)

<br/>

[源码：https://github.com/ZENGzoe/phaser-puzzle.git](https://github.com/ZENGzoe/phaser-puzzle.git)
[demo：https://zengzoe.github.io/phaser-puzzle/dist/](https://zengzoe.github.io/phaser-puzzle/dist/)
![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/07.png)

# 一、Phaser介绍

Phaser是一个开源的HTML5游戏框架，支持桌面和移动HTML5游戏，支持Canvas和WebGL渲染。官方文档齐全，上手也比较容易。

Phaser的功能主要还有预加载、物理引擎、图片精灵、群组、动画等。

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/03.png)

更多详细内容可以查看[Phaser官网](https://phaser.io)，我的学习过程是主要是边看[Phaser案例](https://phaser.io/examples)的实现，边看[API文档](https://www.phaser-china.com/docs/Index.html)查看用法。


# 二、整体框架搭建

#### 1.目录结构

目录初始结构如下:

```
.
├── package.json            
├── postcss.config.js           //postcss配置
├── src                         //主要代码目录
│   ├── css
│   ├── img
│   ├── index.html
│   ├── js  
│   │   └── index.js            //入口文件
│   ├── json                    //json文件目录
│   ├── lib                     //其他库
│   └── sprite                  //sprite雪碧图合成目录
├── webpack.config.build.js     //webpack生成distw文件配置
└── webpack.config.dev.js       //webpack编译配置
```

项目的构建工具使用的是Webpack， Webpack的配置可以查看源码[webapck.config.dev.js]()，为避免文章篇幅过长，这里将不会详细介绍Webpack的配置过程，Webpck的配置介绍可以查看Webpack的官方文档[https://webpack.github.io/](https://webpack.github.io/)。

<br/>

#### 2.创建游戏

##### (1)库引入

在`index.html`引入Phaser官网下载的Phaser库。

```
<script src="js/phaser.min.js"></script>
```

##### (2) 创建游戏

Phaser中通过`Phaser.Game`来创建游戏界面，也是游戏的核心。可以通过创建的这个游戏对象，添加更多生动的东西。

`Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)`有八个参数：

`width` ：游戏界面宽度，默认值为800。
`height` ：游戏界面高度，默认值为600。
`renderer` ：游戏渲染器，默认值为`Phaser.AUTO`，随机选择其他值：`Phaser.WEBGL`、`Phaser.CANVAS`、`Phaser.HEADLESS`（不进行渲染）。
`parent` ：游戏界面挂载的DOM节点，可以为DOM id，或者标签。
`state` ：游戏state对象，默认值为null，游戏的state对象一般包含方法（preload、create、update、render）。
`transparent` ：是否设置游戏背景为透明，默认值为false。
`antialias` ：是否显示图片抗锯齿。默认值为true。
`physicsConfig` ：游戏物理引擎配置。
```

//index.js

//以750宽度视觉搞为准
//选择是canvas渲染方式
window.customGame = new Phaser.Game(750 , 750 / window.innerWidth * window.innerHeight , Phaser.CANVAS , 'container');

```

```
//index.html
<div id="container"></div>
```

这样就可以在页面上看到我们的Canvas界面。

#### 3.功能划分

在项目中，为了将项目模块化，将加载资源逻辑和游戏逻辑分开，在`src/js`中新建`load.js`存放加载资源逻辑，新建`play.js`存放游戏逻辑。在这里的两个模块以游戏场景的形式存在。

场景（state）在Phaser中是可以更快地获取公共函数，比如camera、cache、input等，表现形式为js自定义对象或者函数存在，只要存在preload、create、update这三个方法中地任意一个，就是一个Phaser场景。

在Phaser场景中，总共有五个方法：`init`、`preload`、`create`、`update`、`render`。前三个的执行循序为：init => preload => create。

`init` ：在场景中是最先执行的方法，可以在这里添加场景的初始化。

`preload` ：这个方法在init后触发，如果没有init，则第一个执行，一般在这里进行资源的加载。

`create` ：这个方法在preload后触发，这里可以使用预加载中的资源。

`update` ：这是每一帧都会执行一次的更新方法。

`render` ：这是在每次物件渲染之后都会执行渲染方法。

用户自定义场景可以通过`game.state.add`方法添加到游戏中，如在项目中，需要将预加载模块和游戏逻辑模块加入到游戏中：

```
//index.js

...
const load = require('./load');
const play = require('./play');

customGame.state.add('Load' , load);
customGame.state.add('Play' , play);
```

`game.state.add`第一个参数为场景命名，第二个参数为场景。

此时我的游戏场景就有Load和Play。游戏中首先要执行的是Load场景，可以通过`game.state.start`方法来开始执行Load场景。

```
//index.js

customGame.state.start('Load');
```

<br/>

# 三、资源加载

```
//load.js

const load = {
}
module.exports = load;
```

#### 1.画面初始化

进入页面前，需要进行一些游戏画面的初始化。在这里进行初始化的原因在于在场景里才能使用一些设置的方法。

##### （1）添加画布背景色

```
//load.js
customGame.stage.backgroundColor = '#4f382b';

```

##### （2）设置屏幕适配模式

由于不同设备屏幕尺寸不同，需要根据需求设置适合的适配模式。可通过`game.scale.scaleMode`设置适配模式，适配模式`Phaser.ScaleManager`有五种：

`NO_SCALE` ：不进行任何缩放

`EXACT_FIT` ：对画面进行拉伸撑满屏幕，比例发生变化，会有缩放变形的情况

`SHOW_ALL` ：在比例不变、缩放不变形的基础上显示所有的内容，通常使用这种模式
 
`RESIZE` ：适配画面的宽度不算高度，不进行缩放，不变形

`USER_SCALE` ： 根据用户的设置变形

在这里的适配模式选择的是`SHOW_ALL`：

```
//load.js
customGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
```

#### 2.资源预加载

Phaser中通过`game.load`进行加载资源的预加载，预加载的资源可以为图片、音频、视频、雪碧图等等，这个游戏的资源只有普通图片和雪碧图，其他类型的加载方式可查看[官网文档Phaser. Loader](https://www.phaser-china.com/docs/Phaser.Loader.html)。

##### （1）预加载

**普通图片**

```
customGame.load.image('popup' , '../img/sprite.popup.png');
```

普通图片使用的是`game.load.image(图片key名，图片地址)`;

**雪碧图**

```
customGame.load.atlasJSONHash('tvshow' , '../img/tvshow.png' , '' , this.tvshowJson);
```

雪碧图的合成工具我使用的是[texturepacker](https://www.codeandweb.com/texturepacker)，选择的是输出文件模式是Phaser(JSONHash)，因此使用的是atlasJSONHash方法。第一个参数为图片key名，第二个参数为资源地址，第三个参数为图片数据文件地址，第四个参数为图片数据json或xml对象。

##### （2）图片跨域

如果图片资源和画布不是同源的，需要设置图片可跨域。

```
customGame.load.crossOrigin = 'anonymous';
```

##### （3）监听加载事件

**单个资源加载完成事件**

通过`onFileComplete`方法来监听每个资源加载完的事件，可以用来获取加载进度。

```
customGame.load.onFileComplete.add(this.loadProgress , this);

function loadProgress(progress){
    //progress为获取的资源进度百分比
    $('.J_loading .progress').text(`${progress}%`)
}
```

`onFileComplete`第一个参数为每个资源加载完的事件，第二个参数为指定该事件的上下文。

**全部资源加载完成事件**

通过`onLoadComplete`方法来监听全部资源加载完成事件。

```
customGame.load.onLoadComplete.addOnce(this.loadComplete , this);
```

第一个参数为加载完成事件，第二个参数为指定该事件的上下文。

以上就是预加载的主要实现。

<br/>

# 四、游戏逻辑

游戏逻辑大致可以分为四个部分，分别为画面初始化、物件选择面板的创建、元素的编辑、生成长图。

#### 1.画面初始化

初始化的页面主要有墙面、桌子和电视机，主要是创建这三个物件。在此之前，先介绍下用到的两个概念。

**sprite** ：可用于展示绝大部分的可视化的对象。
```
//创建新图像
//spriteName为预加载资源的唯一key，frame为雪碧图内的frame名，可通过雪碧图的json获得
const newObject = game.add.sprite(0,0,spriteName , frame);

```

**group** ：用于包含一系列对象的容器，方便批量操作对象，比如移动、旋转、放大等。
```
//创建组
const group1 = game.add.group();
//向组内添加新对象newObject
group1.add(newObject);
```

接下来是实例，创建墙面、桌子和电视机：

```
//play.js
const play = {
    create : function(){
        this.createEditPage();  //创建编辑页
    },
    createEditPage : function(){
        this.mobilityGroup = customGame.add.group();    //创建mobilityGroup组，用于存放游戏中的物件
        this.createWall();      //创建墙
        this.createTableSofa('sofatable1.png');     //创建沙发
        this.createTelevision('television1.png');   //创建电视机
    },
    createWall : function(){
        const wall = customGame.add.sprite(0,this.gameHeightHf + 80,'wall1.png');

        wall.anchor.set(0 , 0.5);  
        wall.name = 'wall';

        this.mobilityGroup.add(wall);
    },
    createTableSofa : function(spriteName){
        const tableSofa = customGame.add.sprite(this.gameWidthHf , this.gameHeightHf + 20, 'tableSofa' , spriteName );

        tableSofa.anchor.set(0.5,0.5);
        tableSofa.name = 'tableSofa';
        tableSofa.keyNum = this.keyNum++;   //设置唯一key值

        this.mobilityGroup.add(tableSofa);
    },
}
module.exports = play;
```
`createTelevision`创建同`createTableSofa`，可通过源码查看。
`object.anchor.set(0,0)` 设置对象偏移位置的基准点，默认是左上角的位置（0,0），如果是右下角则是（1,1），对象的中间点是（0.5,0.5）；
`object.name = 'name'`设置对象的名称，可通过`group.getByName(name)`从组中获取该对象。

这样就会在页面上创建一个这样的画面：

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/04.png)

<br/>

#### 2.物件选择面板的创建

物件选择面板的主要逻辑可以分为几部分：创建左侧tab和批量创建元素、tab切换、元素滑动和新增元素。

##### （1）创建左侧tab和批量创建元素

物件选择面板可以分为新年快乐框、tab标题、tab内容、完成按钮四个部分。

```
...
createEditPage : function(){
    ...
    this.createEditWrap();          //创建编辑面板
},
createEditWrap : function(){
    this.editGroup = customGame.add.group();    //editGroup用于存放面板的所有元素
    this.createNewyear();           //创建新年快乐框
    this.createEditContent();       //创建tab内容
    this.createEditTab();           //创建tab标题
    this.createFinishBtn();         //创建完成按钮
}
...
```

新年快乐框、tab标题、完成按钮的实现可以查看源码，这里主要着重介绍tab内容的实现。

物件选择面板主要有四个tab类：

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/05.jpg)

四个tab类创建方式相同，因此取较为复杂的人物tab类为例介绍实现方法。

这里插播一些新的API：

**graphics：** 可以用来绘画，比如矩形、圆形、多边形等图形，还可以用来绘画直线、圆弧、曲线等各种基本物体。

```
//新建图形，第一个参数为x轴位置，第二个参数为y轴位置
const graphicObject = game.add.graphics(0,100); 
//画一个黑色的矩形
graphicObject.beginFill(0x000000);  //设置矩形的颜色
graphicObject.drawRect(0,0,100 , 100);   //设置矩形的x,y,width,height
```
编辑框的实现：
```
//index.js
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
    
    //创建人物
    this.createPostContent();
},
```
给`editContent`添加了遮罩是为了在子元素滑动的时候，可以遮住滑出的内容。

人物选择内容框分为左侧tab和右侧内容。左侧tab主要是文字，通过Phaser的text api实现，右侧通过封装的createEditListDetail方法批量生成。
```
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

    leftTabGroup.addMultiple([selected,text]);
    postContent.addMultiple([leftTab,sitGroup,standGroup,stallGroup,indescribeGroup])

    this.postContent = postContent;
    this.postLeftTab = leftTabGroup;
    this.sitGroup = sitGroup;
    this.standGroup = standGroup;
    this.stallGroup = stallGroup;
    this.indescribeGroup = indescribeGroup;
},
```

右侧的内容需要考虑的是不同内容的位置、尺寸和显示数量不一定的问题，因此需要抽取出不同的设置作为参数传入：

```
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
    }
},
```
到这里就搭好了游戏的全部画面，接下来是tab的切换。
<br/>

##### （2）tab切换

tab的切换逻辑是显示指定的内容，隐藏其他内容。通过组的`visible`属性设置元素的显示和隐藏。

```
//显示
newObject.visible = true;
//隐藏
newObject.visible = false;
```

除此之外，tab的切换还涉及到元素的点击事件，绑定事件前需要激活元素的`inputEnabled`属性，在元素的`events`属性上添加点击事件：

```
newObject.inputEnabled = true;
newObject.events.onInputDown.add(clickHandler , this);  //第一个参数为事件的回调函数，第二个参数为绑定的上下文
```

以人物选择内容框的左侧tab切换为例

给左侧tab添加点击事件：

```
createPostContent : function(){
    ...
    //组内批量添加点击事件，用setAll设置属性，用callAll添加事件
    leftTabGroup.setAll('inputEnabled' , true);
    leftTabGroup.callAll('events.onInputDown.add' , 'events.onInputDown' , this.switchPost , this);
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
    //设置选中框的位置
    this.postLeftTab.getByName('selected').y = selectedTop;
},
```
<br/>

##### （3）元素滑动和新增元素

这里把元素滑动和新增元素放在一起是考虑到组内元素的滑动操作和点击操作的冲突，元素的滑动是通过拖拽实现，如果组内元素添加了点击事件，点击事件优先于父元素的拖拽事件，当手指触摸到子元素时，无法触发拖拽事件。如果忽略子元素的点击事件，则无法捕获子元素的点击事件。

因此给元素添加滑动的逻辑如下：

1.触发滑动的父元素的拖拽功能，并且禁止横向拖拽，允许纵享拖拽。
2.给元素添加物理引擎（因为要给元素一个惯性的速度）。
3.结合onDragStart、onDragStop和onInputUp三个事件的触发判断用户的操作是点击还是滑动，如果是滑动，则三个事件都会触发，并且onInputUp的事件优先于onDragStop，如果是点击，则只会触发InputUp。
4.在onDragUpdate设置边界点，如果用户滑动超过一定边界点则只能滑动到边界点。
5.在onDragStop判断用户滑动的距离和时间计算出手势停止时，给定元素的速度。
6.在onDragStart判断是否有因惯性正在移动的元素，如果有则让该元素停止运动，让移动速度为0。
6.在update里让移动元素的速度减少直至为0停下来模拟惯性。

```
addScrollHandler : function(target){
    let isDrag = false; //判断是否滑动的标识
    let startY , endY , startTime , endTime;
    const box = target.getByName('box');
    box.inputEnabled = true;
    box.input.enableDrag();
    box.input.allowHorizontalDrag = false;  //禁止横向拖拽
    box.input.allowVerticalDrag = true;     //允许纵向拖拽
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
update : function(){
    this.dealScrollObject();
}
```

每次元素移动都要设置`hitArea`属性，用来设置元素的点击和滑动区域。这是因为元素的mask不可见区域还是可点击和滑动的，需要手动设置。

**新增元素：**

```
addNewMobilityObject : function(key , name){
    //默认新元素的位置在屏幕居中位置取随机值
    const randomPos = 30 * Math.random();
    const posX = Math.random() > 0.5 ? this.gameWidthHf + randomPos : this.gameWidthHf - randomPos;
    const posY = Math.random() > 0.5 ? this.gameHeightHf + randomPos : this.gameHeightHf - randomPos;
    const newOne = customGame.add.sprite(posX , posY , key , name);

    newOne.anchor.set(0.5);
    newOne.keyNum = this.keyNum++;

    this.mobilityGroup.add(newOne);
},
```

<br/>

#### 3.元素编辑

新添加的元素或点击画面区内的元素，会有这样的编辑框出现，使得该元素可进行删除缩放操作。

![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/06.png)

**绘制编辑框**

```
addNewMobilityObject : function(){
    ...
    //绑定选中元素
    this.bindObjectSelected(newOne);
    //让新建元素成为当前选中元素
    this.objectSelected(newOne);
},
bindObjectSelected : function(target){
    target.inputEnabled = true;
    target.input.enableDrag(false , true);
    //绘制编辑框
    target.events.onDragStart.add(this.objectSelected , this ); 
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
```

绘制虚线框使用了`BitmapData`api实现，`BitmapData`对象可以有canvas context的操作，可以作为图片或雪碧图的texture。

```
create : function(){
    ...
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
```

由于元素的缩放都会改变尺寸，编辑框的只缩放虚线框尺寸，不改变按钮的尺寸大小，因此每次缩放都要清楚编辑框，重新绘制编辑框。

<br/>

#### 4.生成长图

生成长图较为简单，只需要通过`game.canvas.toDataURL`生成。

```
createFinishBtn : function(){
    ...
    finishBtn.events.onInputUp.add(this.finishPuzzle , this);
},
finishPuzzle : function(){
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
```
[五、总结](#五、总结)

以上是这个h5的主要实现过程，由于代码细节较多，部分代码未贴出，需要配合源码阅读～～

[源码：https://github.com/ZENGzoe/phaser-puzzle.git](https://github.com/ZENGzoe/phaser-puzzle.git)
[demo：https://zengzoe.github.io/phaser-puzzle/dist/](https://zengzoe.github.io/phaser-puzzle/dist/)
![](http://zengzoe.github.io/2019/01/24/%E5%A6%82%E4%BD%95%E7%94%A8Phaser%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%85%A8%E5%AE%B6%E7%A6%8F%E6%8B%BC%E5%9B%BEh5/07.png)

<br/>

# 参考文档

[1.https://phaser.io/](https://phaser.io/)<br/>
