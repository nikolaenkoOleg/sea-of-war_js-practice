/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const gameField = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const gameState = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,
  set updateData(data) {
    this[data] += 1;
    this.render();
  },
  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  },
};

const feild = {
  ships: [

  ],
  shipcount: 0,
  optionShip: {
    count: [1, 2, 3, 4],
    size: [4, 3, 2, 1],
  },
  collision: new Set(),
  generateShip() {
    for (let i = 0; i < this.optionShip.count.length; i += 1) {
      for (let j = 0; j < this.optionShip.count[i]; j += 1) {
        const size = this.optionShip.size[i];
        const ship = this.generateOptionsShip(size);
        this.ships.push(ship);
        this.shipcount += 1;
      }
    }
  },
  generateOptionsShip(shipSize) {
    const ship = {
      hit: [],
      location: [],
    };

    const horizontal = true;
    const vertical = false;
    const direction = Math.random() < 0.5;

    let x;
    let y;

    const tableRow = 10;
    if (direction === horizontal) {
      x = Math.floor(Math.random() * tableRow);
      y = Math.floor(Math.random() * (tableRow - shipSize));
    }

    if (direction === vertical) {
      x = Math.floor(Math.random() * (tableRow - shipSize));
      y = Math.floor(Math.random() * tableRow);
    }


    for (let i = 0; i < shipSize; i += 1) {
      if (direction === horizontal) {
        const newY = y + i;
        ship.location.push(`${x}${newY}`);
      }

      if (direction === vertical) {
        const newX = x + i;
        ship.location.push(`${newX}${y}`);
      }

      ship.hit.push('');
    }

    if (this.checkCollision(ship.location)) {
      return this.generateOptionsShip(shipSize);
    }

    this.addCollision(ship.location);

    return ship;
  },
  checkCollision(location) {
    for (const coord of location) {
      if (this.collision.has(coord)) {
        return true;
      }
    }

    return false;
  },
  addCollision(location) {
    // добавление коллизий для кораблей по принципу: 3 ячейки сверху и cнизу от ячейки корабля
    // и по ячейке слева и справа
    for (let i = 0; i < location.length; i += 1) {
      const x = 0; // первая координата
      const startCoordX = location[i][x] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j += 1) {
        const y = 1; // вторая координата
        const startCoordY = location[i][y] - 1;
        for (let z = startCoordY; z < startCoordY + 3; z += 1) {
          const leftBorder = 0;
          const rigthBorder = 10;
          if (j >= leftBorder && j < rigthBorder && z >= leftBorder && z < rigthBorder) {
            const collisionCoord = `${j}${z}`;
            this.collision.add(collisionCoord);
          }
        }
      }
    }
  },
};

const show = {
  hit(elem) {
    this.changeClass(elem, 'hit');
  },
  miss(elem) {
    this.changeClass(elem, 'miss');
  },
  dead(elem) {
    this.changeClass(elem, 'dead');
  },
  changeClass(elem, value) {
    elem.className = value;
  },
};

const fire = (event) => {
  const { target } = event;
  if (target.classList.contains('miss')
    || target.tagName !== 'TD'
    || target.classList.contains('hit')
    || target.classList.contains('dead')
    || feild.shipcount === 0) {
    return;
  }
  show.miss(target);
  gameState.updateData = 'shot';

  for (let i = 0; i < feild.ships.length; i += 1) {
    const ship = feild.ships[i];
    const index = ship.location.indexOf(target.id);
    const isHitting = index >= 0;
    if (isHitting) {
      show.hit(target);
      gameState.updateData = 'hit';
      ship.hit[index] = 'x';
      const isDead = ship.hit.indexOf('') === -1;
      if (isDead) {
        gameState.updateData = 'dead';
        for (const cell of ship.location) {
          show.dead(document.getElementById(cell));
        }

        feild.shipcount -= 1;
        if (feild.shipcount === 0) {
          header.textContent = 'Игра окончена!';
          header.style.color = 'red';

          if (gameState.shot < gameState.record || gameState.record === 0) {
            localStorage.setItem('seaBattleRecord', gameState.shot);
            gameState.record = gameState.shot;
            gameState.render();
          }
        }
      }
    }
  }
};

const init = () => {
  gameField.addEventListener('click', fire);
  gameState.render();
  feild.generateShip();

  again.addEventListener('click', () => { // перезагрузка игры, без релоада
    gameState.record = localStorage.getItem('seaBattleRecord') || 0;
    gameState.shot = 0;
    gameState.hit = 0;
    gameState.dead = 0;
    gameState.render();

    const cells = document.querySelectorAll('td');
    cells.forEach((cell) => {
      cell.removeAttribute('class');
    });
  });

  record.addEventListener('dblclick', () => {
    localStorage.clear();
    gameState.record = 0;
    gameState.render();
  });
};

init();
