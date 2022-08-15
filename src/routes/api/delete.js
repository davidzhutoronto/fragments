const logger = require('../../logger');

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Delete a fragment's info for current user
 */
module.exports = async (req, res) => {
  const deleted = req.params.id;
  try {
    await Fragment.delete(req.user, deleted);

    let msg = {
      fragment: deleted,
    };
    let message = createSuccessResponse(msg);
    res.status(200).json(message);
  } catch (err) {
    logger.error({ err }, 'error on post');
    res.status(404).json(createErrorResponse(404, 'Cannot convert to .html'));
  }
};
