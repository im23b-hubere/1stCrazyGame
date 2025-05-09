// GameScene - Hauptspielszene
window.GameScene = class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        console.log('GameScene constructor called');
    }

    init() {
        try {
            console.log('GameScene init started');
            // Initialize game variables
            this.score = 0;
            this.gameSpeed = 300;
            this.platformSpawnTime = 2000; // in milliseconds
            this.coinSpawnTime = 3000;
            this.obstacleSpawnTime = 2500;
            this.isPaused = false;
            console.log('GameScene init completed');
        } catch (error) {
            console.error('Error in GameScene init:', error);
        }
    }

    create() {
        try {
            console.log('GameScene create started');
            
            // Check if textures exist before using them
            if (!this.textures.exists('background')) {
                console.error('Background texture missing! Creating emergency texture');
                this.createEmergencyTextures();
            }
            
            // Background
            this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'background'
            );
            
            // Create groups for game objects
            this.platforms = this.physics.add.group();
            this.coins = this.physics.add.group();
            this.obstacles = this.physics.add.group();
            
            // Create ground
            this.ground = this.physics.add.staticGroup();
            
            // Check if ground texture exists
            if (!this.textures.exists('ground')) {
                console.error('Ground texture missing! Creating emergency texture');
                this.createEmergencyTexture('ground', 0x8B4513, 64, 32);
            }
            
            // Create ground with proper physics body
            try {
                // Clear any existing ground objects first
                this.ground.clear(true, true);
                
                // Ensure there's a continuous ground platform across the screen
                const groundHeight = 32;
                const groundY = this.cameras.main.height - (groundHeight / 2);
                
                // Add physics rectangle for entire ground instead of individual pieces
                // This is more efficient and avoids collision detection issues
                const groundWidth = this.cameras.main.width;
                
                // Create a single large ground platform
                const groundPlatform = this.add.rectangle(
                    groundWidth / 2,
                    groundY,
                    groundWidth,
                    groundHeight,
                    0x8B4513
                );
                
                // Add it to the physics system
                this.physics.add.existing(groundPlatform, true); // true = static body
                
                // Add it to our ground group
                this.ground.add(groundPlatform);
                
                console.log('Ground created successfully with physics body');
            } catch (e) {
                console.error('Error creating ground:', e);
                
                // Fallback ground creation
                for (let i = 0; i < this.cameras.main.width; i += 64) {
                    const ground = this.ground.create(i, this.cameras.main.height - 16, 'ground');
                    ground.setScale(1).refreshBody();
                }
            }
            
            // Create player
            if (!this.textures.exists('player')) {
                console.error('Player texture missing! Creating emergency texture');
                this.createEmergencyTexture('player', 0x3498db, 32, 48);
            }
            
            this.player = this.physics.add.sprite(100, this.cameras.main.height / 2, 'player');
            this.player.setBounce(0.2);
            this.player.setCollideWorldBounds(true);
            
            // Player-ground collision with safe error handling
            try {
                this.physics.add.collider(this.player, this.ground, null, (player, ground) => {
                    // This callback will only allow collision if both objects exist and are active
                    return player && player.active && ground && ground.active;
                }, this);
                
                console.log('Player-ground collision setup complete');
            } catch (colliderError) {
                console.error('Error setting up ground collision:', colliderError);
                
                // Try an alternative collision approach if the first one fails
                try {
                    // Simple collider without callback
                    this.physics.add.collider(this.player, this.ground);
                } catch (e) {
                    console.error('Failed to create even basic ground collision. Game may not work properly:', e);
                }
            }
            
            // Player-platform collision
            this.physics.add.collider(this.player, this.platforms);
            
            // Player-coin overlap
            this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
            
            // Player-obstacle collision
            this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
            
            // Setup controls
            this.cursors = this.input.keyboard.createCursorKeys();
            
            // Score text
            this.scoreText = this.add.text(16, 16, 'Score: 0', {
                fontSize: '32px',
                fontFamily: 'Arial, sans-serif',
                fill: '#000'
            });
            
            // Add pause button
            this.pauseButton = this.add.text(
                this.cameras.main.width - 80, 
                16, 
                'PAUSE', 
                {
                    fontSize: '20px',
                    fontFamily: 'Arial, sans-serif',
                    backgroundColor: '#3498db',
                    padding: {
                        left: 8,
                        right: 8,
                        top: 4,
                        bottom: 4
                    },
                    color: '#fff'
                }
            ).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.togglePause());
            
            // Set up spawn timers
            this.platformTimer = this.time.addEvent({
                delay: this.platformSpawnTime,
                callback: this.spawnPlatform,
                callbackScope: this,
                loop: true
            });
            
            this.coinTimer = this.time.addEvent({
                delay: this.coinSpawnTime,
                callback: this.spawnCoin,
                callbackScope: this,
                loop: true
            });
            
            this.obstacleTimer = this.time.addEvent({
                delay: this.obstacleSpawnTime,
                callback: this.spawnObstacle,
                callbackScope: this,
                loop: true
            });
            
            // Play background music
            try {
                this.music = this.sound.add('music', { volume: 0.5, loop: true });
                if (this.music && typeof this.music.play === 'function') {
                    this.music.play().catch(err => {
                        console.warn('Error playing music:', err);
                    });
                }
            } catch (e) {
                console.warn('Could not play background music:', e);
                this.music = this.createDummySound('music');
            }
            
            // Sound effects with improved error handling
            this.jumpSound = this.createSafeSound('jump');
            this.collectSound = this.createSafeSound('collect');
            this.hitSound = this.createSafeSound('hit');
            
            // Create animations if they don't exist
            if (!this.anims.exists('left')) {
                this.createEmergencyAnimations();
            }
            
            console.log('GameScene create completed');
        } catch (error) {
            console.error('Error in GameScene create:', error);
            this.createEmergencyUI('Error loading game. Click to retry.');
        }
    }
    
    // Create emergency texture if a required texture is missing
    createEmergencyTexture(key, color, width, height) {
        try {
            const graphics = this.make.graphics();
            graphics.fillStyle(color);
            graphics.fillRect(0, 0, width, height);
            graphics.generateTexture(key, width, height);
            graphics.destroy();
            console.log(`Created emergency texture: ${key}`);
        } catch (e) {
            console.error(`Failed to create emergency texture ${key}:`, e);
        }
    }
    
    // Create all emergency textures
    createEmergencyTextures() {
        this.createEmergencyTexture('background', 0x87CEEB, 800, 450);
        this.createEmergencyTexture('ground', 0x8B4513, 64, 32);
        this.createEmergencyTexture('platform', 0x8B4513, 200, 32);
        this.createEmergencyTexture('player', 0x3498db, 32, 48);
        this.createEmergencyTexture('coin', 0xFFD700, 32, 32);
        this.createEmergencyTexture('obstacle', 0x808080, 32, 32);
    }
    
    // Create emergency animations
    createEmergencyAnimations() {
        // For the left animation
        this.anims.create({
            key: 'left',
            frames: [{ key: 'player' }],
            frameRate: 10,
            repeat: -1
        });
        
        // For the standing animation
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player' }],
            frameRate: 20
        });
        
        // For the right animation
        this.anims.create({
            key: 'right',
            frames: [{ key: 'player' }],
            frameRate: 10,
            repeat: -1
        });
        
        console.log('Created emergency animations');
    }
    
    // Create a simple UI in case of error
    createEmergencyUI(message) {
        try {
            // Clear any existing objects that might cause errors
            this.children.removeAll();
            
            // Add a black background
            this.add.rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000
            );
            
            // Add error message
            const errorText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 40,
                message,
                {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '24px',
                    color: '#ffffff',
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // Add retry button
            const retryButton = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 40,
                'RETRY',
                {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '28px',
                    color: '#ffffff',
                    backgroundColor: '#e74c3c',
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                }
            ).setOrigin(0.5).setInteractive();
            
            retryButton.on('pointerdown', () => {
                // Go back to main menu
                this.scene.start('MainMenuScene');
            });
            
            console.log('Created emergency UI');
        } catch (e) {
            console.error('Failed to create emergency UI:', e);
            // Last resort - reload the page
            alert('Game crashed. The page will reload.');
            location.reload();
        }
    }

    update() {
        try {
            if (this.isPaused) return;
            
            // Check player inputs
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }
            
            // Jump when the up arrow or space is pressed
            // Sicherere Sprunglogik mit besserer Fehlerbehandlung
            try {
                // Prüfe, ob der Spieler auf dem Boden ist, bevor das Springen erlaubt wird
                const canJump = this.player && this.player.body && 
                                (this.player.body.touching.down || this.player.body.blocked.down);
                
                if ((this.cursors.up.isDown || this.cursors.space.isDown) && canJump) {
                    this.player.setVelocityY(-400);
                    
                    // Spiele den Sprung-Sound mit Fehlerbehandlung ab
                    if (this.jumpSound && typeof this.jumpSound.play === 'function') {
                        try {
                            this.jumpSound.play();
                        } catch (soundError) {
                            console.warn('Error playing jump sound:', soundError);
                        }
                    }
                }
            } catch (jumpError) {
                console.error('Error in jump logic:', jumpError);
            }
            
            // Move platforms, coins, and obstacles to the left
            try {
                this.platforms.getChildren().forEach(platform => {
                    platform.x -= this.gameSpeed * this.sys.game.loop.delta / 1000;
                    
                    // Remove platform if it's off-screen
                    if (platform.x < -platform.width / 2) {
                        platform.destroy();
                    }
                });
            } catch (platformError) {
                console.warn('Error updating platforms:', platformError);
            }
            
            try {
                this.coins.getChildren().forEach(coin => {
                    coin.x -= this.gameSpeed * this.sys.game.loop.delta / 1000;
                    
                    // Apply a spinning animation
                    coin.angle += 2;
                    
                    // Remove coin if it's off-screen
                    if (coin.x < -coin.width / 2) {
                        coin.destroy();
                    }
                });
            } catch (coinError) {
                console.warn('Error updating coins:', coinError);
            }
            
            try {
                this.obstacles.getChildren().forEach(obstacle => {
                    obstacle.x -= this.gameSpeed * this.sys.game.loop.delta / 1000;
                    
                    // Remove obstacle if it's off-screen
                    if (obstacle.x < -obstacle.width / 2) {
                        obstacle.destroy();
                    }
                });
            } catch (obstacleError) {
                console.warn('Error updating obstacles:', obstacleError);
            }
            
            // Gradually increase game speed
            this.gameSpeed += 0.01;
        } catch (updateError) {
            console.error('Critical error in update:', updateError);
            // Versuche, das Spiel wiederherzustellen, anstatt abzustürzen
            this.gameSpeed = 300;
        }
    }
    
    spawnPlatform() {
        // Randomly decide whether to spawn a platform
        if (Math.random() < 0.7) {
            const platform = this.platforms.create(
                this.cameras.main.width + 100,
                Phaser.Math.Between(200, this.cameras.main.height - 100),
                'platform'
            );
            
            platform.setImmovable(true);
            platform.body.allowGravity = false;
        }
    }
    
    spawnCoin() {
        // Randomly decide to spawn a coin
        if (Math.random() < 0.6) {
            const coin = this.coins.create(
                this.cameras.main.width + 100,
                Phaser.Math.Between(100, this.cameras.main.height - 100),
                'coin'
            );
            
            coin.body.allowGravity = false;
            coin.setCircle(coin.width / 2); // Use circular hitbox for coins
            
            // Add a glow effect
            this.tweens.add({
                targets: coin,
                alpha: 0.7,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    spawnObstacle() {
        // Randomly decide to spawn an obstacle
        if (Math.random() < 0.4) {
            const obstacle = this.obstacles.create(
                this.cameras.main.width + 100,
                this.cameras.main.height - 48,
                'obstacle'
            );
            
            obstacle.setImmovable(true);
            obstacle.body.allowGravity = false;
        }
    }
    
    collectCoin(player, coin) {
        // Play collect sound with error handling
        try {
            if (this.collectSound && typeof this.collectSound.play === 'function') {
                this.collectSound.play().catch(err => console.warn('Error playing collect sound:', err));
            }
        } catch (e) {
            console.warn('Error playing collect sound:', e);
        }
        
        // Destroy the coin
        coin.destroy();
        
        // Add points
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // Add a nice effect
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 200,
            yoyo: true
        });
    }
    
    hitObstacle(player, obstacle) {
        // Play hit sound with error handling
        try {
            if (this.hitSound && typeof this.hitSound.play === 'function') {
                this.hitSound.play().catch(err => console.warn('Error playing hit sound:', err));
            }
        } catch (e) {
            console.warn('Error playing hit sound:', e);
        }
        
        // Stop the music
        this.music.stop();
        
        // Notify CrazyGames that gameplay has stopped
        try {
            if (window.CrazyGames && window.CrazyGames.SDK) {
                window.CrazyGames.SDK.game.gameplayStop();
            }
        } catch (e) {
            console.warn('CrazyGames SDK gameplay stop error', e);
        }
        
        // Go to game over scene
        this.scene.start('GameOverScene', { score: this.score });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            // Update button text
            this.pauseButton.setText('RESUME');
            
            // Pause physics and timers
            this.physics.pause();
            this.platformTimer.paused = true;
            this.coinTimer.paused = true;
            this.obstacleTimer.paused = true;
            
            // Pause music
            this.music.pause();
            
            // Add pause overlay
            const overlay = this.add.rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.7
            );
            
            const pauseText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'PAUSED',
                {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '64px',
                    color: '#fff',
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            this.pauseOverlay = overlay;
            this.pauseText = pauseText;
            
        } else {
            // Update button text
            this.pauseButton.setText('PAUSE');
            
            // Resume physics and timers
            this.physics.resume();
            this.platformTimer.paused = false;
            this.coinTimer.paused = false;
            this.obstacleTimer.paused = false;
            
            // Resume music
            this.music.resume();
            
            // Remove pause overlay
            if (this.pauseOverlay) this.pauseOverlay.destroy();
            if (this.pauseText) this.pauseText.destroy();
        }
    }

    // Helper method to safely create sounds with fallbacks
    createSafeSound(key, config = { volume: 0.5 }) {
        try {
            if (this.sound && this.sound.add && this.cache.audio.exists(key)) {
                const sound = this.sound.add(key, config);
                if (sound) return sound;
            }
        } catch (e) {
            console.warn(`Could not load ${key} sound:`, e);
        }
        
        return this.createDummySound(key);
    }
    
    // Create a dummy sound object with all needed methods
    createDummySound(key) {
        console.log(`Creating dummy sound object for: ${key}`);
        return {
            key: key,
            play: () => Promise.resolve(),
            stop: () => {},
            pause: () => {},
            resume: () => {},
            destroy: () => {},
            on: () => {},
            once: () => {},
            setVolume: () => {},
            setRate: () => {},
            setDetune: () => {},
            setSeek: () => {}
        };
    }
} 