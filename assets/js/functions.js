export async function initPage() {
    try {
        const data = await fetch('https://api.covid19api.com/summary');
        const dataJson = await data.json();
        document.getElementById('last-update').innerText = getLastUpdate(new Date(dataJson.Date));
        document.getElementById('total-confirmed').innerText = String(dataJson.Global.TotalConfirmed);
        document.getElementById('max-country').innerText = maxMinCountry(dataJson.Countries, 'max');
        document.getElementById('min-country').innerText = maxMinCountry(dataJson.Countries, 'min');
        dataJson.Countries.forEach(element => {
            generateRow(element.Country, element.CountryCode, element.TotalConfirmed);
            generateOption(element.Country);
        });
        document.getElementById('search-country').addEventListener('change', () => searchDatalist(dataJson.Countries));
    } catch (error) {
        console.log(error);
    }
}

function maxMinCountry(array, maxMin) {
    let maxMinValue;
    if (maxMin === 'max') {
        maxMinValue = array.reduce((accumulator, current) => Math.max(accumulator, current.TotalConfirmed), 0);
    } else if (maxMin === 'min') {
        maxMinValue = array.reduce((accumulator, current) => Math.min(accumulator, current.TotalConfirmed), Infinity);
    }
    const maxMinCountryName = (array.find(item => item.TotalConfirmed === maxMinValue)).Country;
    return `${maxMinCountryName}: ${maxMinValue}`;
}

function generateRow(country, code, totalConfirmed) {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const countryCode = document.createElement('td');
    const number = document.createElement('td');
    name.innerText = country;
    countryCode.innerText = code;
    number.innerText = String(totalConfirmed);
    row.append(name);
    row.append(countryCode);
    row.append(number);
    document.querySelector('tbody').append(row);
}

function generateOption(country) {
    const option = document.createElement('option');
    option.setAttribute('value', country);
    document.getElementById('search-country-list').append(option);
}

function addZero(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function getLastUpdate(date) {
    const day = addZero(date.getDate());
    const month = addZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return `Date: ${day}-${month}-${year}, Time: ${hour}:${minutes}`;
}

function searchDatalist(array) {
    const searchedData = array.find(item => item.Country.toLowerCase() === document.getElementById('search-country').value.toLowerCase());
    if (typeof (searchedData) !== 'undefined') {
        document.querySelector('#search span').innerText = searchedData.TotalConfirmed;
    } else {
        document.querySelector('#search span').innerText = '';
    }
}