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
const zone = require('./zone.route');
const district = require('./district.route');
const deliveryAddress = require('./deliveryAddress.route');
const manageIssues = require('./manageIssues.route');
const receive = require('./receivedOrderse.route');
const scv = require('./scv.route');
const ward = require('./ward.route');
const manageScvRoute = require('./manageScv.route');
const warehouseStock = require('./warehouseStock.route');
const loadingExecuteRoute = require('./loading.execute.route');
const roleRoute = require('./role.route');
const menueRoute = require('./menue.route');
const assignRoute = require('./assign.route');
const supplierRoute = require('./supplier.route');
const expensesRoute = require('./expenses.route');
const videoRecorder = require('./video.record');
const setSalesPriceRoute = require('./setSalesPriceRoute');
const shopOrderRoute = require('./shopOrder.route');
const manageUserRoute = require('./manageUser.route');
const adminRegistrationRoute = require('./adminRegistration.route');
const manageUser = require('./manageUser.route');
const marketRoute = require('./market.route');
const apartmentRoute = require('./apartmentTable.route');
const SuperAdmin = require('./superAdmin.route');
const BusinessUsers = require('./manageBusinessUsers.route');
const DistrictListRoute = require('./districtList.route');
const trendsRoute = require('./trends.router');
const websocket = require('./websocket.js');
const orderRaisedByMWA = require('./orderRaisedbyMWA.route');
const CallStatusRoute = require('./callStatus.route');
const statusRoute = require('./status.route');
const router = express.Router();
const PuserRoute = require('./purchaseUserSalary.route');
const brand = require('./brand.route');
const B2BUsers = require('./B2Busers.route');
const verifyRoute = require('./verify.authentication.route');
const setTrendsValue = require('./set.TrendsValue.route');
const b2bShopClone = require('./b2b.ShopClone.route');
const supplierBuyerRoute = require('./supplierBuyer.route');
const metaUserRoute = require('./meta.users.route');
const postOrderRoute=require('./postorder.route')
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path:'/postorder',
    route:postOrderRoute,
  },
  {
    path: '/verify',
    route: verifyRoute,
  },
  {
    path: '/metaUser',
    route: metaUserRoute,
  },
  {
    path: '/b2bUsers',
    route: B2BUsers,
  },
  {
    path: '/setTrendsValue',
    route: setTrendsValue,
  },
  { path: '/PUserSalaryInfo', route: PuserRoute },
  {
    path: '/b2bShopClone',
    route: b2bShopClone,
  },
  {
    path: '/status',
    route: statusRoute,
  },
  {
    path: '/orderRaisedbyMWA',
    route: orderRaisedByMWA,
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
    path: '/street',
    route: street,
  },
  {
    path: '/zone',
    route: zone,
  },
  {
    path: '/ward',
    route: ward,
  },
  {
    path: '/district',
    route: district,
  },
  {
    path: '/deliveryAddress',
    route: deliveryAddress,
  },
  {
    path: '/manageIssues',
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
    route: manageScvRoute,
  },
  {
    path: '/warehouseStock',
    route: warehouseStock,
  },
  {
    path: '/loadingExecute',
    route: loadingExecuteRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/menu',
    route: menueRoute,
  },
  {
    path: '/assign',
    route: assignRoute,
  },
  {
    path: '/supplier',
    route: supplierRoute,
  },
  {
    path: '/expenses',
    route: expensesRoute,
  },
  {
    path: '/videoRecorder',
    route: videoRecorder,
  },
  {
    path: '/setSalesPrice',
    route: setSalesPriceRoute,
  },
  {
    path: '/orderShop',
    route: shopOrderRoute,
  },
  {
    path: '/manageUser',
    route: manageUser,
  },
  {
    path: '/adminRegistration',
    route: adminRegistrationRoute,
  },
  {
    path: '/market',
    route: marketRoute,
  },
  {
    path: '/apartmentandShop',
    route: apartmentRoute,
  },
  {
    path: '/superAdmin',
    route: SuperAdmin,
  },
  {
    path: '/BusinessUsers',
    route: BusinessUsers,
  },
  {
    path: '/districtlist',
    route: DistrictListRoute,
  },
  {
    path: '/trends',
    route: trendsRoute,
  },
  { path: '/websocket', route: websocket },
  {
    path: '/callStatus',
    route: CallStatusRoute,
  },
  {
    path: '/brand',
    route: brand,
  },
  {
    path: '/supplierBuyer',
    route: supplierBuyerRoute,
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
