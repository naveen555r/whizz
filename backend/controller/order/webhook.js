const stripe = require('../../config/stripe')
const orderModel = require('../../models/orderProductModel')
const addToCartModel=require('../../models/cartProduct')
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_KEY

async function getLineItems(lineItems){
    let productItems =[]

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await stripe.products.retrieve(item.price.product)
            const productId= product.metadata.productId

            const productData={
                productId :  productId,
                name: product.name,
                price: item.price.unit_amount/100,
                quantity:item.quantity,
                image: product.images
            }
            productItems.push(productData)

            
        } 
    }
    return productItems
}

const webhooks = async (request, response) => {
  const signature = request.headers['stripe-signature'];

  const payloadString = JSON.stringify(request.body);

  const header = stripe.webhooks.generateTestHeaderString({
    payload :  payloadString,
    secret :  endpointSecret,
  });

  let event;
  try {

    
    event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);

    console.log("Stripe Event Received:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const session = event.data.object;
        console.log("Session Object:", session);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        console.log("Line Items:", lineItems);

        const productDetails = await getLineItems(lineItems);
        console.log("Product Details:", productDetails);

        const shippingDetails = session.shipping_details;
        console.log('Shipping Details:', shippingDetails);

      

        const orderDetails = {
          productDetails,
          email: session.customer_email,
          userId: session.metadata.userId,
          paymentDetails: {
            paymentId: session.payment_intent,
            payment_method_type: session.payment_method_types,
            payment_status: session.payment_status,
          },
          
          shipping_options: session.shipping_options
            ? session.shipping_options.map((s) => ({
                ...s,
                shipping_amount: s.shipping_amount / 100,
              }))
            : [],
            shippingDetails: session.shipping_details
            ? {
                shipping_name: session.shipping_details.name || '',
                shipping_address: session.shipping_details.address
                  ? {
                      line1: session.shipping_details.address.line1 || '',
                      line2: session.shipping_details.address.line2 || '',
                      city: session.shipping_details.address.city || '',
                      state: session.shipping_details.address.state || '',
                      postal_code: session.shipping_details.address.postal_code || '',
                      country: session.shipping_details.address.country || '',
                    }
                  : {},
              }
            : {},
              
             

          totalAmount: session.amount_total / 100,
        };

        const order = new orderModel(orderDetails);
        const saveOrder = await order.save();
        console.log("Order Saved:", saveOrder);

        if (saveOrder?._id) {
          const deleteCartItems = await addToCartModel.deleteMany({ userId: session.metadata.userId });
          console.log("Deleted Cart Items:", deleteCartItems);
        }
      } catch (error) {
        console.error("Error Handling Checkout Session:", error.message);
        return response.status(500).send(`Internal Server Error: ${error.message}`);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  response.status(200).send();
};

 

module.exports = webhooks

