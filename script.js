const userTimezone = document.getElementById('user-timezone');
const searchTimezone = document.getElementById('search-timezone');
const output = document.getElementsByClassName('output');
const addrressInput = document.querySelector('input');
const submit = document.getElementById('submit');
const logError = document.getElementById('error');
const logHeading = document.getElementById('logHeading');

const apiKey = "3348f39dd7e94e4c98bcad66fe055cf6";
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`;
            try{
                const response = await fetchData(url);
                output[0].style.display = 'block';
                const data = {...response.data[0]}
                renderData(output[0], data);
            }catch(error){
                output[0].innerHTML = "<p style='color:red;'>Failed to load data</p>"
            };
        }, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// when user fills the address and submit fetch the data;
submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (addrressInput.value.trim()) {
        // make the request according to address
        const address = addrressInput.value.trim();
        // get the lat and lon, according to the corresponding address;
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;
        try{
            const response = await fetch(url);
            const data = await response.json()

            output[1].innerHTML= '';
            output[1].style.display = 'block';
            renderData(output[1], data.features[0].properties);

            // correct the styling
            logHeading.style.display='block';
            logHeading.textContent='Your result'
            logError.style.display='none';
            addrressInput.value='';
        }catch(error){
            logHeading.style.display='none';
            logError.style.display='none';
            output[1].innerHTML = "<p style='color:red;'>Failed to load data</p>"
        };
    }else{
        logError.style.display='block';
        logError.textContent= 'Please enter address';
    }
})
// create a function which fetches data
function fetchData(url) {
    return fetch(url)
        .then(resp => {
            return resp.json()
        })
        .then((response) => {
            return new Promise((resolve, reject) => {
                if (response.results) {
                    resolve({ status: "OK", data: response.results });
                } else {
                    reject({ status: "failed", data: "No location found" });
                }
            })
        });
}
getLocation();
// this is the second parameter to pass getCurrentPosition() to this method, to handle errors
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            logError.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            logError.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            logError.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            logError.innerHTML = "An unknown error occurred."
            break;
    }
}


function renderData(container, data) {
    container.innerHTML += `                     
        <p>Name Of The Time Zone: <span class='green'>${data.timezone.name}</span></p>
        <div class="latlong">
            <p>Lat: <span class='green'>${data.lat}</span></p>
            <p>Long: <span class='green'>${data.lon}</span></p>
        </div>
        <p>Offset STD: <span class='green'>${data.timezone.offset_STD}</span></p>
        <p>Offset STD Seconds: <span class='green'>${data.timezone.offset_STD_seconds}</span></p>
        <p>Offset DST: <span class='green'>${data.timezone.offset_DST}</span></p>
        <p>Offset DST Seconds: <span class='green'>${data.timezone.offset_DST_seconds}</span></p>
        <p>Country: <span class='green'>${data.country}</span></p>
        <p>Postcode: <span class='green'>${data.postcode}</span></p>
        <p>Ciyt: <span class='green'>${data.city}</span></p>
    `;
}


