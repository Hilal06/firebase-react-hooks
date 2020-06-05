import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-database'

const config = {
	apiKey: "AIzaSyDMxa2IHdsjDc4RmVQodVdhqcSiWI8YszM",
	authDomain: "my-shop-fad4a.firebaseapp.com",
	databaseURL: "https://my-shop-fad4a.firebaseio.com",
	projectId: "my-shop-fad4a",
	storageBucket: "my-shop-fad4a.appspot.com",
	messagingSenderId: "1036362343778",
	appId: "1:1036362343778:web:b795f2030911ae283ef83b",
	measurementId: "G-S161K4TZMK"
}

class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()

		this.rdb = app.database()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	// addQuote(quote) {
	// 	if(!this.auth.currentUser) {
	// 		return alert('Not authorized')
	// 	}

	// 	return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
	// 		quote
	// 	})
	// }

	addQuote(myquote) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}
		return this.rdb.ref('users/'+this.auth.currentUser.uid).set({
			quote: myquote
		})
	}


	addNote(newTitle, newContent) {
		const date = new Date()
		if (!this.auth.currentUser) {
			return alert('Not authorized')
		}
		return this.rdb.ref('users/'+this.auth.currentUser.uid+'/Notes').push().set(
			{
				title: newTitle,
				date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`.toString(),
				content: newContent,
			}
		)
		
	}

	updateNote(NoteID, newTitle, newContent) {
		if (!this.auth.currentUser) {
			return alert('Not authorized')
		}
		return this.rdb.ref('users/'+this.auth.currentUser.uid+'/Notes'+NoteID).update(
			{
				title: newTitle,
				content: newContent,
			}
		)
	}

	async getNotes() {
		let data = []
		await this.rdb.ref(`users/${this.auth.currentUser.uid}/Notes`)
		.orderByKey()
		.once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				data.push({id: childSnapshot.key, note: childSnapshot.val()})
			})
		})
		return data
	}
	
	deleteNote(note_id) {
		if (!this.auth.currentUser) {
			return alert('Not authorized')
		}
		return this.rdb.ref('users/'+this.auth.currentUser.uid+'/Notes')
		.child(note_id)
		.remove()
		.catch(err => {
			console.log(err.message)
		})
	}


	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	// async getCurrentUserQuote() {
	// 	const quote = await this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).get()
	// 	return quote.get('quote')
	// }

	async getCurrentUserQuote() {
		const quote = await this.rdb.ref(`users/${this.auth.currentUser.uid}`).once('value')
		return quote.child('quote').val()
	}
}

export default new Firebase()