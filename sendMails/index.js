const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
// const { OAuth2Client } = require('google-auth-library');


app.use(express.urlencoded({ extended: true }))

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;



const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
OAuth2Client.setCredentials({ refresh_token: REFREST_TOKEN })


async function sendMail() {
    try {
        const accessToken = await OAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'anabilbaruah2801@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFREST_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'anabilbaruah2801@gmail.com',
            to: 'anabilb1986@gmail.com',
            subject: 'Hello from gamil',
            text: 'Hello man'
        }

        const result = await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        console.log(error)
    }
}

sendMail().then((result) => { console.log(result) }).catch(error => { console.log(error) })

app.listen(3001, () => { console.log("server started") })