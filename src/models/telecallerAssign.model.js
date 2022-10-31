const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const TelecallerteamSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    telecallerHeadId: {
        type: String,
      },
    telecallerteamId: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    reAssignDate:{
      type:String,
    },
    reAssignTime:{
      type:String,
    },
    status:{
      type:String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
  });
  
  const Telecallerteam = mongoose.model('Telecallerteam', TelecallerteamSchema);
  module.exports = Telecallerteam;