import emailjs from 'emailjs-com';

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

/**
 * Unpack a Firebase QuerySnapshot and extract its documents
 * @param {firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>} snapshot - the query result
 * @returns {firebase.firestore.DocumentData[]} an array of Firestore documents, 
 * each injected with the field `id`, equivalent to `docid`
 */
function mapSnapshotToDocs (snapshot) {
	const data = [];
	snapshot.forEach((doc) => {
		if (doc.exists) {
			const temp = doc.data();
			temp.id = doc.id;
			data.push(temp);
		}
	});
	return data;
}

/**
 * Sends an email to notify of a proposed change to a listform
 * @param docId - document id as assigned in Firebase
 * @param originalName - the original name of the store in the listing
 * @param actionWord - the proposed change made to the listing
 * @param listformFields - listform fields with proposed edits
 */
async function sendEmailToUpdateListing(docId, originalName, actionWord, listformFields) {
	const EMAIL_API_KEY = `${process.env.REACT_APP_EMAIL_API_KEY}`;
	const email_params = {
		listing_id: docId,
		listing_name: originalName,
		action_word: actionWord,
	}

	if (actionWord === "edit") {
		email_params['description'] = "A user has requested to edit this listing to:";
		email_params['message'] = JSON.stringify(listformFields, null, 2);
	} else if (actionWord === "delete") {
		email_params['description'] = "A user has reqeusted to delete this listing.";
	}

	await emailjs.send('outlook', 'contact_form', email_params, EMAIL_API_KEY)
		.then((result) => {
			console.log(result);
			return result;
		}, (error) => {
			console.log(error);
			return error;
		});
}

export default {
	compareString,
	capitalizeFirstLetter,
	mapSnapshotToDocs,
	sendEmailToUpdateListing
}