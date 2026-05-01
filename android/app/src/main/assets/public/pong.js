// ============================================================
// PONG CLASSIC — pong.js
// Estrutura:
//   1. Skins
//   2. Estado global
//   3. Navegação entre telas
//   4. Lógica das skins + timer de anúncio
//   5. Controles (toque por zona)
//   6. Física do jogo
//   7. Renderização (desenho)
//   8. Loop principal
//   9. Inicialização
// ============================================================


// ════════════════════════════════════════════════════════════
// 1. SKINS
// ════════════════════════════════════════════════════════════

/*
 * O que é uma skin aqui?
 * É um objeto com cores e funções de desenho customizadas.
 * Ao trocar de skin, atualizamos as variáveis CSS (--bg, --accent etc.)
 * e o canvas passa a usar as funções de desenho da skin ativa.
 *
 * Cada skin tem:
 *   - name: nome exibido
 *   - free: true = sempre disponível, false = precisa de anúncio
 *   - vars: variáveis CSS a aplicar no :root
 *   - drawBall(ctx, x, y, r): como desenhar a bola
 *   - drawPaddle(ctx, x, y, w, h, side): como desenhar a raquete
 *   - drawBg(ctx, w, h): como desenhar o fundo
 *   - drawDivider(ctx, w, h): como desenhar a linha divisória
 */

