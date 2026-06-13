let agricultor;
let gotas = [];
let flores = [];
let nuvens = [];
let pontos = 0;
let angulo = 0;
let venceu = false;

function setup() {
  createCanvas(900, 500);

  // Agricultor
  agricultor = {
    x: width / 2,
    y: 420,
    tamanho: 40
  };

  // Flores
  criarFlores();

  // Nuvens
  for (let i = 0; i < 5; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 150),
      tamanho: random(50, 100)
    });
  }
}

function criarFlores() {
  flores = [];
  for (let i = 0; i < 10; i++) {
    flores.push({
      x: 60 + i * 80,
      crescimento: 20,
      corPetala: color(random(255), random(255), random(255))
    });
  }
}

function draw() {
  background(135, 206, 235); // Céu

  desenharNuvens();

  // Sol
  fill(255, 220, 0);
  circle(800, 80, 70);

  // Gramado
  fill(80, 180, 80);
  rect(0, 350, width, 150);

  // Moinho de vento
  desenharMoinho();

  // Jogador
  if (!venceu) {
    moverAgricultor();
  }
  desenharAgricultor();

  // Flores
  desenharFlores();

  // Gotas de água
  for (let i = gotas.length - 1; i >= 0; i--) {
    let g = gotas[i];
    fill(0, 150, 255);
    ellipse(g.x, g.y, 10);
    g.y += 5;

    for (let f of flores) {
      if (g.x > f.x - 20 && g.x < f.x + 20 && g.y > 320) {
        if (f.crescimento < 100) {
          f.crescimento += 5;
          pontos++;
        }
        gotas.splice(i, 1);
        break;
      }
    }

    if (g.y > height) {
      gotas.splice(i, 1);
    }
  }

  fill(0);
  textSize(24);
  text("Flores irrigadas: " + pontos, 20, 40);

  if (floresProntas()) {
    venceu = true;
  }

  // Tela de vitória
  if (venceu) {
    background(100, 200, 100, 200);
    textAlign(CENTER);
    fill(0);
    textSize(40);
    text("FAZENDA SUSTENTÁVEL!", width / 2, 200);
    textSize(25);
    text("Pressione R para jogar novamente", width / 2, 260);
  }
}

function moverAgricultor() {
  if (keyIsDown(LEFT_ARROW)) {
    agricultor.x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    agricultor.x += 5;
  }
  agricultor.x = constrain(agricultor.x, 20, width - 20);
}

function desenharAgricultor() {
  push();
  translate(agricultor.x, agricultor.y);
  // Corpo
  fill(0, 0, 255);
  rect(-15, -40, 30, 40);
  // Pernas
  fill(50);
  rect(-15, 0, 10, 20);
  rect(5, 0, 10, 20);
  // Braços
  fill(255, 200, 150);
  rect(-25, -35, 10, 30);
  rect(15, -35, 10, 30);
  // Cabeça
  fill(255, 200, 150);
  ellipse(0, -50, 25);
  // Chapéu
  fill(150, 75, 0);
  arc(0, -57, 35, 15, PI, 0, CHORD);
  pop();
}

function desenharFlores() {
  for (let f of flores) {
    // Tronco
    stroke(0, 120, 0);
    strokeWeight(4);
    line(f.x, 350, f.x, 350 - f.crescimento);

    // Pétalas
    noStroke();
    fill(f.corPetala);
    let tamanho = f.crescimento / 2 + 5;
    ellipse(f.x, 350 - f.crescimento, tamanho, tamanho);
    ellipse(f.x - tamanho / 2, 350 - f.crescimento + tamanho / 2, tamanho, tamanho);
    ellipse(f.x + tamanho / 2, 350 - f.crescimento + tamanho / 2, tamanho, tamanho);

    // Centro da flor
    fill(255, 204, 0);
    ellipse(f.x, 350 - f.crescimento, tamanho / 2, tamanho / 2);
  }
}

function desenharMoinho() {
  fill(220);
  rect(60, 180, 15, 170); // torre

  push();
  translate(67, 180);
  rotate(angulo);
  strokeWeight(5);
  stroke(180);
  line(0, 0, 50, 0);
  line(0, 0, -25, 43);
  line(0, 0, -25, -43);
  pop();

  angulo += 0.05;
}

function floresProntas() {
  for (let f of flores) {
    if (f.crescimento < 100) {
      return false;
    }
  }
  return true;
}

function desenharNuvens() {
  for (let n of nuvens) {
    fill(255);
    noStroke();
    ellipse(n.x, n.y, n.tamanho, n.tamanho / 2);
    ellipse(n.x + 30, n.y + 10, n.tamanho, n.tamanho / 2);
    ellipse(n.x - 30, n.y + 10, n.tamanho, n.tamanho / 2);

    // Movimenta nuvem
    n.x += 0.3;
    if (n.x > width + 50) n.x = -50;
  }
}

function keyPressed() {
  if (key === ' ' && !venceu) {
    gotas.push({ x: agricultor.x + 35, y: agricultor.y });
  }

  if (key === 'r' || key === 'R') {
    venceu = false;
    pontos = 0;
    gotas = [];
    criarFlores();
  }
}