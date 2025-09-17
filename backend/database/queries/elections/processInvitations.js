const { getUserByEmail } = require('../userQueries');
const { addInvitedEmailsToEligibleVoters } = require('./addInvitedEmailsToEligibleVoters');
const { sendInvitationEmail } = require('../../utils/email');
const { checkCriteria } = require('../../utils/criteria');

async function processInvitations(election, invitedEmails) {
    const successfullyInvited = [];
    const failedInvitations = [];

    for (const email of invitedEmails) {
        const user = await getUserByEmail(email);

        if (user) {
            const isEligible = checkCriteria(user, election);
            if (isEligible) {
                await addInvitedEmailsToEligibleVoters(election.id, [email]);
                await sendInvitationEmail(email, election);
                successfullyInvited.push(email);
            } else {
                failedInvitations.push({ email, reason: 'User does not meet eligibility criteria.' });
            }
        } else {
            // If user does not exist, add them to eligible_voters and send email.
            // Eligibility will be checked upon registration.
            await addInvitedEmailsToEligibleVoters(election.id, [email]);
            await sendInvitationEmail(email, election);
            successfullyInvited.push(email);
        }
    }

    return { successfullyInvited, failedInvitations };
}

module.exports = {
    processInvitations,
};
