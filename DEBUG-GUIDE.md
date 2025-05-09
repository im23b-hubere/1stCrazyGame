# Debugging Guide for CrazyGames Phaser Runner Game

This guide will help you troubleshoot common issues with the Phaser.js game running on CrazyGames platform.

## Common Issues and Solutions

### 1. Black Screen / Game Not Loading

If you see a black screen or the game fails to load:

- **Check Console Errors:** Open your browser's developer tools (F12) and check the console for errors.
- **Verify Script Loading:** Ensure all scripts are loading correctly. Look for 404 errors in the network tab.
- **Try Debug Mode:** Add `?debug=true` to the URL to enable debug mode, which shows console output on screen.
- **Use debug.html:** Open the debug.html file instead of index.html to access diagnostic tools.

### 2. Audio Issues

If you're having issues with game audio:

- **Browser Sound Policies:** Many browsers require a user interaction before allowing audio to play.
- **Manually Unlock Audio:** Use the "Unlock Audio" button in debug.html.
- **Check Audio Context:** In debug.html, the diagnostic panel shows the audio context state.
- **Audio Format Support:** Ensure your browser supports the Web Audio API.

### 3. Performance Issues

If the game is running slowly:

- **Check FPS:** Use debug.html to monitor the game's FPS.
- **Reduce Background Processes:** Close other tabs and applications.
- **Update Graphics Drivers:** Ensure your graphics drivers are up to date.
- **Try Different Browser:** Some browsers have better WebGL performance than others.

### 4. Scene Loading Failures

If specific scenes aren't loading:

- **Check Class Names:** Ensure classes are properly defined with `window.ClassName`.
- **Verify Script Order:** Scripts must be loaded in the correct order.
- **Look for Script Errors:** Check console for syntax errors in scene scripts.

## Using the Diagnostic Tools

The debug.html file includes several diagnostic tools:

1. **Diagnostic Panel:** Shows real-time information about game state, loaded assets, and errors.
2. **Audio Unlock Button:** Manually tries to unlock the Web Audio context.
3. **Console Output:** Shows all console logs directly on screen.

## Reporting Issues

When reporting issues, please include:

1. Your browser and OS version
2. Any console errors (from developer tools)
3. Steps to reproduce the issue
4. Screenshot of the diagnostic panel (if possible)

## Building for CrazyGames

To build the game for CrazyGames platform:

1. Run `build-for-crazygames.bat` to create a production build
2. Upload the contents of the `dist` folder to CrazyGames
3. Ensure the game works in the CrazyGames test environment before publishing

## Testing on Different Devices

- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices if possible
- Check touch controls on touch-enabled devices

## Advanced Debugging

For more advanced debugging:

1. Set `game.physics.arcade.debug = true` in the console to see physics boundaries
2. Use `game.scene.scenes` to list all scenes and their status
3. Check `game.textures.list` to see all loaded textures 