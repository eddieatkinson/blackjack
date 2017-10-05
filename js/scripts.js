$(document).ready(()=>{
	// BlackJack deal function
	// 	Create deck function
	// 	Shuffle deck function
	// 	Add card[0] and card[2] to player hand, 1 and 3 to dealer
	// 	Place card function
	// 	Push card onto player's array
	var gameStart = true
	var playersHand = [];
	var dealersHand = [];
	var currentCardIndex = 0;
	// freshDeck is the return value of the function createDeck()
	const freshDeck = createDeck();
	console.log(freshDeck);
	// Make a FULL copy of the freshDeck with slice, don't point at it.
	var theDeck = freshDeck.slice();
	// shuffleDeck();

	$('.deal-button').click(()=>{
		theDeck = freshDeck.slice();
		theDeck = shuffleDeck(theDeck);
		console.log(theDeck);
		// Update the player and dealer hand arrays...
		// The player ALWAYS gets the first card in the deck.
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		// Give the dealer the next top card...
		topCard = theDeck.shift();
		dealersHand.push(topCard);

		topCard = theDeck.shift();
		playersHand.push(topCard);

		topCard = theDeck.shift();
		dealersHand.push(topCard);

		console.log(playersHand);
		console.log(dealersHand);
		console.log(theDeck);

		placeCard('player', 1, playersHand[0]);
		placeCard('dealer', 1, dealersHand[0]);
		placeCard('player', 2, playersHand[1]);
		placeCard('dealer', 2, dealersHand[1]);

		// if(gameStart){
		// 	dealCards();
		// 	gameStart = false;
		// }
	})

	$('.hit-button').click(()=>{
		if(!gameStart){
			console.log(currentCardIndex);
			hitMe();
		}
	})

	$('.stand-button').click(()=>{
		
	})

	function placeCard(who, where, whatToPlace){
		var classSelector = `.${who}-cards .card-${where}`;
		$(classSelector).html(`<img src="images/cards/${whatToPlace}.png" />`);
	}

	function createDeck(){
		var newDeck = [];
		// card = suite + value
		// suits is a constant, it cannot be reassigned
		const suits = ['h', 's', 'd', 'c'];
		// outer loop for suit
		for(let s = 0; s < suits.length; s++){ // or suits.map((s)=>{
			//})
		// 	 inner loop for value
			for(let c = 1; c <= 13; c++){
				newDeck.push(c + suits[s]);
			}
		}
		// console.log(newDeck);
		return newDeck;	
	}

	function shuffleDeck(aDeckToBeShuffled){
		// Loop. A lot. Like those machines in casinos.
		// Each time through the loop, we will switch 2 indices (cards).
		// When the loop (lots of times) is done, the array (deck)
		// will be shuffled.
		for (let i = 0; i < 50000; i++){
			var rand1 = Math.floor(Math.random() * aDeckToBeShuffled.length);
			var rand2 = Math.floor(Math.random() * aDeckToBeShuffled.length);
			// Switch theDeck[rand1] with theDeck[rand2].
			// Stash the value of theDeck[rand1] inside card1Defender so
			// we can get back to overwriting theDeck[rand1] with theDeck[rand2].
			var card1Defender = aDeckToBeShuffled[rand1];
			aDeckToBeShuffled[rand1] = aDeckToBeShuffled[rand2];
			aDeckToBeShuffled[rand2] = card1Defender;

		}
		// console.log(theDeck);
		return aDeckToBeShuffled;
	}

	function dealCards(){
		// let i = 0;
		while(currentCardIndex < 4){
			playersHand.push(theDeck[currentCardIndex]);
			currentCardIndex++;
			dealersHand.push(theDeck[currentCardIndex]);
			currentCardIndex++
		}
		console.log(playersHand);
		console.log(dealersHand);
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