const key = '2c17c75b333c9a9c2e09d798a52ca1c1';

function dataOnScreen(data) {
  // Colocar os dados do servidor na tela.
  // Selecionar os texto que serão alterados
  console.log(data);
  document.querySelector('.city-name').innerHTML = "Tempo em " + data.name;
  document.querySelector('.temp').innerHTML = Math.floor(data.main.temp) + "ºC";
  document.querySelector('.weather-text').innerHTML = data.weather[0].description;
  document.querySelector('.weather-quality').innerHTML = "Umidade: " + data.main.humidity + "%"
  document.querySelector('.weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

async function citySearch(city) {
  // Buscar a cidade no servidor
  const data = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`).then(resposta => resposta.json());  

  dataOnScreen(data);
}

function clickButton() {
  const inputCity = document.querySelector(".input-city").value;

  citySearch(inputCity);  
}


// Função para exibir as sugestões
function displaySuggestions(cities) {
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = ""; // Limpa as sugestões anteriores

  // Adiciona as sugestões no dropdown
  cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;
    li.addEventListener("click", () => {
      document.querySelector(".input-city").value = city.name;
      suggestions.innerHTML = ""; // Esconde as sugestões após seleção
    });
    suggestions.appendChild(li);
  });

  // Mostra ou oculta o dropdown
  suggestions.style.display = cities.length ? "block" : "none";
}

// Função para buscar as cidades
async function fetchSuggestions(query) {
  try {
    // Busca as cidades no Brasil
    const urlBrazil = `https://api.openweathermap.org/geo/1.0/direct?q=${query},BR&limit=10&appid=${key}`;
    const responseBrazil = await fetch(urlBrazil);
    const dataBrazil = await responseBrazil.json();

    // Filtra duplicatas manualmente
    const uniqueBrazilCities = dataBrazil.reduce((acc, city) => {
      if (!acc.find(c => c.name === city.name)) {
        acc.push(city);
      }
      return acc;
    }, []);

    // Busca as cidades globais (caso não encontre o suficiente no Brasil)
    const urlGlobal = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${key}`;
    const responseGlobal = await fetch(urlGlobal);
    const dataGlobal = await responseGlobal.json();

    // Combina os resultados brasileiros e globais
    const combinedData = [
      ...uniqueBrazilCities, 
      ...dataGlobal.filter(city => !uniqueBrazilCities.find(brazilCity => brazilCity.name === city.name)).slice(0, 5 - uniqueBrazilCities.length)
    ];

    // Atualiza as sugestões
    displaySuggestions(combinedData);
    
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
}

// Adiciona um event listener para o campo de entrada
let debounceTimeout;
document.querySelector(".input-city").addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  const query = this.value;

  debounceTimeout = setTimeout(() => {
    if (query.length >= 2) { // Apenas busca quando o usuário digitar 2 ou mais caracteres
      fetchSuggestions(query);
    }
  }, 300); // Aguarda 300ms após o último caractere digitado
});


