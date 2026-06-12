import { db } from "./firebase-config.js";

import {
  ref,
  set,
  get,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// =====================
// VARIABLES
// =====================

let currentPlayer = "";
let isAdmin = false;
let score = 0;

const ADMIN_PASSWORD = "eugenia";

let exercises = [];

// =====================
// ELEMENTOS
// =====================

const loginSection = document.getElementById("loginSection");
const gameSection = document.getElementById("gameSection");
const resultSection = document.getElementById("resultSection");

const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");

const welcomePlayer = document.getElementById("welcomePlayer");

const adminBtn = document.getElementById("adminBtn");
const adminSection = document.getElementById("adminSection");

const passwordModal = document.getElementById("passwordModal");
const loginAdminBtn = document.getElementById("loginAdminBtn");
const adminPassword = document.getElementById("adminPassword");

const rankingContainer = document.getElementById("rankingContainer");

// =====================
// LOGIN JUGADOR
// =====================

startBtn.addEventListener("click", () => {

    const name = playerNameInput.value.trim();

    if(name.length < 2){
        alert("Ingresá tu nombre.");
        return;
    }

    currentPlayer = name;

    loginSection.classList.add("hidden");
    gameSection.classList.remove("hidden");

    welcomePlayer.textContent =
        "Jugador: " + currentPlayer;

    loadExercises();

});

// =====================
// ADMIN
// =====================

adminBtn.addEventListener("click", () => {

    passwordModal.classList.remove("hidden");

});

loginAdminBtn.addEventListener("click", () => {

    const pass = adminPassword.value.trim();

    if(pass !== ADMIN_PASSWORD){
        alert("Contraseña incorrecta");
        return;
    }

    isAdmin = true;

    passwordModal.classList.add("hidden");

    adminSection.classList.remove("hidden");

    loadAdminPanel();

});

// =====================
// RANKING ONLINE
// =====================

function loadRanking(){

    const rankingRef = ref(db,"ranking");

    onValue(rankingRef,(snapshot)=>{

        const data = snapshot.val();

        if(!data){

            rankingContainer.innerHTML =
                "<p>No hay jugadores todavía.</p>";

            return;
        }

        const arr = Object.values(data);

        arr.sort((a,b)=>b.score-a.score);

        rankingContainer.innerHTML = "";

        arr.slice(0,20).forEach((player,index)=>{

            const div = document.createElement("div");

            div.className = "rankItem";

            div.innerHTML = `
                <span>
                    ${index+1}. ${player.name}
                </span>

                <strong>
                    ${player.score} pts
                </strong>
            `;

            rankingContainer.appendChild(div);

        });

    });

}

// =====================
// GUARDAR PUNTAJE
// =====================

async function saveScore(points){

    const rankingRef = ref(db,"ranking");

    const newPlayer = push(rankingRef);

    await set(newPlayer,{
        name: currentPlayer,
        score: points,
        date: Date.now()
    });

}

// =====================
// CARGAR EJERCICIOS
// =====================

async function loadExercises(){

    const exerciseRef = ref(db,"exercises");

    const snapshot = await get(exerciseRef);

    if(snapshot.exists()){

        exercises = Object.values(snapshot.val());

    }else{

        exercises = [];

    }

    renderExercises();

}

// =====================
// PANEL ADMIN
// =====================

async function loadAdminPanel(){

    const editor =
        document.getElementById("exerciseEditor");

    editor.innerHTML = "";

    exercises.forEach((exercise,index)=>{

        const block =
        document.createElement("div");

        block.className = "exerciseCard";

        block.innerHTML = `
            <h3>Ejercicio ${index+1}</h3>

            <textarea
                class="adminStatement"
                data-index="${index}"
            >${exercise.statement}</textarea>

            <input
                class="adminAnswer"
                type="number"
                data-index="${index}"
                value="${exercise.answer}"
            >

            <label>
                <input
                    type="checkbox"
                    class="adminImage"
                    data-index="${index}"
                    ${exercise.image ? "checked" : ""}
                >
                Mostrar imagen
            </label>
        `;

        editor.appendChild(block);

    });

}

// =====================
// INICIALIZACIÓN
// =====================

loadRanking();
