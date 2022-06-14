const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  //const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });

  const fragment = await Fragment.byId(req.user, req.params.id);
  if (fragment) {
    let msg = {
      fragment: fragment,
    };
    let message = createSuccessResponse(msg);
    res.status(200).json(message);
  } else {
    let msg = {
      status: 'error',
      error: {
        message: 'No Fragment Found',
        code: 404,
      },
    };
    res.status(404).json(createErrorResponse(404, msg));
  }
};
