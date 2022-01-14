/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  // console.log(document.getElementById("coffee_counter"));
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

// updateCoffeeView(1000);
function clickCoffee(data) {
  // your code here
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach((prod) => {
    if (coffeeCount >= (1 / 2) * prod.price && !prod.unlocked) {
      prod.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter((prod) => prod.unlocked);
}

function makeDisplayNameFromId(id) {
  // your code here
  let result = id[0].toUpperCase();
  // console.log(result);
  for (let i = 1; i < id.length; i++) {
    if (id[i] === "_") {
      result += " ";
    } else if (id[i - 1] === "_") {
      result += id[i].toUpperCase();
    } else {
      result += id[i];
    }
  }
  return result;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  let prodContainer = document.getElementById("producer_container");
  unlockProducers(data.producers, data.coffee);
  deleteAllChildNodes(prodContainer);
  let unlockedProducer = getUnlockedProducers(data);

  for (let i = 0; i < unlockedProducer.length; i++) {
    prodContainer.appendChild(makeProducerDiv(data.producers[i]));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  return data.coffee >= getProducerById(data, producerId).price;
}

function updateCPSView(cps) {
  // your code here
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  if (canAffordProducer(data, producerId)) {
    let producer = getProducerById(data, producerId);
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  }
  if (!canAffordProducer(data, producerId)) return false;
}

function buyButtonClick(event, data) {
  // your code here
  if (event.target.tagName === "BUTTON") {
    let producerId = event.target.id.substring(4);

    if (!attemptToBuyProducer(data, producerId)) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
