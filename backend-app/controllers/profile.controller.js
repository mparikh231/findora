const { getUser, updateUser } = require('./users.controller');

const getProfile = async (req, res) => {
    await getUser(req, res);
};

const updateProfile = async (req, res) => {
    await updateUser(req, res);
};

module.exports = {
    getProfile,
    updateProfile
};