const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductController(req, res) {
    try {
        // Check for permission
        const hasPermission = await uploadProductPermission(req.userId); // Ensure this function is async if needed
        if (!hasPermission) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        // Find and delete the product
        const deleteProduct = await productModel.findByIdAndDelete(_id);

        if (!deleteProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Product deleted successfully",
            data: deleteProduct,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
