//future use

/* const { createSuccessResponse } = require('../../response');
//const { listFragments, readFragment, writeFragment } = require('../../model/data/memory/index');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const deleted = req.params.id;
  Fragment.delete(req.user, deleted);

  let msg = {
    deleted: deleted,
  };
  let message = createSuccessResponse(msg);
  res.status(200).json(message);
};
 */
