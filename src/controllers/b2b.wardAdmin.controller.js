const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminService = require('../services/b2b.wardAdmin.service');

const createdata = catchAsync(async (req, res) => {
  const data = await wardAdminService.createdata(req.body);
  res.send(data);
});

const createArrayData = catchAsync(async (req, res) => {
  const data = await wardAdminService.createArrayData(req.body);
  res.send(data);
});

const getDetails = catchAsync(async (req, res) => {
  const details = await wardAdminService.getdetails(req.params.limit, req.params.page, req.params.status);
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
  const product = await wardAdminService.updateProduct(req.params.orderId, req.body);
  res.send(product);
});

const deliveryexecutive = catchAsync(async (req, res) => {
  const delivery = await wardAdminService.deliveryExecutive(req.params.id, req.body);
  res.send(delivery);
});

const updateAcknowledge = catchAsync(async (req, res) => {
  const acknowledgement = await wardAdminService.updateRejected(req.body);
  res.send(acknowledgement);
});
const updateApproval = catchAsync(async (req, res) => {
  const approval = await wardAdminService.updateApprovedMultiSelect(req.body);
  res.send(approval);
});

const updateRejectionStatus = catchAsync(async (req, res) => {
  const rejected = await wardAdminService.updateRejectMultiSelect(req.body);
  res.send(rejected);
});

const updatePackedStatus = catchAsync(async (req, res) => {
  const rejected = await wardAdminService.updatePackedMultiSelect(req.body);
  res.send(rejected);
});

const updateApproved = catchAsync(async (req, res) => {
  const approved = await wardAdminService.updateStatusApprovedOrModified(req.params.id, req.body);
  res.status(200).send(approved);
});

const updateModified = catchAsync(async (req, res) => {
  const modified = await wardAdminService.updateStatusModifiedOrModified(req.params.id, req.body);
  res.status(200).send(modified);
});

const updateRejected = catchAsync(async (req, res) => {
  const rejected = await wardAdminService.updateStatusrejectOrModified(req.params.id, req.body);
  res.status(200).send(rejected);
});

// ward loading executive
const wardloadExecutive = catchAsync(async (req, res) => {
  const executive = await wardAdminService.wardloadExecutive(req.params.id);
  res.send(executive);
});
const wardloadExecutivebtgroup = catchAsync(async (req, res) => {
  const executive = await wardAdminService.wardloadExecutivebtgroup(req.params.page);
  res.send(executive);
});
const wardloadExecutivepacked = catchAsync(async (req, res) => {
  const executive = await wardAdminService.wardloadExecutivepacked(req.params.status, req.params.date, req.params.page);
  res.send(executive);
});

const updatePacked = catchAsync(async (req, res) => {
  const packed = await wardAdminService.updateStatusForAssugnedAndPacked(req.params.id, req.body);
  res.send(packed);
});

const updateAssigned = catchAsync(async (req, res) => {
  const assign = await wardAdminService.updateStatusForAssugnedAndPacked(req.params.id, 'Assigned');
  res.send(assign);
});

const updateBilled = catchAsync(async (req, res) => {
  const billed = await wardAdminService.updateBilled(req.params.id);
  res.send(billed);
});

// AFTER PACKED BY WARD LOADING EXECUTE

const wardloadExecutivePacked = catchAsync(async (req, res) => {
  const packedOnly = await wardAdminService.wardloadExecutivePacked(req.params.range, req.params.page);
  res.send(packedOnly);
});

const wardDeliveryExecutive = catchAsync(async (req, res) => {
  const name = await wardAdminService.wardDeliveryExecutive();
  res.send(name);
});

const updateAcknowledgeSingle = catchAsync(async (req, res) => {
  const Acknowledged = await wardAdminService.updateAcknowledgeSingle(req.params.id, req.body);
  res.send(Acknowledged);
});

