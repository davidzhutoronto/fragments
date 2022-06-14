// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  console.log(req.user);
  //const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });
  let expand = req.query.expand;

  if (expand == 1) {
    const fragmentList = await Fragment.byUser(req.user, true);
    let msg = {
      fragments: fragmentList,
    };
    let message = createSuccessResponse(msg);
    res.status(200).json(message);
  } else {
    const fragmentList = await Fragment.byUser(req.user);
    let msg = {
      fragments: fragmentList,
    };
    let message = createSuccessResponse(msg);
    res.status(200).json(message);
  }
};
