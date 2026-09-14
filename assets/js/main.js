// =========================================================
// 1. FIREBASE
// =========================================================
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    query,
    orderByKey,
    limitToLast,
    set
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuMehgD-CrrSLW6SIz4OMg7LzDGbY9NTw",
    authDomain: "aeroponia-uts.firebaseapp.com",
    databaseURL: "https://aeroponia-uts-2026-default-rtdb.firebaseio.com",
    projectId: "Aeroponia-UTS",
    storageBucket: "aeroponia-uts.firebasestorage.app",
    messagingSenderId: "553659066320",
    appId: "1:553659066320:web:2fe4b64c723727c8b67bd5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const valorActualRef = ref(db, "Aeroponia-UTS/Valor_Actual");
const historialRef = query(
    ref(db, "Aeroponia-UTS/Historial"),
    orderByKey(),
    limitToLast(100)
);
const etapaConfigRef = ref(db, "Aeroponia-UTS/Config/etapa");

// =========================================================
// 2. BASE DE DATOS DE CULTIVOS (INFO MODAL)
// =========================================================
const DATOS_CULTIVOS = {
    lechuga: {
        icono: '🥬', nombre: 'Lechuga', tipo: 'Hoja verde',
        descripcion: 'Cultivo de hoja verde, rápido y perfecto para aeroponía. Ideal para principiantes.',
        tiempo_cosecha: '28-35 días', ph_ideal: '5.5 - 6.5', temp_ideal: '15-22 °C',
        humedad_ideal: '60-70%', luz_ideal: '12-16 horas',
        consejos: [
            '🌱 Germina en oscuridad los primeros 3 días.',
            '💧 Mantén el pH entre 5.5 y 6.5 para absorber nutrientes.',
            '🌡️ No superes los 25°C o se espigará (florecerá antes de tiempo).',
            '✂️ Cosecha hoja por hoja para mayor producción.'
        ],
        dificultad: '⭐ Fácil', rendimiento: '2-3 kg/m²',
        curiosidad: '¡La lechuga es 95% agua! Por eso en aeroponía crece tan rápido y crujiente.'
    },
    fresa: {
        icono: '🍓', nombre: 'Fresa', tipo: 'Fruto rojo',
        descripcion: 'Fruto dulce y aromático. En aeroponía da frutos más grandes y limpios.',
        tiempo_cosecha: '60-90 días', ph_ideal: '5.8 - 6.5', temp_ideal: '18-24 °C',
        humedad_ideal: '65-80%', luz_ideal: '14-16 horas',
        consejos: [
            '🌺 Necesita polinización manual o con ventiladores.',
            '🍓 Corta los estolones (hijos) para que la planta enfoque energía en frutos.',
            '💧 Aumenta el potasio en la floración para frutos más dulces.',
            '❄️ Las fresas necesitan un "shock de frío" (10-15°C) para activar la floración.'
        ],
        dificultad: '⭐⭐⭐ Media-Alta', rendimiento: '1-2 kg/planta',
        curiosidad: '¡La fresa no es una baya verdadera! Es un "aquenio" (los puntitos son los frutos).'
    },
    tomate: {
        icono: '🍅', nombre: 'Tomate', tipo: 'Fruto',
        descripcion: 'El rey de la huerta. En aeroponía crece vigoroso y con frutos de calidad superior.',
        tiempo_cosecha: '70-90 días', ph_ideal: '5.8 - 6.8', temp_ideal: '20-26 °C',
        humedad_ideal: '60-75%', luz_ideal: '14-18 horas',
        consejos: [
            '🌿 Poda los chupones (brotes laterales) para que crezca en un solo tallo.',
            '🍅 Cuando los frutos comiencen a pintar (cambiar de color), reduce el nitrógeno.',
            '💧 El calcio es clave: previene la "podredumbre apical" (mancha negra en la base).',
            '🪴 Entutorado obligatorio: el tomate es un bejuco que necesita soporte.'
        ],
        dificultad: '⭐⭐⭐ Media', rendimiento: '4-6 kg/planta',
        curiosidad: 'El tomate tiene más de 10,000 variedades en el mundo. ¡La más cara cuesta $100 el kilo!'
    },
    cilantro: {
        icono: '🌿', nombre: 'Cilantro', tipo: 'Hierba aromática',
        descripcion: 'Aroma inconfundible. Crece rápido y se cosecha varias veces.',
        tiempo_cosecha: '25-30 días', ph_ideal: '6.0 - 7.0', temp_ideal: '18-24 °C',
        humedad_ideal: '60-70%', luz_ideal: '10-12 horas',
        consejos: [
            '✂️ Cosecha las hojas externas primero, dejando el centro para que siga creciendo.',
            '💧 No dejes que el sustrato se seque: el cilantro es sensible a la sequía.',
            '🌱 Si ves que florece (espiga), es porque tiene estrés por calor o luz excesiva.',
            '🧅 Combina bien con cebolla y limón en la cocina.'
        ],
        dificultad: '⭐ Fácil', rendimiento: '0.5-1 kg/m²',
        curiosidad: '¡El cilantro es pariente del perejil, el comino y la zanahoria!'
    },
    albahaca: {
        icono: '🌱', nombre: 'Albahaca', tipo: 'Hierba aromática',
        descripcion: 'Aroma dulce y picante. En aeroponía desarrolla hojas enormes y aceites esenciales intensos.',
        tiempo_cosecha: '30-40 días', ph_ideal: '5.8 - 6.5', temp_ideal: '20-28 °C',
        humedad_ideal: '60-70%', luz_ideal: '14-16 horas',
        consejos: [
            '✂️ Corta la punta principal para que se ramifique y dé más hojas.',
            '🌞 Necesita mucho sol: si le falta luz, las hojas se vuelven pequeñas y pálidas.',
            '💧 El agua con pH alto reduce su aroma. Mantén el pH en rango.',
            '🍝 La albahaca y el tomate son compañeros perfectos en el plato y en el huerto.'
        ],
        dificultad: '⭐⭐ Fácil-Media', rendimiento: '1-2 kg/m²',
        curiosidad: 'En la antigua Grecia, la albahaca era símbolo de odio. ¡Hoy es el rey de la cocina italiana!'
    },
    espinaca: {
        icono: '🥗', nombre: 'Espinaca', tipo: 'Hoja verde',
        descripcion: 'Superalimento rico en hierro. En aeroponía crece limpia y sin tierra.',
        tiempo_cosecha: '25-35 días', ph_ideal: '6.0 - 7.0', temp_ideal: '15-20 °C',
        humedad_ideal: '60-70%', luz_ideal: '12-14 horas',
        consejos: [
            '❄️ La espinaca prefiere clima fresco: si hace calor (>25°C), se espiga y amarga.',
            '✂️ Cosecha hoja por hoja desde afuera hacia adentro.',
            '💧 El hierro en la espinaca se absorbe mejor con vitamina C (¡échale limón!).',
            '🌱 Es una de las plantas que más rápido crece en aeroponía.'
        ],
        dificultad: '⭐⭐ Media', rendimiento: '1-2 kg/m²',
        curiosidad: '¡Popeye no se equivocaba! La espinaca tiene hierro, pero el mito nació por un error de cálculo de un científico en 1870.'
    }
};

// =========================================================
// 3. BASE DE DATOS DE CULTIVOS (SISTEMA)
// =========================================================
const cultivosDB = {
    lechuga: {
        nombre: "Lechuga", tipo: "Hoja verde",
        descripcion: "Cultivo de rápido crecimiento, ideal para principiantes.",
        ph: { min: 5.5, max: 6.5, ideal: 6.0, unidad: "" },
        temp: { min: 15, max: 24, ideal: 20, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 21, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 400, max: 600, ideal: 500, unidad: " lux" },
        ciclo: { min: 30, max: 45, promedio: 38 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 18, max: 22, ideal: 20 }, humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 7, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 14, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 20, max: 26, ideal: 23 }, humedad: { min: 50, max: 70, ideal: 60 } } },
            { dia: 25, nombre: "🌿 Desarrollo", descripcion: "Planta grande, lista para cosechar.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 35, nombre: "✅ Cosecha", descripcion: "¡Lista para cortar!",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 15, max: 20, ideal: 18 }, humedad: { min: 40, max: 60, ideal: 50 } } }
        ]
    },
    fresa: {
        nombre: "Fresa", tipo: "Fruto", descripcion: "Cultivo de alto valor comercial.",
        ph: { min: 5.5, max: 6.2, ideal: 5.8, unidad: "" },
        temp: { min: 15, max: 26, ideal: 22, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 21, unidad: "°C" },
        humedad: { min: 65, max: 75, ideal: 70, unidad: "%" },
        luz: { min: 500, max: 700, ideal: 600, unidad: " lux" },
        ciclo: { min: 60, max: 90, promedio: 75 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 18, max: 22, ideal: 20 }, humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 15, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 65, max: 80, ideal: 72 } } },
            { dia: 30, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 20, max: 26, ideal: 23 }, humedad: { min: 60, max: 75, ideal: 68 } } },
            { dia: 50, nombre: "🌿 Floración", descripcion: "Aparecen flores, poliniza.",
                ajustes: { luz: { min: 600, max: 800, ideal: 700 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 70, nombre: "🍓 Cosecha", descripcion: "¡Fresas rojas y dulces!",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 15, max: 22, ideal: 18 }, humedad: { min: 50, max: 65, ideal: 58 } } }
        ]
    },
    tomate: {
        nombre: "Tomate cherry", tipo: "Fruto", descripcion: "Cultivo de gran demanda.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2, unidad: "" },
        temp: { min: 18, max: 28, ideal: 25, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 22, unidad: "°C" },
        humedad: { min: 60, max: 70, ideal: 65, unidad: "%" },
        luz: { min: 600, max: 800, ideal: 700, unidad: " lux" },
        ciclo: { min: 70, max: 100, promedio: 85 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 20, max: 25, ideal: 22 }, humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 20, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 20, max: 26, ideal: 23 }, humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 40, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 600, max: 800, ideal: 700 }, temp: { min: 22, max: 28, ideal: 25 }, humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 60, nombre: "🌿 Floración", descripcion: "Aparecen flores, poliniza.",
                ajustes: { luz: { min: 700, max: 900, ideal: 800 }, temp: { min: 20, max: 26, ideal: 23 }, humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 80, nombre: "🍅 Cosecha", descripcion: "¡Tomates rojos y firmes!",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 45, max: 60, ideal: 52 } } }
        ]
    },
    cilantro: {
        nombre: "Cilantro", tipo: "Hierba aromática", descripcion: "Ciclo corto y alta rotación.",
        ph: { min: 6.0, max: 6.8, ideal: 6.4, unidad: "" },
        temp: { min: 15, max: 25, ideal: 20, unidad: "°C" },
        "temp-agua": { min: 15, max: 22, ideal: 19, unidad: "°C" },
        humedad: { min: 40, max: 60, ideal: 50, unidad: "%" },
        luz: { min: 300, max: 500, ideal: 400, unidad: " lux" },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 15, max: 20, ideal: 18 }, humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 10, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 200, max: 350, ideal: 280 }, temp: { min: 18, max: 22, ideal: 20 }, humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 20, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 18, max: 24, ideal: 21 }, humedad: { min: 40, max: 55, ideal: 48 } } },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 15, max: 20, ideal: 18 }, humedad: { min: 35, max: 50, ideal: 42 } } }
        ]
    },
    albahaca: {
        nombre: "Albahaca", tipo: "Hierba aromática", descripcion: "Aroma intenso. Crece muy bien en aeroponía.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2, unidad: "" },
        temp: { min: 20, max: 28, ideal: 24, unidad: "°C" },
        "temp-agua": { min: 20, max: 26, ideal: 23, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 500, max: 700, ideal: 600, unidad: " lux" },
        ciclo: { min: 30, max: 50, promedio: 40 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 22, max: 26, ideal: 24 }, humedad: { min: 65, max: 85, ideal: 75 } } },
            { dia: 12, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 22, max: 27, ideal: 24 }, humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 25, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 24, max: 28, ideal: 26 }, humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 38, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 20, max: 25, ideal: 22 }, humedad: { min: 40, max: 55, ideal: 48 } } }
        ]
    },
    espinaca: {
        nombre: "Espinaca", tipo: "Hoja verde", descripcion: "Alta en nutrientes y de crecimiento rápido.",
        ph: { min: 6.0, max: 7.0, ideal: 6.5, unidad: "" },
        temp: { min: 10, max: 22, ideal: 18, unidad: "°C" },
        "temp-agua": { min: 15, max: 22, ideal: 19, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 300, max: 500, ideal: 400, unidad: " lux" },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 12, max: 18, ideal: 15 }, humedad: { min: 65, max: 85, ideal: 75 } } },
            { dia: 8, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 200, max: 350, ideal: 280 }, temp: { min: 14, max: 20, ideal: 17 }, humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 18, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 14, max: 22, ideal: 18 }, humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 10, max: 18, ideal: 14 }, humedad: { min: 40, max: 55, ideal: 48 } } }
        ]
    }
};

