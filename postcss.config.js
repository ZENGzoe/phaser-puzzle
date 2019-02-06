var postcss = require('postcss'),
	sprites = require('postcss-sprites'),
	spritesCore = require('postcss-sprites/lib/core'),
	autoprefixer = require('autoprefixer'),
	px2rem = require('postcss-plugin-px2rem');

module.exports = {
	plugins : [
		sprites({
			filterBy : function(img){ //非sprite文件夹下的图片不合并
				var match = img.url.match(/sprite\/([^/]+\/)?[^/]+\.[^/]+$/);
				return match ? Promise.resolve() : Promise.reject();
			},
			groupBy : function(img){ //以sprite文件夹下的子目录作为分组，子目录下的图片和合并成一张雪碧图
				var match = img.url.match(/sprite\/(([^/]+)\/)?([^/]+)\.[^/]+$/);
				if(match){
					if(match[1]){
						return Promise.resolve(match[2]);
					}else{
						return Promise.resolve(match[3]);
					}
				}else{
					return Promise.reject();
				} 
			},
			hooks : {
				onUpdateRule : function(rule,token,img){
					spritesCore.updateRule(rule,token,img);

					//start:若原始样式中没有设置width或height，则根据图片大小自动添加width或height属性
					var dimensions = ['width','height'];
					rule.some(function(decl){
						dimensions.some(function(prop,idx){
							if(decl.prop == prop){
								dimensions.splice(idx,1);
							}
						});
					});
					dimensions.forEach(function(prop){
						var val = img.coords[prop];
						rule.insertAfter(rule.last,postcss.decl({
							prop : prop,
							value : val + 'px'
						}));
					});
					//end:若原始样式中没有设置width或height，则根据图片大小自动添加width或height属性
				},
				relativeTo : 'rule'
			},
			relativeTo : 'rule',
			spritePath : './src/img',
			spritesmith : {
				padding : 4
			},
			stylesheetPath: './dist/css',
		}),
		autoprefixer({
			browsers : [
				'Android >= 4.0',
				'iOS >= 6',
				'last 10 QQAndroid versions',
				'last 10 UCAndroid versions'
			],
			cascade : true
		}),
		px2rem({
			minPixelValue : 2
		})
	]
};
