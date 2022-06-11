const { createSuccessResponse } = require('../../response');

/**
 * Post a list of fragments for the current user
 */
module.exports = (req, res) => {
  let msg = {
    fragments: [],
  };
  let message = createSuccessResponse(msg);
  res.status(200).json(message);
};
