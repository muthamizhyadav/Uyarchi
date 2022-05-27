const httpStatus = require('http-status');
const { Product, Stock, ConfirmStock, LoadingExecute, BillRaise, ManageBill, ShopList } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const Supplier = require('../models/supplier.model');
const ReceivedOrder = require('../models/receivedOrders.model');
const ShopOrders = require('../models/shopOrder.model');

const createProduct = async (productBody) => {
  let { needBidding, biddingStartDate, biddingStartTime, biddingEndDate, biddingEndTime, maxBidAomunt, minBidAmount } =
    productBody;
  if (needBidding === 'no') {
    (biddingStartDate = null),
      (biddingStartTime = null),
      (biddingEndDate = null),
      (biddingEndTime = null),
      (maxBidAomunt = null),
      (minBidAmount = null);
  } else {
    biddingStartDate, biddingStartTime, biddingEndDate, biddingEndTime, maxBidAomunt, minBidAmount;
  }
  return Product.create(productBody);
};

const createManageBill = async (manageBillBody) => {
  const { billId, supplierId, orderId } = manageBillBody;
  const bill = await BillRaise.findById(billId);
  if (bill === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid BillId ');
  }
  const supplier = await Supplier.findById(supplierId);
  if (supplier === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid SupplierId');
  }
  const order = await ReceivedOrder.findById(orderId);
  console.log(order);
  if (order === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OrderId Invalid');
  }
  return ManageBill.create(manageBillBody);
};

const createShopList = async (shopListBody) => {
  return ShopList.create(shopListBody);
};

const getAllShopList = async () => {
  return ShopList.find();
};

const createStock = async (stockbody) => {
  const { supplierId, product, productName } = stockbody;
  let pp = product.map((e) => {
    return e.product;
  });
  const first = Math.floor(1000 + Math.random() * 9000);
  const date = new Date();
  const second = Math.floor(10 + Math.random() * 99);
  const third = Math.floor(10 + Math.random() * 99);
  let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
  let day = (date.getDate() < 9 ? '0' : '') + date.getDate();
  let billid = first + '' + day + '' + second + '' + month + '' + third;
  console.log(month);

  const pros = await Product.findById(pp);
  product.forEach(async (element) => {
    const productId = element.product;
    const pro = await Product.findById(productId);
    console.log(pro.productTitle);
    let oldStock = pro.stock;
    let newStock = element.measureMent;
    let totalStock = parseInt(oldStock) + parseInt(newStock);
    await Product.findByIdAndUpdate({ _id: productId }, { stock: totalStock }, { new: true });
  });
  let values = {};
  const supp = await Supplier.findById(supplierId);
  values = { ...stockbody, ...{ supplierName: supp.supplierName, productName: pros.productTitle, billId: billid } };
  return Stock.create(values);
};

const getByBillId = async (billId) => {
  const bills = Stock.find({ billId });
  console.log(billId);
  if (bills === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'InCorrect BillId');
  }
  return bills;
};

const productAggregationWithShopOrder = async () => {
  const products = await Product.find();
  console.log(
    products.map((e) => {
      return e.id;
    })
  );
  const shopOrders = await ShopOrders.find();
  console.log(
    shopOrders.map((e) => {
      return e.product.map((ee) => {
        return ee.productid;
      });
    })
  );
};

const productDateTimeFilter = async (date) => {
  return Product.aggregate([
    {
      $lookup: {
        from: 'productorders',
        let: { productIds: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productIds', '$productid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: [date, '$date'],
              },
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'callstatuses',
        let: { productid: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productid', '$productid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: [date, '$date'],
              },
            },
          },
        ],
        as: 'callStatusData',
      },
    },
    // {
    //     $unwind:"$callStatusData"
    // },
    {
      $lookup: {
        from: 'status',
        let: { productid: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productid', '$productid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: [date, '$date'],
              },
            },
          },
        ],
        as: 'productstatus',
      },
    },
    // {
    //     $unwind:"$callStatusData"
    // },
    {
        $lookup: {
          from: 'shoporders',
          let: { productid: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$productid', '$productid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
                },
              },
                $match: {
                  $expr: {
                    $eq: [date, '$date'],
                  },
              },
            },
          ],
          as: 'ShopOrders',
        },
    },
    {
      $project: {
        CallStatus: '$callStatusData',
        productstatus: '$productstatus',
        productTitle: 1,
        oldstock: 1,
        onlinePrice: 1,
        category: 1,
        salesmanPrice: 1,
        _id: 1,
        orderdata: '$shopData',
        shopOrder:'$ShopOrders',
      },
    },
  ]);
};

 const aggregationWithProductId = async (id, date) => {
  return Product.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'productorders',
        let: { productId: '$_id' },
        pipeline: [
          { $match: { productid: id } },
          { $match: { date: date } },
          // { $project: { _id: 1, date: { name: "$name", date: "$date" } } },
        ],
        as: 'shopData',
      },
    },
    {
      $project: {
        // orderData: '$zoneData',
        shop: '$shopData',
        productTitle: 1,
        oldstock: 1,
        onlinePrice: 1,
        category: 1,
        salesmanPrice: 1,
        _id: 1,
      },
    },
  ]);
};

