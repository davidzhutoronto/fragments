const logger = require('../../logger');

/* var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt(); */

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a fragment for the current user
 */
module.exports = async (req, res) => {
  console.log(req.params.ext);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    logger.error({ err }, 'error on post');
    let msg = {
      status: 'error',
      error: {
        message: 'No Fragment Found',
        code: 404,
      },
    };
    res.status(404).json(createErrorResponse(404, msg));
  }

  /* let msg = {
    fragment: data,
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message); */
};
