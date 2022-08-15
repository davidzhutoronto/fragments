const logger = require('../../logger');

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

//put a fragment
module.exports = async (req, res) => {
  const contentType = req.headers['content-type'];
  logger.debug({ user: req.user });
  logger.debug({ body: req.body });

  try {
    const fragmentFound = await Fragment.byId(req.user, req.params.id);

    const fragment = new Fragment({
      id: fragmentFound.id,
      ownerId: fragmentFound.ownerId,
      type: fragmentFound.type,
      created: fragmentFound.created,
      updated: fragmentFound.updated,
      size: fragmentFound.size,
    });

    if (fragment.type != contentType) {
      res.status(400).json(createErrorResponse(400, 'Content Type Not Match'));
    } else {
      await fragment.save();
      await fragment.setData(req.body);
      let msg = {
        fragment: fragment,
      };
      let message = createSuccessResponse(msg);
      res.status(200).json(message);
    }
  } catch (err) {
    logger.error({ err }, 'error on post');
    res.status(404).json(createErrorResponse(404, 'No matching id'));
  }
};