const SKINS = {

    // ── Skin 1: Classic ──────────────────────────────────────
    classic: {
        name: 'CLASSIC',
        free: true,
        preview: '#ffffff',
        vars: {
            '--bg':         '#000000',
            '--accent':     '#ffffff',
            '--text':       '#ffffff',
            '--subtext':    '#666666',
            '--glow':       'rgba(255,255,255,0.3)',
            '--btn-bg':     'rgba(255,255,255,0.06)',
            '--btn-border': 'rgba(255,255,255,0.15)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
        },
        drawDivider(ctx, w, h) {
            ctx.setLineDash([8, 8]);
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
        },
        drawPaddle(ctx, x, y, w, h) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(x, y, w, h);
        },
        drawBall(ctx, x, y, r) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        },
    },

    // ── Skin 2: Neon ─────────────────────────────────────────
    neon: {
        name: 'NEON',
        free: true,
        preview: '#00ffcc',
        vars: {
            '--bg':         '#030310',
            '--accent':     '#00ffcc',
            '--text':       '#00ffcc',
            '--subtext':    '#006655',
            '--glow':       'rgba(0,255,200,0.5)',
            '--btn-bg':     'rgba(0,255,200,0.06)',
            '--btn-border': 'rgba(0,255,200,0.2)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#030310';
            ctx.fillRect(0, 0, w, h);
        },
        drawDivider(ctx, w, h) {
            ctx.setLineDash([6, 6]);
            ctx.strokeStyle = 'rgba(0,255,200,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
        },
        drawPaddle(ctx, x, y, w, h, side) {
            const color = side === 'p1' ? '#00ffcc' : '#ff00aa';
            ctx.shadowColor = color;
            ctx.shadowBlur = 18;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.shadowBlur = 0;
        },
        drawBall(ctx, x, y, r) {
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 24;
            ctx.fillStyle = '#00ffcc';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        },
    },

    // ── Skin 3: Retro ─────────────────────────────────────────
    retro: {
        name: 'RETRO',
        free: true,
        preview: '#33ff33',
        vars: {
            '--bg':         '#001100',
            '--accent':     '#33ff33',
            '--text':       '#33ff33',
            '--subtext':    '#115511',
            '--glow':       'rgba(50,255,50,0.4)',
            '--btn-bg':     'rgba(50,255,50,0.05)',
            '--btn-border': 'rgba(50,255,50,0.2)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#001100';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            for (let y = 0; y < h; y += 4) {
                ctx.fillRect(0, y, w, 1);
            }
        },
        drawDivider(ctx, w, h) {
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(50,255,50,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
        },
        drawPaddle(ctx, x, y, w, h) {
            ctx.fillStyle = '#33ff33';
            for (let py = y; py < y + h; py += 4) {
                for (let px = x; px < x + w; px += 4) {
                    ctx.fillRect(px, py, 3, 3);
                }
            }
        },
        drawBall(ctx, x, y, r) {
            ctx.fillStyle = '#33ff33';
            ctx.fillRect(x - r, y - r, r * 2, r * 2);
        },
    },

    // ── Skin 4: Cyber (anuncio) ───────────────────────────────
    cyber: {
        name: 'CYBER',
        free: false,
        preview: '#7700ff',
        vars: {
            '--bg':         '#07000f',
            '--accent':     '#aa00ff',
            '--text':       '#cc88ff',
            '--subtext':    '#440066',
            '--glow':       'rgba(170,0,255,0.5)',
            '--btn-bg':     'rgba(170,0,255,0.08)',
            '--btn-border': 'rgba(170,0,255,0.25)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#07000f';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(100,0,200,0.08)';
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 24) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += 24) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
        },
        drawDivider(ctx, w, h) {
            ctx.strokeStyle = 'rgba(170,0,255,0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        },
        drawPaddle(ctx, x, y, w, h, side) {
            const color = side === 'p1' ? '#aa00ff' : '#00aaff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(x, y, w, 2);
            ctx.shadowBlur = 0;
        },
        drawBall(ctx, x, y, r) {
            ctx.shadowColor = '#aa00ff';
            ctx.shadowBlur = 30;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.5, '#aa00ff');
            grad.addColorStop(1, '#440088');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        },
    },

    // ── Skin 5: Fire vs Ice (anuncio) ────────────────────────
    fire: {
        name: 'FIRE/ICE',
        free: false,
        preview: '#ff4400',
        vars: {
            '--bg':         '#080808',
            '--accent':     '#ff6600',
            '--text':       '#ffaa44',
            '--subtext':    '#664422',
            '--glow':       'rgba(255,80,0,0.5)',
            '--btn-bg':     'rgba(255,80,0,0.08)',
            '--btn-border': 'rgba(255,80,0,0.25)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#080808';
            ctx.fillRect(0, 0, w, h);
            const gTop = ctx.createLinearGradient(0, 0, 0, h / 2);
            gTop.addColorStop(0, 'rgba(0,100,255,0.06)');
            gTop.addColorStop(1, 'transparent');
            ctx.fillStyle = gTop;
            ctx.fillRect(0, 0, w, h / 2);
            const gBot = ctx.createLinearGradient(0, h / 2, 0, h);
            gBot.addColorStop(0, 'transparent');
            gBot.addColorStop(1, 'rgba(255,60,0,0.06)');
            ctx.fillStyle = gBot;
            ctx.fillRect(0, h / 2, w, h / 2);
        },
        drawDivider(ctx, w, h) {
            const grad = ctx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0,   'rgba(0,120,255,0.6)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
            grad.addColorStop(1,   'rgba(255,80,0,0.6)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        },
        drawPaddle(ctx, x, y, w, h, side) {
            const color = side === 'p1' ? '#ff4400' : '#0088ff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 22;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.shadowBlur = 0;
        },
        drawBall(ctx, x, y, r) {
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 28;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, '#ffaa00');
            grad.addColorStop(1, '#ff2200');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        },
    },

    // ── Skin 6: Galaxy (anuncio) ──────────────────────────────
    galaxy: {
        name: 'GALAXY',
        free: false,
        preview: '#4488ff',
        stars: null,
        vars: {
            '--bg':         '#00000a',
            '--accent':     '#4488ff',
            '--text':       '#88aaff',
            '--subtext':    '#223355',
            '--glow':       'rgba(68,136,255,0.5)',
            '--btn-bg':     'rgba(68,136,255,0.06)',
            '--btn-border': 'rgba(68,136,255,0.2)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#00000a';
            ctx.fillRect(0, 0, w, h);
            if (!this.stars) {
                this.stars = Array.from({ length: 80 }, () => ({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.2 + 0.3,
                    a: Math.random(),
                }));
            }
            this.stars.forEach(s => {
                ctx.globalAlpha = s.a;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        },
        drawDivider(ctx, w, h) {
            ctx.setLineDash([6, 10]);
            ctx.strokeStyle = 'rgba(68,136,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
        },
        drawPaddle(ctx, x, y, w, h, side) {
            const color = side === 'p1' ? '#4488ff' : '#aa44ff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.shadowBlur = 0;
        },
        drawBall(ctx, x, y, r) {
            ctx.shadowColor = '#4488ff';
            ctx.shadowBlur = 32;
            const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.5, '#4488ff');
            grad.addColorStop(1, '#001133');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        },
    },

    // ── Skin 7: Minimal (anuncio) ─────────────────────────────
    minimal: {
        name: 'MINIMAL',
        free: false,
        preview: '#f5f5f0',
        vars: {
            '--bg':         '#f5f5f0',
            '--accent':     '#111111',
            '--text':       '#111111',
            '--subtext':    '#aaaaaa',
            '--glow':       'rgba(0,0,0,0.15)',
            '--btn-bg':     'rgba(0,0,0,0.04)',
            '--btn-border': 'rgba(0,0,0,0.12)',
        },
        drawBg(ctx, w, h) {
            ctx.fillStyle = '#f5f5f0';
            ctx.fillRect(0, 0, w, h);
        },
        drawDivider(ctx, w, h) {
            ctx.strokeStyle = 'rgba(0,0,0,0.08)';
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        },
        drawPaddle(ctx, x, y, w, h) {
            ctx.fillStyle = '#111';
            ctx.fillRect(x, y, w, h);
        },
        drawBall(ctx, x, y, r) {
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        },
    },
};

const SKIN_STORAGE_KEY = 'pong_unlocked_skins';
const AD_DURATION_MS   = 2 * 60 * 60 * 1000;


// ════════════════════════════════════════════════════════════
// 2. ESTADO GLOBAL
// ════════════════════════════════════════════════════════════

const state = {
    mode:       'cpu',
    difficulty: 'easy',
    skin:       'classic',
    running:    false,
    paused:     false,
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    p1: { x: 0, score: 0 },
    p2: { x: 0, score: 0 },
    cw: 0, ch: 0,
    paddleW: 0, paddleH: 0,
    ballR: 0,
    maxScore: 5,
    unlocked: {},
    pendingSkin: null,
    _keysDown: {},
};

const AI_SPEED = { easy: 0.55, medium: 0.78, hard: 0.96 };


// ════════════════════════════════════════════════════════════
// 3. NAVEGACAO ENTRE TELAS
// ════════════════════════════════════════════════════════════

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goToMenu() {
    state.running = false;
    state.paused  = false;
    showScreen('screen-menu');
    renderSkinGrid();
}

function togglePause() {
    if (!state.running) return;
    state.paused = !state.paused;
    if (state.paused) {
        showScreen('screen-pause');
    } else {
        showScreen('screen-game');
        requestAnimationFrame(loop);
    }
}


// ════════════════════════════════════════════════════════════
// 4. SKINS + TIMER DE ANUNCIO
// ════════════════════════════════════════════════════════════

function loadUnlocked() {
    try {
        const raw = localStorage.getItem(SKIN_STORAGE_KEY);
        state.unlocked = raw ? JSON.parse(raw) : {};
    } catch {
        state.unlocked = {};
    }
}

function saveUnlocked() {
    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(state.unlocked));
}

