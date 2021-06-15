let cityName = document.querySelectorAll('.weather__city');
let countryName = document.querySelectorAll('.weather__country');
let temperature = document.querySelector('.weather__temperature');

let mainWind = document.querySelector('.weather-main-wind');
let mainCloudiness = document.querySelector('.weather-main-cloudiness');
let mainPressure = document.querySelector('.weather-main-pressure');
let mainHimidity = document.querySelector('.weather-main-himidity');
let mainSunrise = document.querySelector('.weather-main-sunrise');
let mainSunset = document.querySelector('.weather-main-sunset');
let mainGeoCoords = document.querySelector('.weather-main-geo-coords');

let icon = document.querySelector('.weather__icon');
let timeNow = document.querySelector('.wether-date-today-time')
let monthNow = document.querySelector('.wether-date-today-month')
let dayNow = document.querySelector('.wether-date-today-day')

let weatherBlock = document.querySelector('.weather-day');

let dateForTitle;

// let idCity = 703448;
let apiKey = '75402b96b62050d5f61b60530e9049f0';
let latitude = 49.41;
let longitude = 27.00;

navigator.geolocation.getCurrentPosition(
    function(position) {
    	latitude = position.coords.latitude.toFixed(2);
    	longitude = position.coords.longitude.toFixed(2);

    	GeoLocation(latitude, longitude);

}, GeoLocation(latitude, longitude) );


function GeoLocation(lat, lon){
	document.querySelector('.weather-day').innerHTML = '';

	fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=1&appid=${apiKey}&units=metric`)
	// fetch(`http://api.openweathermap.org/data/2.5/weather?id=${idCity}&appid=${apiKey}&units=metric`)
		.then(function (resp) {
			return resp.json()
		})
		.then(function (data){
			// console.log(data);

			for(let i = 0; i < cityName.length; i++){
				cityName[i].textContent = data.name;
			}
			for(let i = 0; i < countryName.length; i++){
				countryName[i].textContent = data.sys.country;
			}

			icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;
			
			temperature.innerHTML = Math.round(data.main.temp) + '&deg;';

			timeAtTheMoment = new Date()

			timeNow.textContent = `${getZero(timeAtTheMoment.getHours())}:${getZero(timeAtTheMoment.getMinutes())}`
			monthNow.textContent = `${getMonth(timeAtTheMoment.getMonth())}`
			dayNow.textContent = `${getZero(timeAtTheMoment.getDate())}`

			mainWind.textContent = data.wind.speed + ' m/s, ' + windDeg(data.wind.deg);

			mainCloudiness.textContent = data.weather[0]['description'];

			mainPressure.textContent = data.main.pressure + ' hpa';

			mainHimidity.textContent = data.main.humidity + ' %';

			let timeSunrise = new Date(data.sys.sunrise*1000);
			mainSunrise.textContent = `${getZero(timeSunrise.getHours())}:${getZero(timeSunrise.getMinutes())}`

			let timeSunset = new Date(data.sys.sunset*1000);
			mainSunset.textContent = `${getZero(timeSunset.getHours())}:${getZero(timeSunset.getMinutes())}`

			mainGeoCoords.textContent = `[${data.coord.lat.toFixed(2)}, ${data.coord.lon.toFixed(2)}]`;

		})
		.catch(function(){

		})


	// fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${idCity}&appid=${apiKey}&units=metric`)
	fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
		.then(function (resp) {
			return resp.json()
		})
		.then(function (data){
			console.log(data);

			let dataWeather = [];

			let dateArraysData;

			for(let i = 0; i < data.list.length; i++) {

				dateArraysData = data.list[i];

				let date = dateArraysData.dt*1000;
				date = new Date(date);
				
				dataWeather['dateHour'] = date.getHours();
				dataWeather['dateDay'] = date.getDate();
				dataWeather['dateWeekday'] = date.getDay();
				dataWeather['dateMonth'] = date.getMonth();
				dataWeather['dateYear'] = date.getFullYear();
				dataWeather['icon'] = dateArraysData.weather[0].icon;
				dataWeather['temperature'] = dateArraysData.main.temp;
				dataWeather['info'] = dateArraysData.weather[0].description;
				dataWeather['wind'] = dateArraysData.wind.speed;
				dataWeather['clouds'] = dateArraysData.clouds.all;
				dataWeather['pressure'] = dateArraysData.main.pressure;

				if(dateForTitle != dataWeather['dateDay']){
					weatherBlock.innerHTML += getDayWeather(dataWeather['dateWeekday'], dataWeather['dateMonth'], dataWeather['dateDay'], dataWeather['dateYear']);
				}

				weatherBlock.innerHTML += getTimeWeather( dataWeather['dateHour'], dataWeather['icon'], dataWeather['temperature'], dataWeather['info'], dataWeather['wind'], dataWeather['clouds'], dataWeather['pressure'] );
				
				dateForTitle = dataWeather['dateDay'];

			}

		})
		.catch(function(){

		})
}

