const container = document.querySelector('.container');
const search = document.querySelector('.searchBox button');
const weatherBox =document.querySelector('.weatherBox');
const weatherDetails =document.querySelector('.weatherDetails');
const errorNotFound =document.querySelector('.notFound');

search.addEventListener( 'click', () => {
    const ApiKey = "0d713f737ea0ef1b9565e1d2231f52b8";
    const  cityName= document.querySelector(".searchBox input").value;
    if (cityName ==='')
    return;
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


    });


});





