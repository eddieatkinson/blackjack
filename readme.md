# BlackJack Game
## Overview
This is the classic card game Blackjack 21, and includes the ability to bet, hit, stand, split, and double down.

## Github Link:
[Blackjack 21](http://github.com/eddieatkinson/blackjack)

## Technologies used:
**Languages:**
* JavaScript
* HTML5
* CSS

**Frameworks:**
* jQuery
* Bootstrap

## Code snippets:
Ability to double down...
``` javascript
    $('.double-down').click(()=>{ // If we click on it...
        if(initialMoney - (2 * wagerTotal) >= 0){
            doubleDown = true;
            $('.deal-button').prop('disabled', true); // No more dealing
            $('.stand-button').prop('disabled', true); // We must take another card
            $('.message').html("You have chosen to double down. You must take exactly one more card (hit it!).")
            increaseWager(wagerTotal, wagerTotal);
            wagerTotal = 2 * wagerTotal;
            return wagerTotal;
        }else{
            $('.message').html("You do not have sufficient funds to double down!");
        }
    })
```
and split...
``` javascript
    $('.split').click(()=>{
        $('.split').hide();
        $('.split-hit-button1').prop('disabled', false);
        $('.split-stand-button1').prop('disabled', false);
        $('.split-player-cards').show();
        $('.split-message').show();
        $('.split-btn').show();
        $('.the-buttons').hide();
        $('.split-hit-button2').prop('disabled', true);
        $('.split-stand-button2').prop('disabled', true);
        isSplit = true;
        increaseWager(wagerTotal, wagerTotal);
        wagerTotal = 2 * wagerTotal;
        split();
    });

    function split(){
        placeCard('player', 1, playersHand[1]);
        playersHandSplit.push(playersHand.shift());
        calculateTotal(playersHand, 'player');
        calculateTotal(playersHandSplit, 'split');
        $('.player-cards .card-2').html("");
    }

    function checkSplitWin(){
        if(calculateTotal(dealersHand, 'dealer') <= 21){
            if(calculateTotal(dealersHand, 'dealer') > calculateTotal(playersHand, 'player')){
                wonFirstHand = false;
                pushFirstHand = false;
            }else if(calculateTotal(dealersHand, 'dealer') == calculateTotal(playersHand, 'player')){
                pushFirstHand = true;
                wonFirstHand = false;
            }else if(calculateTotal(dealersHand, 'dealer') < calculateTotal(playersHand, 'player') && !firstHandBust){
                wonFirstHand = true;
                pushFirstHand = false;
            }
            if(calculateTotal(dealersHand, 'dealer') > calculateTotal(playersHandSplit, 'split')){
                wonSecondHand = false;
                pushSecondHand = false;
            }else if(calculateTotal(dealersHand, 'dealer') == calculateTotal(playersHandSplit, 'split')){
                pushSecondHand = true;
                wonSecondHand = false;
            }else if(calculateTotal(dealersHand, 'dealer') < calculateTotal(playersHandSplit, 'split') && !secondHandBust){
                wonSecondHand = true;
                pushSecondHand = false;
            }
        }else{
            $('message').html("The dealer busted!");
            wonSecondHand = true;
            pushFirstHand = false;
            pushSecondHand = false;
        }
        if(wonFirstHand && wonSecondHand){
            $('.message').html('You won both of your hands!');
            winGame();
        }else if(!wonFirstHand && !wonSecondHand){
            $('.message').html('You lost both of your hands!');
            lostGame();
        }else if((pushFirstHand && !wonSecondHand) || (!wonFirstHand && pushSecondHand)){
            $('.message').html('You lost one hand and tied the other!');
            losePush();
        }else if((wonFirstHand && !wonSecondHand) || (!wonFirstHand && wonSecondHand)){
            $('.message').html('You won one of your hands, but tragically lost the other!');
            push();
        }else if(pushFirstHand && pushSecondHand){
            $('.message').html('You tied both of your hands!');
            push();
        }else if((pushFirstHand && wonSecondHand) || (wonFirstHand && pushSecondHand)){
            $('.message').html('You won one of your hands, and tied the other!');
            winPush();
        }
    }

    $('.split-hit-button1').click(()=>{
        isSplit = false;
        if(calculateTotal(playersHand, 'player') < 21){
            var topCard = theDeck.shift();
            playersHand.push(topCard);
            placeCard('player', playersHand.length, topCard);
            calculateTotal(playersHand, 'player');
        }
        if(calculateTotal(playersHand, 'player') > 21){
            var classSelector = '.message';
            $(classSelector).html('You have busted with your first hand!');
            wonFirstHand = false;
            firstHandBust = true;
            // lostGame();
            $('.split-hit-button1').prop('disabled', true);
            $('.split-stand-button1').prop('disabled', true);
            $('.split-hit-button2').prop('disabled', false);
            $('.split-stand-button2').prop('disabled', false);

        }
        if(doubleDown){
            $('.hit-button').prop('disabled', true);
            $('.dealer-total').show();
            $('.hit-button').prop('disabled', true); // Player cannot hit anymore.
            placeCard('dealer', 2, dealersHand[1]);
            var dealerTotal = calculateTotal(dealersHand, 'dealer');
            while(dealerTotal < 17){
                var topCard = theDeck.shift();
                dealersHand.push(topCard);
                placeCard('dealer', dealersHand.length, topCard);
                dealerTotal = calculateTotal(dealersHand, 'dealer');
            }
            checkSplitWin();
        }
    });

    $('.split-hit-button2').click(()=>{
        isSplit = true;
        if(calculateTotal(playersHandSplit, 'split') < 21){
            var topCard = theDeck.shift();
            playersHandSplit.push(topCard);
            placeCard('player', playersHandSplit.length, topCard);
            calculateTotal(playersHandSplit, 'split');
        }
        if(calculateTotal(playersHandSplit, 'split') > 21){
            var classSelector = '.message';
            $(classSelector).html('You have busted with your second hand.');
            wonSecondHand = false;
            secondHandBust = true;
            if(firstHandBust){ // Lost both hands...
                $(classSelector).html('You have lost the game.');
                dealAfterSplit();
                lostGame();
            }else{
                checkSplitWin();
            }
        }
        if(doubleDown){
            $('.hit-button').prop('disabled', true);
            $('.dealer-total').show();
            $('.hit-button').prop('disabled', true); // Player cannot hit anymore.
            placeCard('dealer', 2, dealersHand[1]);
            var dealerTotal = calculateTotal(dealersHand, 'dealer');
            while(dealerTotal < 17){
                var topCard = theDeck.shift();
                dealersHand.push(topCard);
                placeCard('dealer', dealersHand.length, topCard);
                dealerTotal = calculateTotal(dealersHand, 'dealer');
            }
            checkSplitWin();
        }
    });

    $('.split-stand-button1').click(()=>{
        $('.double-down').hide();
        $('.split-hit-button1').prop('disabled', true); // Player cannot hit anymore.
        $('.split-stand-button1').prop('disabled', true);
        $('.split-hit-button2').prop('disabled', false);
        $('.split-stand-button2').prop('disabled', false);
    });

    $('.split-stand-button2').click(()=>{
        isSplit = false;
        $('.double-down').hide();
        $('.dealer-total').show();
        $('.split-hit-button2').prop('disabled', true); // Player cannot hit anymore.
        placeCard('dealer', 2, dealersHand[1]);
        var dealerTotal = calculateTotal(dealersHand, 'dealer');
        while(dealerTotal < 17){
            var topCard = theDeck.shift();
            dealersHand.push(topCard);
            placeCard('dealer', dealersHand.length, topCard);
            dealerTotal = calculateTotal(dealersHand, 'dealer');
        }
        checkSplitWin();
    });
```

## Screenshots:
![Gameplay]()

## URL:
[Blackjack 21](http://eddiebatkinson.com/blackjack)