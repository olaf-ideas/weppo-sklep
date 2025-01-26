const Cart = require('../models/Cart');
const CartProduct = require('../models/CartProduct');

exports.addProductToCart = async (req, res) => {
  const productId = req.params.id;
  const quantity = 1;
  const userId = req.signedCookies.userId;

  try {
    const cart = await Cart.findOne({ where: { userId: userId }});

    if (!cart) {
      return res.status(400).send('Cart not found');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).send('Product not found');
    }

    const cartProduct = await CartProduct.findOne({
      where: { cartId: cart.id, productId: productId }
    });

    if (cartProduct) {
      cartProduct.quantity += quantity;
      await cartProduct.save();
    }
    else {
      await cart.addProduct(product, { through: { quantity: quantity }});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.removeProductFromCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.signedCookies.userId;

  try {

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};