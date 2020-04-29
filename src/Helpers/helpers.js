/**
 * compare two values and returns true if match else false
 * @param str1
 * @param str2
 */
function compareString (str1, str2) {
	if (typeof str1 !== typeof undefined && typeof str2 !== typeof undefined) {
		if (String(str1).toLowerCase() === String(str2).toLowerCase()) {
			return true;
		}
	}
	return false;
}

/**
 * capitalize all first letters of sentence
 * @param words
 * @returns {string}
 */
function capitalizeFirstLetter (sentence) {
	const words = sentence.split(" ");
	for (var i = 0; i < words.length; i++) {
		var j = words[i].charAt(0).toUpperCase();
		words[i] = j + words[i].substr(1);
	}
	return words.join(" ");
}


export default {
	compareString,
	capitalizeFirstLetter
}