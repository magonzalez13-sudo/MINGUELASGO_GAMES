const config = {

    type: Phaser.AUTO,

    width: window.innerWidth,
    height: window.innerHeight,

    physics:{
        default:'arcade',
        arcade:{
            gravity:{ y:0 },
            debug:false
        }
    },

    scene:{
        preload,
        create,
        update
    }

};

const game = new Phaser.Game(config);

let player;
let cursors;

function preload(){

    this.load.image(
        'player',
        'https://labs.phaser.io/assets/sprites/phaser-dude.png'
    );

}

function create(){

    this.physics.world.setBounds(0,0,5000,5000);

    for(let x=0;x<5000;x+=64){

        for(let y=0;y<5000;y+=64){

            let color = Phaser.Math.Between(0x1a1a1a,0x333333);

            this.add.rectangle(
                x,
                y,
                64,
                64,
                color
            ).setOrigin(0);

        }

    }

    player = this.physics.add.sprite(2500,2500,'player');

    player.setScale(2);

    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);

    this.cameras.main.setZoom(1.5);

    this.cameras.main.setBounds(0,0,5000,5000);

    cursors = this.input.keyboard.createCursorKeys();

    this.add.text(
        20,
        20,
        'VAPOR CHRONICLES',
        {
            font:'22px Arial',
            fill:'#ffffff'
        }
    ).setScrollFactor(0);

}

function update(){

    player.setVelocity(0);

    if(cursors.left.isDown){

        player.setVelocityX(-300);

    }

    if(cursors.right.isDown){

        player.setVelocityX(300);

    }

    if(cursors.up.isDown){

        player.setVelocityY(-300);

    }

    if(cursors.down.isDown){

        player.setVelocityY(300);

    }

}
