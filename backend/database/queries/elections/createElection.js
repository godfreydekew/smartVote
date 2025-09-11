const { pool } = require('../../db');
const { DatabaseError } = require('../../utils/errors');

async function createElection(electionData) {
  const {
    title,
    description,
    startDate,
    endDate,
    status = 'upcoming',
    imageURL,
    organization,
    isPublic,
    accessControl,
    ageRestriction,
    regions,
    useCaptcha = false,
    rules,
    isDraft = true, 
    bannerImage,
    primaryColor,
    smartContractAddress,
    ownerAddress,
    ownerUserId,
    merkleRoot,
  } = electionData;

  try {
    const result = await pool.query(
      `
      INSERT INTO elections (
        title,
        description,
        start_date,
        end_date,
        status,
        image_url,
        organization,
        is_public,
        access_control,
        age_restriction,
        regions,
        use_captcha,
        rules,
        is_draft,
        banner_image,
        primary_color,
        smart_contract_address,
        owner_address,
        owner_user_id,
        merkle_root
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
      `,
      [
        title,
        description,
        startDate,
        endDate,
        status,
        imageURL,
        organization,
        isPublic,
        accessControl,
        ageRestriction,
        regions,
        useCaptcha,
        rules,
        isDraft,
        bannerImage,
        primaryColor,
        smartContractAddress,
        ownerAddress,
        ownerUserId,
        merkleRoot,
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'elections_pkey') {
      throw new DatabaseError(`Election with ID ${id} already exists`, 'DUPLICATE_ELECTION_ID');
    }
    if (error.code === '23505' && error.constraint === 'elections_smart_contract_address_key') {
      throw new DatabaseError(`Election with smart contract address ${smartContractAddress} already exists`, 'DUPLICATE_CONTRACT_ADDRESS');
    }
    throw new DatabaseError('Error creating election: ' + error.message);
  }
}

module.exports = {
  createElection,
};