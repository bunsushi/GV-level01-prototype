let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, chocoLayer, coinLayer, enemyLayer;
var text;
var score = 0;
var enemy;
var fly;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('sand', 'assets/sand.png', { frameWidth: 70, frameHeight: 70 });
    this.load.spritesheet('choco', 'assets/choco.png', { frameWidth: 70, frameHeight: 70 });
    // simple coin image
    this.load.image('coin', 'assets/coin.png');
    // simple Gilgamesh cat
    this.load.image('gilgamesh', 'assets/gilgamesh.png');
    // enemy fly
    this.load.image('fly', 'assets/fly_fly.png');
    // enemy fly spritesheet
    this.load.spritesheet('enemy', 'assets/go-fly.png', { frameWidth: 70, frameHeight: 40 });

}

function create() {
    // load the map 
    map = this.make.tilemap({ key: 'map' });

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('sand');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

    var chocoTiles = map.addTilesetImage('choco');
    // create the ground layer
    chocoLayer = map.createDynamicLayer('Choco', chocoTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);
    chocoLayer.setCollisionByExclusion([-1]);

    var coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coin', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(50, 50, 'gilgamesh');
    player.setBounce(0.1); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width - 60, player.height - 8);

    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    this.physics.add.collider(chocoLayer, player);

    // create the fly animation
    fly = this.physics.add.sprite(50, 550, 'enemy');
    fly.setCollideWorldBounds(true);
    fly.body.setVelocityX(100);

    // adjust fly to be above the ground slightly
    fly.body.setSize(fly.width, fly.height + 20);

    // enemy will collide with the level tiles
    this.physics.add.collider(groundLayer, fly);
    this.physics.add.collider(chocoLayer, fly);

    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
        frameRate: 7,
        repeat: -1
    });

    coinLayer.setTileIndexCallback(85, collectCoin, this);
    // // when the player overlaps with a tile with index 85, collectCoin 
    // // will be called    
    this.physics.add.overlap(player, coinLayer);

    cursors = this.input.keyboard.createCursorKeys();

    // // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#b4c3d1');

    // this text will show the score
    text = this.add.text(20, 20, "score: " + score, {
        fontSize: '20px',
        fontWeight: 'bold',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 1 point to the score
    text.setText("score: " + score); // set the text to show the current score
    return false;
}

function update() {
    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        fly.anims.play('fly', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor()) {
        player.body.setVelocityY(-500);
    }

    if (fly.body.blocked.right) {
        fly.body.setVelocityX(-100);
        fly.flipX = true;
    }

    if (fly.body.blocked.left) {
        fly.body.setVelocityX(100);
        fly.flipX = false;
    }

};