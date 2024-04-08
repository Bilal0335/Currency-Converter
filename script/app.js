const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");
const apiKey = "c12869655c38e1665b41d5ec";
for (let i = 0; i < dropList.length; i++) {
  for (currency_code in countryList) {
    //*selected USD default FROM currency and PKR ad TO currency
    let selected;
    if (i == 0) {
      selected = currency_code === "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code === "PKR" ? "selected" : "";
    }
    //* create option tags with passing currency code as a text & value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    // * insert option tage inside select tage
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); //loadflag with pasing target element as an argument
  });
}

function loadFlag(elem) {
  for (code in countryList) {
    //*if currency code of countryList is equal to option value
    if (code === elem.value) {
      //*select image tag of particular
      let imgTag = elem.parentElement.querySelector("img");

      //*pasing country code of a selected countryList in a image url
      imgTag.src = `https://flagsapi.com/${countryList[code]}/flat/64.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); // * preventing form from submitting
  getExchangeRate();
});

const exchangeicon = document.querySelector(".icon");
exchangeicon.addEventListener("click", () => {
  let temCode = fromCurrency.value; //* temporay currency code of FROM drop list
  fromCurrency.value = toCurrency.value; //* passing To currency code to FROM currency code
  toCurrency.value = temCode; //* Temporay currency code to TO currency code
  loadFlag(fromCurrency); //* calling loadflag with passing select element (fromCurrency) to FROM
  loadFlag(toCurrency); //* calling loadflag with passing select element (toCurrency) to TO
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  let exchangeRateTxt = document.querySelector(".getexchange-rate");
  let amountVal = amount.value;
  //* if user enter any value or enter 0 then we'll put 1 value by default in the input field
  if (amountVal === 0 || amountVal === "") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = `Getting exchange rate...`;
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  //* fetch api response and returning it with parsing into js obj and in another then method receiving that object
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      //*if user is offline or any other error ocuured while fetching data then catch function will run
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
