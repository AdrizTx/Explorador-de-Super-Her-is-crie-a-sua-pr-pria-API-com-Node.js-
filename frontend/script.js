//###########################################
//FRONT-END -- consome nossa API local
//###########################################

// Este arquivo roda no navegador.
// Ele faz requisições para nossa API node.js
// e mostra os dados na tela 

//###########################################
//ELEMENTOS DO HTML
//###########################################
//foto do cachorro
const TimeImage = document.getElementById("TimeImage");
//nome raça
const breedName = document.getElementById("breedName");
//cachorro aleatório
const randomBtn = document.getElementById("randomBtn");
//botão que busca cachorro por raça
const searchBtn = document.getElementById("searchBtn");
//campo de texto onde o usuario digita a raça
const breedInput = document.getElementById("breedInput");
//area onde fica a imagem do cachorro
//usamos querySelector porque é uma classe(.dog-area)
const TimeArea = document.querySelector(".time-area");

//==============================
// URL DA API
//==============================

const API = "http://localhost:3000/api/times";

//==============================
// FUNÇÃO PRINCIPAL
//==============================

async function buscarTime(url) {
  TimeArea.classList.add("loading");

  try {
    const response = await fetch(url);

    // Trata especificamente quando o time não é encontrado (404)
    if (response.status === 404) {
      breedName.textContent = "⚠️ Time não encontrado";
      TimeImage.src = "";
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro ${response.status} ao buscar ${url}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    if (data.status === "error" || !data.message) {
      breedName.textContent = data.message || "Imagem não encontrada";
      TimeImage.src = "";
      return;
    }

    TimeImage.src = data.message;

    // Exemplo de URL: http://localhost:3000/fotos/flamengo/1.jpg
    const partes = data.message.split("/");
    const TIMES = partes[4] || ""; // Proteção caso a posição 4 não exista

    if (TIMES) {
      breedName.textContent = TIMES.charAt(0).toUpperCase() + TIMES.slice(1);
    }

  } catch (erro) {
    // Cai aqui quando o servidor realmente estiver desligado ou houver erro de rede
    console.error(erro);
    
    breedName.textContent = "📴 Servidor offline - rode: node server.js";
    TimeImage.src = "";
  } finally {
    TimeArea.classList.remove("loading");
  }
}

// ==============================
// AÇÕES
// ==============================

//função que busca o cachorro aleatório
function TimeAleatorio(){
  //chamar a função principal
  //passando a rota /aleatorio da API
  buscarTime(`${API}/aleatorio`);
}

//função que busca cachorro por raça
function buscarPorTIMES(){
  //pegar o texto digitado input
  //Trim ele remove os espaços em branco {trim()} do inicio e do fim do texto.
  const TIMES = breedInput.value.trim().toLowerCase();

  //verificar se o usuário digitou algo
  if (!TIMES) {
    // se não digitou, mostra alerta
    alert ("Digite uma Time!")
    // interrompe a função
    return;
  }

  //chamar a API passando a raca na URL
  //exemplo: /api/cachorros/husky
  buscarTime(`${API}/${TIMES}`)
}

// ====================================
// EVENTOS
// ====================================

// quando clicar no botão "aleatório"
randomBtn.addEventListener("click", TimeAleatorio);

// quando clicar no botão "buscar"
searchBtn.addEventListener("click", buscarPorTIMES);

//quando clicar na imagem do cachorro
//carrega outro cachorro aleatório
TimeImage.addEventListener("click", TimeAleatorio);

//quando o usuário apertar o ENTER no input
breedInput.addEventListener("keypress", (event) =>{
  //verifica se a tecla pressionada foi enter
  if (event.key === "Enter"){
    //executa a busca por raça
    buscarPorTIMES();
  }
})

//CARREGA AO ABRIR A PÁGINA

TimeAleatorio();
