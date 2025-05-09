// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [
        window.BootScene, 
        window.LoadingScene,
        window.MainMenuScene, 
        window.GameScene,
        window.GameOverScene
    ],
    pixelArt: false,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // Check for WebGL capability
    render: {
        // Force canvas if WebGL might be problematic
        // This can help with gradient issues in some browsers
        // Set to 'AUTO' to let Phaser decide, or 'CANVAS' to force Canvas mode
        mode: checkGraphicsCapabilities() 
    },
    // Erweiterte Fehlerbehandlung
    callbacks: {
        preBoot: function(game) {
            // Add additional pre-boot checks
            console.log('Game preBoot - checking scenes');
            
            // Make sure audio context is unlocked or can be unlocked
            try {
                document.addEventListener('click', unlockAudioContext, { once: true });
                document.addEventListener('touchstart', unlockAudioContext, { once: true });
            } catch (e) {
                console.warn('Could not add audio context unlock listeners:', e);
            }
        },
        postBoot: function(game) {
            // Nach dem Booten des Spiels
            console.log('Game postBoot completed');
        }
    }
};

// Function to check graphics capabilities and decide the renderer
function checkGraphicsCapabilities() {
    console.log('Checking graphics capabilities...');
    
    // Check if canvas gradients are supported properly
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        
        if (!ctx || typeof ctx.createLinearGradient !== 'function') {
            console.warn('Canvas gradient not supported, using Canvas renderer');
            return Phaser.CANVAS;
        }
        
        // Try to create and use a gradient
        try {
            const gradient = ctx.createLinearGradient(0, 0, 10, 0);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(1, '#ffffff');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 10, 10);
            
            // If we get here, gradients seem to work
            console.log('Graphics capabilities check passed, using AUTO renderer');
            return Phaser.AUTO;
        } catch (e) {
            console.warn('Canvas gradient creation failed, using Canvas renderer:', e);
            return Phaser.CANVAS;
        }
    } catch (e) {
        console.warn('Graphics capabilities check failed, using Canvas renderer:', e);
        return Phaser.CANVAS;
    }
}

// Helper function to unlock audio context
function unlockAudioContext() {
    try {
        // Create and immediately close an audio context to unlock audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const audioContext = new AudioContext();
            // Create a short silent buffer
            const buffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            // Play the silent sound
            if (source.start) {
                source.start(0);
            } else {
                source.noteOn(0);
            }
            
            console.log('Audio context unlocked by user interaction');
            
            // Close the audio context to free resources
            if (audioContext.close) {
                audioContext.close().catch(e => console.warn('Error closing temp audio context:', e));
            }
        }
    } catch (e) {
        console.warn('Audio context unlock attempt failed:', e);
    }
}

