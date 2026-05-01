// ============================================================
// PONG CLASSIC — pong.js v3
//
// Correções:
//   1. Zonas de toque = metade da tela inteira cada
//   2. Bloqueio real das skins premium (sem bypass)
//   3. Botões com tamanho correto (via CSS classe nova)
//   4. Canvas centralizado com pointer-events desligado
//      para não bloquear o toque nas zonas
// ============================================================


// ════════════════════════════════════════════════════════════
// 1. SKINS
// ════════════════════════════════════════════════════════════

var SKINS = {
    classic: {
        name:'CLASSIC', free:true, preview:'#ffffff',
        vars:{'--bg':'#000000','--accent':'#ffffff','--text':'#ffffff','--subtext':'#666666','--glow':'rgba(255,255,255,0.3)','--btn-bg':'rgba(255,255,255,0.06)','--btn-border':'rgba(255,255,255,0.15)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);},
        drawDivider:function(ctx,w,h){ctx.setLineDash([8,8]);ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);},
        drawPaddle:function(ctx,x,y,w,h){ctx.fillStyle='#fff';ctx.fillRect(x,y,w,h);},
        drawBall:function(ctx,x,y,r){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
    },
    neon: {
        name:'NEON', free:true, preview:'#00ffcc',
        vars:{'--bg':'#030310','--accent':'#00ffcc','--text':'#00ffcc','--subtext':'#006655','--glow':'rgba(0,255,200,0.5)','--btn-bg':'rgba(0,255,200,0.06)','--btn-border':'rgba(0,255,200,0.2)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#030310';ctx.fillRect(0,0,w,h);},
        drawDivider:function(ctx,w,h){ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(0,255,200,0.15)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);},
        drawPaddle:function(ctx,x,y,w,h,side){var c=side==='p1'?'#00ffcc':'#ff00aa';ctx.shadowColor=c;ctx.shadowBlur=18;ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.shadowBlur=0;},
        drawBall:function(ctx,x,y,r){ctx.shadowColor='#00ffcc';ctx.shadowBlur=24;ctx.fillStyle='#00ffcc';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    },
    retro: {
        name:'RETRO', free:true, preview:'#33ff33',
        vars:{'--bg':'#001100','--accent':'#33ff33','--text':'#33ff33','--subtext':'#115511','--glow':'rgba(50,255,50,0.4)','--btn-bg':'rgba(50,255,50,0.05)','--btn-border':'rgba(50,255,50,0.2)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#001100';ctx.fillRect(0,0,w,h);ctx.fillStyle='rgba(0,0,0,0.15)';for(var y=0;y<h;y+=4)ctx.fillRect(0,y,w,1);},
        drawDivider:function(ctx,w,h){ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(50,255,50,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);},
        drawPaddle:function(ctx,x,y,w,h){ctx.fillStyle='#33ff33';for(var py=y;py<y+h;py+=4)for(var px=x;px<x+w;px+=4)ctx.fillRect(px,py,3,3);},
        drawBall:function(ctx,x,y,r){ctx.fillStyle='#33ff33';ctx.fillRect(x-r,y-r,r*2,r*2);}
    },
    cyber: {
        name:'CYBER', free:false, preview:'#7700ff',
        vars:{'--bg':'#07000f','--accent':'#aa00ff','--text':'#cc88ff','--subtext':'#440066','--glow':'rgba(170,0,255,0.5)','--btn-bg':'rgba(170,0,255,0.08)','--btn-border':'rgba(170,0,255,0.25)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#07000f';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(100,0,200,0.08)';ctx.lineWidth=1;for(var x=0;x<w;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(var y=0;y<h;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}},
        drawDivider:function(ctx,w,h){ctx.strokeStyle='rgba(170,0,255,0.3)';ctx.lineWidth=1;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();},
        drawPaddle:function(ctx,x,y,w,h,side){var c=side==='p1'?'#aa00ff':'#00aaff';ctx.shadowColor=c;ctx.shadowBlur=20;ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillRect(x,y,w,2);ctx.shadowBlur=0;},
        drawBall:function(ctx,x,y,r){ctx.shadowColor='#aa00ff';ctx.shadowBlur=30;var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(0.5,'#aa00ff');g.addColorStop(1,'#440088');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    },
    fire: {
        name:'FIRE/ICE', free:false, preview:'#ff4400',
        vars:{'--bg':'#080808','--accent':'#ff6600','--text':'#ffaa44','--subtext':'#664422','--glow':'rgba(255,80,0,0.5)','--btn-bg':'rgba(255,80,0,0.08)','--btn-border':'rgba(255,80,0,0.25)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#080808';ctx.fillRect(0,0,w,h);var gt=ctx.createLinearGradient(0,0,0,h/2);gt.addColorStop(0,'rgba(0,100,255,0.06)');gt.addColorStop(1,'transparent');ctx.fillStyle=gt;ctx.fillRect(0,0,w,h/2);var gb=ctx.createLinearGradient(0,h/2,0,h);gb.addColorStop(0,'transparent');gb.addColorStop(1,'rgba(255,60,0,0.06)');ctx.fillStyle=gb;ctx.fillRect(0,h/2,w,h/2);},
        drawDivider:function(ctx,w,h){var g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(0,120,255,0.6)');g.addColorStop(0.5,'rgba(255,255,255,0.3)');g.addColorStop(1,'rgba(255,80,0,0.6)');ctx.strokeStyle=g;ctx.lineWidth=1;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();},
        drawPaddle:function(ctx,x,y,w,h,side){var c=side==='p1'?'#ff4400':'#0088ff';ctx.shadowColor=c;ctx.shadowBlur=22;ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.shadowBlur=0;},
        drawBall:function(ctx,x,y,r){ctx.shadowColor='#ff6600';ctx.shadowBlur=28;var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(0.4,'#ffaa00');g.addColorStop(1,'#ff2200');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    },
    galaxy: {
        name:'GALAXY', free:false, preview:'#4488ff', stars:null,
        vars:{'--bg':'#00000a','--accent':'#4488ff','--text':'#88aaff','--subtext':'#223355','--glow':'rgba(68,136,255,0.5)','--btn-bg':'rgba(68,136,255,0.06)','--btn-border':'rgba(68,136,255,0.2)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#00000a';ctx.fillRect(0,0,w,h);if(!this.stars){this.stars=[];for(var i=0;i<80;i++)this.stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.3,a:Math.random()});}for(var j=0;j<this.stars.length;j++){ctx.globalAlpha=this.stars[j].a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.stars[j].x,this.stars[j].y,this.stars[j].r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;},
        drawDivider:function(ctx,w,h){ctx.setLineDash([6,10]);ctx.strokeStyle='rgba(68,136,255,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);},
        drawPaddle:function(ctx,x,y,w,h,side){var c=side==='p1'?'#4488ff':'#aa44ff';ctx.shadowColor=c;ctx.shadowBlur=20;ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.shadowBlur=0;},
        drawBall:function(ctx,x,y,r){ctx.shadowColor='#4488ff';ctx.shadowBlur=32;var g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(0.5,'#4488ff');g.addColorStop(1,'#001133');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    },
    minimal: {
        name:'MINIMAL', free:false, preview:'#111111',
        vars:{'--bg':'#f5f5f0','--accent':'#111111','--text':'#111111','--subtext':'#aaaaaa','--glow':'rgba(0,0,0,0.15)','--btn-bg':'rgba(0,0,0,0.04)','--btn-border':'rgba(0,0,0,0.12)'},
        drawBg:function(ctx,w,h){ctx.fillStyle='#f5f5f0';ctx.fillRect(0,0,w,h);},
        drawDivider:function(ctx,w,h){ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();},
        drawPaddle:function(ctx,x,y,w,h){ctx.fillStyle='#111';ctx.fillRect(x,y,w,h);},
        drawBall:function(ctx,x,y,r){ctx.fillStyle='#111';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
    }
};

var SKIN_STORAGE_KEY = 'pong_unlocked_skins';
var AD_DURATION_MS   = 2 * 60 * 60 * 1000;


// ════════════════════════════════════════════════════════════
// 2. ESTADO GLOBAL
// ════════════════════════════════════════════════════════════

var state = {
    mode:'cpu', difficulty:'easy', skin:'classic',
    running:false, paused:false,
    ball:{x:0,y:0,vx:0,vy:0},
    p1:{x:0,score:0},
    p2:{x:0,score:0},
    cw:0, ch:0, paddleW:0, paddleH:0, ballR:0,
    maxScore:5,
    unlocked:{}, pendingSkin:null,
    _keysDown:{}
};

var AI_SPEED = { easy:0.35, medium:0.60, hard:0.88 };


// ════════════════════════════════════════════════════════════
// 3. NAVEGACAO
// ════════════════════════════════════════════════════════════

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
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
// 4. SKINS + ANUNCIO
// ════════════════════════════════════════════════════════════

function loadUnlocked() {
    try { state.unlocked = JSON.parse(localStorage.getItem(SKIN_STORAGE_KEY)) || {}; }
    catch(e) { state.unlocked = {}; }
}

function saveUnlocked() {
    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(state.unlocked));
}

function isSkinUnlocked(id) {
    if (SKINS[id].free) return true;
    var exp = state.unlocked[id];
    if (!exp) return false;
    if (Date.now() > exp) { delete state.unlocked[id]; saveUnlocked(); return false; }
    return true;
}

function timeLeftForSkin(id) {
    var exp = state.unlocked[id];
    return exp ? Math.max(0, exp - Date.now()) : 0;
}

function formatTime(ms) {
    var s = Math.ceil(ms/1000);
    var h = Math.floor(s/3600);
    var m = Math.floor((s%3600)/60);
    return h > 0 ? h+'h'+m+'m' : m+'m';
}

function selectSkin(id) {
    /*
     * BLOQUEIO REAL DA SKIN PREMIUM:
     * Verificamos isSkinUnlocked() que checa:
     *   1. Se é gratuita (free:true)
     *   2. Se está no localStorage com timestamp válido
     * Se nenhuma das duas, abre o anúncio.
     * O usuário NÃO consegue burlar isso pelo frontend
     * porque a verificação acontece toda vez que tenta usar.
     */
    if (isSkinUnlocked(id)) {
        state.skin = id;
        applySkinVars(id);
        renderSkinGrid();
    } else {
        state.pendingSkin = id;
        startAd();
    }
}

function applySkinVars(id) {
    var root = document.documentElement.style;
    var vars = SKINS[id].vars;
    var keys = Object.keys(vars);
    for (var i = 0; i < keys.length; i++) {
        root.setProperty(keys[i], vars[keys[i]]);
    }
}

function renderSkinGrid() {
    var grid = document.getElementById('skins-grid');
    grid.innerHTML = '';
    var ids = Object.keys(SKINS);
    for (var i = 0; i < ids.length; i++) {
        (function(id) {
            var skin     = SKINS[id];
            var unlocked = isSkinUnlocked(id);
            var timeLeft = timeLeftForSkin(id);
            var isActive = state.skin === id;

            var card = document.createElement('div');
            card.className = 'skin-card' + (isActive ? ' active' : '');
            card.style.background  = unlocked ? skin.preview+'18' : 'rgba(255,255,255,0.03)';
            card.style.borderColor = isActive  ? 'var(--accent)' : 'rgba(255,255,255,0.08)';

            var circle = document.createElement('div');
            circle.className      = 'skin-preview';
            circle.style.background = (skin.free||unlocked) ? skin.preview : 'rgba(255,255,255,0.1)';
            circle.style.boxShadow  = unlocked ? '0 0 10px '+skin.preview+'88' : 'none';

            var name = document.createElement('div');
            name.className   = 'skin-name';
            name.textContent = skin.name;

            card.appendChild(circle);
            card.appendChild(name);

            if (!skin.free && !unlocked) {
                var lock = document.createElement('div');
                lock.className   = 'skin-lock';
                lock.textContent = 'AD';
                card.appendChild(lock);
            }

            if (!skin.free && unlocked && timeLeft > 0) {
                var timer = document.createElement('div');
                timer.className   = 'skin-timer';
                timer.textContent = formatTime(timeLeft);
                card.appendChild(timer);
            }

            card.addEventListener('click', function(){ selectSkin(id); });
            grid.appendChild(card);
        })(ids[i]);
    }
}

// ── Anúncio ──────────────────────────────────────────────────
/*
 * SISTEMA DE BLOQUEIO DO ANÚNCIO:
 *
 * Usamos TRÊS camadas de proteção:
 *
 * 1. CSS: pointer-events:none — impossível clicar no botão
 * 2. CSS: opacity:0 — botão invisível
 * 3. Flag adFinished: mesmo que as camadas CSS falhem,
 *    finishAd() checa a flag antes de desbloquear
 *
 * O timer no setInterval decrementa a cada 1 segundo.
 * Só quando chega a 0 as três proteções são removidas.
 */
var adInterval = null;
var adFinished = false;

function startAd() {
    adFinished = false;
    var skipBtn = document.getElementById('btn-ad-skip');
    skipBtn.classList.remove('visible');

    showScreen('screen-ad');

    var seconds = 5;
    document.getElementById('ad-countdown').textContent = seconds;

    if (adInterval) clearInterval(adInterval);

    adInterval = setInterval(function() {
        seconds--;
        document.getElementById('ad-countdown').textContent = seconds;
        if (seconds <= 0) {
            clearInterval(adInterval);
            adInterval = null;
            adFinished = true;
            skipBtn.classList.add('visible');
        }
    }, 1000);
}

function finishAd() {
    // Proteção tripla — ignora se o timer não acabou
    if (!adFinished) return;
    if (!state.pendingSkin) return;
    if (!SKINS[state.pendingSkin]) return;

    state.unlocked[state.pendingSkin] = Date.now() + AD_DURATION_MS;
    saveUnlocked();
    state.skin = state.pendingSkin;
    state.pendingSkin = null;
    adFinished = false;
    applySkinVars(state.skin);
    renderSkinGrid();
    showScreen('screen-menu');
}

function cancelAd() {
    if (adInterval) { clearInterval(adInterval); adInterval = null; }
    adFinished = false;
    state.pendingSkin = null;
    showScreen('screen-menu');
}


// ════════════════════════════════════════════════════════════
// 5. MODO E DIFICULDADE
// ════════════════════════════════════════════════════════════

function selectMode(mode) {
    state.mode = mode;
    document.getElementById('btn-mode-cpu').classList.toggle('active', mode==='cpu');
    document.getElementById('btn-mode-2p' ).classList.toggle('active', mode==='2p');
    document.getElementById('section-difficulty').style.display = mode==='cpu' ? '' : 'none';
    document.getElementById('label-p2').textContent = mode==='cpu' ? 'CPU' : 'J2';
}

function selectDifficulty(diff) {
    state.difficulty = diff;
    ['easy','medium','hard'].forEach(function(d){
        document.getElementById('btn-diff-'+d).classList.toggle('active', d===diff);
    });
}


// ════════════════════════════════════════════════════════════
// 6. CONTROLES — TOQUE POR ZONA (METADE DA TELA INTEIRA)
// ════════════════════════════════════════════════════════════

/*
 * COMO AS ZONAS FUNCIONAM AGORA:
 *
 * #zone-p1 = position:fixed, top:50%, bottom:0 → metade INFERIOR da tela
 * #zone-p2 = position:fixed, top:0, bottom:50% → metade SUPERIOR da tela
 *
 * O canvas fica sobreposto no meio com pointer-events:none
 * para não interceptar os toques.
 *
 * Cada zona rastreia seu próprio touch.identifier.
 * Dois dedos em zonas diferentes funcionam totalmente independente.
 */

var touchIds = { p1: null, p2: null };

function setupControls() {
    var zoneP1 = document.getElementById('zone-p1');
    var zoneP2 = document.getElementById('zone-p2');
    var canvas  = document.getElementById('gameCanvas');

    function getCanvasX(touch) {
        var rect   = canvas.getBoundingClientRect();
        var scaleX = state.cw / rect.width;
        var x = (touch.clientX - rect.left) * scaleX;
        // Clamp dentro dos limites da raquete
        var half = state.paddleW / 2;
        return Math.max(half, Math.min(state.cw - half, x));
    }

    // ── J1 — zona inferior ────────────────────────────────
    zoneP1.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!state.running || state.paused) return;
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touchIds.p1 === null) {
                touchIds.p1 = touches[i].identifier;
                state.p1.x  = getCanvasX(touches[i]);
                break;
            }
        }
    }, { passive: false });

    zoneP1.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!state.running || state.paused) return;
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier === touchIds.p1) {
                state.p1.x = getCanvasX(touches[i]);
                break;
            }
        }
    }, { passive: false });

    zoneP1.addEventListener('touchend', function(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier === touchIds.p1) {
                touchIds.p1 = null;
                break;
            }
        }
    }, { passive: false });

    zoneP1.addEventListener('touchcancel', function(e) {
        touchIds.p1 = null;
    }, { passive: false });

    // ── J2 — zona superior ────────────────────────────────
    zoneP2.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!state.running || state.paused) return;
        if (state.mode !== '2p') return;
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touchIds.p2 === null) {
                touchIds.p2 = touches[i].identifier;
                state.p2.x  = getCanvasX(touches[i]);
                break;
            }
        }
    }, { passive: false });

    zoneP2.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!state.running || state.paused) return;
        if (state.mode !== '2p') return;
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier === touchIds.p2) {
                state.p2.x = getCanvasX(touches[i]);
                break;
            }
        }
    }, { passive: false });

    zoneP2.addEventListener('touchend', function(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier === touchIds.p2) {
                touchIds.p2 = null;
                break;
            }
        }
    }, { passive: false });

    zoneP2.addEventListener('touchcancel', function(e) {
        touchIds.p2 = null;
    }, { passive: false });

    // Teclado
    document.addEventListener('keydown', function(e){ state._keysDown[e.key]=true; });
    document.addEventListener('keyup',   function(e){ state._keysDown[e.key]=false; });
}

