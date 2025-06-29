# Pac-Man Retro Deluxe

**Pac-Man Retro Deluxe** is a fully custom-built remake of the classic Pac-Man arcade game, designed with a retro visual style and modern JavaScript-based AI. The game features smart ghosts, power-ups, level progression, a scoring system with high score tracking, and mobile-friendly visuals.

---

## 🎮 Features

- Classic Pac-Man gameplay with:
  - Pellets and power pellets
  - Ghosts with AI based on original arcade logic
  - Frightened and eaten modes
- Pathfinding using A* algorithm
- Multiple levels with increasing difficulty
- Retro visual design styled with pixelated canvas rendering
- Custom intro and game over screens
- Local high score tracking with `localStorage`
- Pausable gameplay with responsive controls

---

## 🛠️ Technologies Used

- **HTML5 Canvas** for rendering
- **JavaScript (ES6+)** for all game logic
- **CSS3** for UI styling
- No external libraries or frameworks

---

## 🎮 Controls

| Action      | Key          |
|-------------|--------------|
| Move Up     | Arrow Up     |
| Move Down   | Arrow Down   | 
| Move Left   | Arrow Left   |
| Move Right  | Arrow Right  |

---

## 📁 File Structure

```
/pacman-retro-deluxe/
│
├── index.html         # Main HTML structure and canvas
├── style.css          # Game and UI styles
├── script.js          # All game logic, rendering, AI, and loop
└── assets/            # (Optional) Icons, fonts, or sounds

```

## 🧠 Game Logic Overview

- **Board**: Grid-based, tracks pellet and wall positions.
- **Pac-Man**: Moves tile-by-tile, consumes pellets, triggers power-ups.
- **Ghosts**:
  - **Blinky**: Directly chases Pac-Man.
  - **Pinky**: Targets four tiles ahead of Pac-Man.
  - **Inky**: Uses a vector between Blinky and two tiles ahead of Pac-Man.
  - **Clyde**: Chases Pac-Man if far away, scatters if near.
- **Ghost Modes**:
  - **Chase**: Uses pathfinding to pursue.
  - **Scatter**: Retreats to corners.
  - **Frightened**: Wanders randomly, can be eaten.
  - **Eaten**: Returns to spawn.

- **Pathfinding**:
  - Uses A* algorithm to compute optimal path to target.
  - Recalculates if target or position changes.

- **Power Pellets**:
  - Grant Pac-Man the ability to eat ghosts for 10 seconds.
  - Double Pac-Man’s speed temporarily.

- **Level Progression**:
  - After clearing all pellets, game increases in speed and difficulty.

- **Game Over**:
  - Triggered when lives reach zero.
  - Shows final and high score with restart button.

---

## 📚 Citation

This game is a fan-made recreation and is not affiliated with or endorsed by Namco or Bandai Namco.

Original Game:  
> Namco. *Pac-Man* [Arcade Video Game]. Japan: Namco, 1980.  
> https://www.bandainamcoent.com/

Font used:  
> "Press Start 2P" font by Codeman38.  
> Licensed under the Open Font License. Available on Google Fonts:  
> https://fonts.google.com/specimen/Press+Start+2P

---


## 👾 Credits

- Game logic, design, and development by **Evan Meier**
- Aesthetic inspired by classic *Pac-Man* arcade game
- Font: Press Start 2P by Codeman38

---

## 📜 License

This project is open source and free to use for educational or personal purposes.  
No commercial use or resale is permitted without permission from original *Pac-Man* IP holders.
