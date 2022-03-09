const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { customerService, tokenService } = require('../services');

const createCustomer = catchAsync(async (req, res) => {
    const customer= await customerService.createCustomer(req.body);
    res.status(httpStatus.CREATED).send(customer);
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const customer = await customerService.loginCustomerWithEmailAndPassword(email, password);
    res.send({ customer });
});

const getCustomers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['firstName', 'lastName']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await customerService.queryOems(filter, options);
    res.send(result);
});

const getCustomer = catchAsync(async (req, res) => {
    const customer = await customerService.getOemById(req.params.customerId);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }
    res.send(customer);
});

const listCustomer = catchAsync(async (req, res) => {
    const results = await customerService.listCustomer();
    res.send(results);
});

const updateCustomer = catchAsync(async (req, res) => {
    const customer = await customerService.updateCustomerById(req.params.customerId, req.body);
    res.send(customer);
});

const resetPassword = catchAsync(async (req, res) => {
    await customerService.resetPassword(req.params.customerId, req.body.newPassword);
    res.status(httpStatus.NO_CONTENT).send();
});
  
  const changePassword = catchAsync(async (req, res) => {
    await customerService.changePassword(req.params.customerId, req.body.oldPassword, req.body.newPassword);
    res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
    createCustomer,
    login,
    getCustomer,
    getCustomers,
    updateCustomer,
    resetPassword,
    changePassword,
    listCustomer,
};