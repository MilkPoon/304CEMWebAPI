const dataSource = {
  users: [
    { username: 'root', password: 'root', nickname: 'ROOT', type: 'admin' },
    { username: 'admin', password: 'admin', nickname: 'ADMIN', type: 'user' },
  ],
  goods: [
    { name: '2001spaceodyssey', price: 1.0, image: '/images/2001spaceodyssey.jpg'},
    { name: 'alannathefirstadventure', price: 2.0, image: '/images/alannathefirstadventure.jpg'},
    { name: 'aliceinwonderland', price: 3.0, image: '/images/aliceinwonderland.jpg'},
    { name: 'callofthewild', price: 4.0, image: '/images/callofthewild.jpg'},
    { name: 'colorofmagic', price: 5.0, image: '/images/colorofmagic.jpg'},
    { name: 'computernetworks', price: 6.0, image: '/images/computernetworks.jpg'},
    { name: 'forbiddencityofclouds', price: 7.0, image: '/images/forbiddencityofclouds.jpg'},
    { name: 'girlslasttour', price: 8.0, image: '/images/girlslasttour.jpg'},
  ]
};

module.exports = { dataSource };
