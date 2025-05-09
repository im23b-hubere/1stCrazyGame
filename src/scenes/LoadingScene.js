// LoadingScene - Zeigt den Ladebildschirm an
window.LoadingScene = class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Setup loading UI
        this.setupLoadingUI();
        
        // Note: We're not loading actual assets anymore since we're using placeholder assets
        // But we'll simulate loading to show the loading screen
        this.simulateLoading();
        
        // Update the CrazyGames loading progress
        this.updateCrazyGamesProgress();
    }

    setupLoadingUI() {
        // Background
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'loading-background'
        );
        
        // Loading text
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Loading...', 
            { 
                fontSize: '32px',
                fill: '#FFF',
                fontFamily: 'Arial, sans-serif'
            }
        ).setOrigin(0.5);
        
        // Add logo
        const logo = this.add.image(
            this.cameras.main.width / 2,
            150,
            'logo'
        ).setOrigin(0.5);
        
        // Add loading bar
        const barWidth = 400;
        const barHeight = 30;
        
        // Loading bar background
        const loadingBarBg = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'loading-bar-bg'
        );
        
        // Loading bar foreground (this will be cropped to show progress)
        this.loadingBar = this.add.image(
            (this.cameras.main.width / 2) - (barWidth / 2),
            this.cameras.main.height / 2,
            'loading-bar'
        ).setOrigin(0, 0.5);
        
        // Initial width (0% loaded)
        this.loadingBar.displayWidth = 0;
        
        // Set up loading progress callback
        this.load.on('progress', (value) => {
            // Update the loading bar width based on the progress value (0 to 1)
            this.loadingBar.displayWidth = barWidth * value;
        });
    }

    simulateLoading() {
        // Simulate loading multiple assets by loading a dummy file multiple times
        // This creates progress events that update our loading bar
        for (let i = 0; i < 10; i++) {
            // Just trigger a few fake progress events
            this.load.on('progress', (value) => {
                // This event will fire with increasing values
            });
        }
    }

    updateCrazyGamesProgress() {
        // When all assets are loaded
        this.load.on('complete', () => {
            try {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    // Tell CrazyGames SDK loading has completed
                    window.CrazyGames.SDK.game.loadingStop();
                }
            } catch (e) {
                console.warn('CrazyGames SDK not available', e);
            }
            
            // Start the main menu after a short delay
            this.time.delayedCall(1000, () => {
                this.scene.start('MainMenuScene');
            });
        });
        
        // Manually trigger the complete event after a short delay
        // since we're not actually loading anything
        this.time.delayedCall(1500, () => {
            this.load.emit('progress', 1);
            this.load.emit('complete');
        });
    }

    create() {
        // Create animations - using the 'player' texture from placeholder.js
        this.createAnimations();
        console.log('LoadingScene: Animations created');
    }

    createAnimations() {
        try {
            console.log('Creating player animations - checking textures');
            
            // Überprüfen, ob die Haupt-Player-Textur existiert
            let hasMainTexture = this.textures.exists('player');
            let hasLeftTexture = this.textures.exists('player-left');
            let hasRightTexture = this.textures.exists('player-right');
            
            console.log(`Available textures - main: ${hasMainTexture}, left: ${hasLeftTexture}, right: ${hasRightTexture}`);
            
            if (!hasMainTexture) {
                console.error('Main player texture does not exist! Creating fallback texture.');
                // Erstelle eine Notfall-Textur
                const graphics = this.make.graphics();
                graphics.fillStyle(0x3498db);
                graphics.fillRect(0, 0, 32, 48);
                graphics.generateTexture('player', 32, 48);
                graphics.destroy();
                hasMainTexture = true;
            }
            
            // Für die Links-Animation
            this.anims.create({
                key: 'left',
                frames: [{ key: hasLeftTexture ? 'player-left' : 'player' }],
                frameRate: 10,
                repeat: -1
            });
            
            // Für die Steh-Animation (Standing)
            this.anims.create({
                key: 'turn',
                frames: [{ key: 'player' }],
                frameRate: 20
            });
            
            // Für die Rechts-Animation
            this.anims.create({
                key: 'right',
                frames: [{ key: hasRightTexture ? 'player-right' : 'player' }],
                frameRate: 10,
                repeat: -1
            });
            
            console.log('Player animations created successfully');
        } catch (error) {
            console.error('Error creating animations:', error);
            
            // Notfall-Animationen erstellen
            try {
                // Minimale Animationen ohne spezielle Frames
                this.anims.create({
                    key: 'left',
                    frames: [{ key: 'player' }],
                    frameRate: 10,
                    repeat: -1
                });
                
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'player' }],
                    frameRate: 20
                });
                
                this.anims.create({
                    key: 'right',
                    frames: [{ key: 'player' }],
                    frameRate: 10,
                    repeat: -1
                });
                
                console.log('Fallback animations created');
            } catch (fallbackError) {
                console.error('Failed to create fallback animations:', fallbackError);
            }
        }
    }
} 