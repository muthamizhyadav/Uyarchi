const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');
const { Stock } = require('../models/product.model');

const createProduct = catchAsync(async (req, res) => {
  const { body } = req;
  const product = await productService.createProduct(body);
  // if (req.files.length != 0) {
  //   let path = '';
  //   req.files.forEach(function (files, index, arr) {
  //     path = 'images/' + files.filename;
  //   });
  //   product.image = path;
  // }
  if (req.files) {
    let path = '';
    path = 'images/';
    if (req.files.image != null) {
      product.image = path + req.files.image[0].filename;
    }

    if (req.files.galleryImages != null) {
      req.files.galleryImages.forEach((e) => {
        product.galleryImages.push(path + e.filename);
      });
    }
  }
  await product.save();
  res.status(httpStatus.CREATED).send(product);
});

const setTrendsValueforProduct = catchAsync(async (req, res) => {
  const product = await productService.setTrendsValueforProduct(req.params.id, req.body);
  await product.save();
  res.send(product);
});

const getStockbyBillId = catchAsync(async (req, res) => {
  const bills = await productService.getByBillId(req.params.billId);
  res.send(bills);
});

const getAllTrends = catchAsync(async (req, res) => {
  const trends = await productService.getTrendsData(req.params.date, req.params.wardId, req.params.street, req.params.page);
  res.send(trends);
});

const createStock = catchAsync(async (req, res) => {
  const { body } = req;
  const stock = await productService.createStock(body);
  await stock.save();
  res.status(httpStatus.CREATED).send(stock);
});

const createManageBill = catchAsync(async (req, res) => {
  const { body } = req;
  const manageBill = await productService.createManageBill(body);
  res.status(httpStatus.CREATED).send(manageBill);
  await manageBill.save();
});

const createBillRaise = catchAsync(async (req, res) => {
  const { body } = req;
  const billRaise = await productService.createBillRaise(body);
  res.status(httpStatus.CREATED).send(billRaise), await billRaise.save();
});

const createMainWherehouseLoadingExecute = catchAsync(async (req, res) => {
  const { body } = req;
  const mwloading = await productService.createMainWherehouseLoadingExecute(body);
  res.status(httpStatus.CREATED).send(mwloading);
  await mwloading.save();
});

const gettrendsCount = catchAsync(async (req, res) => {
  const product = await productService.TrendsCounts(
    req.params.productId,
    req.params.date,
    req.params.wardId,
    req.params.street
  );
  res.send(product);
});

const createShopListService = catchAsync(async (req, res) => {
  const { body } = req;
  const shop = await productService.createShopList(body);
  res.status(httpStatus.CREATED).send(shop);
  await shop.save();
});

const createConfirmStock = catchAsync(async (req, res) => {
  const { body } = req;
  const confirmStock = await productService.createConfirmStock(body, req.params);
  res.status(httpStatus.CREATED).send(confirmStock);
  await confirmStock.save();
});

const getconfirmStockById = catchAsync(async (req, res) => {
  const confirmStock = await productService.getConfrimById(req.params.confirmStockId);
  console.log(confirmStock);
  if (!confirmStock || confirmStock.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ConfirmStock not found');
  }
  res.send(confirmStock);
});

const getManageBillById = catchAsync(async (req, res) => {
  const manageBill = await productService.getManageBill(req.params.manageBillId);
  if (!manageBill || manageBill.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ManageBill Not Found');
  }
  res.send(manageBill);
});

const productDateTimeFilter = catchAsync(async (req, res) => {
  const productdate = await productService.productDateTimeFilter(req.params.date);
  res.send(productdate);
});

const productPaginationForTrends = catchAsync(async (req, res) => {
  const product = await productService.paginationForTrends(req.params.id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
  }
  res.send(product);
});

const getStockById = catchAsync(async (req, res) => {
  const stock = await productService.getStockById(req.params.stockId);
  // if(!stock || stock.active === false){
  //   throw new ApiError(httpStatus.NOT_FOUND, "Stock Not Found")
  // }
  res.send(stock);
});
const getShopList = catchAsync(async (req, res) => {
  const shop = await productService.getAllShopList();
  res.send(shop);
});

const getAllManageBill = catchAsync(async (req, res) => {
  const manage = await productService.getAllManageBill();
  res.send(manage);
});