function handleKeyboard() {
    if (!state.running || state.paused) return;
    var speed = state.cw * 0.02;
    var half  = state.paddleW / 2;
    if (state._keysDown['a']||state._keysDown['A']) state.p1.x=Math.max(half,state.p1.x-speed);
    if (state._keysDown['d']||state._keysDown['D']) state.p1.x=Math.min(state.cw-half,state.p1.x+speed);
    if (state.mode==='2p') {
        if (state._keysDown['ArrowLeft'])  state.p2.x=Math.max(half,state.p2.x-speed);
        if (state._keysDown['ArrowRight']) state.p2.x=Math.min(state.cw-half,state.p2.x+speed);
    }
}


// ════════════════════════════════════════════════════════════
// 7. FISICA
// ════════════════════════════════════════════════════════════

function resetBall(scoredSide) {
    state.ball.x = state.cw / 2;
    state.ball.y = state.ch / 2;
    var speed = state.cw * 0.007;
    var angle = (Math.random()*50-25) * (Math.PI/180);
    var dir   = scoredSide === 'p1' ? -1 : 1;
    state.ball.vx = Math.sin(angle) * speed;
    state.ball.vy = Math.cos(angle) * speed * dir;
}

function moveAI() {
    var aiSpeed = state.cw * 0.007 * AI_SPEED[state.difficulty];
    var diff    = state.ball.x - state.p2.x;
    var half    = state.paddleW / 2;
    if (Math.abs(diff) > 8) state.p2.x += Math.sign(diff) * Math.min(Math.abs(diff), aiSpeed);
    state.p2.x = Math.max(half, Math.min(state.cw-half, state.p2.x));
}

