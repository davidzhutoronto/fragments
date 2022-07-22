const logger = require('../../logger');

var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a fragment for the current user
 */
module.exports = async (req, res) => {
  console.log(req.params.ext);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (Fragment.isSupportedType(fragment.type)) {
      if (req.params.ext === 'html') {
        if (fragment.type === 'text/markdown') {
          const getData = await fragment.getData();
          const data = md.render(`${getData}`);
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(data);
        } else {
          res.status(404).json(createErrorResponse(404, 'Cannot convert'));
        }
      } else if (typeof req.params.ext === 'undefined') {
        const data = await fragment.getData();

        res.setHeader('Content-Type', fragment.type);
        res.status(200).send(data);
      } else {
        res.status(404).json(createErrorResponse(404, 'Not support converting'));
      }
    } else {
      res.status(404).json(createErrorResponse(404, 'Content type not supported'));
    }
  } catch (err) {
    logger.error({ err }, 'error on post');

    res.status(404).json(createErrorResponse(404, 'No Fragment Found'));
  }

  /* let msg = {
    fragment: data,
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message); */
};