// =========================================================
// 4. VARIABLES GLOBALES
// =========================================================
let cultivoSeleccionado = 'lechuga';
let datosActuales = null;
let registrosHistorial = [];
let sensorAbierto = null;
let chartInstance = null;
let chartHashGrafica = null;
let chatIniciado = false;
let fechaInicio = null;
let previewEtapa = null;

// ---- BOMBA ----
let bombaModo = null;
let bombaSegundos = null;
let bombaUltimoTimestamp = null;

// ---- CONEXIÓN ----
let isOffline = false;
let offlineStartTime = null;
let lastUpdateTime = null;
let dataTimeout = null;
const DATA_TIMEOUT_MS = 30000;

// ---- CACHE ANALISIS ----
const _cacheAnalisis = new Map();

// ---- SCHEDULER UI ----
let uiPendiente = false;
function programarActualizacionUI() {
    if (uiPendiente) return;
    uiPendiente = true;
    requestAnimationFrame(() => {
        uiPendiente = false;
        actualizarEstadoGeneral();
        actualizarDetalleAbierto();
    });
}

function getCultivoInfo() {
    return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
}

// =========================================================
// 5. RANGOS POR ETAPA
// =========================================================
function getRangoPorEtapa(sensor, dias) {
    const cultivo = getCultivoInfo();
    let etapaActual = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) { etapaActual = cultivo.etapas[i]; break; }
    }
    if (etapaActual.ajustes && etapaActual.ajustes[sensor]) {
        const a = etapaActual.ajustes[sensor];
        return { min: a.min, max: a.max, ideal: a.ideal, unidad: a.unidad || '', etapa: etapaActual.nombre };
    }
    const base = cultivo[sensor];
    if (base) return { ...base, etapa: etapaActual.nombre };
    const def = rangosPorDefecto[sensor];
    return { ...def, etapa: etapaActual.nombre };
}

// =========================================================
// 6. CONFIGURACIÓN DE SENSORES
// =========================================================
const configuracion = {
    ph:         { campo: "PH",                  nombre: "pH",                   icono: "fa-flask",                        unidad: "",     decimales: 2, descripcion: "El pH indica qué tan ácida o alcalina es la solución nutritiva.", cualitativo: false },
    temp:       { campo: "Temperatura_Ambiente",nombre: "Temperatura ambiente", icono: "fa-temperature-half",             unidad: "°C",   decimales: 1, descripcion: "La temperatura ambiente influye directamente en el crecimiento.", cualitativo: false },
    "temp-agua":{ campo: "Temperatura_Agua",    nombre: "Temperatura del agua", icono: "fa-temperature-three-quarters",   unidad: "°C",   decimales: 1, descripcion: "La temperatura del agua influye en la disponibilidad de oxígeno.", cualitativo: false },
    hum:        { campo: "Humedad_Ambiente",    nombre: "Humedad",              icono: "fa-droplet",                      unidad: "%",    decimales: 1, descripcion: "La humedad indica la cantidad de vapor de agua en el ambiente.", cualitativo: false },
    luz:        { campo: "luz",                 nombre: "Luz",                  icono: "fa-sun",                          unidad: " lux", decimales: 0, descripcion: "La iluminación proporciona la energía para la fotosíntesis.", cualitativo: true }
};

const rangosPorDefecto = {
    ph: { min: 5.0, max: 7.0, ideal: 6.0, unidad: "" },
    temp: { min: 15, max: 28, ideal: 22, unidad: "°C" },
    "temp-agua": { min: 18, max: 26, ideal: 22, unidad: "°C" },
    hum: { min: 40, max: 80, ideal: 60, unidad: "%" },
    luz: { min: 300, max: 800, ideal: 500, unidad: " lux" }
};

const LIMITES_FISICOS = {
    ph: { min: 0, max: 14 },
    temp: { min: -20, max: 60 },
    "temp-agua": { min: -5, max: 60 },
    hum: { min: 0, max: 100 },
    luz: { min: 0, max: 100000 }
};

function esValorImposible(sensor, valor) {
    const l = LIMITES_FISICOS[sensor];
    if (!l || !Number.isFinite(valor)) return false;
    return valor < l.min || valor > l.max;
}

