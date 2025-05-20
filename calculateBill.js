const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Umuryi {
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._foods = [];
    this._foodBills = [];
  }

  getId() {
    return this._id;
  }

  addFood(food, bill) {
    this._foods.push(food);
    this._foodBills.push(parseFloat(bill));
  }

  getTotalBill() {
    return this._foodBills.reduce((sum, b) => sum + b, 0);
  }

  describe() {
    let description = `${this._name} ate:\n`;
    this._foods.forEach((food, i) => {
      description += `  - ${food}: ${this._foodBills[i]} RWF\n`;
    });
    description += `Total food bill: ${this.getTotalBill()} RWF`;
    return description;
  }
}

class Umunywi {
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._drinks = [];
    this._drinkBills = [];
  }

  getId() {
    return this._id;
  }

  addDrink(drink, bill) {
    this._drinks.push(drink);
    this._drinkBills.push(parseFloat(bill));
  }

  getTotalBill() {
    return this._drinkBills.reduce((sum, b) => sum + b, 0);
  }

  describe() {
    let description = `${this._name} drank:\n`;
    this._drinks.forEach((drink, i) => {
      description += `  - ${drink}: ${this._drinkBills[i]} RWF\n`;
    });
    description += `Total drink bill: ${this.getTotalBill()} RWF`;
    return description;
  }
}


// General async input
function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Validators
async function askNonEmpty(question) {
  let input;
  do {
    input = (await ask(question)).trim();
    if (!input) console.log("Input cannot be empty.");
  } while (!input);
  return input;
}

async function askAlphanumericID(question) {
  let input;
  const regex = /^[a-z0-9]+$/i;
  do {
    input = (await ask(question)).trim();
    if (!regex.test(input)) console.log("Please enter a valid ID (letters and numbers only).");
  } while (!regex.test(input));
  return input;
}

async function askName(question) {
  let input;
  const regex = /^[a-zA-Z\s]+$/;
  do {
    input = (await ask(question)).trim();
    if (!regex.test(input)) console.log("Please enter a valid name (letters and spaces only).");
  } while (!regex.test(input));
  return input;
}

async function askPrice(question) {
  let input;
  let price;
  do {
    input = (await ask(question)).trim();
    price = parseFloat(input);
    if (isNaN(price) || price < 0) {
      console.log("Please enter a valid positive number.");
    }
  } while (isNaN(price) || price < 0);
  return price;
}

async function askYesNo(question) {
  let answer;
  do {
    answer = (await ask(question)).trim().toLowerCase();
    if (answer !== "yes" && answer !== "no") {
      console.log("Please enter 'yes' or 'no'.");
    }
  } while (answer !== "yes" && answer !== "no");
  return answer;
}

// MAIN FUNCTION
(async function () {
  // Eater info
  const eaterId = await askAlphanumericID("Enter ID of the person who ate: ");
  const eaterName = await askName("Enter the name of the person who ate: ");
  const eater = new Umuryi(eaterId, eaterName);

  let moreFood = "yes";
  while (moreFood === "yes") {
    const food = await askNonEmpty("Enter a food item: ");
    const foodBill = await askPrice(`Enter the price for ${food}: `);
    eater.addFood(food, foodBill);
    moreFood = await askYesNo("Add another food? (yes/no): ");
  }

  // Drinker info
  const drinkerId = await askAlphanumericID("\nEnter ID of the person who drank: ");
  const drinkerName = await askName("Enter the name of the person who drank: ");
  const drinker = new Umunywi(drinkerId, drinkerName);

  let moreDrink = "yes";
  while (moreDrink === "yes") {
    const drink = await askNonEmpty("Enter a drink item: ");
    const drinkBill = await askPrice(`Enter the price for ${drink}: `);
    drinker.addDrink(drink, drinkBill);
    moreDrink = await askYesNo("Add another drink? (yes/no): ");
  }

  // Output
  console.log("\n--- Results ---\n");

  if (eater.getId() === drinker.getId()) {
    const combinedTotal = eater.getTotalBill() + drinker.getTotalBill();
    console.log(`${eater._name} (ID: ${eater.getId()}) total combined bill: ${combinedTotal} RWF`);
  } else {
    console.log(eater.describe());
    console.log("\n");
    console.log(drinker.describe());
  }

  rl.close();
})();
