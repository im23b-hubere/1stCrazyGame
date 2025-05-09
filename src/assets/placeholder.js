/**
 * Placeholder asset generator for the game
 * This file creates dynamic assets that can be used for testing
 * without requiring external image/sound files
 */

window.PlaceholderAssets = class PlaceholderAssets {
  /**
   * Generate all placeholder assets
   * @param {Phaser.Scene} scene - The scene to add the assets to
   */
  static generateAll(scene) {
    try {
      console.log('Starting placeholder asset generation...');
      
      // Generate all textures one by one with error handling
      try {
        this.generateLogo(scene);
        console.log('Logo generated');
      } catch (e) {
        console.error('Error generating logo:', e);
      }
      
      try {
        this.generateBackground(scene);
        console.log('Background generated');
      } catch (e) {
        console.error('Error generating background:', e);
      }
      
      try {
        this.generateLoadingBackground(scene);
        console.log('Loading background generated');
      } catch (e) {
        console.error('Error generating loading background:', e);
      }
      
      try {
        this.generateGround(scene);
        console.log('Ground generated');
      } catch (e) {
        console.error('Error generating ground:', e);
      }
      
      try {
        this.generatePlatform(scene);
        console.log('Platform generated');
      } catch (e) {
        console.error('Error generating platform:', e);
      }
      
      try {
        this.generateCoin(scene);
        console.log('Coin generated');
      } catch (e) {
        console.error('Error generating coin:', e);
      }
      
      try {
        this.generateObstacle(scene);
        console.log('Obstacle generated');
      } catch (e) {
        console.error('Error generating obstacle:', e);
      }
      
      try {
        this.generatePlayer(scene);
        console.log('Player generated');
      } catch (e) {
        console.error('Error generating player:', e);
      }
      
      // Generate all sounds
      try {
        this.generateJumpSound(scene);
        console.log('Jump sound generated');
      } catch (e) {
        console.error('Error generating jump sound:', e);
        this._createDummyAudio(scene, 'jump');
      }
      
      try {
        this.generateCollectSound(scene);
        console.log('Collect sound generated');
      } catch (e) {
        console.error('Error generating collect sound:', e);
        this._createDummyAudio(scene, 'collect');
      }
      
      try {
        this.generateHitSound(scene);
        console.log('Hit sound generated');
      } catch (e) {
        console.error('Error generating hit sound:', e);
        this._createDummyAudio(scene, 'hit');
      }
      
      try {
        this.generateMusic(scene);
        console.log('Music generated');
      } catch (e) {
        console.error('Error generating music:', e);
        this._createDummyAudio(scene, 'music');
      }
      
      console.log('All placeholder assets generated');
    } catch (error) {
      console.error('Error in generateAll:', error);
      throw error;
    }
  }

  /**
   * Generate a logo texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateLogo(scene) {
    const graphics = scene.make.graphics({add: false});
    
    // Background
    graphics.fillStyle(0x3498db);
    graphics.fillRect(0, 0, 200, 100);
    
    // Border
    graphics.lineStyle(4, 0x2980b9);
    graphics.strokeRect(2, 2, 196, 96);
    
    // Text position
    graphics.fillStyle(0xffffff);
    graphics.fillRect(50, 40, 100, 30);
    
    graphics.generateTexture('logo', 200, 100);
    graphics.destroy();
  }

  /**
   * Safely check if a gradient can be created
   * @param {Phaser.GameObjects.Graphics} graphics - The graphics object
   * @returns {boolean} Whether gradients are supported
   * @private
   */
  static _supportsGradients(graphics) {
    try {
      // Try to create a gradient - if it fails, return false
      if (typeof graphics.createLinearGradient === 'function') {
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Gradient support check failed:', e);
      return false;
    }
  }
  
  /**
   * Safely try to create a gradient or fall back to a solid color
   * @param {Phaser.GameObjects.Graphics} graphics - The graphics object
   * @param {number} x1 - Start x position
   * @param {number} y1 - Start y position
   * @param {number} x2 - End x position
   * @param {number} y2 - End y position
   * @param {Array} colorStops - Array of {offset, color} pairs
   * @param {number} fallbackColor - Fallback color if gradient fails
   * @private
   */
  static _safeGradient(graphics, x1, y1, x2, y2, colorStops, fallbackColor) {
    try {
      if (this._supportsGradients(graphics)) {
        const gradient = graphics.createLinearGradient(x1, y1, x2, y2);
        colorStops.forEach(stop => {
          gradient.addColorStop(stop.offset, stop.color);
        });
        graphics.fillStyle(gradient);
      } else {
        // Fallback to solid color
        graphics.fillStyle(fallbackColor);
      }
    } catch (e) {
      console.warn('Gradient creation failed, using fallback color:', e);
      graphics.fillStyle(fallbackColor);
    }
  }

  /**
   * Generate a background texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateBackground(scene) {
    try {
      const graphics = scene.make.graphics({add: false});
      
      // Try to use a gradient, but fall back to solid color if needed
      this._safeGradient(
        graphics, 
        0, 0, 0, 450, 
        [
          { offset: 0, color: '#1e90ff' },
          { offset: 1, color: '#87ceeb' }
        ],
        0x1e90ff // Fallback color if gradient fails
      );
      
      graphics.fillRect(0, 0, 800, 450);
      
      // Add some clouds
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(100, 80, 30);
      graphics.fillCircle(130, 80, 40);
      graphics.fillCircle(160, 80, 30);
      
      graphics.fillCircle(600, 120, 40);
      graphics.fillCircle(640, 120, 50);
      graphics.fillCircle(680, 120, 40);
      
      graphics.generateTexture('background', 800, 450);
      graphics.destroy();
    } catch (error) {
      console.error('Error generating background, using fallback:', error);
      
      // Ultra-simple fallback for environments with limited graphics support
      try {
        const fallbackGraphics = scene.make.graphics({add: false});
        fallbackGraphics.fillStyle(0x0000ff);
        fallbackGraphics.fillRect(0, 0, 800, 450);
        fallbackGraphics.generateTexture('background', 800, 450);
        fallbackGraphics.destroy();
      } catch (fallbackError) {
        console.error('Critical error creating background texture:', fallbackError);
      }
    }
  }

  /**
   * Generate a loading background texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateLoadingBackground(scene) {
    try {
      const graphics = scene.make.graphics({add: false});
      
      // Background
      graphics.fillStyle(0x000000);
      graphics.fillRect(0, 0, 800, 450);
      
      // Add a subtle pattern
      graphics.lineStyle(1, 0x222222);
      for (let i = 0; i < 800; i += 20) {
        graphics.moveTo(i, 0);
        graphics.lineTo(i, 450);
      }
      for (let i = 0; i < 450; i += 20) {
        graphics.moveTo(0, i);
        graphics.lineTo(800, i);
      }
      
      graphics.generateTexture('loading-background', 800, 450);
      graphics.destroy();
    } catch (error) {
      console.error('Error generating loading background, using fallback:', error);
      
      // Ultra-simple fallback
      try {
        const fallbackGraphics = scene.make.graphics({add: false});
        fallbackGraphics.fillStyle(0x000000);
        fallbackGraphics.fillRect(0, 0, 800, 450);
        fallbackGraphics.generateTexture('loading-background', 800, 450);
        fallbackGraphics.destroy();
      } catch (fallbackError) {
        console.error('Critical error creating loading-background texture:', fallbackError);
      }
    }
  }

  /**
   * Generate a ground texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateGround(scene) {
    const graphics = scene.make.graphics({add: false});
    
    // Ground
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(0, 0, 64, 32);
    
    // Top grass
    graphics.fillStyle(0x228B22);
    graphics.fillRect(0, 0, 64, 8);
    
    // Details
    graphics.fillStyle(0x654321);
    graphics.fillRect(10, 12, 5, 5);
    graphics.fillRect(40, 18, 8, 4);
    graphics.fillRect(20, 22, 6, 6);
    
    graphics.generateTexture('ground', 64, 32);
    graphics.destroy();
  }

  /**
   * Generate a platform texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generatePlatform(scene) {
    const graphics = scene.make.graphics({add: false});
    
    // Platform
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(0, 0, 200, 32);
    
    // Top
    graphics.fillStyle(0x228B22);
    graphics.fillRect(0, 0, 200, 8);
    
    // Border
    graphics.lineStyle(2, 0x654321);
    graphics.strokeRect(0, 0, 200, 32);
    
    graphics.generateTexture('platform', 200, 32);
    graphics.destroy();
  }

  /**
   * Generate a coin texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateCoin(scene) {
    const graphics = scene.make.graphics({add: false});
    
    // Coin
    graphics.fillStyle(0xFFD700);
    graphics.fillCircle(16, 16, 14);
    
    // Shine
    graphics.fillStyle(0xFFFACD);
    graphics.fillCircle(10, 10, 4);
    
    // Border
    graphics.lineStyle(2, 0xDAA520);
    graphics.strokeCircle(16, 16, 14);
    
    graphics.generateTexture('coin', 32, 32);
    graphics.destroy();
  }

  /**
   * Generate an obstacle texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generateObstacle(scene) {
    const graphics = scene.make.graphics({add: false});
    
    // Obstacle (spiky rock)
    graphics.fillStyle(0x808080);
    graphics.fillRect(4, 8, 24, 24);
    
    // Spikes
    graphics.fillStyle(0x696969);
    graphics.moveTo(0, 16);
    graphics.lineTo(8, 0);
    graphics.lineTo(16, 16);
    graphics.fillPath();
    
    graphics.moveTo(16, 16);
    graphics.lineTo(24, 0);
    graphics.lineTo(32, 16);
    graphics.fillPath();
    
    graphics.generateTexture('obstacle', 32, 32);
    graphics.destroy();
  }

  /**
   * Generate a player spritesheet texture
   * @param {Phaser.Scene} scene - The scene to add the texture to
   */
  static generatePlayer(scene) {
    try {
      console.log('Generating player texture...');

      // Create graphics for the player textures
      const graphics = scene.make.graphics({add: false});
      
      // Generate the normal (standing) frame
      graphics.clear();
      this._drawPlayerCharacter(graphics, false, false);
      graphics.generateTexture('player', 32, 48);
      
      // Generate left-facing player
      graphics.clear();
      this._drawPlayerCharacter(graphics, true, true);
      graphics.generateTexture('player-left', 32, 48);
      
      // Generate right-facing player
      graphics.clear();
      this._drawPlayerCharacter(graphics, false, true);
      graphics.generateTexture('player-right', 32, 48);
      
      // Clean up
      graphics.destroy();
      
      console.log('Player textures generated successfully');
    } catch (error) {
      console.error('Error generating player texture:', error);
      
      // Simple fallback if there's an error
      try {
        const fallbackGraphics = scene.make.graphics({add: false});
        fallbackGraphics.fillStyle(0x3498db);
        fallbackGraphics.fillRect(0, 0, 32, 48);
        fallbackGraphics.generateTexture('player', 32, 48);
        fallbackGraphics.destroy();
        
        console.log('Created fallback player texture');
      } catch (fallbackError) {
        console.error('Failed to create fallback texture:', fallbackError);
      }
    }
  }
  
  /**
   * Helper method to draw a player character
   * @param {Phaser.GameObjects.Graphics} graphics - The graphics object to draw on
   * @param {boolean} facingLeft - Whether the character is facing left
   * @param {boolean} moving - Whether the character appears to be moving
   * @private
   */
  static _drawPlayerCharacter(graphics, facingLeft, moving) {
    // Body
    graphics.fillStyle(0x3498db);
    graphics.fillRect(8, 8, 16, 24);
    
    // Head
    graphics.fillStyle(0xf1c40f);
    graphics.fillRect(8, 0, 16, 8);
    
    // Eyes
    graphics.fillStyle(0xffffff);
    if (facingLeft) {
      graphics.fillRect(10, 2, 4, 4);
      // Pupil
      graphics.fillStyle(0x000000);
      graphics.fillRect(10, 3, 2, 2);
    } else {
      graphics.fillStyle(0xffffff);
      graphics.fillRect(18, 2, 4, 4);
      // Pupil
      graphics.fillStyle(0x000000);
      graphics.fillRect(20, 3, 2, 2);
    }
    
    // Legs
    graphics.fillStyle(0x2c3e50);
    if (moving) {
      // Animate legs for movement
      graphics.fillRect(8, 32, 6, 12);
      graphics.fillRect(18, 32, 6, 16);
    } else {
      graphics.fillRect(8, 32, 6, 16);
      graphics.fillRect(18, 32, 6, 16);
    }
    
    // Arms
    graphics.fillStyle(0x3498db);
    if (facingLeft) {
      graphics.fillRect(4, 12, 4, 16);
    } else {
      graphics.fillRect(24, 12, 4, 16);
    }
  }

  /**
   * Generate a jump sound
   * @param {Phaser.Scene} scene - The scene to add the sound to
   */
  static generateJumpSound(scene) {
    try {
      // Get audio buffer, which might be null if AudioContext isn't supported
      const buffer = this._createEmptyAudioBuffer();
      if (buffer) {
        scene.cache.audio.add('jump', { sampleRate: 44100, audioBuffer: buffer });
      } else {
        console.warn('Could not create jump sound due to AudioContext limitations');
        // Workaround: Create a dummy entry to prevent errors
        this._createDummyAudio(scene, 'jump');
      }
    } catch (error) {
      console.error('Error generating jump sound:', error);
      this._createDummyAudio(scene, 'jump');
    }
  }

  /**
   * Generate a collect sound
   * @param {Phaser.Scene} scene - The scene to add the sound to
   */
  static generateCollectSound(scene) {
    try {
      // Get audio buffer, which might be null if AudioContext isn't supported
      const buffer = this._createEmptyAudioBuffer();
      if (buffer) {
        scene.cache.audio.add('collect', { sampleRate: 44100, audioBuffer: buffer });
      } else {
        console.warn('Could not create collect sound due to AudioContext limitations');
        // Workaround: Create a dummy entry to prevent errors
        this._createDummyAudio(scene, 'collect');
      }
    } catch (error) {
      console.error('Error generating collect sound:', error);
      this._createDummyAudio(scene, 'collect');
    }
  }

  /**
   * Generate a hit sound
   * @param {Phaser.Scene} scene - The scene to add the sound to
   */
  static generateHitSound(scene) {
    try {
      // Get audio buffer, which might be null if AudioContext isn't supported
      const buffer = this._createEmptyAudioBuffer();
      if (buffer) {
        scene.cache.audio.add('hit', { sampleRate: 44100, audioBuffer: buffer });
      } else {
        console.warn('Could not create hit sound due to AudioContext limitations');
        // Workaround: Create a dummy entry to prevent errors
        this._createDummyAudio(scene, 'hit');
      }
    } catch (error) {
      console.error('Error generating hit sound:', error);
      this._createDummyAudio(scene, 'hit');
    }
  }

  /**
   * Generate music
   * @param {Phaser.Scene} scene - The scene to add the sound to
   */
  static generateMusic(scene) {
    try {
      // Get audio buffer, which might be null if AudioContext isn't supported
      const buffer = this._createEmptyAudioBuffer();
      if (buffer) {
        scene.cache.audio.add('music', { sampleRate: 44100, audioBuffer: buffer });
        console.log('Music audio generated successfully');
      } else {
        console.warn('Could not create music due to AudioContext limitations');
        // Workaround: Create a dummy entry to prevent errors
        this._createDummyAudio(scene, 'music');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      this._createDummyAudio(scene, 'music');
    }
  }

  /**
   * Create an empty audio buffer for sound placeholders
   * @returns {AudioBuffer} An empty audio buffer
   * @private
   */
  static _createEmptyAudioBuffer() {
    try {
      // Only create AudioContext when this method is called
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      
      // Check if AudioContext is available in this browser
      if (!AudioContextClass) {
        console.warn('AudioContext not supported in this browser');
        return null;
      }
      
      let audioContext = null;
      let buffer = null;
      
      try {
        audioContext = new AudioContextClass();
        // Create a very short buffer with silence to minimize resource usage
        buffer = audioContext.createBuffer(1, 4410, 44100);
        
        // Fill with silence
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = 0;
        }
      } catch (contextError) {
        console.warn('Error creating audio buffer content:', contextError);
        return null;
      } finally {
        // Close the audio context to free up resources if possible
        if (audioContext && audioContext.state !== 'closed' && typeof audioContext.close === 'function') {
          try {
            audioContext.close().catch(e => console.warn('Error closing AudioContext:', e));
          } catch (closeError) {
            console.warn('Error closing AudioContext:', closeError);
          }
        }
      }
      
      return buffer;
    } catch (error) {
      console.error('Error in _createEmptyAudioBuffer:', error);
      return null;
    }
  }

  /**
   * Creates a dummy audio entry to avoid missing key errors
   * @param {Phaser.Scene} scene - The scene to add the dummy audio to
   * @param {string} key - The audio key to create
   * @private
   */
  static _createDummyAudio(scene, key) {
    try {
      // Create a more robust stub that mimics a real sound object
      if (!scene.cache.audio.exists(key)) {
        scene.cache.audio.add(key, {
          isDecoded: true,
          decoded: true, 
          key: key,
          duration: 0.01,
          sampleRate: 44100,
          audioBuffer: null
        });
        console.log(`Created dummy audio entry for: ${key}`);
      }
    } catch (e) {
      console.error(`Could not create dummy audio for ${key}:`, e);
      
      // Last resort: define a minimal entry to prevent crashes
      try {
        scene.cache.audio.entries.set(key, {
          isDecoded: true,
          decoded: true,
          data: { duration: 0 }
        });
      } catch (fallbackError) {
        console.error(`Complete failure creating audio entry for ${key}:`, fallbackError);
      }
    }
  }
} 