// =========================================================
// 7. ANÁLISIS
// =========================================================
function obtenerDiasTranscurridos() {
    if (fechaInicio) {
        const diff = new Date() - new Date(fechaInicio);
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
}

function obtenerEstadisticasHistoricas(sensor) {
    const c = configuracion[sensor];
    const valores = registrosHistorial.map(r => Number(r[c.campo])).filter(v => Number.isFinite(v));
    if (valores.length === 0) return { total: 0, promedio: null, minimo: null, maximo: null, desviacion: null, valores: [] };
    const suma = valores.reduce((a, b) => a + b, 0);
    const promedio = suma / valores.length;
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    const desviacion = Math.sqrt(valores.map(v => (v - promedio) ** 2).reduce((a, b) => a + b, 0) / valores.length);
    return { total: valores.length, promedio, minimo, maximo, desviacion, valores };
}

function obtenerTendenciaReal(sensor, ventana = 20) {
    const c = configuracion[sensor];
    const valores = registrosHistorial.map(r => Number(r[c.campo])).filter(v => Number.isFinite(v));
    if (valores.length < 4) return { tipo: "estable", texto: "No hay suficientes datos históricos.", porcentaje: 0 };
    const recientes = valores.slice(-ventana);
    const anteriores = valores.slice(0, -ventana).slice(-ventana);
    if (recientes.length < 3 || anteriores.length < 3) return { tipo: "estable", texto: "Datos insuficientes para tendencia.", porcentaje: 0 };
    const promA = anteriores.reduce((a, b) => a + b, 0) / anteriores.length;
    const promR = recientes.reduce((a, b) => a + b, 0) / recientes.length;
    if (promA === 0) return { tipo: "estable", texto: "Datos insuficientes.", porcentaje: 0 };
    const dif = promR - promA;
    const pct = (dif / Math.abs(promA)) * 100;
    if (Math.abs(pct) < 3) return { tipo: "estable", texto: `📊 Estable (variación del ${pct.toFixed(1)}%).`, porcentaje: pct };
    if (dif > 0) return { tipo: "subiendo", texto: `⬆️ Subiendo un ${pct.toFixed(1)}% en las últimas mediciones.`, porcentaje: pct };
    return { tipo: "bajando", texto: `⬇️ Bajando un ${Math.abs(pct).toFixed(1)}% en las últimas mediciones.`, porcentaje: pct };
}

function detectarAnomaliaConHistorial(sensor, valorActual) {
    const stats = obtenerEstadisticasHistoricas(sensor);
    if (!stats.promedio || stats.desviacion === null || stats.total < 10) {
        return { esAnomalia: false, texto: "ℹ️ Necesito al menos 10 registros para detectar anomalías." };
    }
    const sup = stats.promedio + stats.desviacion * 2.5;
    const inf = stats.promedio - stats.desviacion * 2.5;
    if (valorActual > sup || valorActual < inf) {
        return { esAnomalia: true, texto: `🚨 ¡VALOR ANÓMALO! Normalmente está entre ${stats.minimo.toFixed(2)} y ${stats.maximo.toFixed(2)}.` };
    }
    return { esAnomalia: false, texto: `✅ Valor dentro del rango histórico normal.` };
}

// =========================================================
// 8. ESTADO
// =========================================================
function obtenerEstado(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    if (valor === null || valor === undefined || isNaN(valor)) {
        return { estado: "warning", texto: "⚠️ Sin datos" };
    }
    if (esValorImposible(sensor, valor)) {
        return { estado: "danger", texto: "🔌 Sensor dañado", esError: true };
    }
    const { min, max } = rango;
    if (sensor === 'luz') {
        if (valor < min) return { estado: "warning", texto: "🌑 Poca luz" };
        if (valor > max) return { estado: "danger", texto: "☀️ Exceso de luz" };
        return { estado: "ok", texto: "☀️ Buena luz" };
    }
    if (valor >= min && valor <= max) return { estado: "ok", texto: "✅ Bueno" };
    const margen = (max - min) * 0.20;
    if (valor >= min - margen && valor <= max + margen) return { estado: "warning", texto: "⚠️ Regular" };
    return { estado: "danger", texto: "❌ Crítico" };
}

function formato(valor, sensor) {
    const c = configuracion[sensor];
    if (!Number.isFinite(valor)) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}

// =========================================================
// 9. SOLUCIONES PRÁCTICAS
// =========================================================
function generarSolucionesPracticas(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const c = configuracion[sensor];
    let soluciones = [];
    let explicacion = "";

    if (esValorImposible(sensor, valor)) {
        return {
            soluciones: [
                "🔌 Revisa que el sensor esté bien conectado",
                "🔋 Verifica la alimentación eléctrica del sensor",
                "🧵 Revisa el cableado en busca de daños o falsos contactos",
                "🔄 Reinicia el módulo/ESP32 si el problema continúa",
                "🛠️ Si persiste, reemplaza el sensor"
            ],
            explicacion: `🔌 El sensor de ${c.nombre.toLowerCase()} está entregando un valor imposible (${valor}${c.unidad}). Esto no es un problema del cultivo, es una falla del sensor.`
        };
    }
    if (!rango || !Number.isFinite(valor)) {
        return { soluciones: ["⚠️ No hay datos de referencia."], explicacion: "Espera a tener más datos." };
    }
    const { min, max, ideal, etapa } = rango;

    if (sensor === 'luz') {
        if (valor < min) {
            explicacion = `💡 Hay POCA luz (${valor.toFixed(0)} lux) para la etapa ${etapa}. Las plantas necesitan más energía.`;
            soluciones = ["💡 Aumenta la intensidad de las luces", "📏 Reduce la distancia entre las luces y las plantas", "⏰ Extiende el fotoperiodo a 12-14 horas", "☀️ Coloca el sistema cerca de una ventana con luz natural"];
        } else if (valor > max) {
            explicacion = `💡 Hay EXCESO de luz (${valor.toFixed(0)} lux) para la etapa ${etapa}. Las plantas pueden quemarse.`;
            soluciones = ["📏 Aumenta la distancia de las luces", "🔅 Reduce la intensidad de las luces", "⏰ Reduce el fotoperiodo a 10-12 horas", "🌿 Usa malla de sombra si es luz solar"];
        } else {
            explicacion = `✅ La iluminación (${valor.toFixed(0)} lux) es adecuada para la etapa ${etapa}.`;
            soluciones = ["👍 Mantén las condiciones de luz actuales"];
        }
    } else if (sensor === 'temp') {
        if (valor < min) { explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está FRÍA para la etapa ${etapa}.`; soluciones = ["🔥 Enciende un calefactor", "🪟 Cierra ventanas", "📦 Aísla el sistema"]; }
        else if (valor > max) { explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está CALIENTE para la etapa ${etapa}. ¡ACTÚA!`; soluciones = ["💨 Abre ventanas", "🌀 Coloca un ventilador", "🧊 Moja el piso alrededor"]; }
        else { explicacion = `✅ La temperatura (${valor.toFixed(1)}°C) es ideal para la etapa ${etapa}.`; soluciones = ["👍 Mantén las condiciones actuales"]; }
    } else if (sensor === 'hum') {
        if (valor < min) { explicacion = `💧 El ambiente está SECO (${valor.toFixed(1)}%) para la etapa ${etapa}.`; soluciones = ["💨 Usa un humidificador", "💧 Coloca bandejas con agua", "🌿 Agrupa las plantas"]; }
        else if (valor > max) { explicacion = `💧 El ambiente está HÚMEDO (${valor.toFixed(1)}%) para la etapa ${etapa}.`; soluciones = ["💨 Abre ventanas", "🌀 Usa un ventilador", "🧊 Deshumidificador"]; }
        else { explicacion = `✅ La humedad (${valor.toFixed(1)}%) es ideal para la etapa ${etapa}.`; soluciones = ["👍 Mantén las condiciones actuales"]; }
    } else if (sensor === 'ph') {
        if (valor < min) { explicacion = `🔬 El pH está ÁCIDO (${valor.toFixed(2)}) para la etapa ${etapa}.`; soluciones = ["🧪 Añade pH UP", "⏳ Espera 15 minutos y mide", `🔄 Repite hasta llegar a pH ${ideal}`]; }
        else if (valor > max) { explicacion = `🔬 El pH está ALCALINO (${valor.toFixed(2)}) para la etapa ${etapa}.`; soluciones = ["🧪 Añade pH DOWN", "⏳ Espera 15 minutos y mide", `🔄 Repite hasta llegar a pH ${ideal}`]; }
        else { explicacion = `✅ El pH (${valor.toFixed(2)}) es ideal para la etapa ${etapa}.`; soluciones = ["👍 Mantén las condiciones actuales"]; }
    } else if (sensor === 'temp-agua') {
        if (valor < min) { explicacion = `🌊 El agua está FRÍA (${valor.toFixed(1)}°C) para la etapa ${etapa}.`; soluciones = ["🔥 Usa un calentador de acuario", "🌡️ Coloca el depósito en un lugar cálido"]; }
        else if (valor > max) { explicacion = `🌊 El agua está CALIENTE (${valor.toFixed(1)}°C) para la etapa ${etapa}. ¡URGENTE!`; soluciones = ["🧊 Pon botellas con agua congelada", "🌡️ Cambia el agua por agua fresca"]; }
        else { explicacion = `✅ El agua (${valor.toFixed(1)}°C) está ideal para la etapa ${etapa}.`; soluciones = ["👍 Mantén la temperatura estable"]; }
    }
    return { soluciones, explicacion };
}

// =========================================================
// 10. ANALISIS INTELIGENTE
// =========================================================
function analizarSensor(sensor, valor) {
    const c = configuracion[sensor];
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const stats = obtenerEstadisticasHistoricas(sensor);
    const tendencia = obtenerTendenciaReal(sensor, 20);
    const anomalia = detectarAnomaliaConHistorial(sensor, valor);
    const estado = obtenerEstado(sensor, valor);
    const soluciones = generarSolucionesPracticas(sensor, valor);
    let significado = "";
    let recomendacion = "";

    if (estado.esError) {
        significado = `🔌 El sensor de ${c.nombre.toLowerCase()} está entregando un valor físicamente imposible (${valor}${c.unidad}). No es un problema del cultivo: indica un sensor desconectado, dañado o con falla de lectura.`;
        recomendacion = "🔧 Revisa la conexión, el cableado y la alimentación del sensor. Si el problema persiste, reemplázalo.";
        return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones, totalDatos: stats.total, etapa: rango ? rango.etapa : undefined };
    }
    if (!stats.promedio || stats.total < 3) {
        significado = `📊 Valor actual: ${valor.toFixed(c.decimales)}${c.unidad}. Aún tengo pocos datos históricos (${stats.total} registros).`;
        recomendacion = "Continúa monitoreando. En unos días podré darte análisis más precisos.";
        return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones, totalDatos: stats.total };
    }
    const { min, max, ideal, etapa } = rango;
    if (valor < min) {
        significado = `📉 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por DEBAJO del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `⚠️ Necesitas SUBIR este valor. El valor ideal es ${ideal}${c.unidad}.`;
    } else if (valor > max) {
        significado = `📈 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por ENCIMA del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `⚠️ Necesitas BAJAR este valor. El valor ideal es ${ideal}${c.unidad}.`;
    } else {
        significado = `✅ El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está DENTRO del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `👍 Mantén las condiciones actuales. El valor ideal es ${ideal}${c.unidad}.`;
    }
    if (tendencia.porcentaje !== 0 && Math.abs(tendencia.porcentaje) > 3) {
        significado += ` 📊 ${tendencia.texto}`;
    }
    if (anomalia.esAnomalia) {
        significado += ` ${anomalia.texto}`;
    }
    return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones, totalDatos: stats.total, etapa };
}

function analizarSensorCached(sensor, valor) {
    const key = `${sensor}_${valor}_${registrosHistorial.length}`;
    const v = _cacheAnalisis.get(key);
    if (v) return v;
    const res = analizarSensor(sensor, valor);
    if (_cacheAnalisis.size > 300) _cacheAnalisis.clear();
    _cacheAnalisis.set(key, res);
    return res;
}
// =========================================================
// 11. ACTUALIZAR TARJETAS DE SENSORES
// =========================================================
function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);
    if (!elemento) return;

    if (isOffline) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "sensor-error");
        card.classList.add("estado-offline");
        status.className = "sub sub-offline";
        elemento.innerHTML = (sensor === 'luz') ? "📡 Sin datos" : "--";
        status.textContent = "📡 Sin datos";
        return;
    }

    if (!Number.isFinite(valor)) {
        elemento.textContent = "--";
        status.textContent = "⚠️ Esperando...";
        status.className = "sub sub-warning";
        return;
    }

    const resultado = obtenerEstado(sensor, valor);

    if (resultado.esError) {
        elemento.innerHTML = `<span style="font-size:20px;">⚠️ ERROR</span>`;
    } else if (sensor === 'luz') {
        elemento.innerHTML = resultado.texto;
    } else {
        elemento.innerHTML = valor.toFixed(c.decimales) + `<span class="unit">${c.unidad}</span>`;
    }

    status.textContent = resultado.texto;
    status.className = `sub sub-${resultado.estado}`;

    card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline", "sensor-error");
    card.classList.add(`estado-${resultado.estado}`);
    if (resultado.esError) card.classList.add("sensor-error");
}

function actualizarTarjetaBomba(valor) {
    const elemento = document.getElementById("sensor-bomba");
    const status = document.getElementById("sensor-bomba-status");
    const card = document.getElementById("card-bomba");
    const icono = document.getElementById("bomba-icon");
    if (!elemento) return;

    if (isOffline) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card.classList.add("estado-offline");
        status.className = "sub sub-offline";
        status.textContent = "📡 Sin datos";
        elemento.textContent = "--";
        return;
    }
    if (valor === undefined || valor === null) {
        elemento.textContent = "--";
        status.textContent = "⚠️ Esperando...";
        status.className = "sub sub-warning";
        return;
    }

    const encendida = valor === true || valor === "true";
    elemento.textContent = encendida ? "🔴 ON" : "⏸️ OFF";
    status.textContent = encendida ? "✅ Encendida" : "⏸️ Apagada";
    status.className = encendida ? "sub sub-ok" : "sub sub-off";

    card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card.classList.add(encendida ? "estado-ok" : "estado-off");

    if (icono) icono.style.color = encendida ? "#22c55e" : "#64748b";
}

// =========================================================
// 12. BOMBA - CUENTA REGRESIVA (UN SOLO TIMER GLOBAL)
// =========================================================
function formatearSegundos(s) {
    if (!Number.isFinite(s) || s < 0) return "--:--";
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function textoModoBomba(modo) {
    switch (modo) {
        case "ON":     return "💧 Regando";
        case "EMERG":  return "🔥 Riego emergencia";
        case "DESC":   return "⏸️ En descanso";
        case "ESPERA": return "⏳ Esperando riego";
        default:       return "🤖 Estado desconocido";
    }
}

function actualizarInfoBombaUI(segundos) {
    const elemModo = document.getElementById("bomba-modo");
    const elemTiempo = document.getElementById("bomba-tiempo");
    const infoBox = document.querySelector(".bomba-info");
    if (!elemModo || !elemTiempo) return;

    if (isOffline || bombaModo === null) {
        if (elemModo.textContent !== "📡 Sin datos") elemModo.textContent = "📡 Sin datos";
        if (elemTiempo.textContent !== "--:--") elemTiempo.textContent = "--:--";
        if (infoBox && infoBox.className !== "bomba-info") infoBox.className = "bomba-info";
        return;
    }

    const texto = textoModoBomba(bombaModo);
    if (elemModo.textContent !== texto) elemModo.textContent = texto;

    let color = "#94a3b8";
    let clase = "bomba-info";
    switch (bombaModo) {
        case "ON":     color = "#22c55e"; clase += " modo-on";     break;
        case "EMERG":  color = "#ef4444"; clase += " modo-emerg";  break;
        case "DESC":   color = "#f59e0b"; clase += " modo-desc";   break;
        case "ESPERA": color = "#64748b"; clase += " modo-espera"; break;
    }
    if (elemModo.style.color !== color) elemModo.style.color = color;
    if (infoBox && infoBox.className !== clase) infoBox.className = clase;

    const tiempoTexto = (segundos === null || segundos === undefined)
        ? "--:--"
        : formatearSegundos(segundos);
    if (elemTiempo.textContent !== tiempoTexto) elemTiempo.textContent = tiempoTexto;
}

// ⚠️ UN SOLO setInterval para toda la vida del script
setInterval(() => {
    if (isOffline || bombaSegundos === null || !bombaUltimoTimestamp) {
        actualizarInfoBombaUI(null);
        return;
    }
    const transcurridoLocal = Math.floor((Date.now() - bombaUltimoTimestamp) / 1000);
    const segundosActuales = Math.max(0, bombaSegundos - transcurridoLocal);
    actualizarInfoBombaUI(segundosActuales);
}, 1000);

// ⚠️ UN SOLO setInterval para el timer offline
setInterval(() => {
    if (!offlineStartTime) return;
    const diff = Math.floor((Date.now() - offlineStartTime) / 1000);
    let tiempoStr;
    if (diff < 60) tiempoStr = `hace ${diff}s`;
    else if (diff < 3600) tiempoStr = `hace ${Math.floor(diff/60)}m ${diff%60}s`;
    else tiempoStr = `hace ${Math.floor(diff/3600)}h ${Math.floor((diff%3600)/60)}m`;

    const t1 = document.getElementById('offlineTimer');
    if (t1) {
        const nuevo = `(${tiempoStr})`;
        if (t1.textContent !== nuevo) t1.textContent = nuevo;
    }
    const t2 = document.getElementById('offlineTimerAlerta');
    if (t2) {
        const nuevo = `⏱️ ${tiempoStr}`;
        if (t2.textContent !== nuevo) t2.textContent = nuevo;
    }
}, 1000);

// =========================================================
// 13. DETALLE DEL SENSOR
// =========================================================
window.abrirDetalle = function(sensor) {
    const detalle = document.getElementById("sensor-detail");
    if (sensorAbierto === sensor) {
        detalle.classList.remove("visible");
        sensorAbierto = null;
        return;
    }
    sensorAbierto = sensor;
    detalle.classList.add("visible");
    actualizarDetalle(sensor);
    setTimeout(() => detalle.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
};

function actualizarDetalle(sensor) {
    if (sensor === "bomba") { actualizarDetalleBomba(); return; }
    if (!datosActuales || !registrosHistorial.length) return;

    const c = configuracion[sensor];
    const valor = Number(datosActuales[c.campo]);
    if (!Number.isFinite(valor)) return;

    const analisis = analizarSensorCached(sensor, valor);
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    document.getElementById("detalle-titulo").innerHTML = `
        <i class="fas ${c.icono}"></i>
        Análisis de ${c.nombre} (${getCultivoInfo().nombre} - ${analisis.etapa || 'Inicio'})
        ${isOffline ? ' <span style="color:#ef4444;font-size:14px;">📡 OFF</span>' : ''}
    `;

    document.getElementById("detalle-metricas").innerHTML = `
        <div class="dato-mini">
            <span>Actual</span>
            <strong style="color: ${isOffline ? '#ef4444' : analisis.estado.estado === 'ok' ? '#86efac' : analisis.estado.estado === 'warning' ? '#fcd34d' : '#fca5a5'}">
                ${isOffline ? '📡 Sin datos' : (sensor === 'luz' ? analisis.estado.texto : formato(valor, sensor))}
            </strong>
        </div>
        <div class="dato-mini">
            <span>Rango (${analisis.etapa || 'Inicio'})</span>
            <strong>${rango ? `${rango.min} - ${rango.max} ${rango.unidad}` : 'N/A'}</strong>
        </div>
        <div class="dato-mini">
            <span>Ideal</span>
            <strong>${rango ? `${rango.ideal} ${rango.unidad}` : 'N/A'}</strong>
        </div>
        <div class="dato-mini">
            <span>Registros</span>
            <strong>${isOffline ? '📡 SIN ACT' : analisis.totalDatos}</strong>
        </div>
    `;

    if (isOffline) {
        document.getElementById("detalle-significado-text").textContent =
            "⚠️ El ESP32 no está enviando datos. El sistema aeropónico sigue funcionando de forma autónoma con los últimos parámetros configurados.";
        document.getElementById("detalle-tendencia-text").textContent =
            "📡 No hay datos nuevos. Revisa la conexión del ESP32.";
        document.getElementById("detalle-soluciones-text").innerHTML =
            `<p style="color: #fca5a5;">⚠️ El ESP32 no está transmitiendo datos. Verifica:</p>
            <ul>
                <li>🔌 Conexión WiFi del ESP32</li>
                <li>📶 Señal de internet en el invernadero</li>
                <li>🔋 Alimentación del ESP32</li>
                <li>📡 Conexión a Firebase</li>
            </ul>
            <p style="color: #fcd34d; margin-top: 8px;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
        document.getElementById("detalle-recomendacion-text").textContent =
            "Revisa la conexión del ESP32. El sistema no necesita intervención para seguir operando.";
        return;
    }

    document.getElementById("detalle-significado-text").textContent = analisis.significado;
    document.getElementById("detalle-tendencia-text").textContent = analisis.tendencia.texto;

    const solucionesDiv = document.getElementById("detalle-soluciones-text");
    if (analisis.soluciones && analisis.soluciones.soluciones.length > 0) {
        let html = `<p style="color: #c4b5fd; margin-bottom: 8px;">${analisis.soluciones.explicacion}</p><ul>`;
        analisis.soluciones.soluciones.forEach(s => {
            const urgente = s.includes('¡ACTÚA RÁPIDO!') || s.includes('¡URGENTE!');
            html += `<li class="${urgente ? 'urgente' : ''}">${s}</li>`;
        });
        html += `</ul>`;
        solucionesDiv.innerHTML = html;
    } else {
        solucionesDiv.innerHTML = `<p>No hay soluciones específicas para este parámetro.</p>`;
    }

    document.getElementById("detalle-recomendacion-text").textContent = analisis.recomendacion;
}

