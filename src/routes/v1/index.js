const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const customerRoute = require('./customer.route')
const businessRoute =require('./businessDetails.route');
const vendorRoute = require('./vendor.route')
const sloggerRoute = require('./slogger.route');
const config = require('../../config/config');
const comboRoute = require('./ProductCombo.route')
const category = require('./category.route');
const cartManagement = require('./cartManagement.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },

  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/business',
    route: businessRoute,
  },
  {
    path: '/customer',
    route: customerRoute,
  },
  {
    path: '/vendor',
    route: vendorRoute,
  },
  {
    path:'/category',
    route: category,
  },
  {
    path:'/combo',
    route: comboRoute,
  },
  {
    path: '/slogger',
    route:sloggerRoute,
  },{
    path:'/cartManagement',
    route: cartManagement,
  }
  
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
