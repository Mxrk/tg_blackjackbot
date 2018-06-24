const Telegraf = require('telegraf')
const {token} = require('./config')

const bot = new Telegraf(token)

var dealer = [];
var dealerP = 0;
var player = [];
var playerP = 0;
var cards = []

var playerCards = ""
var dealerCards = ""
var gamestart = 0;
var running = false;

bot.use((ctx, next) => {
    const start = new Date()
    return next(ctx).then(() => {
        const ms = new Date() - start
        console.log('Response time %sms', ms)

    })
})

bot.catch((err) => {
    console.log('Error: ', err)
})

bot.command('start', (ctx) => {
    if (gamestart === 1) {
        ctx.reply("Cooldown")
    }
    ctx.reply('The game will start now!');
    setup();
    gamestart = 1;
    running = true;
    shuffle(cards)
    var x = cards.pop()
    var y = cards.pop()
    player.push(x,y)
    for (var i = 0, len = player.length; i < len; i++) {
        playerCards += `${player[i].face} of ${player[i].suit} \n`
    }
    counterP(`${player[0].face}`)
    counterP(`${player[1].face}`)
    ctx.reply(playerCards + `Your value is ${playerP}`)
.then(() => {
    var x = cards.pop()
    var y = cards.pop()
    dealer.push(x,y)
    for (var i = 0, len = dealer.length; i < len; i++) {
        dealerCards += `${dealer[i].face} of ${dealer[i].suit} \n`
    };
    counterD(`${dealer[0].face}`)
    counterD(`${dealer[1].face}`)
}).then(() => {
    ctx.reply(dealerCards + `Dealer value is ${dealerP}`)
}).then(() => {
    checkWin(ctx);
})
})


bot.command('/hit', (ctx) => {
    if(running === false){
        ctx.reply('You have to start a game. Use /start')
        
    }else {
        var x = cards.pop()
        // console.log(player)
        player.push(x)
        // console.log(player)
        playerCards = ""
        playerP = 0;
        for (var i = 0, len = player.length; i < len; i++) {
            playerCards += `${player[i].face} of ${player[i].suit} \n`
            // console.log("Face : " + player[i].face)
            counterP(player[i].face)
    
            // console.log(playerP)
        }
        ctx.reply(playerCards + `Your value is ${playerP}`)
        .then(() => {
    
        checkWin(ctx)
        })
    }
  
})


bot.command('/stand', (ctx) => {
    if (dealerP < 21){
        var x = cards.pop()
        dealer.push(x)
        ctx.reply('new card')
    }
    checkWin(ctx);
})


// // // function getCard() {
//     for (var i = playerC; i < playerC; i++) {
// //     ${player[i].face}
// //     ${player[i].suit}
//          playerC++
// // // }}

function checkWin(ctx){
    if (playerP === 21){
        ctx.reply('You won! \n restart with /start')
        reset();
    }

    if (playerP > 21) {
        ctx.reply('lost, Dealer won \n restart with /start')
        reset();
    }
    if (dealerP === 21){
        ctx.reply('Dealer won \n restart with /start' )
        reset(); 
    }

}
function reset(){
    dealer = [];
    dealerP = 0;
    player = [];
    playerP = 0;
    playerCards = ""
    dealerCards = ""
    running = false;  
}

function counterP(value) {
    //console.log("value : "+ value)
    if (value === 'Jack' || value === 'Queen' || value === 'King'){
        playerP += 10
    }else if(value === 'Ace' && playerP < 11) {
        playerP += 11
    }else if(value === 'Ace'){
        playerP += 1
    }
    else {
    playerP += parseInt(value,10 );
}}

function counterD(value) {
    if (value === 'Jack' || value === 'Queen' || value === 'King'){
        dealerP += 10
    }else if(value === 'Ace' && dealerP < 11) {
        dealerP += 11
    }else if(value === 'Ace'){
        dealerP += 1
    }
    else {
    dealerP += parseInt(value,10 );
}}

function setup() {
    reset();
    cards = []
    var suit = [ 'Hearts', 'Spades', 'Diamonds', 'Clubs' ];
for (var a in suit) {
    var face = [ 'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King' ];
    for (var b in face) {
        cards.push({"face": face[b], "suit": suit[a]});
    }
}
gamestart = 0;
}

function shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  //  console.log(cards) after shuffle
}

bot.startPolling()