function actualizarDetalleBomba() {
    if (!datosActuales || !registrosHistorial.length) return;
    const valor = datosActuales.bomba === true || datosActuales.bomba === "true";

    if (isOffline) {
        document.getElementById("detalle-titulo").innerHTML = `<i class="fas fa-power-off"></i> Análisis de la Bomba 📡 OFF`;
        document.getElementById("detalle-metricas").innerHTML = `
            <div class="dato-mini"><span>Estado</span><strong style="color:#ef4444;">📡 Sin datos</strong></div>
            <div class="dato-mini"><span>Último estado</span><strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong></div>
        `;
        document.getElementById("detalle-significado-text").textContent =
            "⚠️ El ESP32 no está enviando datos. La bomba opera con el ciclo programado localmente.";
        document.getElementById("detalle-tendencia-text").textContent =
            "📡 No hay datos nuevos. Revisa la conexión del ESP32.";
        document.getElementById("detalle-soluciones-text").innerHTML =
            `<p style="color: #fca5a5;">⚠️ El ESP32 no está transmitiendo datos. Verifica la conexión.</p>
            <p style="color: #fcd34d; margin-top: 8px;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
        document.getElementById("detalle-recomendacion-text").textContent =
            "Revisa la conexión del ESP32. El sistema no necesita intervención.";
        return;
    }

    const recientes = registrosHistorial.slice(-20);
    const estados = recientes.map(r => r.bomba === true || r.bomba === "true");
    const encendidos = estados.filter(e => e).length;
    const pct = recientes.length ? ((encendidos / recientes.length) * 100).toFixed(0) : 0;
    let ciclos = 0;
    for (let i = 1; i < estados.length; i++) if (estados[i] !== estados[i - 1]) ciclos++;

    const cultivo = getCultivoInfo();
    const infoModo = bombaModo ? textoModoBomba(bombaModo) : "--";
    const infoSeg  = bombaSegundos !== null ? formatearSegundos(bombaSegundos) : "--:--";

    document.getElementById("detalle-titulo").innerHTML = `
        <i class="fas fa-power-off"></i>
        Análisis de la Bomba (${cultivo.nombre})
    `;

    document.getElementById("detalle-metricas").innerHTML = `
        <div class="dato-mini"><span>Estado</span><strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong></div>
        <div class="dato-mini"><span>Modo</span><strong>${infoModo}</strong></div>
        <div class="dato-mini"><span>Próximo cambio</span><strong>${infoSeg}</strong></div>
        <div class="dato-mini"><span>Tiempo encendida</span><strong>${pct}%</strong></div>
    `;

    document.getElementById("detalle-significado-text").textContent =
        valor ? "La bomba está encendida, realizando el ciclo de aspersión." :
        "La bomba está apagada, en espera del próximo ciclo.";

    document.getElementById("detalle-tendencia-text").textContent =
        `En las últimas ${recientes.length} mediciones, la bomba estuvo encendida un ${pct}% del tiempo. Cambios de estado recientes: ${ciclos}.`;

    const solucionesDiv = document.getElementById("detalle-soluciones-text");
    let html = `<p style="color: #c4b5fd; margin-bottom: 8px;">🔧 La bomba es el corazón del sistema.</p><ul>`;
    if (!valor) {
        html += `<li>🔌 Verifica que la bomba esté conectada</li><li>🔄 Revisa que el relé esté funcionando</li><li>💧 Comprueba el nivel de agua</li>`;
    } else {
        html += `<li>✅ La bomba está funcionando correctamente</li><li>💧 Mantén el ciclo de aspersión regular</li>`;
    }
    html += `</ul>`;
    solucionesDiv.innerHTML = html;

    document.getElementById("detalle-recomendacion-text").textContent =
        "Si la bomba no cambia de estado durante más de 1 hora, verifica la conexión del relé.";
}

function actualizarDetalleAbierto() {
    if (sensorAbierto) actualizarDetalle(sensorAbierto);
}

// =========================================================
// 14. PANEL DE CRECIMIENTO
// =========================================================
function getEtapaActual(dias) {
    const cultivo = getCultivoInfo();
    let etapa = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) { etapa = cultivo.etapas[i]; break; }
    }
    return etapa;
}

function actualizarPanelCrecimiento(previewIdx = null) {
    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const diasMostrar = previewIdx !== null ? cultivo.etapas[previewIdx].dia : diasActuales;
    const etapaActual = getEtapaActual(diasMostrar);
    const pct = Math.min(100, Math.round((diasMostrar / cultivo.ciclo.promedio) * 100));

    document.getElementById('etapaIcono').textContent = etapaActual.nombre.split(' ')[0] || '🌱';
    document.getElementById('etapaNombre').textContent = etapaActual.nombre;
    document.getElementById('etapaDia').textContent = `Día ${diasMostrar}`;
    document.getElementById('etapaDesc').textContent = etapaActual.descripcion;
    document.getElementById('progresoPorcentaje').textContent = `${pct}%`;

    const barra = document.getElementById('progresoBarra');
    barra.style.width = `${pct}%`;
    barra.classList.toggle('offline', isOffline);

    document.getElementById('diasTranscurridos').textContent = diasMostrar;
    document.getElementById('diasTotales').textContent = cultivo.ciclo.promedio;
    document.getElementById('etapaCorta').textContent = etapaActual.nombre;

    document.getElementById('panelCrecimiento').classList.toggle('offline', isOffline);
    document.getElementById('panelEtapaActual').classList.toggle('offline', isOffline);

    const selector = document.getElementById('selectorEtapas');
    if (selector) {
        const hash = cultivo.etapas.map((e, i) => `${i}_${e.nombre}_${isOffline}_${previewIdx}_${etapaActual.nombre}`).join('|');
        if (selector.dataset.hash !== hash) {
            selector.dataset.hash = hash;
            let html = '';
            cultivo.etapas.forEach((e, idx) => {
                let clase = 'btn-etapa';
                if (e.nombre === etapaActual.nombre && previewIdx === null) clase += ' activo';
                if (idx === previewIdx && previewIdx !== null) clase += ' preview';
                html += `<button class="${clase}" onclick="seleccionarPreview(${idx})" ${isOffline ? 'disabled' : ''}>${e.nombre}</button>`;
            });
            selector.innerHTML = html;
        }
    }

    const miniEtapas = document.getElementById('miniEtapas');
    if (miniEtapas) {
        const etapaIdx = cultivo.etapas.indexOf(etapaActual);
        const hash = cultivo.etapas.map((e, i) => `${i}_${e.nombre}_${isOffline}_${previewIdx}_${etapaIdx}`).join('|');
        if (miniEtapas.dataset.hash !== hash) {
            miniEtapas.dataset.hash = hash;
            let html = '';
            cultivo.etapas.forEach((e, idx) => {
                let clase = 'mini-etapa';
                if (e.nombre === etapaActual.nombre && previewIdx === null) clase += ' actual';
                else if (idx === previewIdx && previewIdx !== null) clase += ' preview';
                else if (idx < etapaIdx) clase += ' completada';
                if (isOffline) clase += ' offline';
                html += `<span class="${clase}">${e.nombre}</span>`;
            });
            miniEtapas.innerHTML = html;
        }
    }

    const hayPreview = previewIdx !== null;
    const btnAplicar = document.getElementById('btnAplicar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnDia0 = document.getElementById('btnDia0');

    if (isOffline) {
        btnAplicar.disabled = true;
        btnCancelar.disabled = true;
        btnDia0.disabled = true;
        document.getElementById('cambioPendiente').style.display = 'none';
        return;
    }
    if (hayPreview) {
        btnAplicar.disabled = false;
        btnCancelar.disabled = false;
        btnDia0.disabled = true;
        document.getElementById('cambioPendiente').style.display = 'flex';
        document.getElementById('cambioPendienteTexto').textContent = getEtapaActual(diasActuales).nombre;
        document.getElementById('cambioPendienteNuevo').textContent = cultivo.etapas[previewIdx].nombre;
    } else {
        btnAplicar.disabled = true;
        btnCancelar.disabled = true;
        btnDia0.disabled = false;
        document.getElementById('cambioPendiente').style.display = 'none';
    }
}

// =========================================================
// 15. PREVIEW Y ACCIONES DE ETAPA
// =========================================================
window.seleccionarPreview = function(idx) {
    if (isOffline) return;
    const cultivo = getCultivoInfo();
    const etapaActual = getEtapaActual(obtenerDiasTranscurridos());

    const norm = s => s.replace(/[^a-zA-Záéíóúñ ]/g, '').trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, '');

    if (norm(cultivo.etapas[idx].nombre) === norm(etapaActual.nombre)) {
        cancelarPreview();
        return;
    }
    previewEtapa = idx;
    actualizarPanelCrecimiento(idx);
};

function cancelarPreview() {
    previewEtapa = null;
    actualizarPanelCrecimiento(null);
}

function aplicarPreview() {
    if (previewEtapa === null || isOffline) return;
    const cultivo = getCultivoInfo();
    const etapa = cultivo.etapas[previewEtapa];
    const dias = etapa.dia;

    const nuevaFecha = new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() - dias);
    const fechaStr = nuevaFecha.toISOString().split('T')[0];

    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;

    const mapa = {
        "germinacion": "germinacion", "plantula": "plantula",
        "crecimiento": "crecimiento", "desarrollo": "desarrollo",
        "floracion": "floracion", "cosecha": "cosecha"
    };
    let nombreLimpio = etapa.nombre.replace(/[^a-zA-Záéíóúñ ]/g, '').trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    let etapaFirebase = "";
    for (const [k, v] of Object.entries(mapa)) {
        if (nombreLimpio.includes(k) || k.includes(nombreLimpio)) { etapaFirebase = v; break; }
    }
    if (etapaFirebase === "") etapaFirebase = nombreLimpio;

    const etapaRef = ref(db, "Aeroponia-UTS/Config/etapa");
    set(etapaRef, etapaFirebase)
        .then(() => {
            console.log("✅ Etapa actualizada:", etapaFirebase);
            if (chatIniciado) agregarMensaje(`📅 Cambio aplicado: ${etapa.nombre} (Día ${dias})`, "bot");
        })
        .catch(err => console.error("❌ Error etapa:", err));

    previewEtapa = null;
    actualizarPanelCrecimiento(null);
    actualizarEstadoGeneral();

    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
    }
}

function dia0() {
    if (isOffline) return;
    if (!confirm('¿Estás seguro de que quieres reiniciar el cultivo a Día 0?')) return;

    const fechaStr = new Date().toISOString().split('T')[0];
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;

    previewEtapa = null;
    actualizarPanelCrecimiento(null);
    actualizarEstadoGeneral();

    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
    }
    if (chatIniciado) agregarMensaje(`🔄 Cultivo reiniciado a Día 0 (Germinación)`, "bot");
}

// =========================================================
// 16. GESTIÓN DE CONEXIÓN
// =========================================================
function actualizarEstadoOffline(offline) {
    isOffline = offline;

    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");
    const banner = document.getElementById("offlineBanner");
    const alerta = document.getElementById("alertaBox");

    if (offline) {
        badge.className = "status-badge offline";
        text.textContent = '📡 Sin datos ESP32';
        icon.className = 'fas fa-wifi-slash';
        banner.classList.add("visible");

        if (offlineStartTime === null) offlineStartTime = new Date();

        alerta.className = "alerta-box offline";
        alerta.innerHTML = `
            <i class="fas fa-microchip"></i>
            <span>
                <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                    El microcontrolador no está enviando datos a Firebase.
                    El sistema <strong>sigue funcionando de forma autónoma</strong> en el invernadero.
                    <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                        🤖 MODO AUTÓNOMO ACTIVO
                    </span>
                </span>
                <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                    ⏱️ Último dato recibido: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}
                    <span id="offlineTimerAlerta" style="margin-left:8px;"></span>
                </span>
            </span>
        `;
        document.getElementById('chartContainer').classList.add('offline');
        document.getElementById('tableWrapper').classList.add('offline');
    } else {
        badge.className = "status-badge connected";
        text.textContent = '✅ Conectado';
        icon.className = 'fas fa-circle';
        banner.classList.remove("visible");
        offlineStartTime = null;
        document.getElementById('chartContainer').classList.remove('offline');
        document.getElementById('tableWrapper').classList.remove('offline');
        actualizarEstadoGeneral();
    }

    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }

    actualizarPanelCrecimiento(previewEtapa);
    actualizarDetalleAbierto();
    actualizarAsistente();
    renderizarChips();
}

function reiniciarTimeout() {
    if (dataTimeout) clearTimeout(dataTimeout);
    dataTimeout = setTimeout(() => actualizarEstadoOffline(true), DATA_TIMEOUT_MS);
}

// =========================================================
// 17. FIREBASE - VALOR ACTUAL
// =========================================================
onValue(valorActualRef, snapshot => {
    const datos = snapshot.val();
    if (!datos) return;

    datosActuales = datos;
    lastUpdateTime = new Date();

    // BOMBA: solo resetea el timestamp si REALMENTE cambió
    const nuevoModo = datos.bomba_modo || null;
    const segRaw = Number(datos.bomba_segundos);
    const nuevosSegundos = Number.isFinite(segRaw) ? segRaw : null;

    const cambioModo = nuevoModo !== bombaModo;
    const cambioSegundos = nuevosSegundos !== bombaSegundos;

    bombaModo = nuevoModo;
    bombaSegundos = nuevosSegundos;

    if (cambioModo || cambioSegundos) {
        bombaUltimoTimestamp = Date.now();
        actualizarInfoBombaUI(bombaSegundos);
    }

    const ultimaSpan = document.getElementById('ultimaActualizacion');
    if (ultimaSpan) ultimaSpan.textContent = lastUpdateTime.toLocaleTimeString();

    if (isOffline) {
        actualizarEstadoOffline(false);
        if (chatIniciado) agregarMensaje("🔗 ¡Datos recibidos! El ESP32 está transmitiendo nuevamente.", "bot");
    }

    reiniciarTimeout();

    for (const sensor in configuracion) {
        actualizarTarjeta(sensor, Number(datos[configuracion[sensor].campo]));
    }
    actualizarTarjetaBomba(datos.bomba);

    programarActualizacionUI();

    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    if (!isOffline) {
        badge.className = "status-badge connected";
        text.textContent = "✅ Conectado";
    }

}, error => console.error("Firebase error (ValorActual):", error));

// =========================================================
// 18. FIREBASE - HISTORIAL
// =========================================================
onValue(historialRef, snapshot => {
    const data = snapshot.val();
    if (!data) { registrosHistorial = []; return; }

    registrosHistorial = Object.entries(data)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    _cacheAnalisis.clear();

    const contador = document.getElementById("contador-registros");
    const txt = String(registrosHistorial.length);
    if (contador && contador.textContent !== txt) contador.textContent = txt;

    actualizarTabla();
    actualizarGrafica();
    programarActualizacionUI();
}, error => console.error("Firebase error (Historial):", error));

// =========================================================
// 19. TABLA
// =========================================================
function actualizarTabla() {
    const tbody = document.getElementById("tabla-body");
    if (!registrosHistorial.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">📭 No hay datos históricos.</td></tr>`;
        return;
    }

    let html = "";
    registrosHistorial.slice().reverse().slice(0, 30).forEach(r => {
        const ph = Number(r.PH);
        const temp = Number(r.Temperatura_Ambiente);
        const tempAgua = Number(r.Temperatura_Agua);
        const hum = Number(r.Humedad_Ambiente);
        const luz = Number(r.luz);
        const bombaOn = r.bomba === true || r.bomba === "true";

        let fecha = "--";
        if (r.timestamp) fecha = new Date(r.timestamp).toLocaleTimeString();

        const estados = [
            obtenerEstado("ph", ph).estado,
            obtenerEstado("temp", temp).estado,
            obtenerEstado("temp-agua", tempAgua).estado,
            obtenerEstado("hum", hum).estado,
            obtenerEstado("luz", luz).estado
        ];

        let estadoTexto = "✅ Normal";
        let estadoClase = "td-ok";
        if (estados.includes("danger")) { estadoTexto = "❌ Revisar"; estadoClase = "td-danger"; }
        else if (estados.includes("warning")) { estadoTexto = "⚠️ Atención"; estadoClase = "td-warning"; }

        if (isOffline) { estadoTexto = "📡 Sin datos"; estadoClase = "td-danger"; }

        html += `
            <tr>
                <td style="color:#64748b; font-size:12px;">${fecha}</td>
                <td>${Number.isFinite(ph) ? ph.toFixed(2) : "--"}</td>
                <td>${Number.isFinite(temp) ? temp.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(tempAgua) ? tempAgua.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(hum) ? hum.toFixed(1)+"%" : "--"}</td>
                <td>${Number.isFinite(luz) ? luz.toFixed(0)+" lux" : "--"}</td>
                <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
                <td class="${estadoClase}">${estadoTexto}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// =========================================================
// 20. GRÁFICA (update en vez de destroy)
// =========================================================
function actualizarGrafica() {
    const ultimos = registrosHistorial.slice(-40);
    if (!ultimos.length) return;

    const labels = ultimos.map(r => r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "");
    const datasets = [
        { label: "pH", data: ultimos.map(r => Number(r.PH) || null), borderColor: "#a78bfa", backgroundColor: "rgba(167,139,250,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. ambiente °C", data: ultimos.map(r => Number(r.Temperatura_Ambiente) || null), borderColor: "#fb923c", backgroundColor: "rgba(251,146,60,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. agua °C", data: ultimos.map(r => Number(r.Temperatura_Agua) || null), borderColor: "#2dd4bf", backgroundColor: "rgba(45,212,191,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Humedad %", data: ultimos.map(r => Number(r.Humedad_Ambiente) || null), borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Luz lux", data: ultimos.map(r => Number(r.luz) || null), borderColor: "#facc15", backgroundColor: "rgba(250,204,21,.08)", tension: .3, pointRadius: 2, borderWidth: 2 }
    ];

    const canvas = document.getElementById("grafica");
    if (!canvas) return;

    const hash = ultimos.map(r => r.timestamp).join(',');
    if (chartInstance && chartHashGrafica === hash) return;

    const ctx = canvas.getContext("2d");

    if (chartInstance) {
        chartInstance.data.labels = labels;
        datasets.forEach((ds, i) => { chartInstance.data.datasets[i].data = ds.data; });
        chartInstance.update('none');
    } else {
        chartInstance = new Chart(ctx, {
            type: "line",
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: { legend: { labels: { color: "#94a3b8", boxWidth: 12, padding: 12, font: { size: 11 } } } },
                scales: {
                    y: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "#64748b", font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: "#64748b", maxTicksLimit: 8, autoSkip: true, font: { size: 9 } } }
                }
            }
        });
    }
    chartHashGrafica = hash;
}

// =========================================================
// 21. ESTADO GENERAL
// =========================================================
function actualizarEstadoGeneral() {
    const alerta = document.getElementById("alertaBox");
    if (!datosActuales || !registrosHistorial.length) return;

    const cultivo = getCultivoInfo();
    const totalRegistros = registrosHistorial.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    if (isOffline) {
        alerta.className = "alerta-box offline";
        alerta.innerHTML = `
            <i class="fas fa-microchip"></i>
            <span>
                <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                    El sistema sigue funcionando de forma autónoma.
                    <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                        🤖 MODO AUTÓNOMO ACTIVO
                    </span>
                </span>
                <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                    📊 ${totalRegistros} registros históricos | 🌱 ${etapaActual.nombre}
                </span>
            </span>
        `;
        actualizarPanelCrecimiento(previewEtapa);
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor)) continue;
        const estado = obtenerEstado(sensor, valor);
        if (estado.estado === "danger") problemas.push(configuracion[sensor].nombre);
        else if (estado.estado === "warning") advertencias.push(configuracion[sensor].nombre);
    }

    let nivel = "success";
    let icono = "✅";
    let mensaje = `${cultivo.nombre} en óptimas condiciones.`;

    if (problemas.length > 0) {
        nivel = "danger"; icono = "🚨";
        mensaje = `${problemas.length} problema(s) GRAVE: ${problemas.join(", ")}. ¡ACTÚA AHORA!`;
    } else if (advertencias.length > 0) {
        nivel = "loading"; icono = "⚠️";
        mensaje = `${advertencias.length} aviso(s): ${advertencias.join(", ")}. Presta atención.`;
    }

    alerta.className = `alerta-box ${nivel}`;
    alerta.innerHTML = `
        <i class="fas ${icono === '🚨' ? 'fa-triangle-exclamation' : icono === '⚠️' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
        <span>
            <strong>${icono} ${mensaje}</strong>
            📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})
            ${fechaInicio ? ` | 📅 ${new Date(fechaInicio).toLocaleDateString()}` : ''}
            ${previewEtapa !== null ? ' | 👁️ VISTA PREVIA' : ''}
            ${lastUpdateTime ? ` | ⏱️ ${lastUpdateTime.toLocaleTimeString()}` : ''}
        </span>
    `;

    actualizarPanelCrecimiento(previewEtapa);
    actualizarAsistente();
}

// =========================================================
// 22. ASISTENTE (con cache de HTML)
// =========================================================
function actualizarAsistente() {
    const container = document.getElementById("consejosContainer");
    const estadoGeneral = document.getElementById("estado-general");
    if (!datosActuales || !registrosHistorial.length) return;

    const cultivo = getCultivoInfo();
    const totalRegistros = registrosHistorial.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    if (isOffline) {
        estadoGeneral.innerHTML = `📡 SIN DATOS | ${totalRegistros} reg.`;
        estadoGeneral.style.color = "#ef4444";
        const hash = `offline_${totalRegistros}_${dias}_${etapaActual.nombre}`;
        if (container.dataset.hash !== hash) {
            container.dataset.hash = hash;
            container.innerHTML = `
                <div class="consejo consejo-offline">
                    <div class="consejo-icono"><i class="fas fa-microchip"></i></div>
                    <div class="consejo-contenido">
                        <h4>📡 ESP32 SIN TRANSMITIR DATOS</h4>
                        <p>El microcontrolador no está enviando datos a Firebase. El sistema aeropónico <strong>sigue funcionando de forma autónoma</strong>.</p>
                        <p style="margin-top: 8px; color: #fcd34d;"><strong>🤖 MODO AUTÓNOMO ACTIVO</strong> - No se requiere intervención.</p>
                        <ul>
                            <li>📊 ${totalRegistros} registros históricos disponibles</li>
                            <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                            <li>⏳ Esperando datos del ESP32...</li>
                        </ul>
                        <p style="margin-top: 8px; color: #fca5a5;">🔍 Verifica: conexión WiFi, alimentación y programa del ESP32.</p>
                    </div>
                </div>
            `;
        }
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor)) continue;
        const analisis = analizarSensorCached(sensor, valor);
        if (analisis.estado.estado === "danger") problemas.push({ sensor, analisis });
        else if (analisis.estado.estado === "warning" || analisis.anomalia) advertencias.push({ sensor, analisis });
    }

    if (problemas.length) {
        estadoGeneral.innerHTML = `🚨 ${problemas.length} problema(s) | 📊 ${totalRegistros}`;
        estadoGeneral.style.color = "#fca5a5";
    } else if (advertencias.length) {
        estadoGeneral.innerHTML = `⚠️ ${advertencias.length} aviso(s) | 📊 ${totalRegistros}`;
        estadoGeneral.style.color = "#fcd34d";
    } else {
        const pct = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        estadoGeneral.innerHTML = `✅ OK | 📊 ${totalRegistros} | 🌱 ${pct}%`;
        estadoGeneral.style.color = "#86efac";
    }

    const hashEstado =
        `${problemas.map(p => p.sensor).join(',')}|` +
        `${advertencias.map(a => a.sensor).join(',')}|` +
        `${cultivo.nombre}|${etapaActual.nombre}|${dias}|${totalRegistros}|${previewEtapa}`;

    if (container.dataset.hash === hashEstado) {
        iniciarChat();
        return;
    }
    container.dataset.hash = hashEstado;

    let html = `
        <div class="consejo consejo-info">
            <div class="consejo-icono"><i class="fas fa-leaf"></i></div>
            <div class="consejo-contenido">
                <h4>🌱 ${cultivo.nombre} - ${cultivo.tipo}</h4>
                <p>${cultivo.descripcion}</p>
                <p style="margin-top:6px;">📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})</p>
                ${fechaInicio ? `<p style="margin-top:4px; color:#94a3b8;">📅 Inicio: ${new Date(fechaInicio).toLocaleDateString()}</p>` : ''}
                ${previewEtapa !== null ? `<p style="margin-top:4px; color:#fcd34d;">👁️ Vista previa de: ${cultivo.etapas[previewEtapa].nombre}</p>` : ''}
                ${lastUpdateTime ? `<p style="margin-top:4px; color:#64748b;">⏱️ Última actualización: ${lastUpdateTime.toLocaleTimeString()}</p>` : ''}
            </div>
        </div>
    `;

    problemas.forEach(item => {
        const c = configuracion[item.sensor];
        const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
        html += `
            <div class="consejo consejo-danger">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>🚨 ${c.nombre} - ¡REQUIERE ACCIÓN INMEDIATA!</h4>
                    <p>${item.analisis.significado}</p>
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 SOLUCIONES PRÁCTICAS:</strong></p>
                        <ul>${sol.soluciones.map(s => `<li class="${s.includes('¡ACTÚA RÁPIDO!') || s.includes('¡URGENTE!') ? 'urgente' : ''}">${s}</li>`).join('')}</ul>
                    ` : ''}
                </div>
            </div>
        `;
    });

    advertencias.forEach(item => {
        const c = configuracion[item.sensor];
        const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
        html += `
            <div class="consejo consejo-warning">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>⚠️ ${c.nombre}</h4>
                    <p>${item.analisis.tendencia.texto}</p>
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 Soluciones:</strong></p>
                        <ul>${sol.soluciones.slice(0, 4).map(s => `<li>${s}</li>`).join('')}</ul>
                    ` : ''}
                </div>
            </div>
        `;
    });

    if (!problemas.length && !advertencias.length) {
        html += `
            <div class="consejo consejo-ok">
                <div class="consejo-icono"><i class="fas fa-circle-check"></i></div>
                <div class="consejo-contenido">
                    <h4>✅ Todo en orden</h4>
                    <p>${cultivo.nombre} está en condiciones óptimas para la etapa ${etapaActual.nombre}.</p>
                    <ul>
                        <li>📊 ${totalRegistros} registros históricos analizados</li>
                        <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                        <li>💡 Sigue así para una cosecha exitosa</li>
                    </ul>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    iniciarChat();
}