function isSkinUnlocked(skinId) {
    if (SKINS[skinId].free) return true;
    const expiry = state.unlocked[skinId];
    if (!expiry) return false;
    if (Date.now() > expiry) {
        delete state.unlocked[skinId];
        saveUnlocked();
        return false;
    }
    return true;
}

function timeLeftForSkin(skinId) {
    const expiry = state.unlocked[skinId];
    if (!expiry) return 0;
    return Math.max(0, expiry - Date.now());
}

function formatTime(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return h + 'h' + m + 'm';
    return m + 'm';
}

function selectSkin(skinId) {
    if (isSkinUnlocked(skinId)) {
        state.skin = skinId;
        applySkinVars(skinId);
        renderSkinGrid();
    } else {
        state.pendingSkin = skinId;
        startAd();
    }
}

function applySkinVars(skinId) {
    const vars = SKINS[skinId].vars;
    const root = document.documentElement.style;
    Object.entries(vars).forEach(function(entry) {
        root.setProperty(entry[0], entry[1]);
    });
}

function renderSkinGrid() {
    const grid = document.getElementById('skins-grid');
    grid.innerHTML = '';

    Object.entries(SKINS).forEach(function(entry) {
        const id   = entry[0];
        const skin = entry[1];
        const unlocked = isSkinUnlocked(id);
        const timeLeft = timeLeftForSkin(id);
        const isActive = state.skin === id;

        const card = document.createElement('div');
        card.className = 'skin-card' + (isActive ? ' active' : '');
        card.style.background  = unlocked ? skin.preview + '18' : 'rgba(255,255,255,0.03)';
        card.style.borderColor = isActive  ? 'var(--accent)' : 'rgba(255,255,255,0.08)';

        const circle = document.createElement('div');
        circle.className = 'skin-preview';
        circle.style.background  = (skin.free || unlocked) ? skin.preview : 'rgba(255,255,255,0.1)';
        circle.style.boxShadow   = unlocked ? '0 0 12px ' + skin.preview + '88' : 'none';

        const name = document.createElement('div');
        name.className   = 'skin-name';
        name.textContent = skin.name;

        card.appendChild(circle);
        card.appendChild(name);

        if (!skin.free && !unlocked) {
            const lock = document.createElement('div');
            lock.className   = 'skin-lock';
            lock.textContent = 'AD';
            card.appendChild(lock);
        }

        if (!skin.free && unlocked && timeLeft > 0) {
            const timer = document.createElement('div');
            timer.className   = 'skin-timer';
            timer.textContent = formatTime(timeLeft);
            card.appendChild(timer);
        }

        card.addEventListener('click', function() { selectSkin(id); });
        grid.appendChild(card);
    });
}

