const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);

  const data = fragment.getData();

  let msg = {
    data: data,
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message);
};