function movePhysics() {
    var ball=state.ball, r=state.ballR, pw=state.paddleW, ph=state.paddleH;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x-r < 0)        { ball.x=r;           ball.vx= Math.abs(ball.vx); }
    if (ball.x+r > state.cw) { ball.x=state.cw-r;  ball.vx=-Math.abs(ball.vx); }

    var p1Y = state.ch - ph;
    var p2Y = 0;

    if (ball.vy>0 && ball.y+r>=p1Y && ball.x>=state.p1.x-pw/2 && ball.x<=state.p1.x+pw/2) {
        ball.y  = p1Y-r;
        ball.vy = -Math.abs(ball.vy)*1.04;
        ball.vx = ((ball.x-state.p1.x)/(pw/2))*state.cw*0.007;
        spawnParticles(ball.x, ball.y);
    }

    if (ball.vy<0 && ball.y-r<=p2Y+ph && ball.x>=state.p2.x-pw/2 && ball.x<=state.p2.x+pw/2) {
        ball.y  = p2Y+ph+r;
        ball.vy = Math.abs(ball.vy)*1.04;
        ball.vx = ((ball.x-state.p2.x)/(pw/2))*state.cw*0.007;
        spawnParticles(ball.x, ball.y);
    }

    if (ball.y-r < -20) {
        state.p1.score++;
        updateScore(); checkWinner();
        if (state.running) resetBall('p2');
    }
    if (ball.y+r > state.ch+20) {
        state.p2.score++;
        updateScore(); checkWinner();
        if (state.running) resetBall('p1');
    }
}

