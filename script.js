(() => {
    const TILE_SIZE = 28;
    const ROWS = 22;
    const COLS = 20;
    const FPS = 60;

    const TILE = {
        WALL: 0,
        PATH: 1,
        PELLET: 2,
        POWER_PELLET: 3,
        GHOST_HOME: 4,
    };

    const DIRS = {
        NONE: {
            x: 0,
            y: 0
        },
        LEFT: {
            x: -1,
            y: 0
        },
        RIGHT: {
            x: 1,
            y: 0
        },
        UP: {
            x: 0,
            y: -1
        },
        DOWN: {
            x: 0,
            y: 1
        },
    };

    const OPPOSITE_DIR = {
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
        UP: 'DOWN',
        DOWN: 'UP',
    };

    function oppositeDirVector(dir) {
        if (dir.x === -1 && dir.y === 0) return DIRS.RIGHT;
        if (dir.x === 1 && dir.y === 0) return DIRS.LEFT;
        if (dir.x === 0 && dir.y === -1) return DIRS.DOWN;
        if (dir.x === 0 && dir.y === 1) return DIRS.UP;
        return DIRS.NONE;
    }

    const MAZE_LAYOUT = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 3, 0,
        0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0,
        0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0,
        0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 0, 2, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0,
        0, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0,
        0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0,
        0, 3, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0,
        0, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 3, 0,
        0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0,
        0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    function rcToIndex(r, c) {
        return r * COLS + c;
    }

    function indexToRC(i) {
        return {
            r: Math.floor(i / COLS),
            c: i % COLS
        };
    }

    function isWalkable(row, col) {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
        const tile = MAZE_LAYOUT[rcToIndex(row, col)];
        return tile !== TILE.WALL;
    }

    function clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    class Input {
        constructor() {
            this.dir = DIRS.NONE;
            this.nextDir = DIRS.NONE;

            window.addEventListener('keydown', e => {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.nextDir = DIRS.LEFT;
                        break;
                    case 'ArrowRight':
                        this.nextDir = DIRS.RIGHT;
                        break;
                    case 'ArrowUp':
                        this.nextDir = DIRS.UP;
                        break;
                    case 'ArrowDown':
                        this.nextDir = DIRS.DOWN;
                        break;
                    case 'p':
                    case 'P':
                        this.togglePause();
                        break;
                }
            });
            this.paused = false;
            this.pauseListeners = [];
        }
        onPauseChange(callback) {
            this.pauseListeners.push(callback);
        }
        togglePause() {
            this.paused = !this.paused;
            this.pauseListeners.forEach(cb => cb(this.paused));
        }
    }

    class Board {
        constructor(ctx) {
            this.ctx = ctx;
            this.layout = MAZE_LAYOUT.slice();
            this.pelletsCount = 0;
        }

        hasPelletAtPixel(x, y) {
            const row = Math.floor(y / TILE_SIZE);
            const col = Math.floor(x / TILE_SIZE);
            return this.isPellet(row, col) || this.isPowerPellet(row, col);
        }

        eatPelletAtPixel(x, y) {
            const row = Math.floor(y / TILE_SIZE);
            const col = Math.floor(x / TILE_SIZE);
            return this.eatPellet(row, col);
        }

        draw() {
            this.pelletsCount = 0;
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const tile = this.layout[rcToIndex(r, c)];
                    const x = c * TILE_SIZE;
                    const y = r * TILE_SIZE;

                    switch (tile) {
                        case TILE.WALL:
                            this.drawWallTile(x, y, r, c);
                            break;
                        case TILE.PELLET:
                            this.ctx.fillStyle = '#000022';
                            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                            this.drawPellet(x, y, 3, 'yellow');
                            this.pelletsCount++;
                            break;
                        case TILE.POWER_PELLET:
                            this.ctx.fillStyle = '#000022';
                            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                            this.drawPellet(x, y, 8, 'magenta', true);
                            this.pelletsCount++;
                            break;
                        case TILE.GHOST_HOME:
                            this.ctx.fillStyle = '#001122';
                            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                            this.ctx.fillStyle = '#222222';
                            this.ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
                            break;
                        default:
                            this.ctx.fillStyle = '#000011';
                            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }

        drawWallTile(x, y, row, col) {
            const ctx = this.ctx;

            let grad = ctx.createLinearGradient(x, y, x, y + TILE_SIZE);
            grad.addColorStop(0, '#0033cc');
            grad.addColorStop(1, '#000099');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

            const neighbors = {
                top: this.layout[rcToIndex(row - 1, col)] !== TILE.WALL,
                bottom: this.layout[rcToIndex(row + 1, col)] !== TILE.WALL,
                left: this.layout[rcToIndex(row, col - 1)] !== TILE.WALL,
                right: this.layout[rcToIndex(row, col + 1)] !== TILE.WALL,
            };

            ctx.strokeStyle = '#66aaff';
            ctx.lineWidth = 2;

            ctx.beginPath();

            const radius = 6;

            if (neighbors.top && neighbors.left) {
                ctx.moveTo(x + radius, y);
                ctx.arcTo(x, y, x, y + radius, radius);
            } else {
                ctx.moveTo(x, y);
            }

            if (neighbors.left) ctx.lineTo(x, y + TILE_SIZE - radius);
            else ctx.lineTo(x, y + TILE_SIZE);

            if (neighbors.bottom && neighbors.left) {
                ctx.arcTo(x, y + TILE_SIZE, x + radius, y + TILE_SIZE, radius);
            } else {
                ctx.lineTo(x, y + TILE_SIZE);
            }

            if (neighbors.bottom) ctx.lineTo(x + TILE_SIZE - radius, y + TILE_SIZE);
            else ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE);

            if (neighbors.bottom && neighbors.right) {
                ctx.arcTo(x + TILE_SIZE, y + TILE_SIZE, x + TILE_SIZE, y + TILE_SIZE - radius, radius);
            } else {
                ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE);
            }

            if (neighbors.right) ctx.lineTo(x + TILE_SIZE, y + radius);
            else ctx.lineTo(x + TILE_SIZE, y);

            if (neighbors.top && neighbors.right) {
                ctx.arcTo(x + TILE_SIZE, y, x + TILE_SIZE - radius, y, radius);
            } else {
                ctx.lineTo(x + TILE_SIZE, y);
            }

            if (neighbors.top) ctx.lineTo(x + radius, y);
            else ctx.lineTo(x, y);

            ctx.stroke();

            ctx.fillStyle = 'rgba(0, 102, 204, 0.2)';
            ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }

        drawPellet(x, y, radius, color, glow = false) {
            const ctx = this.ctx;
            if (glow) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        isWall(row, col) {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true;
            return this.layout[rcToIndex(row, col)] === TILE.WALL;
        }

        isPellet(row, col) {
            return this.layout[rcToIndex(row, col)] === TILE.PELLET;
        }

        isPowerPellet(row, col) {
            return this.layout[rcToIndex(row, col)] === TILE.POWER_PELLET;
        }

        eatPellet(row, col) {
            if (this.isPellet(row, col) || this.isPowerPellet(row, col)) {
                this.layout[rcToIndex(row, col)] = TILE.PATH;
                this.pelletsCount--;
                return true;
            }
            return false;
        }

        hasPelletAtPixel(x, y) {
            const row = Math.floor(y / TILE_SIZE);
            const col = Math.floor(x / TILE_SIZE);
            return this.isPellet(row, col) || this.isPowerPellet(row, col);
        }

        eatPelletAtPixel(x, y) {
            const row = Math.floor(y / TILE_SIZE);
            const col = Math.floor(x / TILE_SIZE);
            return this.eatPellet(row, col);
        }

        resetPellets() {
            for (let i = 0; i < this.layout.length; i++) {
                if (MAZE_LAYOUT[i] === TILE.PELLET) this.layout[i] = TILE.PELLET;
                else if (MAZE_LAYOUT[i] === TILE.POWER_PELLET) this.layout[i] = TILE.POWER_PELLET;
                else this.layout[i] = MAZE_LAYOUT[i];
            }
        }
    }

    class Entity {
        constructor(board, row, col, speed) {
            this.board = board;
            this.row = row;
            this.col = col;
            this.speed = speed;
            this.x = col * TILE_SIZE;
            this.y = row * TILE_SIZE;

            this.dir = DIRS.NONE;
            this.nextDir = DIRS.NONE;

            this.moving = false;
            this.moveProgress = 0;
        }

        canMove(dir) {
            const newRow = this.row + dir.y;
            const newCol = this.col + dir.x;
            return !this.board.isWall(newRow, newCol);
        }

        setDirection(dir) {
            this.nextDir = dir;
        }

        update(dt) {
            if (this.moving) {
                this.moveProgress += this.speed * TILE_SIZE * dt;
                if (this.moveProgress >= TILE_SIZE) {
                    this.row += this.dir.y;
                    this.col += this.dir.x;
                    this.x = this.col * TILE_SIZE;
                    this.y = this.row * TILE_SIZE;
                    this.moveProgress = 0;
                    this.moving = false;

                    if (this.nextDir !== this.dir && this.canMove(this.nextDir)) {
                        this.dir = this.nextDir;
                        this.moving = true;
                    }
                } else {
                    this.x += this.dir.x * this.speed * TILE_SIZE * dt;
                    this.y += this.dir.y * this.speed * TILE_SIZE * dt;
                }
            } else {
                if (this.canMove(this.nextDir)) {
                    this.dir = this.nextDir;
                    this.moving = true;
                    this.moveProgress = 0;
                } else if (this.canMove(this.dir)) {
                    this.moving = true;
                    this.moveProgress = 0;
                }
            }
        }

        draw(ctx) {}
    }

    class Pacman extends Entity {
        constructor(board, row, col) {
            super(board, row, col, 5);
            this.isPoweredUp = false;
            this.powerUpTimer = 0;
            this.normalSpeed = this.speed;
            this.score = 0;
            this.lives = 3;
        }

        update(dt) {
            if (this.isPoweredUp) {
                this.powerUpTimer -= dt;
                if (this.powerUpTimer <= 0) {
                    this.isPoweredUp = false;
                    this.speed = this.normalSpeed;
                }
            }

            super.update(dt);

            const cx = this.x + TILE_SIZE / 2;
            const cy = this.y + TILE_SIZE / 2;

            if (this.board.hasPelletAtPixel(cx, cy)) {
                const row = Math.floor(cy / TILE_SIZE);
                const col = Math.floor(cx / TILE_SIZE);

                if (this.board.isPowerPellet(row, col)) {
                    this.isPoweredUp = true;
                    this.powerUpTimer = 5;
                    this.speed = this.normalSpeed * 2;
                }

                if (this.board.eatPelletAtPixel(cx, cy)) {
                    this.score += 10;
                }
            }
        }

        powerUp() {
            this.poweredUp = true;
            this.powerTimer = 10;
        }

        draw(ctx) {
            const centerX = this.x + TILE_SIZE / 2;
            const centerY = this.y + TILE_SIZE / 2;
            const radius = TILE_SIZE / 2 - 2;

            if (this.isPoweredUp) {
                ctx.fillStyle = '#FFFF33';
                ctx.shadowColor = '#FFFF66';
                ctx.shadowBlur = 20;
            } else {
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFA500';
                ctx.shadowBlur = 10;
            }


            if (!this.moving || (this.dir.x === 0 && this.dir.y === 0)) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = this.isPoweredUp ? '#FFFF00' : '#FFD700';
                ctx.shadowColor = this.isPoweredUp ? '#FFFF99' : '#FFA500';
                ctx.shadowBlur = this.isPoweredUp ? 20 : 10;
                ctx.fill();
                ctx.shadowBlur = 0;
                return;
            }

            let angleOffset = 0;
            if (this.dir === DIRS.LEFT) angleOffset = Math.PI;
            else if (this.dir === DIRS.UP) angleOffset = -Math.PI / 2;
            else if (this.dir === DIRS.DOWN) angleOffset = Math.PI / 2;

            const time = performance.now() / 50;
            const chomp = (Math.sin(time) + 1) / 2;
            const mouthAngle = 0.2 + chomp * 1.1;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angleOffset + mouthAngle, angleOffset - mouthAngle, false);
            ctx.closePath();

            ctx.fillStyle = this.isPoweredUp ? '#FFFF00' : '#FFD700';
            ctx.shadowColor = this.isPoweredUp ? '#FFFF99' : '#FFA500';
            ctx.shadowBlur = this.isPoweredUp ? 20 : 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    class Pathfinder {
        constructor(board) {
            this.board = board;
        }

        findPath(start, goal) {
            const openSet = [];
            const closedSet = new Set();
            const cameFrom = new Map();

            function hash(rc) {
                return rc.r + ',' + rc.c;
            }

            function heuristic(a, b) {
                return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
            }

            openSet.push({
                ...start,
                f: 0,
                g: 0
            });

            const gScore = {};
            gScore[hash(start)] = 0;

            while (openSet.length > 0) {
                openSet.sort((a, b) => a.f - b.f);
                const current = openSet.shift();
                if (current.r === goal.r && current.c === goal.c) {
                    const path = [];
                    let currKey = hash(current);
                    let pos = current;
                    while (pos) {
                        path.unshift({
                            r: pos.r,
                            c: pos.c
                        });
                        pos = cameFrom.get(currKey);
                        currKey = pos ? hash(pos) : null;
                    }
                    return path;
                }
                closedSet.add(hash(current));

                for (const d of [DIRS.UP, DIRS.DOWN, DIRS.LEFT, DIRS.RIGHT]) {
                    const neighbor = {
                        r: current.r + d.y,
                        c: current.c + d.x
                    };
                    if (!this.board.isWall(neighbor.r, neighbor.c)) {
                        const neighborKey = hash(neighbor);
                        if (closedSet.has(neighborKey)) continue;

                        const tentativeG = gScore[hash(current)] + 1;
                        if (gScore[neighborKey] === undefined || tentativeG < gScore[neighborKey]) {
                            cameFrom.set(neighborKey, current);
                            gScore[neighborKey] = tentativeG;
                            const f = tentativeG + heuristic(neighbor, goal);
                            if (!openSet.find(n => n.r === neighbor.r && n.c === neighbor.c)) {
                                openSet.push({
                                    ...neighbor,
                                    f,
                                    g: tentativeG
                                });
                            }
                        }
                    }
                }
            }
            return null;
        }
    }

    const GHOST_MODE = {
        SCATTER: 'scatter',
        CHASE: 'chase',
        FRIGHTENED: 'frightened',
        EATEN: 'eaten',
    };

    class Ghost extends Entity {
        constructor(board, row, col, speed, color, scatterTarget) {
            super(board, row, col, speed);
            this.color = color;
            this.scatterTarget = scatterTarget;
            this.mode = GHOST_MODE.SCATTER;
            this.pathfinder = new Pathfinder(board);

            this.chaseTarget = null;
            this.path = [];
            this.pathIndex = 0;
            this.recalcPathTimer = 0;

            this.lastTarget = null;
            this.lastPos = {
                r: this.row,
                c: this.col
            };
        }

        setMode(mode) {
            this.mode = mode;
            if (mode === GHOST_MODE.FRIGHTENED) {
                this.dir = oppositeDirVector(this.dir);
            }
            this.path = [];
            this.pathIndex = 0;
        }

        update(dt, pacman) {
            this.recalcPathTimer -= dt;

            if (this.mode === GHOST_MODE.SCATTER) {
                this.chaseTarget = this.scatterTarget;
            } else if (this.mode === GHOST_MODE.CHASE) {
                this.chaseTarget = this.getChaseTarget(pacman);
            } else if (this.mode === GHOST_MODE.EATEN) {
                this.chaseTarget = {
                    r: 9,
                    c: 10
                };
            } else if (this.mode === GHOST_MODE.FRIGHTENED) {}

            const targetChanged = !this.lastTarget ||
                this.lastTarget.r !== this.chaseTarget.r || this.lastTarget.c !== this.chaseTarget.c;
            const positionChanged = this.row !== this.lastPos.r || this.col !== this.lastPos.c;

            if ((this.mode === GHOST_MODE.CHASE || this.mode === GHOST_MODE.SCATTER || this.mode === GHOST_MODE.EATEN) &&
                (this.recalcPathTimer <= 0 || this.path.length === 0 || this.pathIndex >= this.path.length || targetChanged || positionChanged)) {
                if (this.chaseTarget) {
                    const start = {
                        r: this.row,
                        c: this.col
                    };
                    const goal = this.chaseTarget;
                    const path = this.pathfinder.findPath(start, goal);
                    if (path && path.length > 1) {
                        this.path = path;
                        this.pathIndex = 1;
                        this.lastTarget = goal;
                        this.lastPos = start;
                    } else {
                        this.path = [];
                        this.pathIndex = 0;
                    }
                }
                this.recalcPathTimer = 0.3;
            }

            if (this.mode === GHOST_MODE.FRIGHTENED) {
                if (!this.moving) {
                    this.dir = this.chooseFrightenedDirection(pacman);
                    this.moving = true;
                    this.moveProgress = 0;
                }
            } else if (this.path.length > 1 && this.pathIndex < this.path.length) {
                if (!this.moving) {
                    const nextPos = this.path[this.pathIndex];
                    const dir = {
                        x: nextPos.c - this.col,
                        y: nextPos.r - this.row
                    };
                    this.dir = dir;
                    this.moving = true;
                    this.moveProgress = 0;
                    this.pathIndex++;
                }
            } else {
                if (!this.moving) {
                    const options = [DIRS.UP, DIRS.DOWN, DIRS.LEFT, DIRS.RIGHT].filter(d => this.canMove(d));
                    if (options.length > 0) {
                        const noReverse = options.filter(d => !(d.x === -this.dir.x && d.y === -this.dir.y));
                        this.dir = noReverse.length > 0 ? noReverse[Math.floor(Math.random() * noReverse.length)] : options[0];
                        this.moving = true;
                        this.moveProgress = 0;
                    }
                }
            }

            super.update(dt);
        }

        chooseFrightenedDirection(pacman) {
            const options = [DIRS.UP, DIRS.LEFT, DIRS.DOWN, DIRS.RIGHT].filter(d => {
                return this.canMove(d) && !(d.x === -this.dir.x && d.y === -this.dir.y);
            });
            if (options.length === 0) return oppositeDirVector(this.dir);

            let bestDir = options[0];
            let maxDist = -Infinity;
            for (const d of options) {
                const nr = this.row + d.y;
                const nc = this.col + d.x;
                const dist = Math.abs(nr - pacman.row) + Math.abs(nc - pacman.col);
                if (dist > maxDist) {
                    maxDist = dist;
                    bestDir = d;
                }
            }
            return bestDir;
        }

        draw(ctx) {
            const centerX = this.x + TILE_SIZE / 2;
            const centerY = this.y + TILE_SIZE / 2;
            const radius = TILE_SIZE / 2 - 3;

            if (this.mode === GHOST_MODE.FRIGHTENED) {
                ctx.fillStyle = '#0000FF';
                ctx.shadowColor = '#00FFFF';
                ctx.shadowBlur = 10;
            } else if (this.mode === GHOST_MODE.EATEN) {
                ctx.fillStyle = 'white';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(centerX - 6, centerY - 3, 5, 0, 2 * Math.PI);
                ctx.arc(centerX + 6, centerY - 3, 5, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(centerX - 6, centerY - 3, 2, 0, 2 * Math.PI);
                ctx.arc(centerX + 6, centerY - 3, 2, 0, 2 * Math.PI);
                ctx.fill();
                return;
            } else {
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 12;
            }

            ctx.beginPath();
            ctx.moveTo(centerX - radius, centerY + radius);
            ctx.lineTo(centerX + radius, centerY + radius);
            for (let i = 0; i < 6; i++) {
                const x = centerX + radius * Math.cos(Math.PI * i / 3);
                const y = centerY + radius * Math.sin(Math.PI * i / 3);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.ellipse(centerX - 6, centerY - 4, 5, 7, 0, 0, 2 * Math.PI);
            ctx.ellipse(centerX + 6, centerY - 4, 5, 7, 0, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            let pupilOffsetX = 0;
            let pupilOffsetY = 0;
            if (this.dir.x === 1) pupilOffsetX = 2;
            else if (this.dir.x === -1) pupilOffsetX = -2;
            if (this.dir.y === 1) pupilOffsetY = 2;
            else if (this.dir.y === -1) pupilOffsetY = -2;

            ctx.ellipse(centerX - 6 + pupilOffsetX, centerY - 4 + pupilOffsetY, 2.5, 3.5, 0, 0, 2 * Math.PI);
            ctx.ellipse(centerX + 6 + pupilOffsetX, centerY - 4 + pupilOffsetY, 2.5, 3.5, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        getChaseTarget(pacman) {
            return {
                r: pacman.row,
                c: pacman.col
            };
        }
    }

    class Blinky extends Ghost {
        constructor(board, row, col) {
            super(board, row, col, 4.5, '#FF0000', {
                r: 0,
                c: COLS - 1
            });
        }

        getChaseTarget(pacman) {
            return {
                r: pacman.row,
                c: pacman.col
            };
        }
    }

    class Pinky extends Ghost {
        constructor(board, row, col) {
            super(board, row, col, 4, '#FFC0CB', {
                r: 0,
                c: 0
            });
        }

        getChaseTarget(pacman) {
            const ahead = 4;
            let targetR = pacman.row + pacman.dir.y * ahead;
            let targetC = pacman.col + pacman.dir.x * ahead;

            targetR = clamp(targetR, 0, ROWS - 1);
            targetC = clamp(targetC, 0, COLS - 1);

            if (pacman.dir.y === -1 && pacman.dir.x === 0) {
                targetC = clamp(targetC - 4, 0, COLS - 1);
            }
            return {
                r: targetR,
                c: targetC
            };
        }
    }

    class Inky extends Ghost {
        constructor(board, row, col, blinky) {
            super(board, row, col, 3.5, '#00FFFF', {
                r: ROWS - 1,
                c: COLS - 1
            });
            this.blinky = blinky;
        }

        getChaseTarget(pacman) {
            const twoAheadR = pacman.row + pacman.dir.y * 2;
            const twoAheadC = pacman.col + pacman.dir.x * 2;

            let vectR = twoAheadR - this.blinky.row;
            let vectC = twoAheadC - this.blinky.col;

            let targetR = this.blinky.row + vectR * 2;
            let targetC = this.blinky.col + vectC * 2;

            targetR = clamp(targetR, 0, ROWS - 1);
            targetC = clamp(targetC, 0, COLS - 1);

            return {
                r: targetR,
                c: targetC
            };
        }
    }

    class Clyde extends Ghost {
        constructor(board, row, col) {
            super(board, row, col, 3, '#FFA500', {
                r: ROWS - 1,
                c: 0
            });
        }

        getChaseTarget(pacman) {
            const dist = Math.abs(this.row - pacman.row) + Math.abs(this.col - pacman.col);
            if (dist > 8) {
                return {
                    r: pacman.row,
                    c: pacman.col
                };
            } else {
                return this.scatterTarget;
            }
        }
    }

    function checkCollision(a, b, size = TILE_SIZE * 0.7) {
        return (
            a.x < b.x + size &&
            a.x + size > b.x &&
            a.y < b.y + size &&
            a.y + size > b.y
        );
    }

    class Game {
        constructor() {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');

            this.level = 1;
            this.levelThreshold = 1950;
            this.levelSpeeds = {
                1: {
                    pacman: 5,
                    blinky: 4.5,
                    pinky: 4,
                    inky: 3.5,
                    clyde: 3
                },
                2: {
                    pacman: 6,
                    blinky: 5.5,
                    pinky: 5,
                    inky: 4.5,
                    clyde: 4
                },
                3: {
                    pacman: 7,
                    blinky: 6.5,
                    pinky: 6,
                    inky: 5.5,
                    clyde: 5
                },
                4: {
                    pacman: 8,
                    blinky: 7.5,
                    pinky: 7,
                    inky: 6.5,
                    clyde: 6
                },
                5: {
                    pacman: 9,
                    blinky: 9,
                    pinky: 8.5,
                    inky: 7.5,
                    clyde: 7
                }
            };


            this.board = new Board(this.ctx);
            this.input = new Input();

            this.pacman = new Pacman(this.board, 15, 10);

            this.blinky = new Blinky(this.board, 9, 9);
            this.pinky = new Pinky(this.board, 9, 10);
            this.inky = new Inky(this.board, 11, 9, this.blinky);
            this.clyde = new Clyde(this.board, 11, 10);

            this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];

            this.modeTimer = 0;
            this.modeSchedule = [{
                    mode: GHOST_MODE.SCATTER,
                    duration: 7
                },
                {
                    mode: GHOST_MODE.CHASE,
                    duration: 20
                },
                {
                    mode: GHOST_MODE.SCATTER,
                    duration: 7
                },
                {
                    mode: GHOST_MODE.CHASE,
                    duration: 20
                },
                {
                    mode: GHOST_MODE.SCATTER,
                    duration: 5
                },
                {
                    mode: GHOST_MODE.CHASE,
                    duration: 9999
                },
            ];
            this.modeIndex = 0;

            this.scoreboard = document.getElementById('scoreboard');

            this.paused = false;
            this.input.onPauseChange(p => {
                this.paused = p;
            });

            this.lastTime = performance.now();

            this.reset();

            requestAnimationFrame(this.loop.bind(this));
        }
        showGameOver() {
            this.canvas.style.display = 'none';
            this.scoreboard.style.display = 'none';

            const gameOverScreen = document.getElementById('gameOverScreen');
            gameOverScreen.style.display = 'block';

            document.getElementById('finalScore').textContent = `Score: ${this.pacman.score}`;

            const storedHighScore = localStorage.getItem('pacmanHighScore') || 0;
            const highScore = Math.max(this.pacman.score, storedHighScore);
            localStorage.setItem('pacmanHighScore', highScore);
            document.getElementById('highScore').textContent = `High Score: ${highScore}`;
        }

        restartGame() {
            document.getElementById('gameOverScreen').style.display = 'none';

            this.canvas.style.display = 'block';
            this.scoreboard.style.display = 'block';
            this.reset();
            this.paused = false;
        }

        reset() {
            this.board.resetPellets();
            this.pacman.row = 15;
            this.pacman.col = 10;
            this.pacman.x = this.pacman.col * TILE_SIZE;
            this.pacman.y = this.pacman.row * TILE_SIZE;
            this.pacman.lives = 3;
            this.pacman.score = 0;
            this.pacman.dir = DIRS.NONE;
            this.pacman.nextDir = DIRS.NONE;
            this.pacman.moving = false;

            this.ghosts.forEach(g => {
                g.row = 9;
                g.col = 9;
                g.x = g.col * TILE_SIZE;
                g.y = g.row * TILE_SIZE;
                g.dir = DIRS.LEFT;
                g.moving = false;
                g.setMode(GHOST_MODE.SCATTER);
            });

            this.modeTimer = 0;
            this.modeIndex = 0;
            this.updateMode();

            this.updateScoreboard();
        }

        updateMode() {
            const modeEntry = this.modeSchedule[this.modeIndex];
            this.ghosts.forEach(g => g.setMode(modeEntry.mode));
            this.modeTimer = modeEntry.duration;
            this.modeIndex = (this.modeIndex + 1) % this.modeSchedule.length;
        }

        updateScoreboard() {
            this.scoreboard.textContent = `Score: ${this.pacman.score} | Lives: ${this.pacman.lives} | Level: 1`;
        }

        loop(now) {
            const dt = (now - this.lastTime) / 1000;
            this.lastTime = now;

            if (!this.paused) {
                this.update(dt);
            }

            this.draw();

            requestAnimationFrame(this.loop.bind(this));
        }

        update(dt) {
            this.modeTimer -= dt;
            if (this.modeTimer <= 0) {
                this.updateMode();
            }

            this.pacman.nextDir = this.input.nextDir;
            this.pacman.update(dt);

            const pacmanCenterX = this.pacman.x + TILE_SIZE / 2;
            const pacmanCenterY = this.pacman.y + TILE_SIZE / 2;

            if (this.board.hasPelletAtPixel(pacmanCenterX, pacmanCenterY)) {
                const row = Math.floor(pacmanCenterY / TILE_SIZE);
                const col = Math.floor(pacmanCenterX / TILE_SIZE);

                if (this.board.isPowerPellet(row, col)) {
                    this.pacman.isPoweredUp = true;
                    this.pacman.powerUpTimer = 10;
                    this.pacman.speed = this.pacman.normalSpeed * 2;
                    this.ghosts.forEach(g => g.setMode(GHOST_MODE.FRIGHTENED));
                }

                if (this.board.eatPelletAtPixel(pacmanCenterX, pacmanCenterY)) {
                    this.pacman.score += 10;
                }
            }

            this.ghosts.forEach(ghost => ghost.update(dt, this.pacman));
            this.ghosts.forEach(ghost => {
                if (checkCollision(this.pacman, ghost)) {
                    if (ghost.mode === GHOST_MODE.FRIGHTENED) {
                        // Eat ghost: send ghost to eaten mode and add score
                        ghost.setMode(GHOST_MODE.EATEN);
                        this.pacman.score += 200;
                    } else if (ghost.mode !== GHOST_MODE.EATEN) {
                        // Pac-Man loses a life and reset positions
                        this.pacman.lives--;
                        if (this.pacman.lives <= 0) {
                            this.showGameOver();
                        } else {
                            this.pacman.row = 15;
                            this.pacman.col = 10;
                            this.pacman.x = this.pacman.col * TILE_SIZE;
                            this.pacman.y = this.pacman.row * TILE_SIZE;
                            this.pacman.dir = DIRS.NONE;
                            this.pacman.nextDir = DIRS.NONE;
                            this.pacman.moving = false;

                            this.ghosts.forEach(g => {
                                g.row = 9;
                                g.col = 9;
                                g.x = g.col * TILE_SIZE;
                                g.y = g.row * TILE_SIZE;
                                g.dir = DIRS.LEFT;
                                g.moving = false;
                                g.setMode(GHOST_MODE.SCATTER);
                            });

                            this.modeTimer = 0;
                            this.modeIndex = 0;
                            this.updateMode();
                        }
                    }
                }
            });

            this.updateScoreboard();
        }

        draw() {
            this.board.draw();
            this.pacman.draw(this.ctx);
            this.ghosts.forEach(g => g.draw(this.ctx));
        }
    }

    window.game = new Game();

    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('scoreboard').style.display = 'block';
        document.getElementById('gameCanvas').style.display = 'block';

        if (typeof startGame === 'function') {
            startGame();
        }

        document.getElementById('restartButton').addEventListener('click', () => {
            window.game.restartGame();
        });

    });


})();
