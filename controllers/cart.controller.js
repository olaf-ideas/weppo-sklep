const Cart = require('../models/Cart');
const CartProduct = require('../models/CartProduct');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const userId = req.signedCookies.userId;
  
  try {
    const cart = await Cart.findOne({ 
      where: { userId },
      include: {
        model: Product,
        through: { attributes: ['quantity'] }
      }
    });

    if (!cart) {
      return res.render('cart', { cart: { items: [], total: 0 }});
    }

    const cartItems = cart.Products.map(prod => ({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: prod.CartProduct.quantity,
      totalPrice: prod.price * prod.CartProduct.quantity,
      imagePath: prod.imagePath
    }));

    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('cart', { cart: { items: cartItems, total: total }});
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  } 
};

exports.updateCart = async (req, res) => {
  const userId = req.signedCookies.userId;
  const productId = req.params.id;
  const action = req.body.action;

  try {
    let cart = await Cart.findOne({ where: { userId }});

    if (!cart) {
      return res.status(400).send('Cart not found');
    }

    const item = await CartProduct.findOne({
      where: { cartId: cart.id, productId: productId }
    });

    if (!item) {
      return res.status(400).send('Item not found');
    } else {
      if (action === 'increase') {
        item.quantity += 1;
        await item.save();
      }
      else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
        await item.save();
      }
    }

    res.redirect('/cart');
  } catch (err) {
    res.status(500).send('Server error');
  }
}

exports.addProductToCart = async (req, res) => {
  const productId = req.params.id;
  const quantity = 1;
  const userId = req.signedCookies.userId;

  try {
    let cart = await Cart.findOne({ where: { userId }});

    if (!cart) {
      cart = await Cart.create({ userId });
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
      await CartProduct.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity
      });
    }

    res.redirect(`/product/${ productId }`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.removeProductFromCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.signedCookies.userId;

  try {
    const cart = await Cart.findOne({ where: { userId: userId }});

    if (!cart) {
      return res.status(400).send('Cart not found');
    }

    if (!await Product.findByPk(productId)) {
      return res.status(400).send('Product not found');
    }

    const cartProduct = await CartProduct.findOne({
      where: { cartId: cart.id, productId: productId }
    });

    if (cartProduct) {
      await cartProduct.destroy();
      res.redirect('/cart');
    }
    else {
      res.status(404).send('Product not in cart');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};