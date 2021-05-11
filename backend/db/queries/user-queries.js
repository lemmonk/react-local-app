const db = require('../../lib/db.js');
const bcrypt = require('bcrypt');

const getUsers = () => {
	
	const text = `
	SELECT *
	FROM users;`;

	return db
		.query(text)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at users queries 'getUsers'`, err));
};

const createUser = (values) => {
	
const text = `
INSERT INTO users
(first_name, last_name, email, phone, public_key, secret_key, uid, password) 
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;`;

return db.query(text, values)
.then((res) => {

	const profile = {
		public_key: res.rows[0].public_key,
		host: res.rows[0].host,
		image: res.rows[0].image,
		first_name: res.rows[0].first_name,
		last_name: res.rows[0].last_name,
		email: res.rows[0].email,
		phone: res.rows[0].phone,
		city: res.rows[0].city,
		bio: res.rows[0].bio,
		day_rate: res.rows[0].day_rate,
		uid: null,
		verified: res.rows[0].verified,
	}

	

	return profile;
})
.catch((err) =>{

	if (err.constraint === 'users_email_key'){
		return 'exist'
	} else {
		console.log('Error at users queries "createUser"', err);
		return err;
	}
})
};

const confirmUser = (values, uid) => {
	
	const text = `
		UPDATE users
		SET verified = TRUE, uid = $2
		WHERE public_key = $1
		RETURNING verified;`;

	return db
		.query(text, values)
		.then((res) => {

			const confirm = {
				verified: res.rows[0].verified,
				uid: uid
			}
		
			return confirm;
		})
		.catch((err) => console.log(`Error at users queries 'CONFIRM USER'`, err));
};

const loginUser = values => {
	
	const text = `
	SELECT *
	FROM users
	WHERE email = $1;`;

	return db
		.query(text, values)
		.then((res) => {

			return res.rows[0].password;
		})
		.catch((err) => console.log(`Error at users queries 'LOGIN'`, err));
};

const updateUid = (values, uid) => {
	
	const text = `
		UPDATE users
		SET uid = $1
		WHERE email = $2
		RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => {

			const profile = {
				public_key: res.rows[0].public_key,
				host: res.rows[0].host_id,
				image: res.rows[0].image,
				first_name: res.rows[0].first_name,
				last_name: res.rows[0].last_name,
				email: res.rows[0].email,
				phone: res.rows[0].phone,
				city: res.rows[0].city,
				bio: res.rows[0].bio,
				day_rate: res.rows[0].day_rate,
				uid: uid,
				verified: res.rows[0].verified,
			}

			return profile;
		})
		.catch((err) => console.log(`Error at users queries 'UPDATE UID'`, err));
};


const recoverPassword = (values) => {
	
	const text = `
	INSERT INTO recovery
	(email, hash) 
	VALUES($1, $2)
	RETURNING *;`;
	
	return db.query(text, values)
	.then((res) => {
	return res;
	})
	.catch((err) =>{
	console.log(err);
	})
	};

	const getTemp = values => {
	
		const text = `
		SELECT * 
		FROM recovery
		WHERE email = $1`;
		
		return db.query(text, values)
		.then((res) =>res.rows[0])
		.catch((err) =>{
		console.log(err);
		})
		};

		const deleteTemp = values => {
	
			const text = `
			DELETE 
			FROM recovery
			WHERE email = $1
			RETURNING *`;
			
			return db.query(text, values)
			.then((res) =>res.rows[0])
			.catch((err) =>{
			console.log(err);
			})
			};

			const resetPassword = values => {
	
				const text = `
				UPDATE users
				SET password = $2
				WHERE email = $1
				RETURNING verified;`;
				
				return db.query(text, values)
				.then((res) =>res.rows[0])
				.catch((err) =>{
				console.log(err);
				})
				};



const editUser = values => {
	
	const text = `
		UPDATE users
		SET host = $1, city = $2, bio = $3, day_rate = $4, social_link = $5
		WHERE public_key = $6
		RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => {

			const profile = {
				public_key: res.rows[0].public_key,
				host: res.rows[0].host,
				image: res.rows[0].image,
				first_name: res.rows[0].first_name,
				last_name: res.rows[0].last_name,
				email: res.rows[0].email,
				phone: res.rows[0].phone,
				city: res.rows[0].city,
				bio: res.rows[0].bio,
				day_rate: res.rows[0].day_rate,
				social_link: res.rows[0].social_link,
				verified: res.rows[0].verified,
			}

			return profile;
		})
		.catch((err) => console.log(`Error at users queries 'EDIT'`, err));
};

const editUserImg = values => {

	const text = `
		UPDATE users
		SET image = $1
		WHERE public_key = $2
		RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => {

			const profile = {
				public_key: res.rows[0].public_key,
				host: res.rows[0].host,
				image: res.rows[0].image,
				first_name: res.rows[0].first_name,
				last_name: res.rows[0].last_name,
				email: res.rows[0].email,
				phone: res.rows[0].phone,
				city: res.rows[0].city,
				bio: res.rows[0].bio,
				day_rate: res.rows[0].day_rate,
				verified: res.rows[0].verified,
			}

			return profile;
		})
		.catch((err) => console.log(`Error at users queries 'EDIT IMG'`, err));
};


const sessionUser = () => {
	
	const text = `
	SELECT *
	FROM users;`;

	return db
		.query(text)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at users queries 'getSession'`, err));
};


const validateUser = values => {
	
	const text = `
	SELECT *
	FROM users
	WHERE email = $1;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at users queries 'VALIDATE'`, err));
};

const logoutUser = values => {
	
	const text = `
		UPDATE users
		SET uid = $1
		WHERE public_key = $2
		RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => {
			return true;
		})
		.catch((err) => console.log(`Error at users queries 'EDIT'`, err));
};


module.exports = {
	getUsers,
	createUser,
	confirmUser,
	loginUser,
	recoverPassword,
	getTemp,
	deleteTemp,
	resetPassword,
	sessionUser,
	updateUid,
	editUser,
	editUserImg,
	validateUser,
	logoutUser
};
