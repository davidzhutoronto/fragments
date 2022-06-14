const { createSuccessResponse } = require('../../response');
//const { listFragments, readFragment, writeFragment } = require('../../model/data/memory/index');
const { Fragment } = require('../../model/fragment');
/**
 * Post a fragment for the current user
 */
module.exports = (req, res) => {
  //console.log(req.user);
  const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });
  fragment.save();
  fragment.setData(req.body.toString());
  res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
  let msg = {
    fragments: fragment,
  };
  let message = createSuccessResponse(msg);
  res.status(200).json(message);
};
