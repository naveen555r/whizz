const Stripe = require('../../config/stripe');
const userModel = require('../../models/userModels');

const paymentController = async (request, response) => {
  try {
    console.log('Request Body:', request.body);

    const { cartItems, shippingAddress } = request.body;

    // Validate cart items
    if (!cartItems || !Array.isArray(cartItems)) {
      return response.status(400).json({
        message: 'Invalid cart items provided',
        error: true,
        success: false,
      });
    }

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode
    ) {
      return response.status(400).json({
        message: 'Incomplete shipping address provided',
        error: true,
        success: false,
      });
    }

    // Fetch user details
    const user = await userModel.findOne({ _id: request.userId });
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    // Create Stripe checkout session parameters
    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['IN'], // Customize allowed countries if needed
      },
      shipping_options: [
        {
          shipping_rate: 'shr_1QM7v6KK7Y99qjRhN1jVCqUa', // Replace with your actual shipping rate ID
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: request.userId,
        shippingAddress: JSON.stringify({
          name: shippingAddress.name,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pinCode: shippingAddress.pinCode,
        }),
      },
      line_items: cartItems.map((item, index) => {
        if (!item.productId) {
          throw new Error(`Missing 'productId' for cart item at index ${index}`);
        }

        const productImages = Array.isArray(item.productId.productImage)
          ? item.productId.productImage
          : [];
        const firstImage = productImages.length > 0
          ? productImages[0]
          : 'https://example.com/default-image.jpg'; // Fallback image if none available

        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.productId.productName,
              images: [firstImage],
              metadata: {
                productId: item.productId._id,
              },
            },
            unit_amount: item.productId.sellingPrice * 100, // Convert to the smallest currency unit
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    // Create checkout session
    const session = await Stripe.checkout.sessions.create(params);

    // Return session URL for redirection
    response.status(303).json(session);
  } catch (error) {
    console.error('Error in paymentController:', error.message);
    response.status(500).json({
      message: error?.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = paymentController;
