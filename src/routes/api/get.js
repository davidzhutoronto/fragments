// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...

  let msg = {
    status: 'ok',
    fragments: [],
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message);
};