// =========================================================
// 23. CHAT
// =========================================================
const preguntasChip = [
    { id: "ph", texto: "🔬 pH", icono: "fa-flask" },
    { id: "temp", texto: "🌡️ Temp. ambiente", icono: "fa-temperature-half" },
    { id: "temp-agua", texto: "🌊 Temp. agua", icono: "fa-temperature-three-quarters" },
    { id: "hum", texto: "💧 Humedad", icono: "fa-droplet" },
    { id: "luz", texto: "💡 Luz", icono: "fa-sun" },
    { id: "bomba", texto: "🔌 Bomba", icono: "fa-power-off" },
    { id: "resumen", texto: "📊 Resumen general", icono: "fa-clipboard-list" },
    { id: "cosecha", texto: "🌱 ¿Cuándo cosechar?", icono: "fa-calendar-check" },
    { id: "soluciones", texto: "🔧 Todas las soluciones", icono: "fa-tools" },
    { id: "etapa", texto: "🌿 Etapa actual", icono: "fa-seedling" }
];

function iniciarChat() {
    if (chatIniciado) return;
    chatIniciado = true;

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    let mensaje = `🌱 ¡Hola! Soy tu asistente de ${cultivo.nombre}.\n\n📅 Día ${dias} - Etapa: ${etapaActual.nombre}\n${etapaActual.descripcion}\n\n💡 Elige una pregunta o toca un sensor para ver análisis con soluciones adaptadas a tu etapa.\n📌 Puedes cambiar de etapa usando los botones arriba (vista previa antes de aplicar).\n\n⚠️ Recuerda: Los botones de etapa NO afectan el selector de cultivo.`;

    if (isOffline) {
        mensaje += `\n\n📡 <strong>ESP32 SIN TRANSMITIR DATOS</strong>\n🤖 El sistema sigue funcionando de forma autónoma.\n⏳ Última actualización: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}`;
    }

    agregarMensaje(mensaje, "bot");
    renderizarChips();
}

