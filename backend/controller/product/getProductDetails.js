const productMOdel = require('../../models/productModel')

const getProductDetails = async(req,res)=>{
    try{
        const { productId } = req.body

        const product = await productMOdel.findById(productId)

        res.json({
            data : product,
            message: "ok",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getProductDetails