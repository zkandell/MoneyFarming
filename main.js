var gameData = {
    money: 10,
    moneyID: "CurrentMoney",
    moneyPerTick: function() {
        perTick = 0
        // Go through all the producers the player has
        for(var i = 0; i < producerList.length ; i++) {
            producer = producerList[i]
            // Add each producer's contribution
            perTick += producer.perTick * producer.quantity
        }
        return perTick
    }
}

class Producer {
    /* Producers, well, produce a certain amount of money per unit of time. 
    I'm sure I'll need more lines of comments here eventually - but until then, this is empty-ish
    */
    constructor(name,ID,quantity,baseCost,scale,perTick){
        // The name that will be shown to the user for this type of producer
        this.name = name
        // ID for the button to buy this producer
        this.ID = ID
        // However many of it you start with
        this.quantity = quantity
        // basecost is teh cost of the first producer and is used to calculate later ones
        this.baseCost = baseCost
        this.cost = this.baseCost
        // Scale is how quickly it will go up in price (scale plus one raised to the power of quantity)
        this.scale = scale
        // How much money it makes you per tick
        this.perTick = perTick
    }

    ButtonLabel(){
        return "Buy " + this.name + " (currently " + this.quantity + ") Cost: $" + this.cost
    }
    
    UpdateInfo(){
        // Calculates how much the next producer will cost
        this.cost = this.baseCost * ((1 + this.scale)**this.quantity)
        // Updates the button with the new information
        document.getElementById(this.ID).innerHTML = this.ButtonLabel()
    }

}

class Upgrade {
    /*
    Upgrades are a one-time purchase which can only be unlocked after certain 
    requirements are met. They tend to change deeper values or unlock new functionality. 
    */

    constructor(title,description,requirements,cost){
        this.title = title
        this.description = description
        this.requirements = requirements
        this.cost = cost
    }

}

moneyFlower = new Producer("Money Flower","MoneyFlower",0,10,1,1)
moneyBush = new Producer("Money Bush", "MoneyBush",0,20,1,2)
moneyTree = new Producer("Money Tree", "MoneyTree",0,40,1,4)

var producerList = [moneyFlower,moneyBush,moneyTree]

function BuyProducer(producer) {
    // Only execute if you have enough money to buy
    if (gameData.money >= producer.cost) {
        // Subtract the money it costs and update that tag
        gameData.money -= producer.cost
        UpdateMoneyDisplay()
        // Add one to the count
        producer.quantity += 1
        // Run through the usual updates
        producer.UpdateInfo()
    }
}

function PickMoney() {
    // Add money per tick to the current money
    gameData.money += gameData.moneyPerTick()
    UpdateMoneyDisplay()
}

function UpdateMoneyDisplay() {
    // Exactly what it says on the tin
    document.getElementById(gameData.moneyID).innerHTML = "$" + gameData.money
}

function RefreshInterface() {
    UpdateMoneyDisplay()
    // Updates all the buttons for producers
    for(var i = 0; i < producerList.length ; i++) {
        producer = producerList[i]
        producer.UpdateInfo()
    }
}

/*function LowerMoneyTreeScale() {
    moneyTree.scale *= 0.99
}*/

var mainGameLoop = window.setInterval(function() {
    PickMoney()
    RefreshInterface()
}, 1000)