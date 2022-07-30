const service = require("./restaurants.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function averageRating(req, res, next) {
  const ratingReturned = await service.averageRating();
  let {avg: rating} = ratingReturned;
  rating = parseFloat(rating)
  res.json({ data: {average_rating: rating} });
}

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function count(req, res, next) {
  // My solution:
  const countReturn = await service.count();
 let {count} = countReturn;
  count = parseInt(count)
  res.json({ data: { count} });
}

async function create(req, res, next) {
  const newRestaurant = ({ restaurant_name, address, cuisine, rating } =
    req.body.data);
  const createdRestaurant = await service.create(newRestaurant);
  res.status(201).json({ data: createdRestaurant });
}

async function read(req, res) {
  res.json({ data: res.locals.restaurant });
}

async function readHighestRated(req, res, next){
  // My Solution:
const maxR = await service.readHighestRated();
let {max} = maxR;
res.json({ data:  {max_rating: max}});
}

async function restaurantExists(req, res, next) {
  const restaurant = await service.read(req.params.restaurantId);

  if (restaurant) {
    res.locals.restaurant = restaurant;
    return next();
  }
  next({ status: 404, message: `Restaurant cannot be found.` });
}

async function update(req, res) {
  const updatedRestaurant = {
    ...req.body.data,
    restaurant_id: res.locals.restaurant.restaurant_id,
  };

  const data = await service.update(updatedRestaurant);
  res.json({ data });
}

async function destroy(req, res) {
  await service.delete(res.locals.restaurant.restaurant_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  count: asyncErrorBoundary(count),
  averageRating: asyncErrorBoundary(averageRating),
  readHighestRated: asyncErrorBoundary(readHighestRated),
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(destroy)],
  read: [asyncErrorBoundary(restaurantExists), read],
};