// ── Anuncio simulado ─────────────────────────────────────────
var adCountdownInterval = null;

function startAd() {
    showScreen('screen-ad');
    var seconds = 5;
    var countEl = document.getElementById('ad-countdown');
    var skipBtn = document.getElementById('btn-ad-skip');

    countEl.textContent = seconds;
    skipBtn.classList.remove('visible');

    if (adCountdownInterval) clearInterval(adCountdownInterval);

    adCountdownInterval = setInterval(function() {
        seconds--;
        countEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(adCountdownInterval);
            skipBtn.classList.add('visible');
        }
    }, 1000);
}

function finishAd() {
    state.unlocked[state.pendingSkin] = Date.now() + AD_DURATION_MS;
    saveUnlocked();
    state.skin = state.pendingSkin;
    state.pendingSkin = null;
    applySkinVars(state.skin);
    renderSkinGrid();
    showScreen('screen-menu');
}

function cancelAd() {
    if (adCountdownInterval) clearInterval(adCountdownInterval);
    state.pendingSkin = null;
    showScreen('screen-menu');
}


// ════════════════════════════════════════════════════════════
// 5. SELECAO DE MODO E DIFICULDADE
// ════════════════════════════════════════════════════════════

function selectMode(mode) {
    state.mode = mode;
    document.getElementById('btn-mode-cpu').classList.toggle('active', mode === 'cpu');
    document.getElementById('btn-mode-2p').classList.toggle('active', mode === '2p');
    document.getElementById('section-difficulty').style.display = mode === 'cpu' ? '' : 'none';
    document.getElementById('label-p2').textContent = mode === 'cpu' ? 'CPU' : 'J2';
}

function selectDifficulty(diff) {
    state.difficulty = diff;
    ['easy', 'medium', 'hard'].forEach(function(d) {
        document.getElementById('btn-diff-' + d).classList.toggle('active', d === diff);
    });
}


// ════════════════════════════════════════════════════════════
// 6. CONTROLES — TOQUE POR ZONA
// ════════════════════════════════════════════════════════════

function setupControls() {
    var zoneP1 = document.getElementById('zone-p1');
    var zoneP2 = document.getElementById('zone-p2');

    function handleTouch(evt, player) {
        evt.preventDefault();
        if (!state.running || state.paused) return;

        var touch  = evt.touches[0];
        var canvas = document.getElementById('gameCanvas');
        var rect   = canvas.getBoundingClientRect();
        var scaleX = state.cw / rect.width;
        var touchX = (touch.clientX - rect.left) * scaleX;
        var half   = state.paddleW / 2;

        state[player].x = Math.max(half, Math.min(state.cw - half, touchX));
    }

    zoneP1.addEventListener('touchmove',  function(e) { handleTouch(e, 'p1'); }, { passive: false });
    zoneP1.addEventListener('touchstart', function(e) { handleTouch(e, 'p1'); }, { passive: false });

    zoneP2.addEventListener('touchmove', function(e) {
        if (state.mode === '2p') handleTouch(e, 'p2');
    }, { passive: false });
    zoneP2.addEventListener('touchstart', function(e) {
        if (state.mode === '2p') handleTouch(e, 'p2');
    }, { passive: false });

    document.addEventListener('keydown', function(e) { state._keysDown[e.key] = true; });
    document.addEventListener('keyup',   function(e) { state._keysDown[e.key] = false; });
}

