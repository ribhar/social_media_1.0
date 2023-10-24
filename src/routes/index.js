
const express = require('express');
const postRoute = require('./post.routes');
const userRoute = require('./user.routes');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/post',
    route: postRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },


];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
