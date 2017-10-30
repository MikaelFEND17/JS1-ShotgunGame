
//Initialize Game Object
var shotGunGame = new ShotGunGame();

//Connect HTML Elements

//  Action Buttons
var buttonShoot = document.getElementById("ButtonShoot");
var buttonReload = document.getElementById("ButtonReload");
var buttonBlock = document.getElementById("ButtonBlock");
var buttonShotgun = document.getElementById("ButtonShotgun");
var buttonNewGame = document.getElementById("ButtonNewGame");

buttonShoot.addEventListener("click", function() { shotGunGame.PlayerMove(0); } );
buttonReload.addEventListener("click", function() { shotGunGame.PlayerMove(1); } );
buttonBlock.addEventListener("click", function() { shotGunGame.PlayerMove(2); } );
buttonShotgun.addEventListener("click", function() { shotGunGame.PlayerMove(3); } );
buttonNewGame.addEventListener("click", function() { shotGunGame.NewGame(); } );

buttonShoot.disabled = true;
buttonShotgun.disabled = true;

console.log(buttonNewGame);

//  General Game Information
var gameInfoTurn = document.getElementById("TurnInfo");

var gameInfoPlayerText = new Array(document.getElementById("Player1Text"), document.getElementById("Player2Text"));
var gameInfoPlayerAction = new Array(document.getElementById("Player1Action"), document.getElementById("Player2Action"));
var gameInfoPlayerShots = new Array(document.getElementById("Player1Shots"), document.getElementById("Player2Shots"));

gameInfoPlayerText[0].innerHTML = '<span class="BoldText">Player</span>';
gameInfoPlayerAction[0].innerHTML = '<span class="BoldText">Player action: </span>None';
gameInfoPlayerShots[0].innerHTML = '<span class="BoldText">Player shots: </span>0';
gameInfoPlayerText[1].innerHTML = '<span class="BoldText">Computer</span>';
gameInfoPlayerAction[1].innerHTML = '<span class="BoldText">Computer action: </span>None';
gameInfoPlayerShots[1].innerHTML = '<span class="BoldText">Computer shots: </span>0';


var gameState = document.getElementById("GameStateBig");
var gameStateLastRound = document.getElementById("GameStateLastRound");

// Combat Log 

var gameCombatLog = document.getElementById("GameCombatLog");