function handleKeyboard() {
    if (!state.running || state.paused) return;
    var speed = state.cw * 0.02;
    var half  = state.paddleW / 2;

    if (state._keysDown['a'] || state._keysDown['A'])
        state.p1.x = Math.max(half, state.p1.x - speed);
    if (state._keysDown['d'] || state._keysDown['D'])
        state.p1.x = Math.min(state.cw - half, state.p1.x + speed);

    if (state.mode === '2p') {
        if (state._keysDown['ArrowLeft'])
            state.p2.x = Math.max(half, state.p2.x - speed);
        if (state._keysDown['ArrowRight'])
            state.p2.x = Math.min(state.cw - half, state.p2.x + speed);
    }
}


// ════════════════════════════════════════════════════════════
// 7. FISICA DO JOGO
// ════════════════════════════════════════════════════════════

function resetBall(scoredSide) {
    state.ball.x = state.cw / 2;
    state.ball.y = state.ch / 2;

    var speed = state.cw * 0.007;
    var angle = (Math.random() * 60 - 30) * (Math.PI / 180);
    var dir   = scoredSide === 'p1' ? -1 : 1;

    state.ball.vx = Math.sin(angle) * speed;
    state.ball.vy = Math.cos(angle) * speed * dir;
}

function moveAI() {
    var aiSpeed = state.cw * 0.007 * AI_SPEED[state.difficulty];
    var diff    = state.ball.x - state.p2.x;
    var half    = state.paddleW / 2;

    if (Math.abs(diff) > 5) {
        state.p2.x += Math.sign(diff) * Math.min(Math.abs(diff), aiSpeed);
    }
    state.p2.x = Math.max(half, Math.min(state.cw - half, state.p2.x));
}

function movePhysics() {
    var ball = state.ball;
    var r    = state.ballR;
    var pw   = state.paddleW;
    var ph   = state.paddleH;

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Paredes laterais
    if (ball.x - r < 0)          { ball.x = r;            ball.vx =  Math.abs(ball.vx); }
    if (ball.x + r > state.cw)   { ball.x = state.cw - r; ball.vx = -Math.abs(ball.vx); }

    var p1Y = state.ch - ph;
    var p2Y = 0;

    // Colisao P1 (fundo)
    if (ball.vy > 0 &&
        ball.y + r >= p1Y &&
        ball.x >= state.p1.x - pw / 2 &&
        ball.x <= state.p1.x + pw / 2) {

        ball.y  = p1Y - r;
        ball.vy = -Math.abs(ball.vy) * 1.04;
        var hit1 = (ball.x - state.p1.x) / (pw / 2);
        ball.vx  = hit1 * state.cw * 0.007;
        spawnParticles(ball.x, ball.y);
    }

    // Colisao P2 (topo)
    if (ball.vy < 0 &&
        ball.y - r <= p2Y + ph &&
        ball.x >= state.p2.x - pw / 2 &&
        ball.x <= state.p2.x + pw / 2) {

        ball.y  = p2Y + ph + r;
        ball.vy = Math.abs(ball.vy) * 1.04;
        var hit2 = (ball.x - state.p2.x) / (pw / 2);
        ball.vx  = hit2 * state.cw * 0.007;
        spawnParticles(ball.x, ball.y);
    }

    // Ponto P1 — bola saiu pelo topo
    if (ball.y - r < -20) {
        state.p1.score++;
        updateScore();
        checkWinner();
        if (state.running) resetBall('p2');
    }

    // Ponto P2 — bola saiu pelo fundo
    if (ball.y + r > state.ch + 20) {
        state.p2.score++;
        updateScore();
        checkWinner();
        if (state.running) resetBall('p1');
    }
}

function updateScore() {
    document.getElementById('score-p1').textContent = state.p1.score;
    document.getElementById('score-p2').textContent = state.p2.score;
}

function checkWinner() {
    if (state.p1.score >= state.maxScore || state.p2.score >= state.maxScore) {
        state.running = false;
        var p1Won      = state.p1.score >= state.maxScore;
        var winnerName = p1Won
            ? 'VOCE VENCEU!'
            : (state.mode === 'cpu' ? 'CPU VENCEU!' : 'JOGADOR 2 VENCEU!');

        document.getElementById('winner-text').textContent  = winnerName;
        document.getElementById('final-score').textContent  =
            state.p1.score + ' - ' + state.p2.score;

        setTimeout(function() { showScreen('screen-gameover'); }, 600);
    }
}