function renderizarChips() {
    const cont = document.getElementById("chatChips");
    if (!cont) return;

    let hayUrgencia = false;
    if (datosActuales && registrosHistorial.length > 0 && !isOffline) {
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            if (Number.isFinite(valor)) {
                if (obtenerEstado(sensor, valor).estado === "danger") { hayUrgencia = true; break; }
            }
        }
    }

    const hash = `${isOffline}_${hayUrgencia}`;
    if (cont.dataset.hash === hash) return;
    cont.dataset.hash = hash;

    let html = preguntasChip.map(p => `
        <button class="chip ${isOffline ? 'chip-offline' : ''} ${hayUrgencia && (p.id === 'soluciones' || p.id === 'resumen') ? 'chip-urgente' : ''}" onclick="preguntar('${p.id}')" ${isOffline ? 'disabled' : ''}>
            <i class="fas ${p.icono}"></i> ${p.texto}
        </button>
    `).join("");

    html += `<button class="chip chip-reset" onclick="preguntar('reiniciar')"><i class="fas fa-rotate"></i> Reiniciar</button>`;
    cont.innerHTML = html;
}

function agregarMensaje(texto, tipo) {
    const cont = document.getElementById("chatMensajes");
    if (!cont) return;
    const burbuja = document.createElement("div");
    burbuja.className = `chat-bubble ${tipo}`;
    burbuja.innerHTML = texto;
    cont.appendChild(burbuja);
    cont.scrollTop = cont.scrollHeight;
}

