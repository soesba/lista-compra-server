const mongoose = require("mongoose");

module.exports.mapLean = function mapLean(obj) {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map(mapLean);
  const { _id, __v, ...rest } = obj;
  return { ...rest, id: _id ? _id.toString() : undefined };
}

module.exports.mapUnlean = function mapUUnlean(obj) {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map(mapUnlean);
  const { id, ...rest } = obj;
  return { ...rest, _id: id ? new mongoose.Types.ObjectId(`${id}`) : undefined };
}

module.exports.transform = (doc, result) => {
  delete result._id;
  return result;
}

module.exports.postAggregate = (result) => {
  for (const item of result) {
    item.id = item._id;
    delete item._id;
    delete item.__v
  }
  return result;
};