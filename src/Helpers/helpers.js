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
 * @param doc_id - document id as assigned in Firebase
 * @param listform_fields - listform fields with proposed updates
 */
async function sendEmailToUpdateListing(doc_id, originalName, listform_fields) {
	const EMAIL_API_KEY = 'user_VLX3sOLJCtcJAQ7SKiVLe'//`${process.env.REACT_APP_EMAIL_API_KEY}`;
	const email_params = {
		listing_id: doc_id,
		listing_name: originalName,
		message: JSON.stringify(listform_fields, null, 2),
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