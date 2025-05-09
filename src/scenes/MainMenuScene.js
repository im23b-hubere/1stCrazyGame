// MainMenuScene - Zeigt das Hauptmenü an
window.MainMenuScene = class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Background
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        ).setAlpha(0.7);
        
        // Title
        const title = this.add.text(
            this.cameras.main.width / 2,
            100,
            'SIMPLE RUNNER', 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 6,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000',
                    blur: 2,
                    stroke: true,
                    fill: true
                }
            }
        ).setOrigin(0.5);
        
        // Start Game Button
        const startButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'START GAME', 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#ffffff',
                backgroundColor: '#3498db',
                padding: {
                    left: 20,
                    right: 20,
                    top: 10,
                    bottom: 10
                },
                borderRadius: 8
            }
        ).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#2980b9' });
            this.tweens.add({
                targets: startButton,
                scale: 1.1,
                duration: 100
            });
        })
        .on('pointerout', () => {
            if (startButton.text === 'START GAME') { // Only reset if not already starting
                startButton.setStyle({ backgroundColor: '#3498db' });
                this.tweens.add({
                    targets: startButton,
                    scale: 1,
                    duration: 100
                });
            }
        })
        .on('pointerdown', () => {
            // Prevent multiple clicks
            if (startButton.text === 'STARTING...') return;
            
            // Provide visual feedback immediately
            startButton.setStyle({ backgroundColor: '#2980b9' });
            startButton.setText('STARTING...');
            
            // Set a timeout to ensure the game starts even if the ad logic fails
            const safetyTimeout = setTimeout(() => {
                console.log('Safety timeout triggered - starting game directly');
                this.startGame();
            }, 2000);
            
            // Show ad before starting game (if available)
            try {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    // Check if we can show an ad
                    window.CrazyGames.SDK.ad.hasAdblock((hasAdblock) => {
                        if (!hasAdblock) {
                            // Show ad and then start game
                            window.CrazyGames.SDK.ad.requestAd('midgame', {
                                adFinished: () => {
                                    clearTimeout(safetyTimeout);
                                    this.startGame();
                                },
                                adError: () => {
                                    clearTimeout(safetyTimeout);
                                    this.startGame();
                                },
                                adStarted: () => console.log('Ad started')
                            });
                        } else {
                            // Start game directly if adblock is detected
                            clearTimeout(safetyTimeout);
                            this.startGame();
                        }
                    });
                } else {
                    // Start game directly if SDK is not available
                    clearTimeout(safetyTimeout);
                    this.startGame();
                }
            } catch (e) {
                console.warn('CrazyGames SDK not available', e);
                clearTimeout(safetyTimeout);
                this.startGame();
            }
        });
        
        // Instructions
        const instructions = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 100,
            'Use Arrow Keys to move and collect coins.\nAvoid obstacles!', 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Animate the title
        this.tweens.add({
            targets: title,
            y: 120,
            duration: 1500,
            ease: 'Bounce',
            yoyo: false,
            repeat: 0
        });
        
        // Appear effect for the button
        startButton.setScale(0);
        this.tweens.add({
            targets: startButton,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            delay: 500
        });
        
        // Fade in effect for instructions
        instructions.setAlpha(0);
        this.tweens.add({
            targets: instructions,
            alpha: 1,
            duration: 1000,
            delay: 1000
        });
    }
    
    startGame() {
        console.log('MainMenuScene.startGame() called');
        
        // Add delayed call in case scene transition is slow
        this.time.delayedCall(100, () => {
            // Notify CrazyGames that gameplay has started
            try {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    window.CrazyGames.SDK.game.gameplayStart();
                }
            } catch (e) {
                console.warn('CrazyGames SDK gameplay start error', e);
            }
            
            try {
                // Start the game scene with error handling
                console.log('Starting GameScene...');
                
                // First check if the GameScene is available and has been initialized
                const gameScene = this.scene.get('GameScene');
                
                if (!gameScene) {
                    console.error('GameScene not found! Creating emergency scene');
                    
                    // Create a minimal game scene if it doesn't exist
                    if (window.GameScene) {
                        this.scene.add('GameScene', new window.GameScene());
                    } else {
                        // Create an emergency game scene as a last resort
                        console.error('Cannot find GameScene class! Creating emergency scene');
                        this.createEmergencyGameScene();
                    }
                }
                
                // Try to start the scene
                this.scene.start('GameScene');
                
                // Add safety timeout - if GameScene doesn't start properly, go back to menu
                this.time.delayedCall(5000, () => {
                    // Check if we're still in the MainMenuScene after 5 seconds
                    if (this.scene.isActive('MainMenuScene')) {
                        console.error('GameScene failed to start! Creating emergency scene');
                        this.createEmergencyGameScene();
                        this.scene.start('GameScene');
                    }
                });
            } catch (error) {
                console.error('Error starting GameScene:', error);
                
                // Fallback - try to recreate the GameScene if there was an error
                try {
                    if (this.scene.get('GameScene')) {
                        this.scene.remove('GameScene');
                    }
                    
                    if (window.GameScene) {
                        this.scene.add('GameScene', new window.GameScene());
                        this.scene.start('GameScene');
                    } else {
                        // Create minimal working scene as a last resort
                        this.createEmergencyGameScene();
                        this.scene.start('GameScene');
                    }
                } catch (e) {
                    console.error('Failed to recover from GameScene error:', e);
                    alert('Game loading error. Please refresh the page.');
                }
            }
        });
    }
    
    // Create an emergency game scene as a last resort
    createEmergencyGameScene() {
        console.log('Creating emergency GameScene');
        
        class EmergencyGameScene extends Phaser.Scene {
            constructor() {
                super({ key: 'GameScene' });
            }
            
            create() {
                // Create a simple playable game
                // Background
                this.add.rectangle(400, 225, 800, 450, 0x000000);
                
                // Player
                this.player = this.physics.add.sprite(100, 225, 'player');
                if (!this.textures.exists('player')) {
                    const g = this.make.graphics();
                    g.fillStyle(0x3498db);
                    g.fillRect(0, 0, 32, 48);
                    g.generateTexture('player', 32, 48);
                    g.destroy();
                }
                this.player.setCollideWorldBounds(true);
                
                // Score text
                this.scoreText = this.add.text(16, 16, 'Score: 0', {
                    fontSize: '32px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#fff'
                });
                
                // Controls
                this.cursors = this.input.keyboard.createCursorKeys();
                
                // Instructions
                this.add.text(400, 50, 'EMERGENCY GAME MODE', {
                    fontSize: '24px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#ff0000'
                }).setOrigin(0.5);
                
                this.add.text(400, 400, 'Use arrow keys to move. Press ESC to return to menu', {
                    fontSize: '18px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#fff'
                }).setOrigin(0.5);
                
                // Score
                this.score = 0;
                
                // Exit key
                this.input.keyboard.on('keydown-ESC', () => {
                    this.scene.start('MainMenuScene');
                });
            }
            
            update() {
                // Simple controls
                if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-160);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(160);
                } else {
                    this.player.setVelocityX(0);
                }
                
                if (this.cursors.up.isDown && this.player.body.touching.down) {
                    this.player.setVelocityY(-330);
                }
                
                // Increase score over time
                this.score += 0.1;
                this.scoreText.setText('Score: ' + Math.floor(this.score));
            }
        }
        
        this.scene.add('GameScene', new EmergencyGameScene());
    }
} 