$(document).ready(()=>{

	const freshDeck = createDeck();
	var theDeck = [];
	var playersHand = [];
	var dealersHand = [];
	var wagerTotal = 0;
	var initialMoney = 100;
	var doubleDown = true;
	$('.deal-button').prop('disabled', true); // Make sure you place bet before dealing.
	$('.hit-button').prop('disabled', true);
	$('.stand-button').prop('disabled', true);
	$('.double-down').hide();

	$('.one-dollar').click(()=>{
		wagerTotal = increaseWager(wagerTotal, 1);
		canIPlay();
		console.log(wagerTotal);
	})

	$('.five-dollar').click(()=>{
		wagerTotal = increaseWager(wagerTotal, 5);
		canIPlay();
		console.log(wagerTotal);
	})

	$('.ten-dollar').click(()=>{
		wagerTotal = increaseWager(wagerTotal, 10);
		canIPlay();
		console.log(wagerTotal);
	})

	function canIPlay(){ // Have you met the minimum bet?
		if(wagerTotal < 5){
			$('.deal-button').prop('disabled', true);
			$('.hit-button').prop('disabled', true);
			$('.stand-button').prop('disabled', true);
		}else{
			$('.deal-button').prop('disabled', false);
		}
	}

	$('.deal-button').click(()=>{
		$('.double-down').show();

		$('.message').html('Welcome to BlackJack! Please place your initial bets, with a minimum bet of 5 dollars. Good luck!');

		$('.hit-button').prop('disabled', false); // To undo when we did 'stand' previously.

		$('.stand-button').prop('disabled', false);

		$('.card').html(''); // Reset the card images.

		playersHand = []; // So we clear out the hand.
		dealersHand = [];

		var newDeck = freshDeck.slice(); // Slice, so we're not just pointing at it.
		theDeck = shuffleDeck(newDeck);

		var topCard = theDeck.shift();
		playersHand.push('5d');
		placeCard('player', 1, playersHand[0]);

		topCard = theDeck.shift();
		dealersHand.push('10d');
		placeCard('dealer', 1, dealersHand[0]);

		topCard = theDeck.shift();
		playersHand.push('5d');
		placeCard('player', 2, playersHand[1]);

		topCard = theDeck.shift();
		dealersHand.push('7d');
		$('.dealer-cards .card-2').html('<img src="images/cards/deck.png" />');

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');

		// if(calculateTotal(dealersHand, 'dealer') == 21 && calculateTotal(playersHand, 'player') != 21){
		// 	$('.message').html("The dealer has BlackJack. You lose!");
		// 	lostGame();
		if(calculateTotal(dealersHand, 'dealer') != 21 && calculateTotal(playersHand, 'player') == 21){
			$('.message').html("BlackJack! You win!");
			blackJack();
		}

		$('.dealer-total').hide();

	});

	$('.double-down').click(()=>{
		$('.deal-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
		$('.message').html("You have chosen to double down. You must take exactly one more card (hit it!).")
		increaseWager(wagerTotal, wagerTotal);
		wagerTotal = 2 * wagerTotal;
		return wagerTotal;
	})

	function increaseWager(currentWager, amountToIncrease){
		currentWager += amountToIncrease;
		var classSelector = ('.wager-total');
		$(classSelector).html(currentWager);
		initialMoney -= amountToIncrease;
		var classSelector2 = ('.amount-left');
		$(classSelector2).html(initialMoney);
		return currentWager;
	}

	function calculateTotal(hand, who){ // hand = the array with cards to total up, who = which section of the DOM to change
		var handTotal = 0;
		var thisCardTotal = 0;
		var hasAce = false;
		var totalAces = 0;
		for(let i = 0; i < hand.length; i++){
			thisCardTotal = Number(hand[i].slice(0, -1));

			if(thisCardTotal == 1){ // This is an ace.
				hasAce = true;
				thisCardTotal = 11;
				totalAces++; // In case we want to be able to split.
			}else if(thisCardTotal > 10){ // You have a facecard...reset value to 10.
				thisCardTotal = 10;
			}

			handTotal += thisCardTotal;
		}

		for(let i = 0; i < totalAces; i++){
			if(handTotal > 21){ // If we have busted but have an ace.
				handTotal -= 10;
			}
		}

		var classSelector = `.${who}-total`;
		$(classSelector).html(handTotal);
		return handTotal;
	}

	function placeCard(who, where, card){
		var classSelector = `.${who}-cards .card-${where}`;
		$(classSelector).html(`<img src="images/cards/${card}.png" />`);
	}

	$('.hit-button').click(()=>{
		$('.stand-button').prop('disabled', false);
		$('.double-down').hide();
		if(calculateTotal(playersHand, 'player') < 21){
			var topCard = theDeck.shift();
			playersHand.push('1d');
			placeCard('player', playersHand.length, topCard);
			calculateTotal(playersHand, 'player');
		}
		if(calculateTotal(playersHand, 'player') > 21){
			var classSelector = '.message';
			$(classSelector).html('You have busted!');
			lostGame();
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
			checkWin();
		}
	});

	$('.stand-button').click(()=>{
		$('.double-down').hide();
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
		checkWin();
	});

	function createDeck(){
		var newDeck = [];
		const suits = ['h', 's', 'd', 'c'];
		for(let s = 0; s < suits.length; s++){
			for(let c = 1; c <= 13; c++){ // Start at 1 because of how we named our images.
				newDeck.push(c + suits[s]);
			}
		}
		return newDeck;
	}

	function shuffleDeck(arrayToBeShuffled){
		for(let i = 0; i < 50000; i++){
			var rand1 = Math.floor(Math.random() * arrayToBeShuffled.length);
			var rand2 = Math.floor(Math.random() * arrayToBeShuffled.length);
			var saveValueOfCard1 = arrayToBeShuffled[rand1]; // So we don't overwrite it on the next line.
			arrayToBeShuffled[rand1] = arrayToBeShuffled[rand2];
			arrayToBeShuffled[rand2] = saveValueOfCard1;
		}
		return arrayToBeShuffled;
	}

	function checkWin(){
		if(calculateTotal(dealersHand, 'dealer') <= 21){
			if(calculateTotal(dealersHand, 'dealer') > calculateTotal(playersHand, 'player')){
				$('.message').html('You have lost!');
				lostGame();
			}else if(calculateTotal(dealersHand, 'dealer') == calculateTotal(playersHand, 'player')){
				$('.message').html('You have tied!');
				push();
			}else{
				$('.message').html('You have won!');
				winGame();
			}
		}else{
			$('.message').html('You have won!');
			winGame();
		}
	}

	function split(){

	}

	function lostGame(){
		wagerTotal = 0;
		increaseWager(0, 0);
		$('.deal-button').prop('disabled', true);
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}

	function push(){
		initialMoney += wagerTotal;
		wagerTotal = 0;
		increaseWager(0, 0);
		$('.deal-button').prop('disabled', true);
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}

	function winGame(){
		initialMoney += 2 * wagerTotal;
		wagerTotal = 0;
		increaseWager(0, 0);
		$('.deal-button').prop('disabled', true);
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}

	function blackJack(){
		initialMoney += Math.floor(2.5 * wagerTotal);
		wagerTotal = 0;
		increaseWager(0, 0);
		$('.deal-button').prop('disabled', true);
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}

});