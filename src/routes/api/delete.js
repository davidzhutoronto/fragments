const logger = require('../../logger');

const { createSuccessResponse } = require('../../response');
//const { listFragments, readFragment, writeFragment } = require('../../model/data/memory/index');
const { Fragment } = require('../../model/fragment');

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
  }
};
