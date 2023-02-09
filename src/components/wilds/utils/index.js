export function safeScale(number, inMax, outMin, outMax) {
	let scaled = (number * (outMax - outMin)) / inMax + outMin;
	return scaled > outMax ? outMax : scaled;
}

export function calculateChange(start, end, def, baseDefence) {
	let change = end - start;
	let scaledDefence = safeScale(def, 1600, 50, 150);
	return (change * 1000) / scaledDefence / baseDefence;
}
