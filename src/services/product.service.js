const httpStatus = require('http-status');
const { Product, Stock, ConfirmStock, LoadingExecute, BillRaise, ManageBill, ShopList } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const Supplier = require('../models/supplier.model');
const ReceivedOrder = require('../models/receivedOrders.model');
const ShopOrders = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const { MarketShopsClone } = require('../models/market.model');
const moment = require('moment');
const { isDate } = require('moment');
let datenow = moment(new Date()).format('DD-MM-YYYY');
const ReceivedProduct = require('../models/receivedProduct.model');
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

const updateStockById = async (id, updateBody) => {
  let stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
  }
  stock = await Stock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return stock;
};

const setTrendsValueforProduct = async (id, updateBody) => {
  let product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found ');
  }
  product = await Product.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  product = await Product.findByIdAndUpdate({ _id: id }, { $set: { setTrendsDate: datenow } }, { new: true });
  console.log(product);
  return product;
};

const getTrendsData = async (date, wardId, street, page) => {
  let match;
  if (street != 'null') {
    match = { steetId: { $eq: street } };
  } else {
    match = { active: true };
  }
  let wardmatch;
  if (wardId != 'null') {
    wardmatch = { wardId: wardId };
  } else {
    wardmatch = { active: true };
  }
  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          {
            $match: { date: date },
          },
          {
            $match: { $and: [match] },
          },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              pipeline: [{ $match: wardmatch }],
              as: 'StreetData',
            },
          },
          {
            $unwind: '$StreetData',
          },
          { $group: { _id: null, Avg: { $avg: '$Rate' }, Max: { $max: '$Rate' }, Min: { $min: '$Rate' } } },
        ],
        as: 'Productdata',
      },
    },
    {
      $unwind: '$Productdata',
    },
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          {
            $match: {
              date: { $eq: date },
            },
          },
          {
            $match: { $and: [match] },
          },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'b2bshop',
            },
          },
          {
            $unwind: '$b2bshop',
          },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              pipeline: [{ $match: wardmatch }],
              as: 'StreetData',
            },
          },
          {
            $unwind: '$StreetData',
          },
          {
            $project: {
              street: '$StreetData.street',
              Rate: 1,
              Weight: 1,
              Unit: 1,
              shopId: 1,
              steetId: 1,
              UserId: 1,
              longitude: '$b2bshop.Slong',
              latitude: '$b2bshop.Slat',
              ShopName: '$b2bshop.SName',
              date: 1,
            },
          },
        ],
        as: 'Productdetails',
      },
    },
    {
      $project: {
        productDetails: '$Productdetails',
        Avg: '$Productdata.Avg',
        Max: '$Productdata.Max',
        Min: '$Productdata.Min',
        productTitle: 1,
        _id: 1,
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Product.aggregate([
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          {
            $match: { date: date },
          },
          {
            $match: { $and: [match] },
          },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              pipeline: [{ $match: wardmatch }],
              as: 'StreetData',
            },
          },
          {
            $unwind: '$StreetData',
          },
          { $group: { _id: null, Avg: { $avg: '$Rate' }, Max: { $max: '$Rate' }, Min: { $min: '$Rate' } } },
        ],
        as: 'Productdata',
      },
    },
    {
      $unwind: '$Productdata',
    },
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          {
            $match: {
              date: { $eq: date },
            },
          },
          {
            $match: { $and: [match] },
          },
          {
            $lookup: {
              from: 'marketshopsclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'marketshop',
            },
          },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'b2bshop',
            },
          },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              pipeline: [{ $match: wardmatch }],
              as: 'StreetData',
            },
          },
          {
            $unwind: '$StreetData',
          },
          {
            $project: {
              street: '$StreetData.street',
              Rate: 1,
              Weight: 1,
              Unit: 1,
              shopId: 1,
              steetId: 1,
              UserId: 1,
              date: 1,
              marketshop: '$marketshop',
              b2bshop: '$b2bshop',
            },
          },
        ],
        as: 'Productdetails',
      },
    },
    {
      $project: {
        productDetails: '$Productdetails',
        Avg: '$Productdata.Avg',
        Max: '$Productdata.Max',
        Min: '$Productdata.Min',
        productTitle: 1,
        _id: 1,
      },
    },
  ]);
  return { values: values, total: total.length };
};

