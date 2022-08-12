const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminService = require('../services/b2b.wardAdmin.service');


const createdata = catchAsync(async (req, res) => {
    const data = await wardAdminService.createdata(req.body);
    res.send(data);
  });

const getDetails = catchAsync(async (req, res) => {
  const details = await wardAdminService.getdetails(req.params.page);
  res.send(details);
});

const getproductDetails = catchAsync(async (req, res) => {
  const productDetails = await wardAdminService.getproductdetails(req.params.id);
  res.send(productDetails);
});

// const getProductCount = catchAsync(async (req, res)=>{
//     const productCount = await wardAdminService.getProductCount(req.params.orderId);
//     res.send(productCount)
// })

const updateProduct = catchAsync(async (req, res) => {
  const product = await wardAdminService.updateProduct(req.params.id, req.body);
  res.send(product);
});

const deliveryexecutive = catchAsync(async (req, res) => {
  const delivery = await wardAdminService.deliveryExecutive(req.params.id, req.body);
  res.send(delivery);
});

const updateAcknowledge = catchAsync(async (req, res) => {
  const acknowledgement = await wardAdminService.updateRejected(req.params.id, 'Acknowledge');
  res.send(acknowledgement);
});

const updateApproved = catchAsync(async (req, res) => {
  const approved = await wardAdminService.updateRejected(req.params.id, 'Approved');
  res.send(approved);
});

const updateModified = catchAsync(async (req, res) => {
  const modified = await wardAdminService.updateRejected(req.params.id, 'Modified');
  res.send(modified);
});

const updateRejected = catchAsync(async (req, res) => {
  const rejected = await wardAdminService.updateRejected(req.params.id, 'Rejected');
  res.send(rejected);
});

// ward loading executive
const wardloadExecutive = catchAsync(async (req, res) => {
  const executive = await wardAdminService.wardloadExecutive(req.params.page);
  res.send(executive);
});

const updatePacked = catchAsync(async (req, res) => {
  const packed = await wardAdminService.updateBilled(req.params.id, 'Packed');
  res.send(packed);
});

const updateAssigned = catchAsync(async (req, res) => {
  const assign = await wardAdminService.updateBilled(req.params.id, 'Assigned');
  res.send(assign);
});

const updateBilled = catchAsync(async (req, res) => {
  const billed = await wardAdminService.updateBilled(req.params.id, 'Billed');
  res.send(billed);
});

// AFTER PACKED BY WARD LOADING EXECUTE

    const wardloadExecutivePacked = catchAsync(async (req, res) => {
        const packedOnly = await wardAdminService.wardloadExecutivePacked(req.params.page);
        res.send(packedOnly);
    }); 

const wardDeliveryExecutive = catchAsync(async (req, res) => {
  const name = await wardAdminService.wardDeliveryExecutive();
  res.send(name);
});

module.exports = {
  getDetails,
  getproductDetails,
  updateProduct,
  updateAcknowledge,
  updateApproved,
  updateModified,
  updateRejected,

  // ward loading executive

  wardloadExecutive,
  updatePacked,
  updateAssigned,
  updateBilled,

  wardloadExecutivePacked,
  wardDeliveryExecutive,
  deliveryexecutive,


  createdata,
};
