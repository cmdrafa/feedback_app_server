const mongoose = require('mongoose');
const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Survey = mongoose.model('surveys'); // Pulling the surveys model from mongoose
const Mailer = require('../services/Mailer'); // Requiring the Mailer class
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = (app) => {
    // Thank you page
    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    // Fetch all surveys from that user
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });

        res.send(surveys);
    });


    // Getting data from the sendgrid api(response) and updating the database
    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        _.chain(req.body)
            .map((event) => {
                const match = p.test(new URL(event.url).pathname);
                if (match) {
                    return { email: event.email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact()
            .uniqBy('email', 'surveyId')
            .each((event) => {
                Survey.updateOne({
                    _id: event.surveyId,
                    recipients: {
                        $elemMatch: { email: event.email, responded: false }
                    }
                },
                    {
                        $inc: { [event.choice]: 1 },
                        $set: { 'recipients.$.responded': true },
                        lastResponded: new Date()
                    }
                ).exec();
            })
            .value();


        res.send({});
    });

    // Start a new survey
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body; //ES6 syntax, pulling all the properties from the body object

        const survey = new Survey({ // key and value with the same name, ES6
            title,
            subject,
            body,
            recipients: recipients.split(',').map((email) => { // Split the array by the commas, then map and return an email object
                return {
                    email: email.trim() // Remove empty spaces
                }
            }),
            _user: req.user.id,
            dateSent: Date.now()
        });

        // Now, after the survey is saved, we send the survey email
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    });
}