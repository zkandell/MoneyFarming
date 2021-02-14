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
    constructor(name,ID,quantity,baseCost,scale,perTick,ButtonLabel){
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
        // You can pass in a function to override the button label - otherwise it uses the default
        // Part here for functionality, part to test how this works
        if(typeof ButtonLabel == 'function'){this.ButtonLabel = ButtonLabel}
        }

    ButtonLabel(){return "Buy " + this.name + " (currently " + this.quantity + ") Cost: $" + this.cost}

    AltText(){return "Produces $" + this.perTick + " per second"}
    
    UpdateInfo(){
        // Calculates how much the next producer will cost
        this.cost = this.baseCost * ((1 + this.scale)**this.quantity)
        // Updates the button with the new information
        document.getElementById(this.ID).innerHTML = this.ButtonLabel()
        document.getElementById(this.ID).title = this.AltText()
    }

    Buy(){
        //Only execute if there's enough money
        if (gameData.money >= this.cost) {
            // Subtract the money it costs and update that tag
            gameData.money -= this.cost
            UpdateMoneyDisplay()
            // Add one to the count
            this.quantity += 1
            // Run through the usual updates
            this.UpdateInfo()
        }
    }

}

class Upgrade {
    /* Upgrades are a one-time purchase which can only be unlocked after certain 
    requirements are met. They tend to change deeper values or unlock new functionality. 
    */

    constructor(ID,title,description,requirement,cost,effect){
        // The ID that identifies the button for this upgrade
        this.ID = ID
        // Every upgrade shows a title and description
        this.title = title
        this.description = description
        // What needs to be the case before you can purchase this upgrade
        this.requirement = requirement
        // How much it costs in $
        this.cost = cost
        // A function that's executed when the upgrade is bought
        this.effect = effect
        // Set a flag to show this hasn't been bought
        this.bought = false

        // Set up the text
        document.getElementById(this.ID).innerHTML = this.title
        document.getElementById(this.ID).title = this.description
    }

    Buy() {
        //Only execute if there's enough money and this upgrade has never been bought before
        if (gameData.money >= this.cost && this.bought == false) {
            // Subtract the money it costs and update that tag
            gameData.money -= this.cost
            UpdateMoneyDisplay()
            // Flag this upgrade as bought
            this.bought = true
            // Put the upgrade into effect
            this.effect()
        }
    }

    UpdateInfo(){
        document.getElementById(this.ID).innerHTML = this.title
        document.getElementById(this.ID).title = this.description
    }

}

moneyFlower = new Producer("Money Flower","MoneyFlower",0,10,1,1)
moneyBush = new Producer("Money Bush", "MoneyBush",0,20,1,2,1)
moneyTree = new Producer("Money Tree", "MoneyTree",0,40,1,4)
ughBees = new Upgrade("ughBees","Ugh, bees","Makes Money Flowers 10% more effective",true,100,function(){moneyFlower.perTick*=1.1})
pruningShears = new Upgrade("pruningShears","Pruning Shears","Makes Money Bushes 10% more effective",true,200,function(){moneyBush.perTick*=1.1})

var producerList = [moneyFlower,moneyBush,moneyTree]
var upgradeList = [ughBees,pruningShears]

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
    // Do the same for the upgrades
    }
    for(var i = 0; i < upgradeList.length ; i++) {
        upgrade = upgradeList[i]
        upgrade.UpdateInfo()
    }
}

var mainGameLoop = window.setInterval(function() {
    PickMoney()
    RefreshInterface()
}, 1000)