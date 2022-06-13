// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  console.log(req.user);
  //const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });

  const fragmentList = await Fragment.byUser(req.user, true);

  let msg = {
    fragments: fragmentList,
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message);
};
