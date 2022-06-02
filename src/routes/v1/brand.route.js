const express =require("express");
const brandimage=require("../../middlewares/brand")
const router=express.Router();
const brand=require("../../controllers/brand.controller")
router.route("/").post(brandimage.array("image"),brand.createbrand).get(brand.getbrand)

module.exports = router;