// const statusMatchingAppOrModi = catchAsync(async (req, res) => {
//   let statusMatching;
//   if (req.params.status == 'Acknowledged') {
//     statusMatching = await wardAdminService.getdetailsDataStatusAcknowledged(
//       req.params.limit,
//       req.params.page,
//       req.params.status
//     );
//   } else if (req.params.status == 'ordered') {
//     statusMatching = await wardAdminService.getdetailsDataStatusOdered(req.params.limit, req.params.page, req.params.status);
//   } else if (req.params.status == 'Rejected') {
//     statusMatching = await wardAdminService.getdetailsDataStatusRejected(
//       req.params.limit,
//       req.params.page,
//       req.params.status
//     );
//   } else if (
//     req.params.status == 'Approved' ||
//     req.params.status == 'Modified' ||
//     req.params.status == 'Packed' ||
//     req.params.status == 'Assigned'
//   ) {
//     statusMatching = await wardAdminService.getAppOrModifiedStatus(req.params.limit, req.params.page, req.params.status);
//   }
//   res.send(statusMatching);
// });

const statusMatchingAppOrModi = catchAsync(async (req, res) => {
  let hover = moment().subtract(-1, 'hours').format('H');
  let timeslot = [
    { start: 10, end: 20 },
    { start: 20, end: 30 },
    { start: 30, end: 40 },
    { start: 40, end: 50 },
    { start: 50, end: 60 },
    { start: 60, end: 70 },
    { start: 70, end: 80 },
    { start: 80, end: 90 },
    { start: 900, end: 1000 },
    { start: 1000, end: 1100 },
    { start: 1100, end: 1200 },
    { start: 1200, end: 1300 },
    { start: 1300, end: 1400 },
    { start: 1400, end: 1500 },
    { start: 1500, end: 1600 },
    { start: 1600, end: 1700 },
    { start: 1700, end: 1800 },
    { start: 1800, end: 1900 },
    { start: 1900, end: 2000 },
    { start: 2000, end: 2100 },
    { start: 2100, end: 2200 },
    { start: 2200, end: 2300 },
    { start: 2300, end: 2400 },
    { start: 2400, end: 2500 },
  ];
  let lapsed = timeslot[hover].start;
  console.log(req.params.type, req.params.time, req.params.status, req.params.limit, req.params.page);
  let statusMatching;
  if (req.params.status == 'Acknowledged') {
    statusMatching = await wardAdminService.getdetailsDataStatusAcknowledged(
      req.params.type,
      req.params.time,
      req.params.status,
      req.params.limit,
      req.params.page
    );
  } else if (req.params.status == 'ordered') {
    statusMatching = await wardAdminService.getdetailsDataStatusOdered(
      req.params.type,
      req.params.time,
      req.params.status,
      req.params.limit,
      req.params.page
    );
  } else if (req.params.status == 'Rejected') {
    statusMatching = await wardAdminService.getdetailsDataStatusRejected(
      req.params.type,
      req.params.time,
      req.params.status,
      req.params.limit,
      req.params.page
    );
  } else if (
    req.params.status == 'Approved' ||
    req.params.status == 'Modified' ||
    req.params.status == 'Packed' ||
    req.params.status == 'Assigned'
  ) {
    statusMatching = await wardAdminService.getAppOrModifiedStatus(
      req.params.type,
      req.params.time,
      req.params.status,
      req.params.limit,
      req.params.page
    );
  } else if (req.params.status == 'lapsed') {
    statusMatching = await wardAdminService.getdetailsDataStatuslasped(
      req.params.type,
      req.params.time,
      req.params.status,
      req.params.limit,
      req.params.page
    );
  }
  res.send(statusMatching);
});

const countStatus = catchAsync(async (req, res) => {
  const Acknowledged = await wardAdminService.countStatus(req.params.id, req.body);
  res.send(Acknowledged);
});

const getAssigned_details = catchAsync(async (req, res) => {
  const orderAssign = await wardAdminService.getAssigned_details();
  res.send(orderAssign);
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
  createArrayData,

  updateAcknowledgeSingle,
  updateApproval,
  updateRejectionStatus,
  countStatus,
  statusMatchingAppOrModi,
  getAssigned_details,
  updatePackedStatus,
  wardloadExecutivepacked,
  wardloadExecutivebtgroup,
};
