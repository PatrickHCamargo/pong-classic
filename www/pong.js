const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

// ── Modo de jogo ────────────────────────────────────────────────────────────
let gameMode = 'cpu'; // 'cpu' | '2p'

function setMode(mode) {
    gameMode = mode;
    document.getElementById('btn-vs-cpu').classList.toggle('active', mode === 'cpu');
    document.getElementById('btn-vs-p2' ).classList.toggle('active', mode === '2p');

    const ctrl2 = document.getElementById('ctrl-p2');
    const lbl2  = ctrl2.querySelector('.ctrl-label');

    if (mode === '2p') {
        lbl2.textContent = 'J2';
        ctrl2.style.opacity = '1';
        document.getElementById('p2up'  ).disabled = false;
        document.getElementById('p2down').disabled = false;
    } else {
        lbl2.textContent = 'CPU';
        ctrl2.style.opacity = '0.35';
        document.getElementById('p2up'  ).disabled = true;
        document.getElementById('p2down').disabled = true;
    }
    reset();
}

// ── Tamanho responsivo ──────────────────────────────────────────────────────
function resize() {
    // Desconta os botões laterais (~15% de cada lado) + gaps
    const btnW  = document.getElementById('ctrl-p1').offsetWidth || 70;
    const gap   = 16;
    const avail = window.innerWidth - (btnW * 2) - (gap * 2) - 16;

    const maxW = Math.min(avail, 700);
    const maxH = Math.min(window.innerHeight * 0.60, 350);
    const ratio = 2;

    let w = maxW;
    let h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }

    canvas.width  = Math.floor(w);
    canvas.height = Math.floor(h);

    reset();
}

// ── Estado ──────────────────────────────────────────────────────────────────
const PADDLE_RATIO   = 0.25;
const PADDLE_W_RATIO = 0.018;

let ballX, ballY, ballSpeedX, ballSpeedY;
let p1Y, p2Y;
let p1Score = 0, p2Score = 0;

function paddleH()   { return canvas.height * PADDLE_RATIO; }
function paddleW()   { return Math.max(8, canvas.width * PADDLE_W_RATIO); }
function ballR()     { return Math.max(6, canvas.width * 0.013); }
function baseSpeed() { return canvas.width * 0.006; }

function reset() {
    if (!canvas.width) return;
    ballX = canvas.width  / 2;
    ballY = canvas.height / 2;

    const speed = baseSpeed();
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * speed;
    ballSpeedY = (Math.random() * 2 - 1) * speed;

    p1Y = (canvas.height - paddleH()) / 2;
    p2Y = (canvas.height - paddleH()) / 2;
}

// ── Estado dos botões (pressionado / não pressionado) ───────────────────────
const keys = { p1up: false, p1down: false, p2up: false, p2down: false };

function bindBtn(id, key) {
    const el = document.getElementById(id);

    // Touch
    el.addEventListener('touchstart', e => { e.preventDefault(); keys[key] = true;  }, { passive: false });
    el.addEventListener('touchend',   e => { e.preventDefault(); keys[key] = false; }, { passive: false });
    el.addEventListener('touchcancel',e => { e.preventDefault(); keys[key] = false; }, { passive: false });

    // Mouse / clique
    el.addEventListener('mousedown',  () => keys[key] = true );
    el.addEventListener('mouseup',    () => keys[key] = false);
    el.addEventListener('mouseleave', () => keys[key] = false);
}

bindBtn('p1up',   'p1up');
bindBtn('p1down', 'p1down');
bindBtn('p2up',   'p2up');
bindBtn('p2down', 'p2down');

// Teclado (bônus: WASD + setas)
document.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'W') keys.p1up   = true;
    if (e.key === 's' || e.key === 'S') keys.p1down = true;
    if (e.key === 'ArrowUp')            keys.p2up   = true;
    if (e.key === 'ArrowDown')          keys.p2down = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'w' || e.key === 'W') keys.p1up   = false;
    if (e.key === 's' || e.key === 'S') keys.p1down = false;
    if (e.key === 'ArrowUp')            keys.p2up   = false;
    if (e.key === 'ArrowDown')          keys.p2down = false;
});

// ── Lógica ──────────────────────────────────────────────────────────────────
function clamp(y) {
    return Math.max(0, Math.min(canvas.height - paddleH(), y));
}

function moveEverything() {
    const ph      = paddleH();
    const pw      = paddleW();
    const r       = ballR();
    const pSpeed  = baseSpeed() * 1.4; // velocidade das raquetes

    // Mover J1 pelos botões
    if (keys.p1up)   p1Y -= pSpeed;
    if (keys.p1down) p1Y += pSpeed;
    p1Y = clamp(p1Y);

    // Mover J2 pelos botões (ou IA)
    if (gameMode === '2p') {
        if (keys.p2up)   p2Y -= pSpeed;
        if (keys.p2down) p2Y += pSpeed;
        p2Y = clamp(p2Y);
    } else {
        // IA simples
        const center   = p2Y + ph / 2;
        const aiSpeed  = baseSpeed() * 0.85;
        if (center < ballY - 5) p2Y += aiSpeed;
        else if (center > ballY + 5) p2Y -= aiSpeed;
        p2Y = clamp(p2Y);
    }

    // Mover bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Topo / baixo
    if (ballY - r < 0) {
        ballY = r;
        ballSpeedY = Math.abs(ballSpeedY);
    }
    if (ballY + r > canvas.height) {
        ballY = canvas.height - r;
        ballSpeedY = -Math.abs(ballSpeedY);
    }

    // Colisão raquete J1 (esquerda)
    if (ballX - r < pw && ballY > p1Y && ballY < p1Y + ph) {
        ballX      = pw + r;
        ballSpeedX = Math.abs(ballSpeedX) * 1.05;
        const hit  = (ballY - p1Y) / ph - 0.5;
        ballSpeedY = hit * baseSpeed() * 3;
    }

    // Colisão raquete J2 (direita)
    const p2X = canvas.width - pw;
    if (ballX + r > p2X && ballY > p2Y && ballY < p2Y + ph) {
        ballX      = p2X - r;
        ballSpeedX = -Math.abs(ballSpeedX) * 1.05;
        const hit  = (ballY - p2Y) / ph - 0.5;
        ballSpeedY = hit * baseSpeed() * 3;
    }

    // Ponto
    if (ballX - r < 0) {
        p2Score++;
        document.getElementById('p2score').textContent = p2Score;
        reset();
    }
    if (ballX + r > canvas.width) {
        p1Score++;
        document.getElementById('p1score').textContent = p1Score;
        reset();
    }
}

function drawEverything() {
    const r  = ballR();
    const pw = paddleW();
    const ph = paddleH();

    // Fundo
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Linha central
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Raquete J1 (branca)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, p1Y, pw, ph);

    // Raquete J2 (vermelha)
    ctx.fillStyle = "#f55";
    ctx.fillRect(canvas.width - pw, p2Y, pw, ph);

    // Bola
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ballX, ballY, r, 0, Math.PI * 2);
    ctx.fill();
}

function update() {
    moveEverything();
    drawEverything();
    requestAnimationFrame(update);
}

// ── Init ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', resize);

// Espera o DOM renderizar os botões antes de calcular tamanho
requestAnimationFrame(() => {
    resize();
    setMode('cpu');
    update();

    const isTouch = 'ontouchstart' in window;
    document.getElementById('hint').textContent = isTouch
        ? '📱 Use os botões para mover | Troque o modo acima'
        : '⌨️  W/S = J1 · ↑/↓ = J2 · ou use os botões';
});
