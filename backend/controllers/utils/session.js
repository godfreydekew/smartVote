
const saveSessionData = (req, user) => {
    req.session.user = user;
    req.session.save();
}

const saveKycSession = (req, user, diditSessionId = null) => {
    req.session.user = { 
      ...user,
      diditSessionId 
    };
    req.session.save();
  };
  
  module.exports = { saveSessionData, saveKycSession };