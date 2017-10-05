$(document).ready(()=>{
	// BlackJack deal function
	// 	Create deck function
	// 	Shuffle deck function
	// 	Add card[0] and card[2] to player hand, 1 and 3 to dealer
	// 	Place card function
	// 	Push card onto player's array

	var playersHand = [];
	var dealersHand = [];
	// freshDeck is the return value of the function createDeck()
	const freshDeck = createDeck();
	console.log(freshDeck);
	// Make a FULL copy of the freshDeck with slice, don't point at it.
	var theDeck = freshDeck.slice();
	shuffleDeck();

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

	function shuffleDeck(){
		// Loop. A lot. Like those machines in casinos.
		// Each time through the loop, we will switch 2 indices (cards).
		// When the loop (lots of times) is done, the array (deck)
		// will be shuffled.
		for (let i = 0; i < 50000; i++){
			var rand1 = Math.floor(Math.random() * theDeck.length);
			var rand2 = Math.floor(Math.random() * theDeck.length);
			// Switch theDeck[rand1] with theDeck[rand2].
			// Stash the value of theDeck[rand1] inside card1Defender so
			// we can get back to overwriting theDeck[rand1] with theDeck[rand2].
			var card1Defender = theDeck[rand1];
			theDeck[rand1] = theDeck[rand2];
			theDeck[rand2] = card1Defender;

		}
		console.log(theDeck);
	}









})