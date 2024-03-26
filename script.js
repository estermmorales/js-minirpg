let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "Bastão", power: 5 },
  { name: "Adaga", power: 30 },
  { name: "Marreta", power: 50 },
  { name: "Espada", power: 100 },
];
const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15,
  },
  {
    name: "Besta Feroz",
    level: 8,
    health: 60,
  },
  {
    name: "Dragão",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": ["Ir para loja", "Ir para caverna", "Lutar contra o dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Você está na praça da cidade. Você vê uma placa que diz "Loja".',
  },
  {
    name: "store",
    "button text": [
      "Comprar 10 de vida (10 de ouro)",
      "Comprar arma (30 de ouro)",
      "Ir para praça da cidade",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na loja.",
  },
  {
    name: "cave",
    "button text": [
      "Lutar contra slime",
      "Lutar contra besta feroz",
      "Ir para praça da cidade",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna. Você vê alguns monstros.",
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando contra um monstro.",
  },
  {
    name: "kill monster",
    "button text": [
      "Ir para praça da cidade",
      "Ir para praça da cidade",
      "Ir para praça da cidade",
    ],
    "button functions": [goTown, goTown, goTown],
    text: 'O monstro grita "Arg!" enquanto morre. Você ganha pontos de experiência e encontra moedas.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Você morre. ☠️",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Você derrota o dragão! VOCÊ VENCE O JOGO! 🎉",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente para comprar vida.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = `Agora você tem um(a) ${newWeapon}.`;
      inventory.push(newWeapon);
      text.innerText += ` No seu inventário você tem: ${inventory}`;
    } else {
      text.innerText = "Você não tem ouro suficiente para comprar uma arma.";
    }
  } else {
    text.innerText = "Você já tem a arma mais poderosa!";
    button2.innerText = "Vender arma por 15 de ouro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = `Você vendeu um(a) ${currentWeapon}.`;
    text.innerText += ` No seu inventário você tem: ${inventory}`;
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  fighting === 1
    ? (text.innerText = `A ${monsters[fighting].name} ataca.`)
    : (text.innerText = `O ${monsters[fighting].name} ataca.`);
  currentWeapon === 0
    ? (text.innerText += ` Você ataca com seu ${weapons[currentWeapon].name}.`)
    : (text.innerText += ` Você ataca com sua ${weapons[currentWeapon].name}.`);
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Você erra.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += ` Sua ${inventory.pop()} quebra.`;
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  fighting === 1
    ? (text.innerText = `Você esquiva do ataque da ${monsters[fighting].name}`)
    : (text.innerText = `Você esquiva do ataque do ${monsters[fighting].name}`);
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["bastão"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = `Você escolheu ${guess}. Aqui estão os números aleatórios: \n`;
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Correto! Você ganhou 20 de ouro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errado! Você perdeu 10 de vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
