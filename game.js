var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1600,
    height: 1216,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};

var game = new Phaser.Game(config);

var BootScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },
 
    preload: function ()
    {
        this.load.spritesheet('tiles', 'images_src/map/tiled/spritesheet.tsx');
        
        this.load.tilemapTiledJSON('map', 'images_src/map/tiled/map.json');
        
        this.load.spritesheet('player', 'images_src/characters/elfo.png', { frameWidth: 60, frameHeight: 108 });
    },
 
    create: function ()
    {
        this.scene.start('WorldScene');
    }
});
 
var WorldScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },
    preload: function ()
    {

    },
    create: function ()
    {
        var map = this.make.tilemap({ key: 'map' });
        
        var tiles = map.addTilesetImage('spritesheet', 'tiles');

        var grass = map.createStaticLayer('grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('obstacles', tiles, 0, 0);
    
        obstacles.setCollisionByExclusion([-1]);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 11, 12, 13, 14, 15]}),
            frameRate: 10,
            repeat: -1 
        });
    
        this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { frames: [ 16, 17, 18, 19, 20]}),
                frameRate: 10,
                repeat: -1
        });
    
        this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('player', { frames: [ 6, 7, 8, 9, 10]}),
                frameRate: 10,
                repeat: -1
        });
    
        this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('player', { frames: [ 1, 2, 3, 4, 5 ]}),
                frameRate: 10,
                repeat: -1
        });        

    
        this.player = this.physics.add.sprite(50, 100, 'player', 6);

         // pour ne pas aller au dela de la map 
         this.physics.world.bounds.width = map.widthInPixels;
         this.physics.world.bounds.height = map.heightInPixels;
         this.player.setCollideWorldBounds(true);
         
         // pour ne pas aller 
         this.physics.add.collider(this.player, obstacles);
 
         // limite la caméra aux bordures de la map
         this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
         this.cameras.main.startFollow(this.player);
         this.cameras.main.roundPixels = true; 
     
         
         this.cursors = this.input.keyboard.createCursorKeys();
         
         // spawn d'un ennemi
         this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
         for(var i = 0; i < 30; i++) {
             var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
             var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
                    
         }        
         
         this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
     },
     onMeetEnemy: function(player, zone) {        
         // we move the zone to some other location
         zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
         zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
         
         // shake the world
         this.cameras.main.shake(300);
         
     //    this.controls.update(delta);
     
         this.player.body.setVelocity(0);
 
         // Horizontal movement
         if (this.cursors.left.isDown)
         {
             this.player.body.setVelocityX(-80);
         }
         else if (this.cursors.right.isDown)
         {
             this.player.body.setVelocityX(80);
         }
 
         // Vertical movement
         if (this.cursors.up.isDown)
         {
             this.player.body.setVelocityY(-80);
         }
         else if (this.cursors.down.isDown)
         {
             this.player.body.setVelocityY(80);
         }        
 
         // Update the animation last and give left/right animations precedence over up/down animations
         if (this.cursors.left.isDown)
         {
             this.player.anims.play('left', true);
             this.player.flipX = true;
         }
         else if (this.cursors.right.isDown)
         {
             this.player.anims.play('right', true);
             this.player.flipX = false;
         }
         else if (this.cursors.up.isDown)
         {
             this.player.anims.play('up', true);
         }
         else if (this.cursors.down.isDown)
         {
             this.player.anims.play('down', true);
         }
         else
         {
             this.player.anims.stop();
         }
     }
     
 });
