$(document).ready(()=>{
	// BlackJack deal function
	// 	Create deck function
	// 	Shuffle deck function
	// 	Add card[0] and card[2] to player hand, 1 and 3 to dealer
	// 	Place card function
	// 	Push card onto player's array
	var gameStart = true;
	var gameOn = true;
	var playersHand = [];
	var dealersHand = [];
	var currentCardIndex = 0;
	// freshDeck is the return value of the function createDeck()
	const freshDeck = createDeck();
	// console.log(freshDeck);
	// Make a FULL copy of the freshDeck with slice, don't point at it.
	var theDeck = freshDeck.slice();
	// shuffleDeck();

	$('.deal-button').click(()=>{
		theDeck = freshDeck.slice();
		theDeck = shuffleDeck(theDeck);
		playersHand = [];
		dealersHand = [];
		$('.card').html('-');
		// console.log(theDeck);
		// Update the player and dealer hand arrays...
		// The player ALWAYS gets the first card in the deck.
		var topCard = theDeck.shift();
		playersHand.push(topCard);

		placeCard('player', 1, playersHand[0]);

		// var aceValue = aceCheck(topCard);
		// Give the dealer the next top card...
		topCard = theDeck.shift();
		dealersHand.push(topCard);
		placeCard('dealer', 1, dealersHand[0]);

		topCard = theDeck.shift();
		playersHand.push(topCard);

		placeCard('player', 2, playersHand[1]);
		// aceValue = aceCheck(topCard);

		topCard = theDeck.shift();
		dealersHand.push(topCard);
		placeCard('dealer', 2, dealersHand[1]);

		// console.log(playersHand);
		// console.log(dealersHand);
		// console.log(theDeck);

		// Call placeCard for each of the 4 cards:
		// arg 1. who
		// arg 2. where
		// arg 3. what (card to place in the DOM)
		
		
		

		// Figure the total and put it in the DOM.
		// arg 1. entire hand
		// arg 2. who

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');
	})

	$('.hit-button').click(()=>{
		// Get the top card.
		var topCard = theDeck.shift();
		// Push it onto the player's hand.
		playersHand.push(topCard);
		// Put the card in the DOM.
		placeCard('player', playersHand.length, topCard);
		// aceCheck(topCard);
		// Calculate the new total.
		calculateTotal(playersHand, 'player');
	})

	$('.stand-button').click(()=>{
		// What happens to the player's hand on stand? -- Nothing.
		// Control passes to the dealer.
		// Rules for the dealer:
		// 1. If I have less than 17..., I MUST hit.
		// 2. If I have 17 or more, I CANNOT hit (even if it means losing)
		var dealersTotal = calculateTotal(dealersHand, 'dealer');
		while(dealersTotal < 17){
			var topCard = theDeck.shift();
			dealersHand.push(topCard);
			placeCard('dealer', dealersHand.length, topCard);
			dealersTotal = calculateTotal(dealersHand, 'dealer');
		}
		checkWin();

	})

	// function aceCheck(theTopCard){
	// 	console.log(theTopCard);
	// 	console.log(Number(theTopCard.slice[0, -1]));
	// 	if(theTopCard.slice[0, -1] == "1"){
	// 		var aceValue = prompt("Oooh. It looks like you got an ace! Would you like that to be a 1 or 11?");
	// 	}
	// 	return aceValue;
	// }

	function checkWin(){
		var playersTotal = calculateTotal(playersHand, 'player');
		var dealersTotal = calculateTotal(dealersHand, 'dealer');

		// 1. If the player has > 21, player busts and loses.
		// 2. If the dealer has > 21, dealer busts and loses.
		// 3. If playersHand.length == 2 AND playersTotal == 21...BlackJack
		// 4. If dealerHand.length == 2 AND dealersTotal == 21...BlackJack
		// 5. If player > dealer, player wins
		// 6. If dealer > player, dealer wins
		// 7. else...push (tie)
	}

	function placeCard(who, where, whatToPlace){
		var classSelector = `.${who}-cards .card-${where}`;
		$(classSelector).html(`<img src="images/cards/${whatToPlace}.png" />`);
		// console.log("1");
	}

	function calculateTotal(hand, who){
		// purpose:
		// 1. Find out the number and return it.
		// 2. Update the DOM with the right number for the right player.
		// Initialize counter at 0.
		var handTotal = 0;
		// As we loop through the hand, we need a var for each card's value.
		var thisCardsValue = 0;
		for(let i = 0; i < hand.length; i++){
			// Copy onto thisCardsValue the entire sting, except for the last character (-1).
			// Then, convert it to a number.
			thisCardsValue = Number(hand[i].slice(0,-1));
			if(thisCardsValue > 10){
				thisCardsValue = 10;
			}
			if(who == 'player' && thisCardsValue == 1){
				var aceMessage = $('.message');
				// thisCardsValue = Number(prompt("Ooh. It looks like you got an ace. Would you like it to be 1 or 11 points?"));
				// aceMessage.html(`<form class="ace-value-submit">Oooh. You got an ace! Would you like it to be valued 1 or 11?<div><input type="radio" name="ace" id="ace-value-1" 
				// 	value="1"><label for="ace-value-1"> &nbsp1</label> &nbsp<input type="radio" name="ace" id="ace-value-11" value="11"/><label for="ace-value-11"> &nbsp11</label></div><div><input type="submit" value="Make that ace happen!"></div></form>`);
				aceMessage.html(`<form class="ace-value-submit">Oooh. You got an ace! Would you like it to be valued 1 or 11?<input type="text" class="" placeholder="Enter a 1 or 11.">
					<input type="submit" class="ace-value-submit" value="Make that ace happen!"></form>`);
				thisCardsValue = aceValueSubmit();
				
			}
			
			// if(thisCardsValue == 1){
			// 	thisCardsValue = valueOfAce;
			// }
			handTotal += thisCardsValue;
		}
		var classSelector = `.${who}-total`;
		$(classSelector).html(handTotal);
		// console.log("2");
		return handTotal;
	}

	function aceValueSubmit(){
		$('.ace-value-submit').click((event)=>{
			event.preventDefault();
			var aceValue = Number($('.message').val());
			if(aceValue == 1){
				thisCardsValue = 1;
			}else if(aceValue == 11){
				thisCardsValue = 11;
			}else{
				console.log("Not a proper value...");
			}
			return thisCardsValue;
		})
		
	}
	

	function createDeck(){
		var newDeck = [];
		const suits = ['h', 's', 'd', 'c'];
		for(let s = 0; s < suits.length; s++){ // or suits.map((s)=>{
			//})
			for(let c = 1; c <= 13; c++){
				newDeck.push(c + suits[s]);
			}
		}
		return newDeck;	
	}

	function shuffleDeck(aDeckToBeShuffled){
		for (let i = 0; i < 50000; i++){
			var rand1 = Math.floor(Math.random() * aDeckToBeShuffled.length);
			var rand2 = Math.floor(Math.random() * aDeckToBeShuffled.length);
		
			var card1Defender = aDeckToBeShuffled[rand1];
			aDeckToBeShuffled[rand1] = aDeckToBeShuffled[rand2];
			aDeckToBeShuffled[rand2] = card1Defender;

		}
		return aDeckToBeShuffled;
	}

	function dealCards(){
		while(currentCardIndex < 4){
			playersHand.push(theDeck[currentCardIndex]);
			currentCardIndex++;
			dealersHand.push(theDeck[currentCardIndex]);
			currentCardIndex++
		}
		// console.log(playersHand);
		// console.log(dealersHand);
	}
	

	function hitMe(){
		playersHand.push(theDeck[currentCardIndex]);
		currentCardIndex++;
		console.log("Hit me!" + currentCardIndex);
		dealersHand.push(theDeck[currentCardIndex]);
		currentCardIndex++;
		console.log("Hit me dealer" + currentCardIndex);
		console.log(playersHand);
		console.log(dealersHand);
	}







})