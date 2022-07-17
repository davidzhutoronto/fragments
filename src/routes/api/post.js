const logger = require('../../logger');

//const apiUrl = process.env.API_URL || 'http://localhost:8080';

const { createSuccessResponse, createErrorResponse } = require('../../response');
//const { listFragments, readFragment, writeFragment } = require('../../model/data/memory/index');
const { Fragment } = require('../../model/fragment');
/**
 * Post a fragment for the current user
 */
module.exports = async (req, res) => {
  logger.debug({ user: req.user });
  logger.debug({ body: req.body });

  const contentType = req.headers['content-type'];

  //if (contentType.includes('text') || contentType === 'application/json')
  if (Fragment.isSupportedType(contentType)) {
    const fragment = new Fragment({ ownerId: req.user, type: contentType, size: 0 });
    try {
      await fragment.save();
      await fragment.setData(req.body);
    } catch (err) {
      logger.error({ err }, 'error on post');
    }
    /* const st = await fragment.getData();
    console.log(st.toString()); */
    res.set('Location', `${req.headers.host}/v1/fragments/${fragment.id}`);
    let msg = {
      fragments: fragment,
    };
    let message = createSuccessResponse(msg);
    res.status(201).json(message);
  } else {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }
};
