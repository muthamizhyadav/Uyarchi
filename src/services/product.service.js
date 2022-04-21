const httpStatus = require('http-status');
const { Product, Stock, ConfirmStock, LoadingExecute, BillRaise, ManageBill } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const Supplier = require('../models/supplier.model');
const ReceivedOrder = require('../models/receivedOrders.model')

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

const createManageBill = async (manageBillBody) =>{
  const { billId, supplierId, orderId } = manageBillBody
  const bill = await BillRaise.findById(billId)
  if(bill === null){
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid BillId ")
  }
  const supplier = await Supplier.findById(supplierId)
  if(supplier === null){
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid SupplierId")
  }
  const order = await ReceivedOrder.findById(orderId);
  console.log(order)
  if(order === null){
    throw new ApiError(httpStatus.BAD_REQUEST, "OrderId Invalid")
  }
  return ManageBill.create(manageBillBody)
}

const createStock = async (stockbody) => {
  const { supplierId, product } = stockbody;
  product.forEach(async (element) => {
    const productId = element.product;
    const pro = await Product.findById(productId);
    console.log(pro);
    let oldStock = pro.stock;
    let newStock = element.measureMent;
    let totalStock = parseInt(oldStock) + parseInt(newStock);
    await Product.findByIdAndUpdate({ _id: productId }, { stock: totalStock }, { new: true });
  });
  let values = {};
  const supp = await Supplier.findById(supplierId);
  values = { ...stockbody, ...{ supplierName: supp.supplierName } };
  return Stock.create(values);
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
  let values = {}
  netWeight = quantity + wastage
  const product = await Product.findById(productId);
  if (product === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Product Id 😞');
  }
  values ={...MWLEbody, ...{netWeight}}
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

const getProductById = async (id) => {
  return Product.findById(id);
};

const getManageBill = async(id) =>{
  return ManageBill.findById(id);
}

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

const getAllManageBill = async ()=>{
  return ManageBill.find()
}

const updateManageBill = async (manageBillId, updatebody) =>{
  let manageBill = await getManageBill(manageBillId);
  if(!manageBill){
    throw new ApiError(httpStatus.NOT_FOUND, "ManageBill Not Found")
  }
  manageBill = await ManageBill.findByIdAndUpdate({_id:manageBillId}, updatebody, {new:true})
  return manageBill
}

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

const updateStockStatucById = async (id) => {
  let stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock Not Found');
  }
  stock = await Stock.findByIdAndUpdate({ _id: id }, { status: "Raised" }, { new: true });
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

const sendStocktoLoadingExecute = async (id)=>{
  let stocks = await getStockBySupplierId(id)
  stocks = await Stock.findByIdAndUpdate({_id:id}, {loadingExecute:true}, {new:true})
  console.log(stocks)
  if(!stocks.loadingExecute === true){
    return null
  }
  return stocks
}

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

const deleteBillManage = async (manageBillId) =>{
  const manageBill = await getManageBill(manageBillId)
  if(!manageBill){
    throw new ApiError(httpStatus.NOT_FOUND, "manage Bill Not Found")
  }
    manageBill.active = false, manageBill.archive = true, await manageBill.save()
}

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
  createStock,
  createConfirmStock,
  createManageBill,
  getAllManageBill,
  getManageBill,
  updateStockStatucById,
  updateManageBill,
  deleteBillManage,
  createBillRaise,
  getAllBillRaised,
  getBillRaiseById,
  updateBillRaiseById,
  deleteBillRaise,
  createMainWherehouseLoadingExecute,
  getAllConfirmStack,
  getAllMailWherehoustLoadingExecute,
  getConfrimById,
  updateArrivedById,
  updateConfirmById,
  deleteConfirmStockById,
  sendStocktoLoadingExecute,
  getAllStock,
  getProductById,
  getMailWherehoustLoadingExecuteById,
  updateMainWherehouseLoadingExecuteById,
  deleteMainWherehouseLoadingExecuteById,
  getStockBySupplierId,
  updateProductById,
  deleteProductById,
  queryProduct,
};