function ShotGunGame()
{
    this.combatLog = new Array();
    this.players = new Array(new Player("Player"), new Player("Computer"));
    this.numberOfTurns = 0;
    this.winner = "None";
    this.gameOver = false;
    this.combatLog = new CombatLog();

    this.DoComputerMove = function()
    {
        if (this.players[1].GetBullets() == 3)
        {
            //Do 3 = ShotGun if the computer have 3 bullets.
            this.players[1].GetAction().DoActionByNumber(3);
        }
        else if (this.players[1].GetBullets() == 0)
        {
            //Don't have any bullets Shoot is unavailible 1-2
            var actionNumber = GetRandomInt(1, 2);
            this.players[1].GetAction().DoActionByNumber(actionNumber);
        }
        else
        {
            //Otherwise get a random move from 0-2
            var actionNumber = GetRandomInt(0, 2);
            this.players[1].GetAction().DoActionByNumber(actionNumber);
        }
    }

    this.PlayerMove = function(aAction)
    {
        if (aAction == 3 && this.players[0].GetBullets() < 3)
        {
            alert("Illegal move made, shotgun with less than 3 bullets.");
        }
        else if (aAction == 0 && this.players[0].GetBullets() == 0)
        {
            alert("Illegal move made, tried shooting without bullets.");
        }
        else
        {
            this.players[0].GetAction().DoActionByNumber(aAction);
            this.UpdateRoundActionTextForPlayer(0);

            this.DoComputerMove();
            this.UpdateRoundActionTextForPlayer(1);

            this.combatLog.LogMessage(this.players[0].GetName(), this.players[0].GetAction().GetActionName(), this.players[1].GetName(), this.players[1].GetAction().GetActionName());

            this.DetermineRoundOutcome();
        }

        this.numberOfTurns++;
        gameInfoTurn.innerHTML = '<span class="BoldText">Turn: </span>' + this.numberOfTurns;

    }

    this.DetermineRoundOutcome = function()
    {
        gameState.innerHTML = "Game is ongoing!";

        if (this.players[0].GetAction().GetActionName() == "Reload" && this.players[1].GetAction().GetActionName() == "Reload")
        {
            this.players[0].BulletsIncrease();
            this.players[1].BulletsIncrease();

            this.UpdateShotsTextForPlayer(0);
            this.UpdateShotsTextForPlayer(1);

            gameStateLastRound.innerHTML = "Both players Reloaded and gained +1 bullet";
        }
        else if (this.players[0].GetAction().GetActionName() == "Shoot" && this.players[1].GetAction().GetActionName() == "Shoot")
        {
            this.players[0].BulletsDecrease();
            this.players[1].BulletsDecrease();

            this.UpdateShotsTextForPlayer(0);
            this.UpdateShotsTextForPlayer(1);
            
            gameStateLastRound.innerHTML = "Both players shot and gained -1 bullet";
        }
        else if (this.players[0].GetAction().GetActionName() == "Reload" && this.players[1].GetAction().GetActionName() == "Block")
        {
            this.players[0].BulletsIncrease();
            this.UpdateShotsTextForPlayer(0);
            
            gameStateLastRound.innerHTML = this.players[0].GetName() +  " reloaded and gained +1 bullet while " + this.players[1].GetName() + " tried to block.";
        }
        else if (this.players[0].GetAction().GetActionName() == "Block" && this.players[1].GetAction().GetActionName() == "Reload")
        {
            this.players[1].BulletsIncrease();
            this.UpdateShotsTextForPlayer(1);
            gameStateLastRound.innerHTML = this.players[1].GetName() +  " reloaded and gained +1 bullet while " + this.players[0].GetName() + " tried to block.";
        }
        else if (this.players[0].GetAction().GetActionName() == "Shoot" && this.players[1].GetAction().GetActionName() == "Block")
        {
            this.players[0].BulletsDecrease();
            this.UpdateShotsTextForPlayer(0);
            
            gameStateLastRound.innerHTML = this.players[0].GetName() +  " shot and lost -1 bullet because " + this.players[1].GetName() + "  blocked.";
        }        
        else if (this.players[0].GetAction().GetActionName() == "Block" && this.players[1].GetAction().GetActionName() == "Shoot")
        {
            this.players[1].BulletsDecrease();
            this.UpdateShotsTextForPlayer(1);
            
            gameStateLastRound.innerHTML = this.players[1].GetName() +  " shot and lost -1 bullet because " + this.players[0].GetName() + "  blocked.";
        }
        else if (this.players[0].GetAction().GetActionName() == "Shoot" && this.players[1].GetAction().GetActionName() == "Reload")
        {
            //Player Wins
            this.GameOver(this.players[0].GetName(), "Shoot");

        }
        else if (this.players[0].GetAction().GetActionName() == "Reload" && this.players[1].GetAction().GetActionName() == "Shoot")
        {
            //Computer Wins
            this.GameOver(this.players[1].GetName(), "Shoot");
        }
        else if (this.players[0].GetAction().GetActionName() == "ShotGun" && this.players[1].GetAction().GetActionName() == "ShotGun")
        {
            //Draw
            this.GameOver(-1, "Double Shotgun");
        }
        else if (this.players[0].GetAction().GetActionName() == "ShotGun" && this.players[1].GetAction().GetActionName() != "ShotGun")
        {
            //Player Wins
            this.GameOver(this.players[0].GetName(), "Shotgun");
        }
        else if (this.players[0].GetAction().GetActionName() != "ShotGun" && this.players[1].GetAction().GetActionName() == "ShotGun")
        {
            //Computer Wins
            this.GameOver(this.players[1].GetName(), "Shotgun");
        }
        else
        {
            
            gameStateLastRound.innerHTML = "Both players blocked!";
            
            //Just logging block vs block to check.
            if (this.players[0].GetAction().GetActionName() != "Block" || this.players[1].GetAction().GetActionName() != "Block")
            {
                alert("Both players should have blocked but didn't?");
                console.log("Both players should block: ");
                console.log(this.players[0].GetAction().GetActionName());
                console.log(this.players[1].GetAction().GetActionName());
            }
        }

        this.SetPlayerButtonStates();

    }

    this.UpdateRoundActionTextForPlayer = function(aPlayerID)
    {
        gameInfoPlayerAction[aPlayerID].innerHTML = '<span class="BoldText">' + this.players[aPlayerID].GetName() + " action: </span>" + this.players[aPlayerID].GetAction().GetActionName();
    }

    this.UpdateShotsTextForPlayer = function(aPlayerID)
    {
        gameInfoPlayerShots[aPlayerID].innerHTML = '<span class="BoldText">' + this.players[aPlayerID].GetName() + " shots: </span>" + this.players[aPlayerID].GetBullets();
    }

    this.GameOver = function(aWinner, aWinType)
    {
        this.winner = aWinner;
        this.gameOver = true;

        gameState.innerHTML = "Game Over!";
        
        if (aWinType == "Double Shotgun")
        {
            gameStateLastRound.innerHTML = "Both players died to double shotgun, game is draw!";
        }
        else if (aWinType == "Shotgun")
        {
            gameStateLastRound.innerHTML = aWinner + " wins using shotgun!";
        }
        else if (aWinType == "Shoot")
        {
            gameStateLastRound.innerHTML = aWinner + " wins by shooting!";
        }
        else
        {
            alert("This shouldn't happen"); //Debug purpose remove after;
        }


        buttonShoot.disabled = true;
        buttonReload.disabled = true;
        buttonBlock.disabled = true;
        buttonShotgun.disabled = true;

        buttonNewGame.style.display = "block";

    }

    this.SetPlayerButtonStates = function()
    {
        if (this.players[0].GetBullets() >= 3 && this.gameOver == false)
        {
            buttonShotgun.disabled = false;
        }
        else
        { 
            buttonShotgun.disabled = true;
        }

        if (this.players[0].GetBullets() > 0 && this.gameOver == false)
        {
            buttonShoot.disabled = false;
        }
        else
        { 
            buttonShoot.disabled = true;
        }
    }

    this.NewGame = function()
    {
        this.players[0].Reset();
        this.players[1].Reset();

        this.UpdateRoundActionTextForPlayer(0);
        this.UpdateRoundActionTextForPlayer(1);

        this.UpdateShotsTextForPlayer(0);
        this.UpdateShotsTextForPlayer(1);

        this.gameOver = false;

        buttonShoot.disabled = true;
        buttonReload.disabled = false;
        buttonBlock.disabled = false;
        buttonShotgun.disabled = true;
        buttonNewGame.style.display = "none";

        
        gameState.innerHTML = "Waiting for actions!";
        gameStateLastRound.innerText = "";

        this.numberOfTurns = 0;
        gameInfoTurn.innerHTML = '<span class="BoldText">Turn: </span>' + this.numberOfTurns;

        this.combatLog.Clear();
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

    this.SetBullets = function(aAmount)
    {
        bullets = aAmount;
    }

    this.BulletsIncrease = function()
    {
        bullets++;
    }

    this.BulletsDecrease = function()
    {
        bullets--;
    }

    this.Reset = function()
    {
        this.SetBullets(0);
        this.GetAction().Reset();
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

    this.Reset = function()
    {
        action = "None";
        actionAsNumber = -1;
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

function CombatLog()
{
    this.LogMessage = function(aName1, aAction1, aName2, aAction2)
    {
        var actionText = aName1 + " performed action " + aAction1 + "<br />" + aName2 + " performed action " + aAction2;
    
        var newParagraph = document.createElement("p");
        newParagraph.innerHTML = actionText;
    
        gameCombatLog.appendChild(newParagraph);
    }
    
    this.Clear = function()
    {
        while (gameCombatLog.hasChildNodes()) 
        {
            gameCombatLog.removeChild(gameCombatLog.lastChild);
        }
    }
}




function GetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}