/**
 * compare two values and returns true if match else false
 * @param str1
 * @param str2
 */
export function cmpStr (str1, str2) {
	if (typeof str1 !== typeof undefined && typeof str2 !== typeof undefined) {
		if (String(str1).toLowerCase() === String(str2).toLowerCase()) {
			return true;
		}
	}
	return false;
}

/**
 * capitalize all first letters of sentence
 * @param str
 * @returns {string}
 */
export function ucFirstAllWords (str) {
	var pieces = str.split(" ");
	for (var i = 0; i < pieces.length; i++) {
		var j = pieces[i].charAt(0).toUpperCase();
		pieces[i] = j + pieces[i].substr(1);
	}
	return pieces.join(" ");
}
