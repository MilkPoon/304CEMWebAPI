const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose')
const hbs = require('hbs');

const { userSchema, goodSchema, favoriteSchema, orderSchema, cartSchema, commentSchema } = require('./db');
const { dataSource } = require('./init');

var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// set view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// set static assets
app.use(express.static(__dirname + '/static'));

// db
const User = mongoose.model('User', userSchema);
const Good = mongoose.model('Good', goodSchema);
const Favorite = mongoose.model('Favorite', favoriteSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Comment = mongoose.model('Comment', commentSchema);
mongoose.connect('mongodb://admin:admin@localhost:27017/304cem?authSource=admin', {
  useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.connection.on("connected", async () => {
  console.log('connect mongodb success');
  // init data
  const users = await User.find();
  users.forEach(async item => {
    await User.remove({_id: item._id});
  })
  dataSource.users.forEach(async item => {
    await User.create(item);
  })
  dataSource.goods.forEach(async item => {
    await Good.remove(item);
    await Good.create(item);
  })
  const comments = await Comment.find();
  comments.forEach(async item => {
    await Comment.remove(item);
  })
  const carts = await Cart.find();
  carts.forEach(async item => {
    await Cart.remove(item);
  })
  const orders = await Order.find();
  orders.forEach(async item => {
    await Order.remove(item);
  })
  const favorites = await Favorite.find();
  favorites.forEach(async item => {
    await Favorite.remove(item);
  })
  console.log('init db success');
})
mongoose.connection.on("error", () => {
  console.log('connect mongodb error');
})

// views
app.get('/', function(req, res) {
  res.sendFile("index.html");
});

// api
app.get('/comment/:name', async function(req, res) {
  const name = req.params.name;
  const comments = await Comment.find({ name: name});
  console.log(`req: GET /comment/${name}`, comments);
  res.status(200).send(comments);
})

app.post('/comment', async function(req, res) {
  let data = undefined;
  if (req.session.user) {
    data = JSON.parse(req.session.user);
  }
  const comment = req.body;
  comment.username = data.user.username;
  await Comment.create(comment);
  console.log(`req: POST /comment`, comment);
  res.status(200).send();
})

app.get('/good', async function(req, res) {
  let data = undefined;
  let list = await Good.find();
  let favorites = []
  if (req.session.user) {
    data = JSON.parse(req.session.user);
    favorites = await Favorite.find({ username: data.user.username });
  }
  console.log(`req: GET /good`, list.map(item => {
    const temp = {
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    }
    temp.name = item.name.toUpperCase();
    temp.favorite = favorites.findIndex(el => el.image === item.image) > -1;
    return temp;
  }));
  res.status(200).send({
    user: req.session.user ? data.user : undefined,
    list: list.map(item => {
      const temp = {
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
      }
      temp.name = item.name.toUpperCase();
      temp.favorite = favorites.findIndex(el => el.image === item.image) > -1;
      return temp;
    })
  });
});

app.get('/good/:id', async function(req, res) {
  var id = req.params.id;
  const good = await Good.findById(id)
  console.log(`req: GET /good/${id}`, good);
  res.status(200).send(good);
});

app.get('/favorite', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const data = JSON.parse(req.session.user);
  const list = await Favorite.find({ username: data.user.username });
  console.log(`req: GET /favorite/`, list);
  res.status(200).send({
    user: { ...data.user, login: true },
    list
  });
});

app.get('/order', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const data = JSON.parse(req.session.user);
  const list = await Order.find({ username: data.user.username });
  console.log(`req: GET /order/`, list);
  res.status(200).send({
    user: { ...data.user, login: true },
    list
  });
});

app.get('/cart', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const data = JSON.parse(req.session.user);
  const list = await Cart.find({ username: data.user.username });
  console.log(`req: GET /cart/`, list);
  res.status(200).send({
    user: { ...data.user, login: true },
    list
  });
});

