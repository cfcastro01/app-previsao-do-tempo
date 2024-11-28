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