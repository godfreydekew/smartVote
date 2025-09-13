/**
 * Checks if a user meets the defined criteria.
 * @param {object} user - The user object.
 * @param {object} election - The election object containing eligibility criteria.
 * @returns {boolean} - True if the user meets all criteria, false otherwise.
 */
function checkCriteria(user, election) {
    // KYC requirement
    if (election.kyc_required && !user.kyc_verified) {
        return false;
    }

    // Age restriction
    if (election.age_restriction && election.age_restriction.length === 2) {
        const minAge = election.age_restriction[0];
        const maxAge = election.age_restriction[1];
        if (user.age === null || user.age < minAge || user.age > maxAge) {
            return false;
        }
    }

    // Region restriction
    if (election.regions && election.regions.length > 0) {
        if (!user.country_of_residence || !election.regions.includes(user.country_of_residence)) {
            return false;
        }
    }

    return true; // User passed all checks
}

module.exports = {
    checkCriteria,
};
