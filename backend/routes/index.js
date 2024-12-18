const express = require('express')

const router= express.Router()

const userSignUpController = require("../controller/user/userSignup")
const userSignIncontroller = require("../controller/user/userSignin")
const userDetailsController = require("../controller/user/userDetails")
const authToken =require("../middleware/authToken")
const userLogout = require("../controller/user/userLogout")
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require("../controller/product/uploadProduct")
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const filterProductController =require('../controller/product/filterProduct')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartView')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCart')
const searchProduct = require('../controller/product/searchProduct')
const paymentController = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.Controller')
const allOrderController = require('../controller/order/allorderController')
const deleteProductController = require('../controller/product/deleteProduct')
const sendOtpController = require('../controller/user/sendOtpController')
const verifyOtpController = require('../controller/user/verifyOtpController')
const resetPasswordController = require('../controller/user/resetPasswordController')





router.post("/signup",userSignUpController)
router.post("/signin",userSignIncontroller )
router.post("/send-otp",sendOtpController)
router.post("/verify-otp",verifyOtpController)
router.post('/reset-password', resetPasswordController);
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)


//admin-panel
router.get("/all-users",authToken,allUsers)
router.post("/update-user",authToken,updateUser)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",updateProductController)
router.delete("/delete-product",authToken,deleteProductController)
router.get("/get-categoryproduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.post("/filter-product",filterProductController)
router.get("/search",searchProduct)

//add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-cart-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)


//payment section
 router.post("/checkout-section",authToken,paymentController)
 router.post("/webhook",webhooks) // api/webhook
 router.get("/order-list",authToken,orderController)
 router.get("/allorder",authToken,allOrderController)

module.exports =router