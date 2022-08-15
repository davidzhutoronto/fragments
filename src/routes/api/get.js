// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let expand = req.query.expand;

  //always return an array, even it's empty
  if (expand == 1) {
    const fragmentList = await Fragment.byUser(req.user, true);
    res.status(200).json(createSuccessResponse({ fragments: fragmentList }));
  } else {
    const fragmentList = await Fragment.byUser(req.user);
    let msg = {
      fragments: fragmentList,
    };
    let message = createSuccessResponse(msg);
    res.status(200).json(message);
  }
};