app.put('/edit', async function(req, res) {
  const user = req.body;
  try {
    const data = JSON.parse(req.session.user);
    const id = data.user._id;
    const one = await User.findById(id);
    if (!one) {
      res.status(500).send({ error: 'error' });
      return
    }
    await User.findByIdAndUpdate(one._id, {
      username: user.username === '' ? undefined : user.username,
      password: user.password === '' ? undefined : user.password,
      email: user.email === '' ? undefined : user.email,
      phone: user.phone === '' ? undefined : user.phone,
    });
    console.log(`req: PUT /edit/`, user);
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ error: 'error' });
  }
})

app.put('/good', async function(req, res) {
  const good = req.body;
  try {
    const one = await Good.findById(good._id);
    if (!one) {
      res.status(500).send({ error: 'error' });
      return
    }
    await Good.findByIdAndUpdate(good._id, good);
    console.log(`req: PUT /good/`, good);
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ error: 'error' });
  }
})

app.post('/login', async function(req, res) {
  const user = req.body;
  try {
    const result = await User.findOne(user);
    if (result) {
      req.session.user = JSON.stringify({ user: result });
      console.log(`login success`);
      res.status(200).send({ user: result });
    } else {
      console.log(`login error`);
      res.status(500).send({ error: 'error' });
    }
  } catch (e) {
    console.log(`login error`);
    res.status(500).send({ error: 'error' });
  }
})

app.post('/register', async function(req, res) {
  const user = req.body;
  try {
    const one = await User.find({ username: user.username });
    if (one.length > 0) {
      res.status(500).send({ error: 'error' });
      return
    }
    user.nickname = user.username.toUpperCase();
    user.type = 'user';
    const result = await User.create(user);
    console.log(`req: POST /register`, user);
    res.status(200).send({ user: result });
  } catch (e) {
    res.status(500).send({ error: 'error' });
  }
})

app.post('/loginout', function(req, res) {
  req.session.user = undefined;
  console.log(`req: POST /loginout`);
  res.status(200).send({ user: { flag: false } });
})

app.post('/favorite', async function(req, res) {
  if (!req.session.user) {
    res.redirect('/index')
    return;
  }
  const data = JSON.parse(req.session.user);
  const id = req.body.id;
  const good = await Good.findById(id);
  good.username = data.user.username;
  console.log(`req: POST /favorite`, {
    name: good.name,
    price: good.price,
    image: good.image,
    username: data.user.username,
  });
  await Favorite.create({
    name: good.name,
    price: good.price,
    image: good.image,
    username: data.user.username,
  });
  res.status(200).send();
})

app.post('/cart', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const data = JSON.parse(req.session.user);
  const id = req.body.id;
  const good = await Good.findById(id);
  good.username = data.user.username;
  console.log(`req: POST /cart`, {
    name: good.name,
    image: good.image,
    price: good.price,
    username: data.user.username,
  });
  await Cart.create({
    name: good.name,
    image: good.image,
    price: good.price,
    username: data.user.username,
  });
  res.status(200).send();
})

app.post('/buy', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const data = JSON.parse(req.session.user);
  const carts = await Cart.find({ username: data.user.username});
  carts.forEach(async item => {
    await Order.create({
      name: item.name,
      image: item.image,
      price: item.price,
      username: data.user.username,
    });
    await Cart.remove({ _id: item.id });
  })
  console.log(`req: POST /buy`, carts);
  res.status(200).send();
})

app.delete('/favorite', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const id = req.body.id;
  await Favorite.remove({ _id: id })
  console.log(`req: DELETE /favorite`, id)
  res.status(200).send();
})

app.delete('/order', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const id = req.body.id;
  await Order.remove({ _id: id })
  console.log(`req: DELETE /order`, id)
  res.status(200).send();
})

app.delete('/cart', async function(req, res) {
  if (!req.session.user) {
    res.status(500).send({ error: 'error' });
    return;
  }
  const id = req.body.id;
  await Cart.remove({ _id: id });
  console.log(`req: DELETE /cart`, id)
  res.status(200).send();
})

// listen port
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Listen at http://%s:%s", host, port)
})