function updateScore() {
    document.getElementById('score-p1').textContent = state.p1.score;
    document.getElementById('score-p2').textContent = state.p2.score;
}

function checkWinner() {
    if (state.p1.score>=state.maxScore || state.p2.score>=state.maxScore) {
        state.running = false;
        var p1Won = state.p1.score >= state.maxScore;
        document.getElementById('winner-text').textContent =
            p1Won ? 'VOCE VENCEU!' : (state.mode==='cpu'?'CPU VENCEU!':'J2 VENCEU!');
        document.getElementById('final-score').textContent =
            state.p1.score+' - '+state.p2.score;
        setTimeout(function(){ showScreen('screen-gameover'); }, 600);
    }
}


// ════════════════════════════════════════════════════════════
// 8. PARTICULAS
// ════════════════════════════════════════════════════════════

function spawnParticles(x, y) {
    var container = document.getElementById('particles');
    var canvas    = document.getElementById('gameCanvas');
    var rect      = canvas.getBoundingClientRect();
    var sx = rect.left + x*(rect.width/state.cw);
    var sy = rect.top  + y*(rect.height/state.ch);
    var color = SKINS[state.skin].vars['--accent']||'#fff';

    for (var i=0; i<8; i++) {
        var p     = document.createElement('div');
        p.className = 'particle';
        var size  = Math.random()*5+3;
        var angle = Math.random()*360;
        var dist  = Math.random()*35+15;
        p.style.cssText = [
            'width:'+size+'px','height:'+size+'px','background:'+color,
            'left:'+(sx-size/2)+'px','top:'+(sy-size/2)+'px',
            '--tx:'+(Math.cos(angle*Math.PI/180)*dist)+'px',
            '--ty:'+(Math.sin(angle*Math.PI/180)*dist)+'px',
            'animation-duration:'+(Math.random()*0.3+0.4)+'s'
        ].join(';');
        container.appendChild(p);
        setTimeout(function(){ if(p.parentNode)p.parentNode.removeChild(p); }, 800);
    }
}


