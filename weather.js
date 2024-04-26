const container = document.querySelector('.container');
const search = document.querySelector('.searchBox button');
const weatherBox =document.querySelector('.weatherBox');
const weatherDetails =document.querySelector('.weatherDetails');
const errorNotFound =document.querySelector('.notFound');
const locationBtn =document.querySelector(".locationBtn");

const ApiKey = "0d713f737ea0ef1b9565e1d2231f52b8";

// addEventListener location
window.addEventListener(('load'),()=>
{
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition
        (
            function(position) {
                let  lat = position.coords.latitude;
                let  lon = position.coords.longitude;
                console.log(`Latitude : ${lat} , Longitude: ${lon}`);
                getWeatherByLocation(lat,lon);
                
             
            },
            function(error) {
                console.error('Error getting user location:', error);
                alert('Failed to get user location. Please try again.');
            }
        );
    }else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
    }
        
}
);



// function search by city
function  getWeatherBySearch(cityName) {
  
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${ApiKey}`)
    .then(response => response.json())
    .then(json =>{
        if (json.cod === '404'){
            container.style.height ='400px';
            weatherBox.style.display ='none';
            weatherDetails.style.display ='none';
            errorNotFound.style.display ="block";
            errorNotFound.classList.add('fadeIn');
            return;
        }
        console.log(cityName);
        displayWeatherCity(json);
        displayForCast(cityName);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('City not found. Please try again.');
    });

}



let metric = "units=metric";
function displayForCast(cityName){

const forcastUrl =`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${ApiKey}&${metric}`;

fetch(forcastUrl)
.then(response => response.json())
.then(data =>{
    document.getElementById("dayFive").innerHTML = "";
 
   console.log(data);
   const forecastByDate=[];
   const fiveForecastDay=data.list.filter(responseLigne=>{
       const date = new Date(responseLigne.dt_txt).getDate()
       if(!forecastByDate.includes(date)){
         return  forecastByDate.push(date)
       }
   })
   // filtrer les dates
   const forecastsDays = fiveForecastDay.map(el => {
       const date = new Date(el.dt_txt).toLocaleString('fr-FR',{weekday:'long'});
       return date;
   });
   // console.log(forecastsDays)
   forecastsDays.forEach(el => {
       console.log("Date:", el.date);
   })
   //filtrer par température
   const forecastsTemp = fiveForecastDay.map(el => {
       const temperature = el.main.temp;
       return temperature;
   })
   forecastsTemp.forEach(el => {
       console.log("Température:", el.temperature);
   })

 // Récupérer l'élément canvas

const ctx = document.getElementById('myChart');

// Vérifier si l'élément canvas existe
if (ctx) {
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Créer un nouveau graphique
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastsDays,
            datasets: [{
                label: 'Température',
                data: forecastsTemp,
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'black dark'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    //day4

   
        var i;
        for(i=1;i<5;i++){
            const forecastDate = new Date(data.list[i].dt_txt);
            let forCastHtml = `
        
            <div class="future-forecast">
            <div class="today" id="current-temp">
                <div class="other">
                <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="weather icon" class="w-icon" id="iconImg">

                    <div class="day">${forecastsDays[i]}</div>
                    <div class="temp"> ${forecastsTemp[i]}°C</div>
                    <div class="temp">${forecastDate.toLocaleDateString('fr-FR')}</div>
                </div>
            </div>
        </div> 


            `;    
            
        document.getElementById("dayFive").innerHTML += forCastHtml ;

        }

} else {
    console.error("L'élément canvas avec l'ID 'myChart' n'a pas été trouvé.");
}

})
.catch(error => {
    console.error('Error fetching weather data:', error);
    alert('City not found. Please try again.');
});

}




// function search by location 
function getWeatherByLocation(latitude , longitude){
    const ApiKey = "0d713f737ea0ef1b9565e1d2231f52b8";
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${ApiKey}`)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        const city = json.name;  // Assuming the city name is in the first result
                console.log(`City: ${city}`);
                const nameC =document.querySelector( ".nomVille" ) ;
                nameC.innerHTML = `${city} Today`;
            displayWeatherCity(json);
            displayForCast(city);

    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    });
}


// displayWeatherCity



function displayWeatherCity(json){

        errorNotFound.style.display="none";
        errorNotFound.classList.remove('fadeIn');

        const image = document.querySelector('.weatherBox img');
        const temperature = document.querySelector('.weatherBox .temperature');
        const description = document.querySelector('.weatherBox .description');
        const humidity = document.querySelector('.weatherDetails .humidity span');
        const wind = document.querySelector('.weatherDetails .windSpeed span');

        switch (json.weather[0].main) {
            case 'Clear':
                image.src = 'images/clear.png';
                break;

            case 'Rain':
                image.src = 'images/rain.png';
                break;

            case 'Snow':
                image.src = 'images/snow.png';
                break;

            case 'Clouds':
                image.src = 'images/clouds.png';
                break;

            case 'Haze':
                image.src = 'images/mist.png';
                break;

            default:
                image.src = '';
        }
        
     
        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
        container.style.height = '590px';


    }



// addEventListener search
search.addEventListener('click',()=>{
    const  cityName = document.querySelector(".searchBox input").value;
    const nameC =document.querySelector( ".nomVille" ) ;
    nameC.innerHTML = `${cityName} Today`;
    if (!cityName){
        alert('enter a city name');
        return;
    }
    getWeatherBySearch(cityName);
displayForCast

});