const getBillRaiseById = catchAsync(async (req, res) => {
  const billRaise = await productService.getBillRaiseById(req.params.billRaiseId);
  if (!billRaise || billRaise.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BillRaise Not Found');
  }
  res.send(billRaise);
});

const getMailWherehoustLoadingExecuteById = catchAsync(async (req, res) => {
  const mwloading = await productService.getMailWherehoustLoadingExecuteById(req.params.mwLoadingId);
  if (!mwloading || mwloading.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MainWherehouse Loading Execute Not Fiund');
  }
  res.send(mwloading);
});

const getAllMailWherehoustLoadingExecute = catchAsync(async (req, res) => {
  const mwloading = await productService.getAllMailWherehoustLoadingExecute();
  res.send(mwloading);
});

// const getStocksByStatusDelivered = catchAsync(async (req, res)=>{
//   const stock = await productService.getStocksByStatusDelivered()
//   res.send(stock)
// })

const getStockByLoadingExecute = catchAsync(async (req, res) => {
  const stock = await productService.getStockByLoadingExecute();
  res.send(stock);
});

const getAllBillRaised = catchAsync(async (req, res) => {
  const billRaise = await productService.getAllBillRaised();
  res.send(billRaise);
});

const getAllConfirmStock = catchAsync(async (req, res) => {
  const confirmStock = await productService.getAllConfirmStack();
  res.send(confirmStock);
});

const getAllStock = catchAsync(async (req, res) => {
  const stock = await productService.getAllStock();
  res.send(stock);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productTitle', 'unit']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProduct(filter, options);
  res.send(result);
});

const getproduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product || product.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const getProductByIdWithAggregation = catchAsync(async (req, res) => {
  const product = await productService.getProductByIdWithAggregation(req.params.id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product[0]);
});

const getStockBySupplierId = catchAsync(async (req, res) => {
  const stock = await productService.getStockBySupplierId(req.params.supplierId);
  res.send(stock);
});

const getAllienceBySupplierId = catchAsync(async (req, res) => {
  const stock = await productService.getAllienceBySupplierId(req.params.id);
  res.send(stock);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  if (req.files) {
    let path = '';
    path = 'images/';
    if (req.files.image != null) {
      product.image = path + req.files.image[0].filename;
    }

    if (req.files.galleryImages != null) {
      product.galleryImages = [];
      req.files.galleryImages.forEach((e) => {
        product.galleryImages.push(path + e.filename);
      });
    }
  }
  await product.save();
  res.send(product);
});

const updatingStatusForDelivered = catchAsync(async (req, res) => {
  const stock = await productService.updatingStatusForDelivered(req.params.id, req.body);
  res.send(stock);
  await stock.save();
});

const updateBillRaiseById = catchAsync(async (req, res) => {
  const billRaise = await productService.updateBillRaiseById(req.params.billRaiseId, req.body);
  res.send(billRaise);
});

const updateConfirmStock = catchAsync(async (req, res) => {
  const confirmStock = await productService.updateConfirmById(req.params.confirmStockId, req.body);
  res.send(confirmStock);
});

const updateArrivedById = catchAsync(async (req, res) => {
  const stock = await productService.updateArrivedById(req.params.id, req.body);
  res.send(stock);
});

const updateStockQtyById = catchAsync(async (req, res) => {
  const stock = await productService.updateStockQtyById(req.params.id, req.body);
  res.send(stock);
});

const updateManageBill = catchAsync(async (req, res) => {
  const manageBill = await productService.updateManageBill(req.params.billManageId, req.body);
  res.send(manageBill);
});

const updateMainWherehouseLoadingExecuteById = catchAsync(async (req, res) => {
  const mwloading = await productService.updateMainWherehouseLoadingExecuteById(req.params.mwLoadingId, req.body);
  res.send(mwloading);
});

const updateStockStatusById = catchAsync(async (req, res) => {
  const status = await productService.updateStockStatucById(req.params.id, req.body);
  res.send(status);
});

const aggregationWithProductId = catchAsync(async (req, res) => {
  const product = await productService.aggregationWithProductId(req.params.id, req.params.date);
  res.send(product);
});

