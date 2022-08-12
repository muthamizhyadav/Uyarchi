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
const postOrderRoute = require('./postorder.route');
const generalEnquiryRoute = require('./generalEnquiry.route');
const trendProductRoute = require('./trend.product.route');
const hsnRoute = require('./hsn.route');
const manageExpenseRoute = require('./manage.expenses.route');
const b2bUSerSalaryRoute = require('./b2bUser.Salary.route');
const TrendsCloneRoute = require('./trendsClone.route');
const TrendProductCloneRoute = require('./trendsProduct.clone.route');
const B2bBillStatus = require('./b2bBillStatus.Route');
const ReceivedProduct = require('./receivedProduct.route');
const ReceivedStock = require('./receivedStock.Route');
const TransactionRoute = require('./transaction.route');
const Attendance = require('./b2bAttendance.route');
const wallet = require('./b2b.wallet.route');
const walletPayment = require('./b2b.walletPayment.route');
const SupplierBillRoute = require('./supplierbills.route');
const monthlyRecuring = require('./b2b.monthlyRecuring.route');
const AnnualExpenseRecuring = require('./b2b.expenses.annual.recuring.route');
// const redirect = require('./b2b.redirect.route');
const callHistory = require('./b2b.callHistory.route');
const attendancePayment = require('./b2b.atttendancePayment.route');
// const salesApp = require('./b2b.sales.route');
const estimateOrderRoute = require('./estimatedOrders.route');
const manageSalary = require('./manage.salary.route');
const wardAdminRouter = require('./b2b.wardAdmin.routes');
const usableStock = require('./usableStock.route');
const AssignStock = require('./AssignStock.route');
const packTypeRoute = require('./packType.route');
const productpackTypeRoute = require('./productPacktype.route');
const wardAdminGroup = require('./b2b.wardAdminGroup.route');
const slowCheck = require('./slow.sample.route');
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/summa',
    route: slowCheck,
  },
  {
    path: '/usableStock',
    route: usableStock,
  },
  {
    path: '/supplierBills',
    route: SupplierBillRoute,
  },
  {
    path: '/estimatedOrders',
    route: estimateOrderRoute,
  },
  {
    path: '/B2bBillStatus',
    route: B2bBillStatus,
  },
  {
    path: '/Transaction',
    route: TransactionRoute,
  },
  {
    path: '/receivedStock',
    route: ReceivedStock,
  },
  {
    path: '/b2bUserSalary',
    route: b2bUSerSalaryRoute,
  },
  {
    path: '/hsn',
    route: hsnRoute,
  },
  {
    path: '/receivedProduct',
    route: ReceivedProduct,
  },
  {
    path: '/manageExpenses',
    route: manageExpenseRoute,
  },
  {
    path: '/trendProduct',
    route: trendProductRoute,
  },
  {
    path: '/trendProductClone',
    route: TrendProductCloneRoute,
  },
  {
    path: '/postorder',
    route: postOrderRoute,
  },
  {
    path: '/generalEnquiry',
    route: generalEnquiryRoute,
  },
  { path: '/postorder', route: postOrderRoute },
  {
    path: '/verify',
    route: verifyRoute,
  },
  {
    path: '/metaUser',
    route: metaUserRoute,
  },
  {
    path: '/trendsClone',
    route: TrendsCloneRoute,
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
    path: '/manageSalary',
    route: manageSalary,
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
  {
    path: '/attendance',
    route: Attendance,
  },
  {
    path: '/wallet',
    route: wallet,
  },
  {
    path: '/walletPayment',
    route: walletPayment,
  },
  {
    path: '/callHistory',
    route: callHistory,
  },
  {
    path: '/monthlyRecuring',
    route: monthlyRecuring,
  },
  {
    path: '/annualExpenseRecuring',
    route: AnnualExpenseRecuring,
  },
  {
    path: '/attendancePayment',
    route: attendancePayment,
  },
  {
    path: '/wardAdminDetails',
    route: wardAdminRouter,
  },
  {
    path: '/AssignStock',
    route: AssignStock,
  },
  {
    path: '/wardAdminGroup',
    route: wardAdminGroup,
  },
  {
    path: '/packType',
    route: packTypeRoute,
  },
  {
    path: '/productpackType',
    route: productpackTypeRoute,
  },
  // {
  //   path: '/sales',
  //   route: salesApp,
  // }
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
