function ShotGunGame()
{
    this.combatLog = new Array();
    this.player = new Player("Player");
    this.computer = new Player("Computer");
    //this.playerTurn = "1";


    this.GetComputerMove = function()
    {
        return getRandomInt(0, 2);
    }

}


function Player(name)
{
    this.name = name;
    this.action = new Action();
    this.bullets = 0;

    this.GetAction = function()
    {
        return this.action;
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
    this.action = "None";
    this.actionAsInt = -1;
}


function LogMessage()
{
    this.player = "";
    this.action = "";
}

function GetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}