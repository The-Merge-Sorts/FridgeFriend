const express = require("express");

const {
  addFridge,
  getAllFridgesGeoCode,
  getFridgeInfoByID,
  updateByField
} = require("./fridges.controller");
/*
getFridgeGeoCode
getFridgesImagesB
*/

const fridgesRouter = express.Router();

fridgesRouter
  .route('/:id')
  .get(getFridgeInfoByID)
  .put(updateByField)

fridgesRouter
  .route('/')
  .post(addFridge)
  .get(getAllFridgesGeoCode)
//   .put()
//   .delete();


module.exports = fridgesRouter;
