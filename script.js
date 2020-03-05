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
    {
      locarion: ['26', '36', '46', '56'],
      hit: ['', '', '', ''],
    },
    {
      locarion: ['11', '12', '13'],
      hit: ['', '', ''],
    },
    {
      locarion: ['69', '79'],
      hit: ['', ''],
    },
    {
      locarion: ['32'],
      hit: [''],
    },
  ],
  shipcount: 4,
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
  if (target.classList.contains('miss') || target.tagName !== 'TD') {
    return;
  }
  show.miss(target);
  gameState.updateData = 'shot';

  for (let i = 0; i < feild.ships.length; i += 1) {
    const ship = feild.ships[i];
    const index = ship.locarion.indexOf(target.id);
    const isHitting = index >= 0;
    if (isHitting) {
      show.hit(target);
      gameState.updateData = 'hit';
      ship.hit[index] = 'x';
      const isDead = ship.hit.indexOf('') === -1;
      if (isDead) {
        gameState.updateData = 'dead';
        for (const cell of ship.locarion) {
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

  again.addEventListener('click', () => {
    location.reload();
  });
};

init();
