const logger = require('../../logger');

const { createSuccessResponse, createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');
/**
 * Post a fragment for the current user
 */
module.exports = async (req, res) => {
  logger.debug({ user: req.user });
  logger.debug({ body: req.body });

  const contentType = req.headers['content-type'];
  if (req.body === {}) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  } else {
    if (Fragment.isSupportedType(contentType)) {
      const fragment = new Fragment({ ownerId: req.user, type: contentType });
      try {
        await fragment.setData(req.body);
        await fragment.save();
        res.set('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);

        let msg = {
          fragment: fragment,
        };
        let message = createSuccessResponse(msg);
        res.status(201).json(message);
      } catch (err) {
        logger.error({ err }, 'error on post');
      }
    } else {
      res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    }
  }
};
