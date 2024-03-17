// Generate a random number between 1 and 20
const low_limit = 1;
const high_limit = 20;
const random_number = Math.floor(Math.random() * high_limit) + low_limit;

// Initializing constants
const max_attempts = 3;

// Initializing variables
let attempts = 0;

// Guessing numbers process
do {
	// Load user input via prompt
	let user_input = prompt(`Tipněte si číslo v rozsahu od ${low_limit} do ${high_limit}:`);
	
	// Validation of user input
	if (user_input === null) {
		break;
	} else if (user_input === "") {
		alert(`Prosím, zadejte neprázdný vstup.`);
	} else {
		// Parse user input
		let guess_number = parseInt(user_input);
		
		// Validation of parsed value
		if (isNaN(guess_number)) {
			alert(`Prosím, zadejte vstup jako platné číslo.`);
		} else if (guess_number < low_limit || guess_number > high_limit) {
			alert(`Prosím, zadejte číslo z platného rozsahu (${low_limit} - ${high_limit}).`);
		} else {
			attempts++;
			
			// Validation of numbers
			if (guess_number === random_number) {
				alert(`Gratuluji vyhrál jste!\nHledané číslo ${random_number} bylo uhodnuto na ${attempts}. pokus.`);
				break;
			} else {
				if (max_attempts === attempts) {
					alert(`Byly vyčerpány všechny pokusy na tipování!\nHledané číslo bylo ${random_number}.`);
				} else {
					alert(`Tipnuté číslo se neshoduje s hledaným!\nZbývajících pokusů: ${max_attempts - attempts}`);
				}
			}
		}
	}
} while (attempts < max_attempts);