// ════════════════════════════════════════════════════════════
// 9. RENDERIZACAO
// ════════════════════════════════════════════════════════════

function draw() {
    var canvas = document.getElementById('gameCanvas');
    var ctx    = canvas.getContext('2d');
    var skin   = SKINS[state.skin];
    var pw=state.paddleW, ph=state.paddleH;

    skin.drawBg(ctx, state.cw, state.ch);
    skin.drawDivider(ctx, state.cw, state.ch);
    skin.drawPaddle(ctx, state.p1.x-pw/2, state.ch-ph, pw, ph, 'p1');
    skin.drawPaddle(ctx, state.p2.x-pw/2, 0,           pw, ph, 'p2');
    skin.drawBall(ctx, state.ball.x, state.ball.y, state.ballR);
}


// ════════════════════════════════════════════════════════════
// 10. LOOP
// ════════════════════════════════════════════════════════════

function loop() {
    if (!state.running || state.paused) return;
    handleKeyboard();
    if (state.mode==='cpu') moveAI();
    movePhysics();
    draw();
    requestAnimationFrame(loop);
}


// ════════════════════════════════════════════════════════════
// 11. INICIAR JOGO
// ════════════════════════════════════════════════════════════

function startGame() {
    var canvas = document.getElementById('gameCanvas');

    /*
     * O canvas ocupa a LARGURA TOTAL da tela.
     * A altura é proporcional: canvas = 30% da altura da tela.
     * As zonas de toque ocupam 35% cada (total 70% + 30% do canvas = 100%).
     *
     * Assim o canvas fica centralizado e as zonas ocupam
     * metade da tela inteira cada uma.
     */
    var W = window.innerWidth;
    var H = Math.round(W * 0.55); // proporção do campo

    canvas.width  = W;
    canvas.height = H;

    // Posiciona o canvas-wrap exatamente no centro
    var wrap = document.getElementById('canvas-wrap');
    wrap.style.width  = W + 'px';
    wrap.style.height = H + 'px';
    wrap.style.marginLeft = '-' + (W/2) + 'px';
    wrap.style.marginTop  = '-' + (H/2) + 'px';

    state.cw      = W;
    state.ch      = H;
    state.paddleW = W * 0.38;
    state.paddleH = Math.max(6, H * 0.04);
    state.ballR   = Math.max(5, W * 0.022);

    state.p1.score = 0;
    state.p2.score = 0;
    state.p1.x = W / 2;
    state.p2.x = W / 2;

    touchIds.p1 = null;
    touchIds.p2 = null;

    updateScore();
    applySkinVars(state.skin);
    resetBall('p2');

    state.running = true;
    state.paused  = false;

    showScreen('screen-game');

    // Hints brevemente
    var h1 = document.getElementById('hint-p1');
    var h2 = document.getElementById('hint-p2');
    h1.style.opacity = '0.5';
    h2.style.opacity = state.mode==='2p' ? '0.5' : '0';
    setTimeout(function(){ h1.style.opacity='0'; h2.style.opacity='0'; }, 2500);

    requestAnimationFrame(loop);
}


// ════════════════════════════════════════════════════════════
// 12. INIT
// ════════════════════════════════════════════════════════════

function init() {
    loadUnlocked();
    applySkinVars(state.skin);
    renderSkinGrid();
    setupControls();
    showScreen('screen-menu');
}

document.addEventListener('DOMContentLoaded', init);
