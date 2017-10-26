debugger;


//Initialize Game Object
var shotGunGame = new ShotGunGame();

//Connect HTML Elements

//  Action Buttons
var buttonShoot = document.getElementById("ButtonShoot");
var buttonReload = document.getElementById("ButtonReload");
var buttonBlock = document.getElementById("ButtonBlock");
var buttonShotgun = document.getElementById("ButtonShotgun");

buttonShoot.addEventListener("click", function() { shotGunGame.PlayerMove(0); } );
buttonReload.addEventListener("click", function() { shotGunGame.PlayerMove(1); } );
buttonBlock.addEventListener("click", function() { shotGunGame.PlayerMove(2); } );
buttonShotgun.addEventListener("click", function() { shotGunGame.PlayerMove(3); } );

buttonShotgun.disabled = true;

//  General Game Information
var gameInfoTurn = document.getElementById("TurnInfo");
var gameInfoPlayerText = document.getElementById("PlayerText");
var gameInfoPlayerAction = document.getElementById("PlayerAction");
var gameInfoPlayerShots = document.getElementById("PlayerShots");
var gameInfoComputerText = document.getElementById("ComputerText");
var gameInfoComputerAction = document.getElementById("ComputerAction");
var gameInfoComputerComputerShots = document.getElementById("ComputerShots");

gameInfoPlayerText.innerText = "Player";
gameInfoPlayerAction.innerText = "Player action: ";
gameInfoPlayerShots.innerText = "Player shots: 0";
gameInfoComputerText.innerText = "Computer";
gameInfoComputerAction.innerText = "Computer action: ";
gameInfoComputerComputerShots.innerText = "Player shots: 0";

// Combat Log 

var gameCombatLog = document.getElementById("GameCombatLog");

function ShotGunGame()
{
    this.combatLog = new Array();
    this.player = new Player("Player");
    this.computer = new Player("Computer");
    this.numberOfTurns = 0;

    this.DoComputerMove = function()
    {
        if (this.computer.bullets == 3)
        {
            //Do 3 = ShotGun if the computer have 3 bullets.
            this.computer.GetAction().DoActionByNumber(3);
        }

        //Otherwise get a random move from 0-2
        var actionNumber = getRandomInt(0, 2);
        this.computer.GetAction().DoActionByNumber(actionNumber);
    }

    this.Update = function()
    {
        this.DoComputerMove();
    }

    this.PlayerMove = function(aAction)
    {
        if (aAction == 3 && this.player.GetBullets() < 3)
        {
            alert("Illegal move made, shotgun with less than 3 bullets");
        }
        else
        {
            this.player.GetAction().DoActionByNumber(aAction);

            LogMessage(this.player.GetName(), this.player.GetAction().GetActionName());
        }

    }

}


function Player(name)
{
    var name = name;
    var action = new Action();
    var bullets = 0;

    this.GetAction = function()
    {
        return action;
    }

    this.GetName = function()
    {
        return name;
    }

    this.GetBullets = function()
    {
        return bullets;
    }

    this.BulletsIncrease = function()
    {
        this.bullets++;
    }

    this.BulletsDecrease = function()
    {
        this.bullets--;
    }
}

function Action()
{
    var action = "None";
    var actionAsNumber= -1;

    this.Shoot = function()
    {
        action = "Shoot";
        actionAsNumber = 0;
    }

    this.Reload = function()
    {
        action = "Reload";
        actionAsNumber = 1;
    }

    this.Block = function()
    {
        action = "Block";
        actionAsNumber = 2;

    }

    this.Shotgun = function()
    {
        action = "ShotGun";
        actionAsNumber = 3;
    }

    this.DoActionByNumber = function(aNumber)
    {
        if (aNumber == 0)
        {
            this.Shoot();
        }
        else if (aNumber == 1)
        {
            this.Reload();
        }
        else if (aNumber == 2)
        {
            this.Block();
        }
        else if (aNumber == 3)
        {
            this.Shotgun();
        }
    }

    this.GetActionName = function()
    {
        return action;
    }
}

function LogMessage(aName, aAction)
{
    var actionText = aName + " performed action " + aAction;

    var newParagraph = document.createElement("p");
    var newText = document.createTextNode(actionText)
    newParagraph.appendChild(newText);

    gameCombatLog.appendChild(newParagraph);
}

function GetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}