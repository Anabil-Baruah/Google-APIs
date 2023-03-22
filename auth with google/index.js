const { OAuth2Client } = require('google-auth-library');


const CLIENT_ID = process.env.CLIENT_ID.toString()
const CLIENT_SECRET = process.env.CLIENT_SECRET.toString()
const REDIRECT_URI = `${baseURL}/signUp/auth/google/callback`;


const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);



router.route('/auth/google')
    .get((req, res) => {
        const authUrl = client.generateAuthUrl({
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'],
            state: req.session.csrfToken,
        });
        res.redirect(authUrl);
    });

router.route('/auth/google/callback')
    .get(async (req, res, next) => {
        const { code } = req.query;

        try {
            // Exchange authorization code for access token
            const { tokens } = await client.getToken(code);

            // Set access token for future requests
            client.setCredentials(tokens);

            // Retrieve user information
            const { data: { email, given_name, family_name, picture } } = await client.request({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            });

            console.log(email, given_name, picture);

            const userFound = await user.findOne({ email })

            if (userFound !== null) {
                return res.json({
                    "status": "error",
                    "message": "User already exist login in to continue"
                });
            }
            const newUser = new user({
                username: given_name,
                email: email,
                password: "",

            })
            //generating token
            const token = await newUser.generateAuthToken();

            res.cookie("jwt", token, {
                httpOnly: true
            });
            const result = await newUser.save()

            if (result) {
                res.redirect(`${baseURL}`)
            }
            else {
                res.json({ message: err.message, type: 'danger' })
            }

            // res.redirect('/');
        } catch (err) {
            console.error("error occured");
            res.redirect(`${baseURL}/signUp`);
        }
    });