// Create generic fallback scene class
function createGenericScene(name) {
    return class extends Phaser.Scene {
        constructor() {
            super({ key: name });
            console.warn(`Using fallback scene for ${name}`);
        }
        
        create() {
            this.add.text(
                400, 225, 
                `Error: ${name} scene didn't load properly.\nClick to continue anyway.`, 
                { 
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '24px',
                    color: '#ffffff',
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // For LoadingScene and BootScene, provide a way to continue
            if (name === 'BootScene') {
                this.input.once('pointerdown', () => {
                    this.scene.start('LoadingScene');
                });
            } else if (name === 'LoadingScene') {
                this.input.once('pointerdown', () => {
                    this.scene.start('MainMenuScene');
                });
            }
        }
    };
}

// Initialize CrazyGames SDK first, then start the game
(async function() {
    console.log('Starting game initialization...');
    
    // Create fallbacks for missing scenes if needed
    const requiredScenes = ['BootScene', 'LoadingScene', 'MainMenuScene', 'GameScene', 'GameOverScene'];
    
    // Create fallbacks for any missing scenes
    for (const sceneName of requiredScenes) {
        if (typeof window[sceneName] === 'undefined') {
            console.warn(`Creating fallback for missing scene: ${sceneName}`);
            window[sceneName] = createGenericScene(sceneName.replace('Scene', ''));
        }
    }
    
    // Create fallback for PlaceholderAssets if missing
    if (typeof window.PlaceholderAssets === 'undefined') {
        console.warn('Creating fallback for PlaceholderAssets');
        window.PlaceholderAssets = class PlaceholderAssets {
            static generateAll(scene) {
                console.warn('Using fallback PlaceholderAssets');
                // Create minimal textures for the game to function
                try {
                    const g = scene.make.graphics();
                    // Player sprite
                    g.fillStyle(0x3498db);
                    g.fillRect(0, 0, 32, 48);
                    g.generateTexture('player', 32, 48);
                    g.generateTexture('player-left', 32, 48);
                    g.generateTexture('player-right', 32, 48);
                    
                    // Background
                    g.clear();
                    g.fillStyle(0x1e90ff);
                    g.fillRect(0, 0, 800, 450);
                    g.generateTexture('background', 800, 450);
                    g.generateTexture('loading-background', 800, 450);
                    
                    // Platform and ground
                    g.clear();
                    g.fillStyle(0x8B4513);
                    g.fillRect(0, 0, 64, 32);
                    g.generateTexture('ground', 64, 32);
                    g.clear();
                    g.fillStyle(0x8B4513);
                    g.fillRect(0, 0, 200, 32);
                    g.generateTexture('platform', 200, 32);
                    
                    // Coin
                    g.clear();
                    g.fillStyle(0xFFD700);
                    g.fillCircle(16, 16, 16);
                    g.generateTexture('coin', 32, 32);
                    
                    // Obstacle
                    g.clear();
                    g.fillStyle(0x808080);
                    g.fillRect(0, 0, 32, 32);
                    g.generateTexture('obstacle', 32, 32);
                    
                    // Logo and UI elements
                    g.clear();
                    g.fillStyle(0x3498db);
                    g.fillRect(0, 0, 200, 100);
                    g.generateTexture('logo', 200, 100);
                    
                    // Loading bar
                    g.clear();
                    g.fillStyle(0xffffff);
                    g.fillRect(0, 0, 400, 30);
                    g.generateTexture('loading-bar-bg', 400, 30);
                    g.clear();
                    g.fillStyle(0x3498db);
                    g.fillRect(0, 0, 400, 30);
                    g.generateTexture('loading-bar', 400, 30);
                    
                    g.destroy();
                    
                    console.log('Fallback textures created successfully');
                } catch (e) {
                    console.error('Failed to create fallback textures:', e);
                }
                
                // Create dummy sounds
                try {
                    this._createDummyAudio(scene, 'jump');
                    this._createDummyAudio(scene, 'collect');
                    this._createDummyAudio(scene, 'hit');
                    this._createDummyAudio(scene, 'music');
                } catch (e) {
                    console.error('Failed to create dummy audio:', e);
                }
            }
            
            static _createDummyAudio(scene, key) {
                try {
                    scene.cache.audio.entries.set(key, {
                        isDecoded: true,
                        decoded: true,
                        data: { duration: 0 }
                    });
                } catch (e) {
                    console.error(`Failed to create dummy audio for ${key}:`, e);
                }
            }
        };
    }
    
    try {
        // Try to initialize CrazyGames SDK
        console.log('Attempting to initialize CrazyGames SDK...');
        let sdkInitialized = false;
        
        try {
            if (window.CrazyGames && window.CrazyGames.SDK) {
                await window.CrazyGames.SDK.init();
                window.CrazyGames.SDK.game.loadingStart();
                sdkInitialized = true;
                console.log('CrazyGames SDK initialized successfully');
            } else {
                console.warn('CrazyGames SDK not found, continuing without it');
            }
        } catch (sdkError) {
            console.warn('Failed to initialize CrazyGames SDK:', sdkError);
        }
        
        // Initialize the game
        console.log('Creating Phaser game instance...');
        
        // Ensure game config is using window-based scene references
        const gameConfig = {
            ...config,
            scene: [
                window.BootScene, 
                window.LoadingScene,
                window.MainMenuScene, 
                window.GameScene,
                window.GameOverScene
            ]
        };
        
        const game = new Phaser.Game(gameConfig);
        
        // Make the game instance globally available
        window.game = game;
        
        // Add more robust error handlers
        game.events.on('ERROR', (error) => {
            console.error('Phaser game error:', error);
        });
        
        // Handle scene transition errors
        game.events.on('SCENE_TRANSITION_COMPLETE', (fromScene, toScene) => {
            console.log(`Scene transition complete: ${fromScene} -> ${toScene}`);
        });
        
        game.events.on('SCENE_TRANSITION_FAILED', (fromScene, toScene) => {
            console.error(`Scene transition failed: ${fromScene} -> ${toScene}`);
            // Try to recover by going to main menu or loading scene
            try {
                if (game.scene.isActive('MainMenuScene')) {
                    game.scene.start('MainMenuScene');
                } else if (game.scene.isActive('LoadingScene')) {
                    game.scene.start('LoadingScene');
                } else {
                    // Last resort, try to start the boot scene
                    game.scene.start('BootScene');
                }
            } catch (e) {
                console.error('Failed to recover from scene transition error:', e);
            }
        });
        
        window.addEventListener('error', function(e) {
            console.error('Window error event:', e.message);
        });
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Fatal error initializing the game:', error);
        // Display error message with retry button
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
                <h2>Game Error</h2>
                <p>The game failed to start. This could be due to browser compatibility issues.</p>
                <button style="background: #3498db; color: white; border: none; padding: 10px 20px; margin-top: 15px; cursor: pointer; border-radius: 4px;" 
                        onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
})(); 