function getDayWeather(weekday, month, day, year){
	return `<div class="weather-days__title">${getWeekday(weekday)} ${getMonth(month)} ${getZero(day)} ${year}</div>`
}

function getTimeWeather(hours, image, temperature, info, windSpeed, clouds, pressure){
	return `<div class="weather-day-time__data">
				<div class="weather-day__time-and-image">
					<div class="weather-day__hours">
						${getZero(hours)}:00
					</div>
					<div class="weather-day__icon">
						<img src="https://openweathermap.org/img/wn/${image}@2x.png">
					</div>
				</div>
				<div class="weather-day__data-weather">
					<div class="weather-day__data-deg">
						<div class="weather-day-deg">
							${temperature.toFixed(1)} &deg;C
						</div>
						<div class="weather-day-weath">
							${info}
						</div>
					</div>
					<div class="weather-day__data-data">
						<div>
							${windSpeed} m/s,
						</div>
						<div>
							clouds: ${clouds}%,
						</div>
						<div>
							${pressure} hpa
						</div>
					</div>
				</div>
			</div>`
}
function getZero(time){
	if(time < 10){
		return '0' + time;
	} else {
		return time;
	}
}

function windDeg(data){
	if(data >= 337.5 && data <= 360 || data >= 0 && data <= 22.4){
		return 'Northern'
	} else if (data >= 22.5 && data <= 67.4) {
		return 'Northeastern'
	} else if (data >= 67.5 && data <= 112.4){
		return 'East'
	} else if (data >= 112.5 && data <= 157.4){
		return 'Southeastern'
	} else if (data >= 157.5 && data <= 202.4) {
		return 'Southern'
	} else if (data >= 202.5 && data <= 247.4) {
		return 'Southwest'
	} else if (data >= 247.5 && data <= 292.4) {
		return 'West'
	} else if (data >= 292.5 && data <= 337.4) {
		return 'Northwestern'
	} else {
		return 'error'
	}
}

function getWeekday(num){
	if (num == 0){
		return 'Sun'
	} else if (num == 1) {
		return 'Mon'
	} else if (num == 2) {
		return 'Tue'
	} else if (num == 3){
		return 'Wed'
	} else if (num == 4){
		return 'Thu'
	} else if (num == 5){
		return 'Fri'
	} else if (num == 6){
		return 'Sut'
	}
}

function getMonth(num){
	if (num == 0){
		return 'Jun'
	} else if (num == 1){
		return 'Feb'
	} else if (num == 2){
		return 'Mat'
	} else if (num == 3){
		return 'Apr'
	} else if (num == 4){
		return 'May'
	} else if (num == 5){
		return 'Jun'
	} else if (num == 6){
		return 'Jul'
	} else if (num == 7){
		return 'Aug'
	} else if (num == 8){
		return 'Sep'
	} else if (num == 9){
		return 'Oct'
	} else if (num == 10){
		return 'Nov'
	} else if (num == 11){
		return 'Dec'
	}
}