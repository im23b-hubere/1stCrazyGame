import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

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
        BootScene, 
        LoadingScene,
        MainMenuScene, 
        GameScene,
        GameOverScene
    ],
    pixelArt: false,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Initialize CrazyGames SDK first, then start the game
(async function() {
    try {
        // Initialize CrazyGames SDK
        console.log('Initializing CrazyGames SDK...');
        await window.CrazyGames.SDK.init();
        console.log('CrazyGames SDK initialized');

        // Start loading indicator for CrazyGames
        window.CrazyGames.SDK.game.loadingStart();

        // Initialize the game
        const game = new Phaser.Game(config);
        
        // Make the game instance globally available
        window.game = game;
    } catch (error) {
        console.error('Error initializing the game:', error);
        // Fallback - initialize game without SDK
        const game = new Phaser.Game(config);
        window.game = game;
    }
})(); 