function generarSolucionesCompletas() {
    const cultivo = getCultivoInfo();
    let mensaje = `🔧 <strong>SOLUCIONES PRÁCTICAS para ${cultivo.nombre}</strong>\n\n`;
    if (isOffline) mensaje += `📡 <strong>ESP32 SIN DATOS</strong> - Mostrando últimos valores conocidos.\n\n`;

    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor)) continue;
        const analisis = analizarSensorCached(sensor, valor);
        const c = configuracion[sensor];
        const sol = analisis.soluciones || { soluciones: [], explicacion: "" };
        mensaje += `<strong>${c.nombre}:</strong> `;
        mensaje += (sensor === 'luz') ? `${analisis.estado.texto}\n` : `${formato(valor, sensor)} (${analisis.estado.texto})\n`;
        if (sol.explicacion) mensaje += `${sol.explicacion}\n`;
        if (sol.soluciones && sol.soluciones.length > 0) mensaje += `🔹 ${sol.soluciones.join('\n🔹 ')}\n`;
        mensaje += `\n`;
    }
    return mensaje;
}

window.preguntar = function(id) {
    if (id === "reiniciar") {
        document.getElementById("chatMensajes").innerHTML = "";
        chatIniciado = false;
        iniciarChat();
        return;
    }
    if (!datosActuales || !registrosHistorial.length) {
        const p = preguntasChip.find(x => x.id === id);
        if (p) agregarMensaje(p.texto, "user");
        agregarMensaje("⏳ Esperando datos... inténtalo en unos segundos.", "bot");
        return;
    }

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    if (isOffline) {
        if (id === "resumen") {
            agregarMensaje("📊 Dame un resumen general", "user");
            let mensaje = `📊 <strong>RESUMEN de ${cultivo.nombre} (MODO AUTÓNOMO)</strong>\n\n📡 <strong>ESP32 SIN TRANSMITIR DATOS</strong>\n📈 ${registrosHistorial.length} registros históricos\n🌱 ${etapaActual.nombre} (Día ${dias})\n\n🤖 El sistema sigue funcionando de forma autónoma.\n\n📊 <strong>Últimos valores:</strong>\n`;
            for (const sensor in configuracion) {
                const valor = Number(datosActuales[configuracion[sensor].campo]);
                if (!Number.isFinite(valor)) continue;
                const a = analizarSensorCached(sensor, valor);
                mensaje += (sensor === 'luz') ? `${configuracion[sensor].nombre}: ${a.estado.texto}\n` : `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${a.estado.texto})\n`;
            }
            mensaje += `\n⏱️ Última actualización: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}`;
            agregarMensaje(mensaje, "bot");
            return;
        }
        if (id === "cosecha") {
            agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
            const pct = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
            let m = `🌱 <strong>Análisis de COSECHA para ${cultivo.nombre}</strong>\n\n📅 ${dias} días\n📈 ${pct}% del ciclo\n🌿 Etapa actual: ${etapaActual.nombre}\n\n📡 Modo autónomo activo.\n`;
            m += pct >= 100 ? `✅ ¡LISTO PARA COSECHAR!` : pct > 80 ? `🔜 Casi listo para cosechar.` : `🌱 Sigue cuidando las plantas.`;
            agregarMensaje(m, "bot");
            return;
        }
        if (id === "soluciones") {
            agregarMensaje("🔧 Dame todas las soluciones", "user");
            agregarMensaje(`🔧 <strong>SOLUCIONES (MODO AUTÓNOMO)</strong>\n\n📡 ESP32 sin datos en tiempo real.\n\n` + generarSolucionesCompletas(), "bot");
            return;
        }
        const c = configuracion[id];
        if (c) {
            const p = preguntasChip.find(x => x.id === id);
            if (p) agregarMensaje(p.texto, "user");
            const valor = Number(datosActuales[c.campo]);
            if (!Number.isFinite(valor)) { agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot"); return; }
            const a = analizarSensorCached(id, valor);
            let m = `📡 <strong>MODO AUTÓNOMO</strong>\n\n<strong>${c.nombre}:</strong> `;
            m += (id === 'luz') ? `${a.estado.texto}\n\n` : `${formato(valor, id)} (${a.estado.texto})\n\n`;
            m += `📡 ESP32 no está transmitiendo datos nuevos.\n🤖 El sistema sigue funcionando de forma autónoma.`;
            agregarMensaje(m, "bot");
            return;
        }
        if (id === "bomba") {
            agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
            const on = datosActuales.bomba === true || datosActuales.bomba === "true";
            agregarMensaje(`📡 <strong>MODO AUTÓNOMO</strong>\n\n` + (on ? "✅ Bomba ENCENDIDA (último estado)." : "⏸️ Bomba APAGADA (último estado).") + "\n\n🤖 El sistema sigue su ciclo programado.", "bot");
            return;
        }
        if (id === "etapa") {
            agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
            let m = `🌿 <strong>Etapa actual de ${cultivo.nombre}</strong>\n\n📅 Día ${dias}\n🌱 ${etapaActual.nombre}\n${etapaActual.descripcion}\n\n📡 Modo autónomo activo.\n\n📋 <strong>Todas las etapas:</strong>\n`;
            cultivo.etapas.forEach(e => { m += `${e.nombre === etapaActual.nombre ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`; });
            agregarMensaje(m, "bot");
            return;
        }
        agregarMensaje("📡 El sistema está en MODO AUTÓNOMO. No hay conexión en tiempo real.", "bot");
        return;
    }

    if (id === "resumen") {
        agregarMensaje("📊 Dame un resumen general", "user");
        const pct = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        let m = `📊 <strong>RESUMEN de ${cultivo.nombre}</strong>\n\n📈 ${registrosHistorial.length} registros\n🌱 ${etapaActual.nombre} (Día ${dias})\n📈 ${pct}% completado\n\n`;
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            if (!Number.isFinite(valor)) continue;
            const a = analizarSensorCached(sensor, valor);
            m += (sensor === 'luz') ? `${configuracion[sensor].nombre}: ${a.estado.texto}\n` : `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${a.estado.texto})\n`;
        }
        m += `\n💡 Los rangos se ajustan automáticamente según tu etapa.`;
        agregarMensaje(m, "bot");
        return;
    }
    if (id === "cosecha") {
        agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
        const pct = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        let m = `🌱 <strong>Análisis de COSECHA para ${cultivo.nombre}</strong>\n\n📅 ${dias} días\n📈 ${pct}% completado\n🌿 Etapa: ${etapaActual.nombre}\n\n`;
        m += pct >= 100 ? `✅ ¡LISTO PARA COSECHAR!` : pct > 80 ? `🔜 Casi listo.` : `🌱 Sigue cuidando las plantas.`;
        agregarMensaje(m, "bot");
        return;
    }
    if (id === "etapa") {
        agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
        let m = `🌿 <strong>Etapa actual de ${cultivo.nombre}</strong>\n\n📅 Día ${dias}\n🌱 ${etapaActual.nombre}\n${etapaActual.descripcion}\n\n📋 <strong>Todas las etapas:</strong>\n`;
        cultivo.etapas.forEach(e => { m += `${e.nombre === etapaActual.nombre ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`; });
        m += `\n💡 Puedes cambiar de etapa desde el panel de progreso.`;
        agregarMensaje(m, "bot");
        return;
    }
    if (id === "soluciones") {
        agregarMensaje("🔧 Dame todas las soluciones", "user");
        agregarMensaje(generarSolucionesCompletas(), "bot");
        return;
    }
    if (id === "bomba") {
        agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
        const on = datosActuales.bomba === true || datosActuales.bomba === "true";
        const modo = bombaModo ? textoModoBomba(bombaModo) : "";
        const seg = bombaSegundos !== null ? formatearSegundos(bombaSegundos) : "--:--";
        let m = on ? "✅ Bomba ENCENDIDA. El sistema está pulverizando solución nutritiva." : "⏸️ Bomba APAGADA. Esperando el próximo ciclo.";
        if (modo) m += `\n\n🔧 Modo actual: ${modo}`;
        if (bombaSegundos !== null) m += `\n⏱️ Próximo cambio en: ${seg}`;
        agregarMensaje(m, "bot");
        return;
    }

    const c = configuracion[id];
    if (!c) { agregarMensaje("❓ No entendí la pregunta.", "bot"); return; }
    const p = preguntasChip.find(x => x.id === id);
    const valor = Number(datosActuales[c.campo]);
    if (p) agregarMensaje(p.texto, "user");
    if (!Number.isFinite(valor)) { agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot"); return; }

    const a = analizarSensorCached(id, valor);
    const sol = a.soluciones || { soluciones: [], explicacion: "" };
    let m = `<strong>${c.nombre}:</strong> `;
    m += (id === 'luz') ? `${a.estado.texto}\n\n` : `${formato(valor, id)} (${a.estado.texto})\n\n`;
    m += a.significado + "\n\n";
    if (sol.soluciones && sol.soluciones.length > 0) {
        m += `🔧 <strong>SOLUCIONES PRÁCTICAS:</strong>\n` + sol.soluciones.map(s => `• ${s}`).join('\n');
    } else {
        m += `✅ Todo en orden. Sigue así.`;
    }
    agregarMensaje(m, "bot");
};

// =========================================================
// 24. SELECTOR DE CULTIVO
// =========================================================
document.getElementById('selectorCultivo').addEventListener('change', function() {
    cultivoSeleccionado = this.value;
    document.getElementById("chatMensajes").innerHTML = "";
    chatIniciado = false;
    previewEtapa = null;
    cancelarPreview();
    _cacheAnalisis.clear();

    // Invalidar caches
    document.getElementById('consejosContainer').dataset.hash = "";
    document.getElementById('chatChips').dataset.hash = "";
    document.getElementById('selectorEtapas').dataset.hash = "";
    document.getElementById('miniEtapas').dataset.hash = "";

    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
        actualizarTarjetaBomba(datosActuales.bomba);
        actualizarEstadoGeneral();
        if (sensorAbierto) actualizarDetalle(sensorAbierto);
    }
    iniciarChat();
});

