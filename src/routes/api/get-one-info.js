const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  //const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    if (fragment) {
      let msg = {
        fragment: fragment,
      };
      let message = createSuccessResponse(msg);

      res.status(200).json(message);
    }
  } catch (err) {
    logger.error({ err }, 'error on get info');

    res.status(404).json(createErrorResponse(404, 'No Fragment Found'));
  }

  //const fragment = await Fragment.byId(req.user, req.params.id);
};
