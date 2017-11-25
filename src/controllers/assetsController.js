const Asset = require('./../models/Asset');

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.send(assets);
  } catch (error) {
    console.log(error);
  }
};