const TrendsCounts = async (productId, date, wardId, street) => {
  let match;
  if (street != 'null') {
    match = { steetId: { $eq: street } };
  } else {
    match = { active: true };
  }
  let wardmatchCount;
  let wardmatch;
  if (wardId != 'null') {
    wardmatch = { wardId: wardId };
    wardmatchCount = { wardId: { $eq: wardId } };
  } else {
    wardmatch = { active: true };
    wardmatchCount = { active: true };
  }
  let b2bshops = await Shop.aggregate([
    {
      $match: {
        $and: [match, wardmatchCount],
      },
    },
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: date,
              productId: productId,
            },
          },
        ],
        as: 'StreetData',
      },
    },
    {
      $unwind: '$StreetData',
    },
  ]);
  if (street != 'null') {
    match = { productId: { $eq: productId }, date: { $eq: date }, steetId: { $eq: street } };
  } else {
    match = { productId: { $eq: productId }, date: { $eq: date } };
  }
  console.log(wardId);
  if (wardId != 'null') {
    wardmatch = { Wardid: wardId };
    wardmatchCount = { Wardid: { $eq: wardId } };
  } else {
    wardmatch = { active: true };
    wardmatchCount = { active: true };
  }
  console.log(match);
  let marketshop = await MarketShopsClone.aggregate([
    {
      $lookup: {
        from: 'marketclones',
        localField: 'MName',
        foreignField: '_id',
        pipeline: [
          {
            $match: wardmatchCount,
          },
        ],
        as: 'StreetDatass',
      },
    },
    {
      $unwind: '$StreetDatass',
    },
    {
      $lookup: {
        from: 'trendproductsclones',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: match,
          },
        ],
        as: 'StreetData',
      },
    },
    {
      $unwind: '$StreetData',
    },
  ]);
  let totelcount = marketshop.length + b2bshops.length;
  if (street != 'null') {
    totelcount = 1;
  }

  return { streetCount: totelcount };
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
  const first = Math.floor(1000 + Math.random() * 9000);
  const date = new Date();
  const second = Math.floor(10 + Math.random() * 99);
  const third = Math.floor(10 + Math.random() * 99);
  let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
  let day = (date.getDate() < 9 ? '0' : '') + date.getDate();
  let billid = first + '' + day + '' + second + '' + month + '' + third;
  console.log(month);
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
  values = { ...stockbody, ...{ supplierName: supp.supplierName, billId: billid } };
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
        shopOrder: '$ShopOrders',
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

const AccountDetails = async (date, page) => {
  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'productorders',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        Qty: '$productDetails.Qty',
        Avg: '$productDetails.Avg',
      },
    },
  ]);
  let total = await Product.aggregate([
    {
      $lookup: {
        from: 'productorders',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
  ]);
  return { values: values, total: total.length };
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

const getProductByIdWithAggregation = async (id) => {
  console.log(id);
  const product = await Product.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'category',
        foreignField: 'parentCategoryId',
        as: 'subcategorydata',
      },
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'SubCatId',
        foreignField: 'subcategory',
        as: 'brandData',
      },
    },
    {
      $lookup: {
        from: 'hsns',
        localField: 'HSN_Code',
        foreignField: '_id',
        as: 'hsnData',
      },
    },
  ]);
  return product;
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
  return Product.find();
};

const getAllManageBill = async () => {
  return ManageBill.find();
};

const getStockByLoadingExecute = async () => {
  return Stock.find({ loadingExecute: true, closeOrder: true });
};