const updateStockById = catchAsync(async (req, res) => {
  const stack = await productService.updateStackById(req.params.stockId, req.body);
  res.send(stack);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteBillManage = catchAsync(async (req, res) => {
  await productService.deleteBillManage(req.params.manageBillId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendStocktoLoadingExecute = catchAsync(async (req, res) => {
  const stocks = await productService.sendStocktoLoadingExecute(req.params.id, req.body);
  // const { body } = req;
  if (req.files.length != 0) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/weighbridge/' + files.filename;
    });
    stocks.weighbridgeBill = path;
  }
  res.send(stocks);
});

const productAggregationWithShopOrder = catchAsync(async (req, res) => {
  const products = await productService.productAggregationWithShopOrder();
  res.send(products);
});

const getLoadingExecuteDate = catchAsync(async (req, res) => {
  const loading = await productService.getLoadingExecuteDate();
  res.send(loading);
});

const getStockByStatusCreated = catchAsync(async (req, res) => {
  const stock = await productService.getStockByStatusCreated();
  res.send(stock);
});

const getStockByStatusRaised = catchAsync(async (Req, res) => {
  const stock = await productService.getStockByStatusRaised();
  res.send(stock);
});

const getStocksByStatusDelivered = catchAsync(async (Req, res) => {
  const stock = await productService.getStockStatusDelivered();
  res.send(stock);
});

const getStockByStatusClosed = catchAsync(async (req, res) => {
  const stock = await productService.getStockByStatusClosed();
  res.send(stock);
});

const deleteMainWherehouseLoadingExecuteById = catchAsync(async (req, res) => {
  await productService.deleteMainWherehouseLoadingExecuteById(req.params.mwLoadingId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteConfirmStockById = catchAsync(async (req, res) => {
  await productService.deleteConfirmStockById(req.params.confirmStockId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteBillRaise = catchAsync(async (req, res) => {
  await productService.deleteBillRaise(req.params.billRaiseId);
  res.status(httpStatus.NO_CONTENT).send();
});

const productDealingWithsupplier = catchAsync(async (req, res) => {
  const products = await productService.matchproductWithSupplier(req.params.id);
  if (!products) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Products Not Found');
  }
  res.send(products);
});

const getbillingexecutive = catchAsync(async (req, res) => {
  const stock = await productService.getbillingexecutives();
  res.send(stock);
});
const productaggregateById = catchAsync(async (req, res) => {
  console.log('sdfsdfsd');
  const product = await productService.productaggregateById(req.params.page);
  res.send(product);
});

const updatesStockById = catchAsync(async (req, res) => {
  const stock = await productService.updateStockById(req.params.id, req.body);
  if (req.files.length != 0) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/stock/' + files.filename;
    });
    stock.weighbridgeBill = path;
  }
  await stock.save();
  res.send(stock);
});

const costPriceCalculation = catchAsync(async (req, res) => {
  const product = await productService.costPriceCalculation();
  res.send(product);
});

module.exports = {
  createProduct,
  getAllienceBySupplierId,
  createStock,
  updateStockQtyById,
  getStockByStatusCreated,
  getStockById,
  createBillRaise,
  createManageBill,
  getAllManageBill,
  getManageBillById,
  getStockByStatusRaised,
  getStocksByStatusDelivered,
  updateManageBill,
  getStockByStatusClosed,
  deleteBillManage,
  getAllBillRaised,
  productAggregationWithShopOrder,
  getBillRaiseById,
  updateBillRaiseById,
  productPaginationForTrends,
  getLoadingExecuteDate,
  deleteBillRaise,
  createMainWherehouseLoadingExecute,
  createConfirmStock,
  getAllConfirmStock,
  getAllMailWherehoustLoadingExecute,
  getconfirmStockById,
  updateConfirmStock,
  deleteConfirmStockById,
  getStockByLoadingExecute,
  getAllStock,
  getStockBySupplierId,
  getMailWherehoustLoadingExecuteById,
  getProducts,
  getStockbyBillId,
  productDealingWithsupplier,
  updateArrivedById,
  updateStockStatusById,
  updateMainWherehouseLoadingExecuteById,
  getAllTrends,
  getproduct,
  updateStockById,
  productDateTimeFilter,
  updateProduct,
  deleteProduct,
  deleteMainWherehouseLoadingExecuteById,
  aggregationWithProductId,
  sendStocktoLoadingExecute,
  updatingStatusForDelivered,
  getProductByIdWithAggregation,
  createShopListService,
  setTrendsValueforProduct,
  getShopList,
  productaggregateById,
  updatesStockById,
  gettrendsCount,

  // cost price calculation
  costPriceCalculation,
};
