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
var groundLayer, chocoLayer, coinLayer;
var text;
var score = 0;
var fly;
var life = 10;
var lifeText;
var gameOver = false;
var lion, croc;
var coins;

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
    // TODO: make this into an actual spritesheet w/walking animations
    this.load.spritesheet('gilgamesh-ghost', 'assets/gilgamesh-ghost.png', { frameWidth: 90, frameHeight: 90 });
    // enemy fly spritesheet
    this.load.spritesheet('enemy', 'assets/go-fly.png', { frameWidth: 70, frameHeight: 40 });
    // citizen lion
    this.load.image('lion', 'assets/051-lion.png');
    this.load.image('croc', 'assets/citizens/051-crocodile.png');


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
    player.immune = false;

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

    // enemy collides with player
    this.physics.add.overlap(player, fly, collisionHandler, null, this);

    // enemy collides with player's shield (don't lose life, just bounce back your enemy!)

    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'ghost',
        frames: this.anims.generateFrameNumbers('gilgamesh-ghost', { start: 0, end: 0 }),
        frameRate: 7,
        repeat: -1
    });

    // create the lion
    lion = this.physics.add.sprite(100, 50, 'lion');
    lion.setCollideWorldBounds(true);
    lion.body.setVelocityX(100);
    lion.hitPoints = 3;

    // adjust lion to be above the ground slightly
    lion.body.setSize(lion.width, lion.height - 8);

    // lion will collide with the level tiles
    this.physics.add.collider(groundLayer, lion);
    this.physics.add.collider(chocoLayer, lion);

    // enemy collides with player
    this.physics.add.overlap(player, lion, attackHandler, null, this);

    // create the lion
    croc = this.physics.add.sprite(1070, 500, 'croc');
    croc.setCollideWorldBounds(true);
    croc.body.setVelocityX(100);
    croc.hitPoints = 3;

    // adjust lion to be above the ground slightly
    croc.body.setSize(croc.width, croc.height - 70);

    // lion will collide with the level tiles
    this.physics.add.collider(groundLayer, croc);
    this.physics.add.collider(chocoLayer, croc);

    // enemy collides with player
    this.physics.add.overlap(player, croc, attackHandler, null, this);

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

    lifeText = this.add.text(900, 20, "life: " + life, {
        fontSize: '20px',
        fontWeight: 'bold',
        fill: '#ffffff'
    });

    lifeText.setScrollFactor(0);
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

// this function will be called when the player touches a coin
function robNPC(player, coin) {
    coin.disableBody(true, true); // remove the tile/coin
    score++; // add 1 point to the score
    text.setText("score: " + score); // set the text to show the current score
    return false;
}

function collisionHandler(player, fly) {

    if (player.immune === false) {
        console.log("boop");
        // player.anims.play('ghost', true);
        life--;
        lifeText.setText("life: " + life);
        if (fly.body.touching.left) {
            fly.body.velocity.x = 150;
            fly.flipX = false;
            console.log("touchin' left");
        } else if (fly.body.touching.right) {
            fly.body.velocity.x = -150;
            fly.flipX = true;
            console.log("touchin' right");
        }

        player.immune = true;
        console.log(player.immune + " Haha! I'm immune for one second!")

        setTimeout(function () {
            player.immune = false;
            console.log(player.immune + " Drat! I'm mortal again");
        }, 1000);

        checkForLoss();
    }
}

function checkForLoss() {
    if (life === 0) {
        gameOver = true;
    }
}

function attackHandler(player, lion) {

    if (player.immune === false && cursors.space.isDown) {
        console.log(lion.hitPoints);
        console.log("knock knock");
        lion.hitPoints--;
        if (lion.hitPoints === 0) {
            console.log("moneyyyy");
            //  Some coins to collect, 10 in total, evenly spaced 70 pixels apart along the x axis
            coins = this.physics.add.group({
                key: 'coin',
                repeat: 9,
                setXY: { x: lion.x - 350, y: lion.y - 100, stepX: 70 }
            });

            coins.children.iterate(function (child) {

                //  Give each star a slightly different bounce
                child.setBounceY(Phaser.Math.FloatBetween(0.5, 1));

            });

            this.physics.add.collider(groundLayer, coins);
            this.physics.add.collider(chocoLayer, coins);
            this.physics.add.overlap(player, coins, robNPC, null, this);

            lion.disableBody(true, true);
        }
        else if (lion.body.touching.left) {
            // lion.body.velocity.x = 150;
            lion.flipX = false;
            console.log("that smarts!");
        } else if (lion.body.touching.right) {
            // lion.body.velocity.x = -150;
            lion.flipX = true;
            console.log("hey!");
        }

        player.immune = true;
        console.log(player.immune + " Haha! I'm immune for one second!")

        setTimeout(function () {
            player.immune = false;
            console.log(player.immune + " Drat! I'm mortal again");
        }, 1000);
    }
}

function update() {
    if (gameOver) {
        // this.physics.pause();
        window.location.reload();
    }

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