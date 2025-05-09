// BootScene - Erste Szene zum Laden grundlegender Ressourcen
window.BootScene = class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('BootScene constructor called');
    }

    preload() {
        console.log('BootScene: Preload started');
        
        // Check if textures already exist (might happen during a scene restart)
        if (this.textures.exists('background') && this.textures.exists('player')) {
            console.log('Textures already exist, skipping generation');
            // Still create loading bar if needed
            if (!this.textures.exists('loading-bar')) {
                this.createLoadingBar();
            }
            return;
        }
        
        try {
            // First create our own fallback assets to guarantee we have the basics
            this.createFallbackAssets();
            console.log('BootScene: Fallback assets created as a safety net');
            
            // Then try the more advanced placeholder assets
            try {
                // Generate placeholder assets instead of loading external files
                if (typeof PlaceholderAssets !== 'undefined' && PlaceholderAssets.generateAll) {
                    PlaceholderAssets.generateAll(this);
                    console.log('BootScene: PlaceholderAssets generated successfully');
                } else {
                    console.warn('PlaceholderAssets not available, using fallbacks');
                }
            } catch (placeholderError) {
                console.error('Error generating placeholder assets:', placeholderError);
                // We already have fallbacks, so no further action needed
            }
        } catch (error) {
            console.error('Critical error in BootScene preload:', error);
            // Create super basic assets as last resort
            this.createSuperBasicAssets();
        }
        
        // Create loading bar assets
        this.createLoadingBar();
        
        console.log('BootScene: Preload completed');
    }
    
    createSuperBasicAssets() {
        console.log('Creating super basic assets (last resort)');
        try {
            // Only create the absolute minimum required textures
            const g = this.make.graphics();
            
            // Player (blue rectangle)
            g.fillStyle(0x0000ff);
            g.fillRect(0, 0, 32, 48);
            g.generateTexture('player', 32, 48);
            
            // Background (black)
            g.clear();
            g.fillStyle(0x000000);
            g.fillRect(0, 0, 800, 450);
            g.generateTexture('background', 800, 450);
            g.generateTexture('loading-background', 800, 450);
            
            g.destroy();
        } catch (e) {
            console.error('Failed to create super basic assets:', e);
            
            // Display error to user
            const errorElement = document.createElement('div');
            errorElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;z-index:1000;';
            errorElement.innerHTML = '<div style="text-align:center;padding:20px;"><h2>Game Error</h2><p>Could not initialize game graphics. Try refreshing the page.</p><button onclick="location.reload()" style="padding:10px 20px;margin-top:20px;background:#3498db;color:#fff;border:none;cursor:pointer;">Refresh</button></div>';
            document.body.appendChild(errorElement);
        }
    }
    
    createFallbackAssets() {
        console.log('Creating fallback assets');
        
        // Create minimal required assets if placeholder generation failed
        const graphics = this.make.graphics();
        
        try {
            // Player
            graphics.fillStyle(0x3498db);
            graphics.fillRect(0, 0, 32, 48);
            graphics.generateTexture('player', 32, 48);
            
            // Also create player direction textures
            graphics.generateTexture('player-left', 32, 48);
            graphics.generateTexture('player-right', 32, 48);
            
            // Logo
            graphics.clear();
            graphics.fillStyle(0x3498db);
            graphics.fillRect(0, 0, 200, 100);
            graphics.generateTexture('logo', 200, 100);
            
            // Background
            graphics.clear();
            graphics.fillStyle(0x87ceeb);
            graphics.fillRect(0, 0, 800, 450);
            graphics.generateTexture('background', 800, 450);
            
            // Loading background
            graphics.clear();
            graphics.fillStyle(0x000000);
            graphics.fillRect(0, 0, 800, 450);
            graphics.generateTexture('loading-background', 800, 450);
            
            // Ground
            graphics.clear();
            graphics.fillStyle(0x8B4513);
            graphics.fillRect(0, 0, 64, 32);
            graphics.generateTexture('ground', 64, 32);
            
            // Platform
            graphics.clear();
            graphics.fillStyle(0x8B4513);
            graphics.fillRect(0, 0, 200, 32); 
            graphics.generateTexture('platform', 200, 32);
            
            // Coin
            graphics.clear();
            graphics.fillStyle(0xFFD700);
            graphics.fillCircle(16, 16, 16);
            graphics.generateTexture('coin', 32, 32);
            
            // Obstacle
            graphics.clear();
            graphics.fillStyle(0x808080);
            graphics.fillRect(0, 0, 32, 32);
            graphics.generateTexture('obstacle', 32, 32);
            
            graphics.destroy();
            
            console.log('Fallback assets created successfully');
        } catch (error) {
            console.error('Error creating fallback assets:', error);
            graphics.destroy();
            throw error;
        }
    }
    
    createLoadingBar() {
        try {
            const width = 400;
            const height = 30;
            
            // Generate loading bar graphics
            const graphics = this.make.graphics();
            
            // White loading background
            graphics.fillStyle(0xffffff, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.generateTexture('loading-bar-bg', width, height);
            
            // Blue loading bar
            graphics.clear();
            graphics.fillStyle(0x3498db, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.generateTexture('loading-bar', width, height);
            
            graphics.destroy();
            
            console.log('Loading bar assets created');
        } catch (error) {
            console.error('Error creating loading bar:', error);
            
            // Create super simple loading bar as fallback
            try {
                const g = this.make.graphics();
                g.fillStyle(0xffffff);
                g.fillRect(0, 0, 400, 30);
                g.generateTexture('loading-bar-bg', 400, 30);
                g.clear();
                g.fillStyle(0x0000ff);
                g.fillRect(0, 0, 400, 30);
                g.generateTexture('loading-bar', 400, 30);
                g.destroy();
            } catch (e) {
                console.error('Failed to create simple loading bar:', e);
            }
        }
    }

    create() {
        console.log('BootScene: Create started');
        
        // Some initial game settings
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Create animations
        this.createBasicAnimations();
        
        // Go to the loading scene
        this.scene.start('LoadingScene');
        console.log('BootScene: Starting LoadingScene');
    }
    
    createBasicAnimations() {
        try {
            // Basic animations in case LoadingScene fails to create them
            if (!this.anims.exists('left')) {
                this.anims.create({
                    key: 'left',
                    frames: [{ key: 'player' }],
                    frameRate: 10,
                    repeat: -1
                });
            }
            
            if (!this.anims.exists('right')) {
                this.anims.create({
                    key: 'right',
                    frames: [{ key: 'player' }],
                    frameRate: 10,
                    repeat: -1
                });
            }
            
            if (!this.anims.exists('turn')) {
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'player' }],
                    frameRate: 20
                });
            }
            
            console.log('Basic animations created in BootScene');
        } catch (e) {
            console.error('Error creating basic animations:', e);
        }
    }
}