const matchproductWithSupplier = async (id) => {
  return;
};

const createConfirmStock = async (confirmBody) => {
  const { stockId } = confirmBody;
  const stocks = await Stock.findById(stockId);
  let specific = stocks;
  if (stocks === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Stock Id😞');
  }
  return ConfirmStock.create(confirmBody);
};

const createMainWherehouseLoadingExecute = async (MWLEbody) => {
  const { productId, quantity, wastage } = MWLEbody;
  let values = {};
  netWeight = quantity + wastage;
  const product = await Product.findById(productId);
  if (product === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Product Id 😞');
  }
  values = { ...MWLEbody, ...{ netWeight } };
  return LoadingExecute.create(values);
};

const createBillRaise = async (billRaiseBody) => {
  const { productId } = billRaiseBody;
  const product = await Product.findById(productId);
  if (product === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Product Id 😞');
  }
  return BillRaise.create(billRaiseBody);
};

const getAllMailWherehoustLoadingExecute = async () => {
  return LoadingExecute.find();
};

const getAllConfirmStack = async () => {
  return ConfirmStock.find();
};

const getAllStock = async () => {
  return Stock.find();
};

const getConfrimById = async (id) => {
  return await ConfirmStock.findById(id);
};

const getStockBySupplierId = async (id) => {
  return await Stock.findById(id);
};

const getAllienceBySupplierId = async (id) => {
  const stock = await Stock.findById(id);
  let others = {
    totalPrice: stock.totalPrice,
    logisticCost: stock.logisticCost,
    coolieCost: stock.coolieCost,
    misAllianceCost: stock.misAllianceCost,
  };
  return others;
};

const getProductById = async (id) => {
  return Product.findById(id);
};

const getManageBill = async (id) => {
  return ManageBill.findById(id);
};

const getMailWherehoustLoadingExecuteById = async (id) => {
  return LoadingExecute.findById(id);
};

const getBillRaiseById = async (id) => {
  return BillRaise.findById(id);
};

const getAllBillRaised = async () => {
  return BillRaise.find();
};

const queryProduct = async (filter, options) => {
  return Product.paginate(filter, options);
};

const getAllManageBill = async () => {
  return ManageBill.find();
};

// const getStocksByStatusDelivered = async()=>{
//   return Stock.find({loadingExecute:true, closeOrder:false})
// }

const getStockByLoadingExecute = async () => {
  return Stock.find({ loadingExecute: true, closeOrder: true });
};

const paginationForTrends = async (id) => {
  return Product.aggregate([
    {
      $sort: { productTitle: 1 },
    },
    { $skip: 5 * id },
    { $limit: 5 },
  ]);
};

const updateManageBill = async (manageBillId, updatebody) => {
  let manageBill = await getManageBill(manageBillId);
  if (!manageBill) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ManageBill Not Found');
  }
  manageBill = await ManageBill.findByIdAndUpdate({ _id: manageBillId }, updatebody, { new: true });
  return manageBill;
};

const updateMainWherehouseLoadingExecuteById = async (mwLoadingId, updateBody) => {
  let loading = await getMailWherehoustLoadingExecuteById(mwLoadingId);
  if (!loading) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MainWherehouse Not Found');
  }
  loading = await LoadingExecute.findByIdAndUpdate({ _id: mwLoadingId }, updateBody, { new: true });
  return loading;
};

const updateBillRaiseById = async (billRaiseId, updateBody) => {
  let billRaise = await getBillRaiseById(billRaiseId);
  if (!billRaise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BillRaise Not Found');
  }
  billRaise = await BillRaise.findByIdAndUpdate({ _id: billRaiseId }, updateBody, { new: true });
  return billRaise;
};

const updateArrivedById = async (id) => {
  let stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
  }
  stock = await Stock.findByIdAndUpdate({ _id: id }, { arrived: true }, { new: true });
  return stock;
};

// const updatingStatusForDelivered = async (id, updateBody)=>{
//   let stock = await Stock.findById(id);
//   if(!stock){
//     throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
//   }
//   stock = await Stock.findByIdAndUpdate({_id:id}, updateBody, {new:true});
//   return stock;
// }

