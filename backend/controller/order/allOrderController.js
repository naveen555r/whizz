const orderModel = require('../../models/orderProductModel');
const userModel = require('../../models/userModels');

const allOrderController =async(request,response)=>{
    const userId =request.userId

    const user = await userModel.findById(userId)

    if(user.role !=='Admin'){
        return response.status(400).json({
            message:"Access denied"
        })
    } 

    const Allorder = await orderModel.find().sort({createdAt:-1})

    return response.status(200).json({
        data : Allorder,
        success: true
    })

}
module.exports = allOrderController