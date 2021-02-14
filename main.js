var gameData = {
    // This is how much money you start with - this will change a lot later
    money: 10,
    // String representation of the money
    moneyString: '10',
    // Identifies the element on the page that has the money information
    moneyID: "CurrentMoney",
    // Every tick, you run through this function to get the amount of money produced per tick
    moneyPerTick: function() {
        perTick = 0
        // Go through all the producers the player has
        for(var i = 0; i < producerList.length ; i++) {
            producer = producerList[i]
            // Add each producer's contribution
            perTick += producer.perTick * producer.quantity
        }
        return perTick
    },
    // Number of game ticks per second
    tickSpeed: 2,
    // How often the display refreshes per second
    frameRate: 5
}

class Buyable {
    /* Parent of the Producer/Upgrade classes
    This defines an item that displays dynamic text and can be bought
    ...Yeah, I never got around to finishing this, but it's an idea to pick up next time
    */
   constructor(ID,label,description){
       this.ID = ID
       this.label = label
       this.description = description
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

    AltText(){return "Produces $" + FormatMoney(this.perTick) + " per second"}
    
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
        // A function that returns a boolean - if true, the upgrade can be unlocked
        // This functionality still needs to be implemented
        this.requirement = requirement
        // How much it costs in $
        this.cost = cost
        // A function that's executed when the upgrade is bought
        this.effect = effect
        // Set a flag to show this hasn't been bought
        this.bought = false
    }

    ButtonLabel() {
        let label = this.title
        if (this.bought == true) {label += " (Bought)"}
        return label
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
        document.getElementById(this.ID).innerHTML = this.ButtonLabel()
        document.getElementById(this.ID).title = this.description
    }

}

moneyFlower = new Producer("Money Flower","MoneyFlower",0,10,1,1)
moneyBush = new Producer("Money Bush", "MoneyBush",0,20,1,2,1)
moneyTree = new Producer("Money Tree", "MoneyTree",0,40,1,4)
ughBees = new Upgrade("ughBees","Ugh, bees","Makes Money Flowers 10% more productive",true,100,function(){moneyFlower.perTick*=1.1})
pruningShears = new Upgrade("pruningShears","Pruning Shears","Makes Money Bushes 10% more productive",true,200,function(){moneyBush.perTick*=1.1})
huggingTrees = new Upgrade("huggingTrees","Hugging Trees","Makes Money Trees 10% more productive",true,400,function(){moneyTree.perTick*=1.1})

var producerList = [moneyFlower,moneyBush,moneyTree]
var upgradeList = [ughBees,pruningShears,huggingTrees]

function PickMoney() {
    // Add money per tick to the current money
    gameData.money += gameData.moneyPerTick()
    UpdateMoneyDisplay()
}

function FormatMoney(money) {
    // Convert the current amount of money to a string rather than number
    let moneyString = money.toFixed(2)
    return moneyString
}

function UpdateMoneyDisplay() {
    // Exactly what it says on the tin
    gameData.moneyString = FormatMoney(gameData.money)
    document.getElementById(gameData.moneyID).innerHTML = "$" + gameData.moneyString
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
    if (gameData.money >= 100000){
        // Show the self-deprecating message when the player has too much money
        document.getElementById("Message").style.display = 'block'
    }
}

// Refreshes display of everything on the screen
var RefreshScreen = window.setInterval(function() {RefreshInterface()},1000/gameData.frameRate)

// Main loop that collects money
var mainGameLoop = window.setInterval(function() {PickMoney()}, 1000/gameData.tickSpeed)