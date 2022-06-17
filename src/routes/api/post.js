const apiUrl = process.env.API_URL || 'http://localhost:8080';

const { createSuccessResponse } = require('../../response');
//const { listFragments, readFragment, writeFragment } = require('../../model/data/memory/index');
const { Fragment } = require('../../model/fragment');
/**
 * Post a fragment for the current user
 */
module.exports = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });
  fragment.save();

  fragment.setData(Buffer.from(req.body.toString()));
  const st = await fragment.getData();
  console.log(st.toString());
  res.set('Location', `${apiUrl}/v1/fragments/${fragment.id}`);
  let msg = {
    fragments: fragment,
  };
  let message = createSuccessResponse(msg);
  res.status(200).json(message);
};
