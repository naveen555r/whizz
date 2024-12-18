const productMOdel = require("../../models/productModel")

 const getCategoryProduct = async(req,res)=>{
    try{
        const productCategory = await productMOdel.distinct("category")
        console.log("category", productCategory )
        //ARRAY TO STORE ONE PRODUCT  FROM EACH CATEGORY
        const productByCategory = []

        for(const category of productCategory){

            const product = await productMOdel.findOne({category})

            if(product){
                productByCategory.push(product)
            }

        }

        res.json({
            message : "category product",
            data : productByCategory,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error: true,
            success : false
        })

    }
 }

 module.exports = getCategoryProduct









