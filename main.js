var gameData = {
    money: 10,
    moneyPerTick: 0,
    moneyFlowers: 0,
    moneyFlowerBaseCost: 10,
    moneyFlowerScale: 2,
    moneyFlowerCost: 10,
    moneyBushes: 0,
    moneyBushBaseCost: 20,
    moneyBushScale: 2,
    moneyBushCost: 20,
    moneyTrees: 0,
    moneyTreeBaseCost: 40,
    moneyTreeScale: 2,
    moneyTreeCost: 40
}

function PickMoney() {
    gameData.money += gameData.moneyPerTick
    document.getElementById("CurrentMoney").innerHTML = "$" + gameData.money
}

function BuyMoneyFlower() {
    if (gameData.money >= gameData.moneyFlowerCost) {
        gameData.money -= gameData.moneyFlowerCost
        gameData.moneyPerTick += 1
        gameData.moneyFlowers +=1
        gameData.moneyFlowerCost = gameData.moneyFlowerBaseCost * (gameData.moneyFlowerScale**gameData.moneyFlowers)
        document.getElementById("CurrentMoney").innerHTML = "$" + gameData.money
        document.getElementById("MoneyFlower").innerHTML = "Buy Money Flower (currently " + gameData.moneyFlowers + ") Cost: $" + gameData.moneyFlowerCost
    }
}

function BuyMoneyBush() {
    if (gameData.money >= gameData.moneyBushCost) {
        gameData.money -= gameData.moneyBushCost
        gameData.moneyPerTick += 2
        gameData.moneyBushes +=1
        gameData.moneyBushCost = gameData.moneyBushBaseCost * (gameData.moneyBushScale**gameData.moneyBushes)
        document.getElementById("CurrentMoney").innerHTML = "$" + gameData.money
        document.getElementById("MoneyBush").innerHTML = "Buy Money Bush (currently " + gameData.moneyBushes + ") Cost: $" + gameData.moneyBushCost
    }
}

function BuyMoneyTree() {
    if (gameData.money >= gameData.moneyTreeCost) {
        gameData.money -= gameData.moneyTreeCost
        gameData.moneyPerTick += 4
        gameData.moneyTrees +=1
        gameData.moneyTreeCost = gameData.moneyTreeBaseCost * (gameData.moneyTreeScale**gameData.moneyTrees)
        document.getElementById("CurrentMoney").innerHTML = "$" + gameData.money
        document.getElementById("MoneyTree").innerHTML = "Buy Money Tree (currently " + gameData.moneyTrees + ") Cost: $" + gameData.moneyTreeCost
    }
}

function BuyMoneyPerClick() {
    if (gameData.money >= gameData.moneyPerClickCost) {
        gameData.money -= gameData.moneyPerClickCost
        gameData.moneyPerTick += 1
        gameData.moneyPerClickCost *= 2
        document.getElementById("CurrentMoney").innerHTML = "$" + gameData.money
        document.getElementById("perClickUpgrade").innerHTML = "Buy Money Tree (currently " + gameData.moneyPerTick + ") Cost: $" + gameData.moneyPerClickCost
    }
}

var mainGameLoop = window.setInterval(function() {
    PickMoney()
}, 1000)