//const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a fragment for the current user
 */
module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);
  const data = await fragment.getData();

  res.set('Content-Type', 'text/plain');
  res.status(200).send(data);

  /* let msg = {
    fragment: data,
  };
  let message = createSuccessResponse(msg);

  res.status(200).json(message); */
};