// =========================================================
// 25. FECHA DE SIEMBRA
// =========================================================
const fechaPanel = document.getElementById('fechaSiembraPanel');
const fechaGuardada = localStorage.getItem('fechaSiembra');

if (fechaGuardada) {
    fechaPanel.value = fechaGuardada;
    fechaInicio = fechaGuardada;
} else {
    const hoy = new Date().toISOString().split('T')[0];
    fechaPanel.value = hoy;
    fechaInicio = hoy;
    localStorage.setItem('fechaSiembra', hoy);
}

fechaPanel.addEventListener('change', function() {
    if (isOffline) return;
    fechaInicio = this.value;
    localStorage.setItem('fechaSiembra', this.value);
    previewEtapa = null;
    cancelarPreview();
    _cacheAnalisis.clear();
    actualizarEstadoGeneral();
    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
    }
    if (chatIniciado) agregarMensaje(`📅 Fecha de inicio actualizada: ${new Date(fechaInicio).toLocaleDateString()}`, "bot");
});

document.getElementById('btnHoy').addEventListener('click', function() {
    if (isOffline) return;
    const hoy = new Date().toISOString().split('T')[0];
    fechaPanel.value = hoy;
    fechaInicio = hoy;
    localStorage.setItem('fechaSiembra', hoy);
    previewEtapa = null;
    cancelarPreview();
    _cacheAnalisis.clear();
    actualizarEstadoGeneral();
    if (datosActuales) for (const s in configuracion) actualizarTarjeta(s, Number(datosActuales[configuracion[s].campo]));
    if (chatIniciado) agregarMensaje(`📅 Inicio cambiado a HOY`, "bot");
});

document.getElementById('btnSemana').addEventListener('click', function() {
    if (isOffline) return;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 7);
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    previewEtapa = null;
    cancelarPreview();
    _cacheAnalisis.clear();
    actualizarEstadoGeneral();
    if (datosActuales) for (const s in configuracion) actualizarTarjeta(s, Number(datosActuales[configuracion[s].campo]));
    if (chatIniciado) agregarMensaje(`📅 Inicio cambiado a -7 días`, "bot");
});

// =========================================================
// 26. BOTONES DE ACCIÓN
// =========================================================
document.getElementById('btnAplicar').addEventListener('click', aplicarPreview);
document.getElementById('btnCancelar').addEventListener('click', cancelarPreview);
document.getElementById('btnDia0').addEventListener('click', dia0);

// =========================================================
// 27. SECCIONES CONTRAÍBLES
// =========================================================
window.toggleSeccion = function(id) {
    const contenido = document.getElementById(id);
    const flecha = document.getElementById(`flecha-${id}`);
    if (!contenido) return;
    const oculto = contenido.classList.toggle("oculto");
    if (flecha) flecha.style.transform = oculto ? "rotate(-90deg)" : "rotate(0deg)";
};

// =========================================================
// 28. MODAL INFO CULTIVO
// =========================================================
const btnInfoCultivo = document.getElementById('btnInfoCultivo');
const modalOverlay = document.getElementById('modalCultivoOverlay');
const modalCerrar = document.getElementById('modalCultivoCerrar');
const modalIcono = document.getElementById('modalCultivoIcono');
const modalTitulo = document.getElementById('modalCultivoTitulo');
const modalBody = document.getElementById('modalCultivoBody');

btnInfoCultivo.addEventListener('click', (e) => {
    e.stopPropagation();
    const clave = document.getElementById('selectorCultivo').value;
    mostrarInfoCultivo(clave);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function cerrarModalCultivo() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalCerrar.addEventListener('click', cerrarModalCultivo);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) cerrarModalCultivo(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModalCultivo(); });

function mostrarInfoCultivo(clave) {
    const data = DATOS_CULTIVOS[clave];
    if (!data) return;
    modalIcono.textContent = data.icono;
    modalTitulo.textContent = data.nombre;
    const consejosHtml = data.consejos.map(c => `<li>${c}</li>`).join('');

    modalBody.innerHTML = `
        <div class="modal-seccion">
            <h4><i class="fas fa-align-left"></i> Descripción</h4>
            <p>${data.descripcion}</p>
        </div>
        <div class="modal-seccion">
            <h4><i class="fas fa-table-cells-large"></i> Datos técnicos</h4>
            <div class="modal-grid-iconos">
                <div class="modal-item-icono"><span class="icono-grande">⏳</span><span class="etiqueta">Cosecha</span><span class="valor">${data.tiempo_cosecha}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">🧪</span><span class="etiqueta">pH ideal</span><span class="valor">${data.ph_ideal}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">🌡️</span><span class="etiqueta">Temp. ideal</span><span class="valor">${data.temp_ideal}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">💧</span><span class="etiqueta">Humedad</span><span class="valor">${data.humedad_ideal}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">☀️</span><span class="etiqueta">Luz</span><span class="valor">${data.luz_ideal}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">📊</span><span class="etiqueta">Dificultad</span><span class="valor">${data.dificultad}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">📦</span><span class="etiqueta">Rendimiento</span><span class="valor">${data.rendimiento}</span></div>
                <div class="modal-item-icono"><span class="icono-grande">🌱</span><span class="etiqueta">Tipo</span><span class="valor">${data.tipo}</span></div>
            </div>
        </div>
        <div class="modal-seccion">
            <h4><i class="fas fa-lightbulb"></i> Consejos prácticos</h4>
            <ul>${consejosHtml}</ul>
        </div>
        <div class="modal-seccion">
            <div class="curiosidad-box">
                <h4><i class="fas fa-star" style="color:#f59e0b;"></i> ¿Sabías que...?</h4>
                <p>${data.curiosidad}</p>
            </div>
        </div>
    `;
}

// =========================================================
// 29. INICIALIZACIÓN
// =========================================================
reiniciarTimeout();

setTimeout(() => {
    actualizarPanelCrecimiento(null);
}, 100);

console.log("🚀 Aeroponia UTS - Versión fluida (sin guía duplicada)");
console.log(`🌱 Cultivo: ${getCultivoInfo().nombre}`);
console.log(`📅 Día ${obtenerDiasTranscurridos()}`);