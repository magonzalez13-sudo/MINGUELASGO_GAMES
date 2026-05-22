// ===============================
// OXIGEN - main.js
// Juego convertido de Python a HTML5
// ===============================

// =====================================
// CONFIG
// =====================================

const CONFIG = {

    VIDA_INICIAL: 100,
    OXIGENO_INICIAL: 100,
    CHATARRA_INICIAL: 50,

    CONSUMO_OXIGENO_POR_TURNO: 5,
    CONSUMO_VIDA_SIN_OXIGENO: 10,

    DISTANCIA_MAXIMA_EXPLORACION: 1000,

    PROBABILIDAD_EVENTO: 0.4,

    RECOMPENSA_CHATARRA_MIN: 10,
    RECOMPENSA_CHATARRA_MAX: 50,

    DANIO_EVENTO_MIN: 10,
    DANIO_EVENTO_MAX: 30,

    MEJORAS: {

        cilindro_oxigeno: {
            nombre: "Cilindro Mejorado",
            costo: 100,
            efecto: "Oxígeno +50"
        },

        armadura_ligera: {
            nombre: "Armadura Ligera",
            costo: 150,
            efecto: "Daño -20%"
        },

        detector_recursos: {
            nombre: "Detector",
            costo: 200,
            efecto: "Más chatarra"
        },

        medibots: {
            nombre: "Medibots",
            costo: 250,
            efecto: "Regenera vida"
        }

    }

};

// =====================================
// JUGADOR
// =====================================

const jugador = {

    vida: CONFIG.VIDA_INICIAL,
    vidaMax: CONFIG.VIDA_INICIAL,

    oxigeno: CONFIG.OXIGENO_INICIAL,
    oxigenoMax: CONFIG.OXIGENO_INICIAL,

    chatarra: CONFIG.CHATARRA_INICIAL,

    distancia: 0,

    reduccionDanio: 0,

    bonusRecoleccion: 1,

    regeneracion: 0,

    mejoras: [],

    escudo: false,
    turnosEscudo: 0

};

// =====================================
// EVENTOS
// =====================================

const eventos = [

    {
        nombre: "💎 Depósito de Chatarra",
        descripcion: "Encontraste chatarra valiosa.",
        tipo: "recompensa"
    },

    {
        nombre: "⚠️ Zona Contaminada",
        descripcion: "Recibiste daño.",
        tipo: "danio"
    },

    {
        nombre: "🔥 Explosión",
        descripcion: "Una explosión te golpea.",
        tipo: "danio"
    },

    {
        nombre: "💚 Base Médica",
        descripcion: "Recuperas vida.",
        tipo: "curacion"
    },

    {
        nombre: "🛡️ Escudo",
        descripcion: "Escudo activado.",
        tipo: "escudo"
    }

];

// =====================================
// UI
// =====================================

function actualizarUI() {

    document.getElementById("vidaBar").style.width =
        (jugador.vida / jugador.vidaMax * 100) + "%";

    document.getElementById("oxigenoBar").style.width =
        (jugador.oxigeno / jugador.oxigenoMax * 100) + "%";

    document.getElementById("vidaText").innerText =
        jugador.vida + "/" + jugador.vidaMax;

    document.getElementById("oxigenoText").innerText =
        jugador.oxigeno + "/" + jugador.oxigenoMax;

    document.getElementById("chatarraText").innerText =
        jugador.chatarra;

    document.getElementById("distanciaText").innerText =
        jugador.distancia;

}

// =====================================
// EVENTOS ALEATORIOS
// =====================================

