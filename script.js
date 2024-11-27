
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const arena = createMatrix(12, 20);
const player = {
    pos: { x: 5, y: 0 },
    matrix: createPiece('T'),
};

let dropCounter = 0;
let dropInterval = 1000; // Drop every second
let lastTime = 0;

let score = 0;
let level = 1;
const compliments = [
    "Del, olet mahtava!",
    "Hyvää syntymäpäivää, Del!",
    "Del, sinä loistat!",
    "Ihanaa päivää, Del!",
    "Del, hymyile, se pukee sinua!",
    "Del, paras olet!",
    "Kiitos että olet sinä, Del!",
    "Del on numero yksi!",
    "Vau, mikä tyyppi, Del!",
    "Taidat olla Tetris-mestari, Del!",
    "Upea ihminen, Del!",
    "Tee se, mihin uskot, Del!",
    "Del, olet tähti!",
    "Mahtava pelitaito, Del!",
    "Onnea matkaan, Del!",
    "Sinä selviät tästä, Del!",
    "Ihailen asennettasi, Del!",
    "Hymyile lisää, Del!",
    "Del, olet tärkeä!",
    "Mikä energia, Del!",
    "Loistavaa työtä, Del!",
    "Täydellinen päivä sinulle, Del!",
    "Rakkautta ja iloa, Del!",
    "Uskalla unelmoida, Del!",
    "Del, olet niin fiksu!",
    "Ihailtava tyyppi, Del!",
    "Hyvin tehty, Del!",
    "Näytät upealta, Del!",
    "Sinä olet erityinen, Del!",
    "Jatka samaan malliin, Del!",
    "Sinä teet eron, Del!",
    "Del, olet ystävällinen!",
    "Kiitos että olet olemassa, Del!",
    "Uskomaton tyyppi olet, Del!",
    "Wow, olet taitava, Del!",
    "Del, olet rautaa!",
    "Mahtava synttäri, Del!",
    "Onnellisuutta päivään, Del!",
    "Tee oma juttusi, Del!",
    "Loistat aina, Del!",
    "Del, sinä inspiroit!",
    "Päivän paras, Del!",
    "Loistava peli, Del!",
    "Olet superhyvä, Del!",
    "Rakastettava tyyppi, Del!",
    "Del voittaa aina!",
    "Sinä olet sankari, Del!",
    "Olet uskomaton, Del!",
    "Mikä lahjakkuus, Del!",
    "Del, olet timantti!"
];

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } // Add more pieces if needed
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'blue';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (
                m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        score += rowCount * 10;
        rowCount *= 2;
    }
}

function playerReset() {
    player.matrix = createPiece('T');
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2) | 0;
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        score = 0;
        updateScore();
    }
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function updateScore() {
    document.getElementById('score').innerText = score;
    document.getElementById('compliment').innerText =
        compliments[Math.floor(Math.random() * compliments.length)];
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        player.pos.x--;
        if (collide(arena, player)) {
            player.pos.x++;
        }
    } else if (event.key === 'ArrowRight') {
        player.pos.x++;
        if (collide(arena, player)) {
            player.pos.x--;
        }
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        rotate(player.matrix, 1);
        if (collide(arena, player)) {
            rotate(player.matrix, -1);
        }
    }
});

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

playerReset();
update();
