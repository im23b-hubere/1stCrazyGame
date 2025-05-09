// GameOverScene - Zeigt den Game Over Bildschirm an
window.GameOverScene = class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // Store the final score
        this.finalScore = data.score || 0;
    }

    create() {
        // Background
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        ).setAlpha(0.8);
        
        // Game Over text
        const gameOverText = this.add.text(
            this.cameras.main.width / 2,
            100,
            'GAME OVER', 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#ff0000',
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
        
        // Score text
        const scoreText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 20,
            'Your score: ' + this.finalScore, 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Play Again button
        const playAgainButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 80,
            'PLAY AGAIN', 
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
            playAgainButton.setStyle({ backgroundColor: '#2980b9' });
            this.tweens.add({
                targets: playAgainButton,
                scale: 1.1,
                duration: 100
            });
        })
        .on('pointerout', () => {
            playAgainButton.setStyle({ backgroundColor: '#3498db' });
            this.tweens.add({
                targets: playAgainButton,
                scale: 1,
                duration: 100
            });
        })
        .on('pointerdown', () => {
            // Show ad if possible
            try {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    window.CrazyGames.SDK.ad.hasAdblock((hasAdblock) => {
                        if (!hasAdblock) {
                            // Show rewarded ad
                            window.CrazyGames.SDK.ad.requestAd('rewarded', {
                                adFinished: () => this.restartGame(),
                                adError: () => this.restartGame(),
                                adStarted: () => console.log('Ad started')
                            });
                        } else {
                            // Restart directly if ad blocker detected
                            this.restartGame();
                        }
                    });
                } else {
                    // Restart directly if SDK is not available
                    this.restartGame();
                }
            } catch (e) {
                console.warn('CrazyGames SDK not available', e);
                this.restartGame();
            }
        });
        
        // Main Menu button
        const menuButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 160,
            'MAIN MENU', 
            { 
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#7f8c8d',
                padding: {
                    left: 16,
                    right: 16,
                    top: 8,
                    bottom: 8
                },
                borderRadius: 8
            }
        ).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            menuButton.setStyle({ backgroundColor: '#95a5a6' });
            this.tweens.add({
                targets: menuButton,
                scale: 1.1,
                duration: 100
            });
        })
        .on('pointerout', () => {
            menuButton.setStyle({ backgroundColor: '#7f8c8d' });
            this.tweens.add({
                targets: menuButton,
                scale: 1,
                duration: 100
            });
        })
        .on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
        
        // Animate Game Over text
        this.tweens.add({
            targets: gameOverText,
            y: 120,
            duration: 1000,
            ease: 'Bounce',
            yoyo: false,
            repeat: 0
        });
        
        // Fade in score text
        scoreText.setAlpha(0);
        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        // Appear effect for buttons
        playAgainButton.setScale(0);
        menuButton.setScale(0);
        
        this.tweens.add({
            targets: playAgainButton,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            delay: 1000
        });
        
        this.tweens.add({
            targets: menuButton,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            delay: 1200
        });
        
        // Submit score to CrazyGames
        this.submitScore();
    }
    
    submitScore() {
        try {
            if (window.CrazyGames && window.CrazyGames.SDK) {
                // No direct score submission in SDK v3
                console.log('Score would be submitted: ' + this.finalScore);
            }
        } catch (e) {
            console.warn('CrazyGames SDK score submission error', e);
        }
    }
    
    restartGame() {
        this.scene.start('GameScene');
    }
} 