// ════════════════════════════════════════════════════════════
// 8. PARTICULAS DE COLISAO
// ════════════════════════════════════════════════════════════

function spawnParticles(x, y) {
    var container = document.getElementById('particles');
    var canvas    = document.getElementById('gameCanvas');
    var rect      = canvas.getBoundingClientRect();
    var scaleX    = rect.width  / state.cw;
    var scaleY    = rect.height / state.ch;
    var screenX   = rect.left + x * scaleX;
    var screenY   = rect.top  + y * scaleY;
    var color     = SKINS[state.skin].vars['--accent'] || '#fff';

    for (var i = 0; i < 8; i++) {
        var p     = document.createElement('div');
        p.className = 'particle';
        var size  = Math.random() * 6 + 3;
        var angle = Math.random() * 360;
        var dist  = Math.random() * 40 + 20;
        var tx    = Math.cos(angle * Math.PI / 180) * dist + 'px';
        var ty    = Math.sin(angle * Math.PI / 180) * dist + 'px';

        p.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'background:' + color,
            'left:' + (screenX - size / 2) + 'px',
            'top:' + (screenY - size / 2) + 'px',
            '--tx:' + tx,
            '--ty:' + ty,
            'animation-duration:' + (Math.random() * 0.4 + 0.5) + 's',
        ].join(';');

        container.appendChild(p);
        setTimeout(function() { p.remove(); }, 900);
    }
}


// ════════════════════════════════════════════════════════════
// 9. RENDERIZACAO
// ════════════════════════════════════════════════════════════

function draw() {
    var canvas = document.getElementById('gameCanvas');
    var ctx    = canvas.getContext('2d');
    var skin   = SKINS[state.skin];
    var pw     = state.paddleW;
    var ph     = state.paddleH;

    skin.drawBg(ctx, state.cw, state.ch);
    skin.drawDivider(ctx, state.cw, state.ch);

    skin.drawPaddle(ctx, state.p1.x - pw / 2, state.ch - ph, pw, ph, 'p1');
    skin.drawPaddle(ctx, state.p2.x - pw / 2, 0,             pw, ph, 'p2');

    skin.drawBall(ctx, state.ball.x, state.ball.y, state.ballR);
}


// ════════════════════════════════════════════════════════════
// 10. LOOP PRINCIPAL
// ════════════════════════════════════════════════════════════

function loop() {
    if (!state.running || state.paused) return;
    handleKeyboard();
    if (state.mode === 'cpu') moveAI();
    movePhysics();
    draw();
    requestAnimationFrame(loop);
}


// ════════════════════════════════════════════════════════════
// 11. INICIAR JOGO
// ════════════════════════════════════════════════════════════

function startGame() {
    var canvas = document.getElementById('gameCanvas');
    var wrap   = document.getElementById('canvas-wrap');
    var W      = wrap.clientWidth;
    var H      = Math.round(W * (9 / 16));

    canvas.width  = W;
    canvas.height = H;

    state.cw      = W;
    state.ch      = H;
    state.paddleW = W * 0.35;
    state.paddleH = Math.max(8, H * 0.025);
    state.ballR   = Math.max(6, W * 0.022);

    state.p1.score = 0;
    state.p2.score = 0;
    state.p1.x     = W / 2;
    state.p2.x     = W / 2;

    updateScore();
    applySkinVars(state.skin);
    resetBall('p2');

    state.running = true;
    state.paused  = false;

    showScreen('screen-game');

    var h1 = document.getElementById('hint-p1');
    var h2 = document.getElementById('hint-p2');
    h1.style.opacity = '0.4';
    h2.style.opacity = state.mode === '2p' ? '0.4' : '0';
    setTimeout(function() { h1.style.opacity = '0'; h2.style.opacity = '0'; }, 2000);

    requestAnimationFrame(loop);
}


// ════════════════════════════════════════════════════════════
// 12. INICIALIZACAO
// ════════════════════════════════════════════════════════════

function init() {
    loadUnlocked();
    applySkinVars(state.skin);
    renderSkinGrid();
    setupControls();
    showScreen('screen-menu');
}

document.addEventListener('DOMContentLoaded', init);
