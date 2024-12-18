const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    productDetails: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
    paymentDetails: {
      paymentId: {
        type: String,
        default: '',
      },
      payment_method_type: [],
      payment_status: {
        type: String,
        default: '',
      },
    },
    shipping_options: [],
    totalAmount: {
      type: Number,
      default: 0,
    },
    shippingDetails: {
      shipping_name: {
        type: String,
        default: '',
      },
      shipping_address: {
        line1: { type: String, default: '' },
        line2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postal_code: { type: String, default: '' },
        country: { type: String, default: '' },
      },
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
