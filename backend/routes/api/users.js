const express = require('express');
const fileupload = require('express-fileupload')
const path = require('path');
const fs = require('fs')
const app = express();
app.use(fileupload());
app.enable('trust proxy');
const router = express.Router();
router.use(fileupload());
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const nodemail = require('./mailingService/confirmation');

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
	keyFilename: path.join(__dirname, process.env.SB_PATH),
	projectId: process.env.SB_ID
});
const tinify = require("tinify");
tinify.key = process.env.TINY_API;


const {
	getUsers,
	createUser,
	confirmUser,
	loginUser,
	recoverPassword,
	getTemp,
	deleteTemp,
	resetPassword,
	editUser,
	editUserImg,
	sessionUser,
	updateUid,
	validateUser,
	logoutUser,
} = require('../../db/queries/user-queries');

// router.get('/', (req, res) => {

// 	getUsers()
// 		.then((data) => res.json())
// 		.catch((err) => console.log('Error at users GET route "/"', err));
// });

router.post('/create', async (req, res) => {

const submitted = req.body.input;
	
const salt = bcrypt.genSaltSync(2);
const temp_uid = uniqid();
const hashedUid = bcrypt.hashSync(temp_uid, salt);
const temp_key = uniqid();
const public_key = bcrypt.hashSync(temp_key, salt);
const secret_key = bcrypt.hashSync(public_key, salt);

const hash = bcrypt.hashSync(submitted.password, salt);
	
	
	const values = [submitted.first_name, submitted.last_name, submitted.email, public_key, secret_key, hashedUid, hash];

	
		createUser(values)
		.then( async (data) => {

			const details = {
				name: submitted.first_name,
				email: submitted.email,
				public_key: public_key
			}

		if(data === 'exist'){
			return res.json(data);
		}

	
		nodemail.sendConfirmation(details).then((mail) => {
			
			if(mail){
				return res.json(data);
			} 
			return res.json(false);
		})
		})


		.catch((err) => {
			console.log('Error at users CREATE route "/"', err);
			return res.json(false);
		});

});




router.patch('/confirm', (req, res) => {
	const salt = bcrypt.genSaltSync(2);
	const temp_uid = uniqid();
	const uid = bcrypt.hashSync(temp_uid, salt);
	const hashedUid = bcrypt.hashSync(uid, salt);
	const values = [req.body.url_id, hashedUid];

		confirmUser(values, uid)
		.then((data) => res.json(data))
		.catch((err) => {
			console.log('Error at users CONFIRM route "/"', err);
			return res.json(false);
		});

});



router.post('/login', (req, res) => {

		const submitted = req.body.input;
		const salt = bcrypt.genSaltSync(2);
		const temp_uid = uniqid();
		const uid = bcrypt.hashSync(temp_uid, salt);
		const hashedUid = bcrypt.hashSync(uid, salt);
		
		const values = [submitted.email];

		loginUser(values)
		.then((password) => {

		bcrypt.compare(submitted.password, password, function(err, result){
		
			if(result){

				updateUid([hashedUid, submitted.email], uid)
				.then((data) => res.json(data));
	

			} else {

				return res.json(false);
		
			}
		
		});
	
		})
		.catch((err) => {
			console.log('Error at users LOGIN route "/"', err);
			return res.json(false);
		});

});

router.post('/recovery', async (req, res) => {

		const salt = bcrypt.genSaltSync(2);
		const temp_uid = uniqid();
		const uid = bcrypt.hashSync(temp_uid, salt);
		const hash= bcrypt.hashSync(uid, salt);
		const email = req.body.email;
		const values = [email, hash];

		recoverPassword(values)
		.then((data) => {
  
			if(!data){
				return res.json(false);
			}

			const details = {
				email: email,
				uid: uid
			}
		
			nodemail.sendRecovery(details).then((mail) => {

				if(mail){
					return res.json(true);
				} 
				return res.json(false);

		})

		})
		.catch((err) => {
			console.log('Error at users CONFIRM route "/"', err);
			return res.json(false);
		});

});

