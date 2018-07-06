let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
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
var groundLayer, chocoLayer;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('sand', 'assets/sand.png', { frameWidth: 70, frameHeight: 70 });
    this.load.spritesheet('choco', 'assets/choco.png', { frameWidth: 70, frameHeight: 70 });
    // simple Gilgamesh cat
    this.load.image('gilgamesh', 'assets/gilgamesh.png');
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

    cursors = this.input.keyboard.createCursorKeys();

    // // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#b4c3d1');

}

function update() {
     if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
        player.flipX = false; // flip the sprite to the left
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
        player.flipX = true; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor()) {
        player.body.setVelocityY(-400);
    }
};