const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const customerRoute = require('./customer.route');
const businessRoute = require('./businessDetails.route');
const vendorRoute = require('./vendor.route');
const sloggerRoute = require('./slogger.route');
const config = require('../../config/config');
const comboRoute = require('./ProductCombo.route');
const category = require('./category.route');
const cartManagement = require('./cartManagement.route');
const street = require('./street.route');
const zone = require('./zone.route')
const district = require('./district.route')
const deliveryAddress = require('./deliveryAddress.route')
const manageIssues = require('./manageIssues.route');
const receive =require('./receivedOrderse.route');
const scv = require('./scv.route');
const ward = require('./ward.route')
const manageScvRoute = require('./manageScv.route');
const warehouseStock = require('./warehouseStock.route');
const loadingExecuteRoute = require('./loading.execute.route');
const roleRoute = require('./role.route')
const menueRoute = require('./menue.route')
const assignRoute = require('./assign.route')

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
    path: '/category',
    route: category,
  },
  {
    path: '/combo',
    route: comboRoute,
  },
  {
    path: '/slogger',
    route: sloggerRoute,
  },
  {
    path: '/cartManagement',
    route: cartManagement,
  },
  {
    path:'/street',
    route: street,
  },
  {
    path:'/zone',
    route: zone,
  },
  {
    path:'/ward',
    route:ward,
  },
  {
    path:'/district',
    route: district,
  },
  {
    path:'/deliveryAddress',
    route: deliveryAddress,
  },
  {
    path:'/manageIssues',
    route: manageIssues,
  },
  {
    path: '/receivedOrders',
    route: receive,
  },
  {
    path: '/scv',
    route: scv,
  },
  {
    path: '/manageScv',
    route: manageScvRoute
  },
  {
    path:'/warehouseStock',
    route: warehouseStock,
  },
  {
    path: '/loadingExecute',
    route: loadingExecuteRoute,
  },
  {
    path: '/role',
    route: roleRoute 
  },
  {
    path: '/menu',
    route: menueRoute,
  },
  {
    path: '/assign',
    route: assignRoute
  },
  
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