function generarEvento() {

    if (Math.random() > CONFIG.PROBABILIDAD_EVENTO) return;

    const evento = eventos[
        Math.floor(Math.random() * eventos.length)
    ];

    let texto = `
        <h2>${evento.nombre}</h2>
        <p>${evento.descripcion}</p>
    `;

    switch(evento.tipo) {

        case "recompensa":

            let scrap =
                random(
                    CONFIG.RECOMPENSA_CHATARRA_MIN,
                    CONFIG.RECOMPENSA_CHATARRA_MAX
                );

            scrap = Math.floor(scrap * jugador.bonusRecoleccion);

            jugador.chatarra += scrap;

            texto += `<p>+${scrap} chatarra</p>`;

            break;

        case "danio":

            if(jugador.escudo){

                texto += `<p>🛡️ Escudo bloqueó el daño</p>`;
                break;

            }

            let danio =
                random(
                    CONFIG.DANIO_EVENTO_MIN,
                    CONFIG.DANIO_EVENTO_MAX
                );

            danio = Math.floor(
                danio * (1 - jugador.reduccionDanio / 100)
            );

            jugador.vida -= danio;

            texto += `<p>-${danio} vida</p>`;

            break;

        case "curacion":

            jugador.vida += 30;

            if(jugador.vida > jugador.vidaMax)
                jugador.vida = jugador.vidaMax;

            texto += `<p>+30 vida</p>`;

            break;

        case "escudo":

            jugador.escudo = true;
            jugador.turnosEscudo = 5;

            texto += `<p>Escudo por 5 turnos</p>`;

            break;

    }

    document.getElementById("eventBox").innerHTML = texto;

}

// =====================================
// EXPLORAR
// =====================================

function explorar() {

    jugador.distancia += 10;

    jugador.oxigeno -= CONFIG.CONSUMO_OXIGENO_POR_TURNO;

    if(jugador.oxigeno < 0)
        jugador.oxigeno = 0;

    if(jugador.oxigeno <= 0){

        jugador.vida -= CONFIG.CONSUMO_VIDA_SIN_OXIGENO;

    }

    generarEvento();

    if(jugador.regeneracion > 0){

        jugador.vida += jugador.regeneracion;

        if(jugador.vida > jugador.vidaMax)
            jugador.vida = jugador.vidaMax;

    }

    if(jugador.turnosEscudo > 0){

        jugador.turnosEscudo--;

        if(jugador.turnosEscudo <= 0){

            jugador.escudo = false;

        }

    }

    if(jugador.vida <= 0){

        gameOver();
        return;

    }

    actualizarUI();

}

// =====================================
// MERCADO
// =====================================

function abrirMercado() {

    let html = `
        <h2>🏪 MERCADO</h2>
    `;

    for(let id in CONFIG.MEJORAS){

        const m = CONFIG.MEJORAS[id];

        html += `
            <div class="market-item">

                <h3>${m.nombre}</h3>

                <p>${m.efecto}</p>

                <p>💰 ${m.costo}</p>

                <button onclick="comprar('${id}')">
                    COMPRAR
                </button>

            </div>
        `;

    }

    document.getElementById("market").innerHTML = html;

}

// =====================================
// COMPRAR
// =====================================

function comprar(id) {

    const mejora = CONFIG.MEJORAS[id];

    if(jugador.chatarra < mejora.costo){

        alert("No tienes suficiente chatarra");
        return;

    }

    if(jugador.mejoras.includes(id)){

        alert("Ya comprada");
        return;

    }

    jugador.chatarra -= mejora.costo;

    jugador.mejoras.push(id);

    switch(id){

        case "cilindro_oxigeno":

            jugador.oxigenoMax += 50;
            jugador.oxigeno = jugador.oxigenoMax;

            break;

        case "armadura_ligera":

            jugador.reduccionDanio += 20;

            break;

        case "detector_recursos":

            jugador.bonusRecoleccion += 0.3;

            break;

        case "medibots":

            jugador.regeneracion = 5;

            break;

    }

    actualizarUI();

    alert("Mejora comprada");

}

// =====================================
// DESCANSAR
// =====================================

function descansar() {

    jugador.vida += 20;
    jugador.oxigeno += 20;

    if(jugador.vida > jugador.vidaMax)
        jugador.vida = jugador.vidaMax;

    if(jugador.oxigeno > jugador.oxigenoMax)
        jugador.oxigeno = jugador.oxigenoMax;

    document.getElementById("eventBox").innerHTML = `
        <h2>😴 Descanso</h2>
        <p>Recuperaste recursos.</p>
    `;

    actualizarUI();

}

// =====================================
// GAME OVER
// =====================================

function gameOver(){

    document.body.innerHTML = `

        <div style="
            color:red;
            text-align:center;
            margin-top:100px;
            font-family:Arial;
        ">

            <h1>☠ GAME OVER</h1>

            <h2>Distancia: ${jugador.distancia}m</h2>

            <button onclick="location.reload()">
                REINICIAR
            </button>

        </div>

    `;

}

// =====================================
// UTILS
// =====================================

function random(min,max){

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

// =====================================
// START
// =====================================

actualizarUI();
