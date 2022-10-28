const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Roles } = require('../models');
const { Shop } = require('../models/b2b.ShopClone.model');
const  Telecallerteam  = require('../models/telecallerAssign.model');
const { Users } = require('../models/B2Busers.model');
const moment = require('moment');
const createtelecallerAssignReassign = async (body) => {
    let { arr } = body;
    let serverdate = moment().format('yyy-MM-DD');
    let time = moment().format('hh:mm a');
    if (body.status == 'Assign') {
      arr.forEach(async (e) => {
        await Users.findByIdAndUpdate({ _id: e }, { telecallerStatus: body.status }, { new: true });
        await Telecallerteam.create({
          telecallerHeadId: body.telecallerHeadId,
          telecallerteamId: e,
          status: body.status,
          date: serverdate,
          time: time,
        });
      });
    } else {
      arr.forEach(async (e) => {
        let data = await Telecallerteam.find({ telecallerHeadId: body.telecallerHeadId, telecallerteamId: e, status: 'Assign' });
        data.forEach(async (f) => {
          await Users.findByIdAndUpdate({ _id: f.telecallerteamId }, { telecallerStatus: body.status }, { new: true });
          await Telecallerteam.findByIdAndUpdate(
            { _id: f._id },
            { telecallerHeadId: f.telecallerHeadId, telecallerteamId: f.telecallerteamId, status: body.status, reAssignDate: serverdate, reAssignTime: time },
            { new: true }
          );
        });
      });
    }
    return 'created';
  };

  module.exports = {
    createtelecallerAssignReassign,
  }