const paginationForTrends = async (id) => {
  return Product.aggregate([
    {
      $match: {
        TrendspreferredQuantity: { $ne: null },
      },
    },
    {
      $sort: { productTitle: 1 },
    },
    { $skip: 10 * id },
    { $limit: 10 },
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
  console.log(stackId);
  let stack = await Stock.findOne({ supplierId: stackId });
  console.log(stack);
  if (!stack) {
    throw new ApiError(httpStatus.NOT_FOUND, 'stacks not found');
  }
  stack = await Stock.findOneAndUpdate({ supplierId: stackId }, updateBody, { new: true });
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
const productaggregateById = async (page) => {
  const product = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'catName',
      },
    },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'SubCatId',
        foreignField: '_id',
        as: 'subcatName',
      },
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'Brand',
        foreignField: '_id',
        as: 'brandName',
      },
    },
    {
      $lookup: {
        from: 'hsns',
        localField: 'HSN_Code',
        foreignField: '_id',
        as: 'hsnData',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  const total = await Product.find().count();

  return {
    value: product,
    total: total,
  };
};

const costPriceCalculation = async (date, page) => {
  let values = await Product.aggregate([{ $skip: 10 * page }, { $limit: 10 }]);
  const result = await values.map(async (product) => {
    const followers = await ReceivedProduct.aggregate([
      {
        $match: {
          date: { $eq: date },
        },
      },
      {
        $lookup: {
          from: 'receivedstocks',
          localField: '_id',
          foreignField: 'groupId',
          pipeline: [{ $group: { _id: null, Total: { $sum: '$incomingQuantity' } } }],
          as: 'incomingQuantity',
        },
      },
      { $unwind: '$incomingQuantity' },
      {
        $lookup: {
          from: 'receivedstocks',
          localField: '_id',
          foreignField: 'groupId',
          pipeline: [{ $match: { productId: product._id } }],
          as: 'receivedstocks',
        },
      },
      { $unwind: '$receivedstocks' },
      {
        $lookup: {
          from: 'transportbills',
          localField: '_id',
          foreignField: 'groupId',
          pipeline: [{ $group: { _id: null, Total: { $sum: '$billAmount' } } }],
          as: 'transportbills',
        },
      },
      { $unwind: '$transportbills' },
    ]);
    let retunJson;
    if (followers.length != 0) {
      console.log(followers[0]);
      let cost = followers[0].receivedstocks.billingPrice;
      let exp = followers[0].transportbills.Total / followers[0].incomingQuantity.Total;
      retunJson = {
        _id: product._id,
        productTitle: product.productTitle,
        onlinePrice: product.onlinePrice,
        salesmanPrice: product.salesmanPrice,
        expenceTotal: followers[0].transportbills.Total,
        incomingQuantity: followers[0].incomingQuantity.Total,
        expenceamount: Math.round(cost + exp),
      };
    } else {
      retunJson = {
        _id: product._id,
        productTitle: product.productTitle,
        onlinePrice: product.onlinePrice,
        salesmanPrice: product.salesmanPrice,
        expenceTotal: 0,
        incomingQuantity: 0,
        expenceamount: 0,
      };
    }
    return retunJson;
  });
  // Resolve all promises in the array:
  return await Promise.all(result);

  // await values.forEach(async (product) => {`
  //   // console.log(product);
  //   let receiveddate = await ReceivedProduct.aggregate([
  //     {
  //       $match: {
  //         date: { $eq: date },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'receivedstocks',
  //         localField: '_id',
  //         foreignField: 'groupId',
  //         pipeline: [{ $match: { productId: product._id } }],
  //         as: 'receivedstocks',
  //       },
  //     },
  //     { $unwind: '$receivedstocks' },
  //   ]);
  //   if (receiveddate.length != 0) {
  //     retunJson.push(receiveddate[0]);
  //     console.log(retunJson);
  //   }
  // });

  return await Promise.all(retunJson);
};

module.exports = {
  createProduct,
  getTrendsData,
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
  getProductByIdWithAggregation,
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
  productaggregateById,
  updateStockById,
  setTrendsValueforProduct,
  TrendsCounts,
  // cost price calculation
  costPriceCalculation,
  AccountDetails,
};