const updateStockQtyById = async (id, updateBody) => {
  let stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
  }
  stock = await Stock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return stock;
};

const updateStockStatucById = async (id, updatebody) => {
  let stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
  }
  stock = await Stock.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return stock;
};

const updateConfirmById = async (confirmStockId, updateBody) => {
  let confirmStock = await getConfrimById(confirmStockId);
  if (!confirmStock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ConfirmStock Not Found😛');
  }
  confirmStock = await ConfirmStock.findByIdAndUpdate({ _id: confirmStockId }, updateBody, { new: true });
  return confirmStock;
};

const sendStocktoLoadingExecute = async (id, updatebody) => {
  let stocks = await getStockBySupplierId(id);
  stocks = await Stock.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return stocks;
};

const getStockById = async (stockId) => {
  const stocks = await Stock.findById(stockId);
  if (!stocks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock NOT Found');
  }
  return stocks;
};

const getStockByStatusCreated = async () => {
  return Stock.find({ status: 'Created' });
};

const getStockByStatusRaised = async () => {
  return Stock.find({ status: 'Raised' });
};

const getStockStatusDelivered = async () => {
  return Stock.find({ status: 'Delivered' });
};

const getStockByStatusClosed = async () => {
  return Stock.find({ status: 'Closed' });
};

const updateStackById = async (stackId, updateBody) => {
  let stack = await getStockById(stackId);
  if (!stack) {
    throw new ApiError(httpStatus.NOT_FOUND, 'stack not found');
  }
  stack = await Stock.findByIdAndUpdate({ _id: stackId }, updateBody, { new: true });
  return stack;
};

const getLoadingExecuteDate = async () => {
  const loadings = Stock.find({ loadingExecute: true });
  return loadings;
};

const updateProductById = async (productId, updateBody) => {
  let prod = await getProductById(productId);
  if (!prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  prod = await Product.findByIdAndUpdate({ _id: productId }, updateBody, { new: true });
  return prod;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found ');
  }
  (product.active = false), (product.archive = true), await product.save();
  return product;
};

const deleteBillManage = async (manageBillId) => {
  const manageBill = await getManageBill(manageBillId);
  if (!manageBill) {
    throw new ApiError(httpStatus.NOT_FOUND, 'manage Bill Not Found');
  }
  (manageBill.active = false), (manageBill.archive = true), await manageBill.save();
};

const deleteConfirmStockById = async (confirmStockId) => {
  const confirmStock = await getConfrimById(confirmStockId);
  if (!confirmStock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Confirm Stock Not Found');
  }
  (confirmStock.active = false), (confirmStock.archive = true), await confirm.save();
};

const deleteBillRaise = async (billRaiseId) => {
  const billRaise = await getBillRaiseById(billRaiseId);
  if (!billRaise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BillRaise Not Found');
  }
  (billRaise.active = false), (billRaise.archive = true), await billRaise.save();
};

const deleteMainWherehouseLoadingExecuteById = async (mwLoadingId) => {
  const loading = await getMailWherehoustLoadingExecuteById(mwLoadingId);
  if (!loading) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Main Wherehouse Not found');
  }
  (loading.active = false), (loading.archive = true), await loading.save();
};

module.exports = {
  createProduct,
  getStockById,
  productDateTimeFilter,
  paginationForTrends,
  getAllienceBySupplierId,
  createStock,
  updateStackById,
  createConfirmStock,
  createManageBill,
  getAllManageBill,
  getStockByStatusRaised,
  getStockStatusDelivered,
  getManageBill,
  getLoadingExecuteDate,
  updateStockStatucById,
  getStockByStatusClosed,
  updateManageBill,
  deleteBillManage,
  getStockByStatusCreated,
  createBillRaise,
  getAllBillRaised,
  getBillRaiseById,
  // updatingStatusForDelivered,
  updateBillRaiseById,
  deleteBillRaise,
  createMainWherehouseLoadingExecute,
  getAllConfirmStack,
  getAllMailWherehoustLoadingExecute,
  updateStockQtyById,
  productAggregationWithShopOrder,
  getConfrimById,
  getStockByLoadingExecute,
  updateArrivedById,
  updateConfirmById,
  deleteConfirmStockById,
  sendStocktoLoadingExecute,
  getAllStock,
  getProductById,
  getMailWherehoustLoadingExecuteById,
  updateMainWherehouseLoadingExecuteById,
  getByBillId,
  deleteMainWherehouseLoadingExecuteById,
  getStockBySupplierId,
  updateProductById,
  deleteProductById,
  queryProduct,
  getStockStatusDelivered,
  matchproductWithSupplier,
  aggregationWithProductId,
  createShopList,
  getAllShopList,
};
