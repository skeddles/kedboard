const ROOT_FREQUENCY = 60;
const NAMES = ['whole', 'half', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
const COUNTS = [];
const PIANO_KEY_RATIOS = {
	"1:1": "c",
	"2:1": "c",
	"16:15": "c#",
	"9:8": "d",
	"6:5": "d#",
	"5:4": "e",
	"4:3": "f",
	"45:32": "f#",
	"3:2": "g",
	"8:5": "g#",
	"5:3": "a",
	"9:5": "a#",
	"15:8": "b"
};
 
//input config
const octavesInput = document.querySelector('input[name=octaves]');
if (octavesInput) octavesInput.value = 5;
const divisionsInput = document.querySelector('input[name=divisions]');
if (divisionsInput) divisionsInput.value = 5; 

//when either input changes, recreate the samboard
document.querySelector('input[name=octaves]').addEventListener('input', createSamboard);
document.querySelector('input[name=divisions]').addEventListener('input', createSamboard);


createSamboard();

function createSamboard () {
	const octaves = octavesInput.value;
	const largestDivisor = divisionsInput.value;

	document.querySelector('piano').innerHTML = '';

	let keysToAdd = [];
	for (var o = 0; o < octaves; o++) {
		for (let divisor = 1; divisor <= largestDivisor; divisor++) {
			keysToAdd.push({octave: o, divisor: divisor, instance: 1});
		    for (let instance = 2; instance < divisor; instance++) {
				//if the ratio can be simplified, don't add it
				if (divisor % instance === 0) continue;
		        keysToAdd.push({octave: o, divisor: divisor, instance: instance});
		    }
		}
	}

	//sort keys by octave then ratio
	keysToAdd.sort((a,b) => {
		if (b.divisor === 1) return 1;
		if (a.octave === b.octave) {
			return a.instance/a.divisor - b.instance/b.divisor;
		} else {
			return a.octave - b.octave;
		}
	});

	keysToAdd.forEach(key => addKey(key.octave, key.divisor, key.instance));
}

function freqFromRatio (o,a,b) {
	return ROOT_FREQUENCY * Math.pow(2, i) * (a/b);
}

function createKeyboard (rootFrequency, numKeys,) {
	for (var i = 0; i < numKeys; i++) {
		addKey(getFrequencyOfNote(i));
	}
}


/* 
ocatve - the current octave of the note
divisor - divide this octave into this many equal parts (2 = divide into halves, 3 = thirds, etc)
instance - the number of divisors to count (2 = 2nd quarter, 3 = 3rd quarter, etc) (this cant be equal or greater to the divisor, otherwise you're just entering a new octave)
*/
function addKey (octave, divisor, instance=1, rootFrequency=ROOT_FREQUENCY) {
	if (instance > divisor) throw 'instance cannot be greater than divisor';

	const ratio = divisor===1?1:((divisor+instance)/divisor);
	const octaveOffset = Math.pow(2, octave);
	const frequency = ROOT_FREQUENCY * octaveOffset * ratio;

	var key = document.createElement('key');
	const keyText = `
		oct ${octave} <br/>
		${instance}/${divisor} <br/>
		${ratio.toFixed(2)} <br/>
		${frequency.toFixed(0)}Hz <br/>
		${PIANO_KEY_RATIOS[(divisor+instance)+":"+divisor]||''} <br/>
	`;
	key.innerHTML = keyText;
	key.className = 'd'+divisor;
	key.frequency = frequency;
	key.octave = octave;

	document.querySelector('piano').appendChild(key);
}

//add event listener to left click for all elements 
document.addEventListener('click', function (event) {
	if (event.target.closest('piano')) {
		if (event.target.tagName === 'KEY') {
			var index = Array.from(event.target.parentNode.children).indexOf(event.target);
			playTone(event.target.frequency);
			log('Key pressed: ', index, event.target.frequency);
		} 
	} 
});

function getFrequencyOfNote (note) {
	return ROOT_FREQUENCY * Math.pow(2, note / 12);
}

function playTone(frequency) {
    var audioContext = new AudioContext();
    var oscillator = audioContext.createOscillator();
    var gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    // Start with full volume
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    // Fade out over 100 milliseconds 
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

    setTimeout(function () {
        oscillator.stop();
    }, 1000);
} 

function log () {
	console.log(...arguments);
	document.querySelector('log').innerHTML += '<div>' + Array.from(arguments).join(' ') + '</div>';
}	

log('piano started');


keyboardLetters = [
	['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
	['a','s','d','f','g','h','j','k','l',';','\''],
	['z','x','c','v','b','n','m',',','.','/']
];

const pressedKeys = new Set();

const KEYBOARD_OCTAVE_OFFSET = 1;

document.addEventListener('keydown', function (event) {
    const letterPressed = event.key.toLowerCase();
    if (pressedKeys.has(letterPressed)) return; // If the key is already pressed, do nothing
    pressedKeys.add(letterPressed); // Add the key to the set

	const key = getKeyElementFromKeyboardKey(letterPressed);
	if (!key) return;

    playTone(key.frequency);
	key.classList.add('playing');
	setTimeout(() => key.classList.remove('playing'), 250);
});

document.addEventListener('keyup', function (event) {
    const letterReleased = event.key.toLowerCase();
    pressedKeys.delete(letterReleased); // Remove the key from the set
});

function getKeyElementFromKeyboardKey (keyboardKey) {
    const letterRow = keyboardLetters.findIndex(row => row.includes(keyboardKey));
    if (letterRow === -1) return;
    const letterIndex = keyboardLetters[letterRow].indexOf(keyboardKey);
    const pianoKeys = Array.from(document.querySelector('piano').children);
    const octaveKeyIndex = pianoKeys.findIndex(key => key.octave-KEYBOARD_OCTAVE_OFFSET === letterRow && key.className === 'd1');
    const keyIndex = octaveKeyIndex + letterIndex;
    const key = pianoKeys[keyIndex]; 
	return key; 
}

