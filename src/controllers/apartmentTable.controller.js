const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const apartmentTableService = require('../services/apartmentTable.service');

const createapartmentTableService = catchAsync(async (req, res) => {
    const apart = await apartmentTableService.createApartment(req.body);     

    if (req.files) {
        //   let path = [];
        //   console.log(req.files)
          req.files.forEach(function (files, index, arr) {
                apart.photoCapture.push("images/apartment/"+files.filename)
                // console.log(shop.photoCapture)
            
          });
          
        }
    res.status(httpStatus.CREATED).send(apart);
    await apart.save();
});

const createshopTableService = catchAsync(async (req, res) => {
    const shop = await apartmentTableService.createShop(req.body);
    if (req.files) {
    //   let path = [];
    //   console.log(req.files)
      req.files.forEach(function (files, index, arr) {
            shop.photoCapture.push("images/shop/"+files.filename)
            // console.log(shop.photoCapture)
        
      });
      
    }
    res.status(httpStatus.CREATED).send(shop);
    await shop.save();
});

const getApartmentById = catchAsync(async (req, res) => {
  const apart = await apartmentTableService.getApartmentById(req.params.apartmentId);
  if (!apart || apart.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'apartment not found');
  }
  res.send(apart);
});

const getAllApartment= catchAsync(async (req, res) => {
    const apart = await apartmentTableService.getAllApartment(req.params);
    if (!apart) {
      throw new ApiError(httpStatus.NOT_FOUND);
    }
    res.send(apart);
  });

  const getAllShop= catchAsync(async (req, res) => {
    const shop = await apartmentTableService.getAllShop(req.params);
    if (!shop) {
      throw new ApiError(httpStatus.NOT_FOUND);
    }
    res.send(shop);
  });

const getShopById = catchAsync(async (req, res) => {
    const shop = await apartmentTableService.getShopById(req.params.shopId);
    if (!shop || shop.active === false) {
      throw new ApiError(httpStatus.NOT_FOUND, 'shop not found');
    }
    res.send(shop);
  });

const updateApartment = catchAsync(async (req, res) => {
  const apart = await apartmentTableService.updateApartmentById(req.params.apartmentId, req.body);
  res.send(apart);
});

const updateShop = catchAsync(async (req, res) => {
    const apart = await apartmentTableService.updateShopById(req.params.shopId, req.body);
    res.send(apart);
  });

const deleteApartment = catchAsync(async (req, res) => {
  await apartmentTableService.deleteapartmentById(req.params.apartmentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteshop = catchAsync(async (req, res) => {
    await apartmentTableService.deleteShopById(req.params.shopId);
    res.status(httpStatus.NO_CONTENT).send();
  });

module.exports = {
    createapartmentTableService,
    createshopTableService,
    getApartmentById,
    getShopById,
    updateApartment,
  updateShop,
  deleteApartment,
  deleteshop,
  getAllShop,
  getAllApartment

};