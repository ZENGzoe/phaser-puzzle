require('../css/common.scss');
require('../css/index.scss');

const load = require('./load');
const play = require('./play');


window.customGame = new Phaser.Game(750 , 750 / window.innerWidth * window.innerHeight , Phaser.CANVAS , 'container');


customGame.state.add('Load' , load);
customGame.state.add('Play' , play);
customGame.state.start('Load');