router.post('/recover', async (req, res) => {

	const input = req.body.input;
	
	getTemp([input.email])
	.then((data) => {
	
	bcrypt.compare(input.id, data.hash, function(err, result){
		
		if(result){

			deleteTemp([data.email])
			.then((data) => {
			})


		} else {

			return res.json(false);
	
		}
	
	});


	})
	.catch((err) => res.json(false));

});


router.post('/reset', async (req, res) => {

	const input = req.body.input;

	getTemp([input.email])
	.then((data) => {
	// console.log('DATA',data);
	
	bcrypt.compare(input.id, data.hash, function(err, result){
		
		if(result){

			deleteTemp([data.email])
			.then((data) => {
				const salt = bcrypt.genSaltSync(2);
				const hash = bcrypt.hashSync(input.password, salt);
				resetPassword([data.email, hash])
				.then((data) => {
					return res.json(data);
				})
			})
		
				} else {

					return res.json(false);
			
				}
	
	});


	})

	.catch((err) => res.json(false));

});



router.patch('/edit', (req, res) => {

	const update = req.body.update;
		validateUser([update.email])

		.then((data) => {
			
				bcrypt.compare(update.uid, data.uid, function(err, result) {
					
					if(result){
					
						const values = [update.host, update.city, update.bio, 
					update.day_rate, update.social_link, data.public_key];

						editUser(values)
						.then((data) => res.json(data))

					} else {
						return res.json(false);
					}

			}
				);

		})
	
		.catch((err) => {
			console.log('Error at users EDIT route "/"', err);
			return res.json(false);
		});

});





router.post('/editImg', async (req, res) => {



	const file = req.files.image;
	
	const ext = `/${uniqid()}.jpeg`;
	const path =  '/tmp' + ext;



  file.mv(path, async (error) => {
    if (error) {
      console.error('path error => ',error)
      return res.json(false);
    }


		validateUser([req.body.email])
		.then((data) =>  {

				bcrypt.compare(req.body.uid, data.uid, function(err, result) {
					
					if(result){
					
						const values = [ext, data.public_key];

							editUserImg(values)
							.then( async (data) => {

								try {

									const source = tinify.fromFile(path);
									await source.toFile(path);
						
									const filePath = path;
									const bucketName = 'locals-images';
						
									await storage.bucket(bucketName).upload(filePath, {
										destination: `${ext}`,
										resumable: false,
										gzip: true
									});
						
									console.log(`${filePath} uploaded to ${bucketName}`);

									//safty for this has a way of failing on a whim
									try {
									fs.unlinkSync(filePath) //<-- blocking function
									console.log(`File ${filePath} removed`)
									await storage.bucket(bucketName).file(req.body.ref).delete();
									console.log(`${req.body.ref} deleted from ${bucketName}`);
								
						
									} catch (error) {
										console.log('silently failed to delete')
									}
									
									return res.json(data);
							
								} catch (error) {
									console.log('BUCKET ERROR', error);
									return res.json(error);
								}
							})




					} else {

						return res.json('failed to validate user');
					}

				});

		})

		
		.catch((err) => {
			return res.json(false);
		});
	
  })

});




router.post('/session', (req, res) => {

		sessionUser()
		.then((data) => {

			for(const user of data){
				
				bcrypt.compare(req.body.uid, user.uid, function(err, result) {
				

					if(result){

							profile = {
								public_key: user.public_key,
								host: user.host,
								image: user.image,
								first_name: user.first_name,
								last_name: user.last_name,
								email: user.email,
								city: user.city,
								bio: user.bio,
								day_rate: user.day_rate,
								social_link: user.social_link,
								thumbs_up: user.thumbs_up,
								thumbs_down: user.thumbs_down,
								connect_id: user.connect_id,
								customer_id: user.customer_id,
								uid: req.body.uid,
								verified: user.verified,
							}

						return res.json(profile);
					} 

				});
			}
			
		})
		.catch((err) => {
			console.log('Error at users SESSION route "/"', err);
			return res.json(false);
		});

});


router.patch('/logout', (req, res) => {


	const salt = bcrypt.genSaltSync(2);
	const temp_uid = uniqid();
	const uid = bcrypt.hashSync(temp_uid, salt);
	logoutUser([uid, req.body.public_key])
	.then((data) =>{
	return res.json(data);
	})
	
	
		.catch((err) => console.log('Error at users EDIT route "/"', err));

});



module.exports = router;
