const populationEl = document.getElementById("population");
const infectedEl = document.getElementById("infected");
const deadEl = document.getElementById("dead");
const cureEl = document.getElementById("cure");
const dnaEl = document.getElementById("dna");
const newsEl = document.getElementById("news");

const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endText = document.getElementById("endText");

const countries = document.querySelectorAll(".country");

let population = 8000000000;
let infected = 10;
let dead = 0;
let cure = 0;
let dna = 0;

let spread = 1;
let lethality = 0;
let resistance = 0;
let mutation = 0;

let gameEnded = false;

function updateUI(){
populationEl.textContent = population.toLocaleString();
infectedEl.textContent = infected.toLocaleString();
deadEl.textContent = dead.toLocaleString();
cureEl.textContent = Math.floor(cure);
dnaEl.textContent = dna;
}

function randomNews(){

const news = [
"📰 Gobiernos investigan nueva enfermedad",
"📰 Aeropuertos empiezan controles",
"📰 Científicos preocupados",
"📰 Se detectan nuevos síntomas",
"📰 La OMS declara emergencia",
"📰 Hospitales saturados",
"📰 Disturbios por cuarentenas",
"📰 La cura avanza rápidamente",
"📰 Se cierran fronteras"
];

newsEl.textContent =
news[Math.floor(Math.random()*news.length)];

}

function infectLoop(){

if(gameEnded) return;

let newInfected =
Math.floor(infected * (0.01 + spread*0.003));

infected += newInfected;

let newDead =
Math.floor(infected * lethality * 0.0005);

dead += newDead;

infected -= newDead;

if(infected > population - dead){
infected = population - dead;
}

dna += Math.floor(Math.random()*3);

if(infected > 5000000){
cure += 0.15 - resistance*0.02;
}

if(cure < 0) cure = 0;

countries.forEach(country=>{

if(Math.random() < infected/population){
country.classList.add("infected");
}

if(Math.random() < dead/population){
country.classList.add("dead");
}

});

if(dead >= population*0.95){
endGame(true);
}

if(cure >= 100){
endGame(false);
}

updateUI();

}

function buyUpgrade(type){

if(type==="air" && dna>=10){
dna-=10;
spread+=1;
newsEl.textContent =
"✈ El virus ahora viaja por el aire";
}

if(type==="water" && dna>=15){
dna-=15;
spread+=1.5;
newsEl.textContent =
"💧 El agua está contaminada";
}

if(type==="symptom" && dna>=20){
dna-=20;
lethality+=1;
newsEl.textContent =
"🤒 Aparecen síntomas graves";
}

if(type==="resist" && dna>=25){
dna-=25;
resistance+=1;
newsEl.textContent =
"🧬 El virus resiste mejor la cura";
}

if(type==="mutation" && dna>=35){
dna-=35;
spread+=2;
lethality+=1;
mutation+=1;
newsEl.textContent =
"☣ El virus ha mutado";
}

updateUI();

}

function endGame(win){

gameEnded = true;

endScreen.classList.remove("hidden");

if(win){

endTitle.textContent = "☠ HUMANIDAD DESTRUIDA";
endText.textContent =
"Tu plaga acabó con el mundo.";

}else{

endTitle.textContent = "💉 CURA COMPLETADA";
endText.textContent =
"La humanidad sobrevivió.";

}

}

setInterval(infectLoop,1000);
setInterval(randomNews,7000);

updateUI();
