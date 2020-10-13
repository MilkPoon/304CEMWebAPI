let user = { flag: false }
open('index');

function open(name, id) {
  if (name === 'login') {
    $('#login').show()
    $('#view').hide();
    $('#register').hide();
    $('#edit').hide();
  }
  if (name === 'register') {
    $('#register').show()
    $('#login').hide()
    $('#view').hide();
    $('#edit').hide();
  }
  if (name === 'edit') {
    if (user.flag) {
      $('#header-view').html('Edit Profile')
      $('#edit-username').val(user.username);
      $('#edit-password').val(user.password);
      $('#edit-password1').val(user.password);
      $('#edit-email').val(user.email);
      $('#edit-phone').val(user.phone);

      $('#edit').show();
      $('#register').hide();
      $('#login').hide()
      $('#view').hide();
      $('#tip').hide();
    } else {
      open('index')
      $('#tip').show();
    }
  }
  if (name === 'favorite') {
    if (user.flag) {
      $.ajax({
        url: '/favorite',
        method: 'get',
        success: function(res) {
          $('#header-view').html('My Favorite')
          $('#list').html('');
          let result = '';
          res.list.forEach(item => {
            result += `
            <div class="good">
              <div class="thumbnail">
                <img src="${item.image}">
                <div class="caption">
                  <h3 style="overflow: hidden;text-overflow:ellipsis;">
                    <a href="javascript: open('detail', '${item._id}')">${item.name}</a>
                  </h3>
                  <p class="price">$ ${item.price}</p>
                  <p>
                    <a href="javascript: deleteFavorite('${item._id}')" class="btn btn-danger" role="button">
                      <i class="glyphicon glyphicon-trash"></i>&nbsp;Delete</a>
                  </p>
                </div>
              </div>
            </div>
          `
          })
          $('#list').html(result);
        },
      });
      $('#showUsername').html(user.username);
      $('#logined').show();
      $('#loginout').hide();
      $('#view').show();
      $('#login').hide();
      $('#register').hide();
      $('#edit').hide();
      $('#tip').hide();
    } else {
      open('index')
      $('#tip').show();
    }
  }
  if (name === 'cart') {
    if (user.flag) {
      $.ajax({
        url: '/cart',
        method: 'get',
        success: function(res) {
          $('#list').html('');
          $('#header-view').html('My Shopping Cart <a class="btn btn-danger" href="javascript: buy()">Buy All</a>')
          let result = '';
          res.list.forEach(item => {
            result += `
            <div class="good">
              <div class="thumbnail">
                <img src="${item.image}">
                <div class="caption">
                  <h3 style="overflow: hidden;text-overflow:ellipsis;">
                    <a href="javascript: open('detail', '${item._id}')">${item.name}</a>
                  </h3>
                  <p class="price">$ ${item.price}</p>
                  <p>
                    <a href="javascript: deleteCart('${item._id}')" class="btn btn-danger" role="button">
                      <i class="glyphicon glyphicon-trash"></i>&nbsp;Delete</a>
                  </p>
                </div>
              </div>
            </div>
          `
          })
          $('#list').html(result);
        },
      });
      $('#showUsername').html(user.username);
      $('#logined').show();
      $('#loginout').hide();
      $('#view').show();
      $('#login').hide();
      $('#register').hide();
      $('#edit').hide();
      $('#tip').hide();
    } else {
      open('index')
      $('#tip').show();
    }
  }
  if (name === 'order') {
    if (user.flag) {
      $.ajax({
        url: '/order',
        method: 'get',
        success: function(res) {
          $('#list').html('');
          $('#header-view').html('My Order');
          let result = '';
          res.list.forEach(item => {
            result += `
            <div class="good">
              <div class="thumbnail">
                <img src="${item.image}">
                <div class="caption">
                  <h3 style="overflow: hidden;text-overflow:ellipsis;">
                    <a href="javascript: open('detail', '${item._id}')">${item.name}</a>
                  </h3>
                  <p class="price">$ ${item.price}</p>
                </div>
              </div>
            </div>
          `
          })
          $('#list').html(result);
        },
      });
      $('#showUsername').html(user.username);
      $('#logined').show();
      $('#loginout').hide();
      $('#view').show();
      $('#login').hide();
      $('#register').hide();
      $('#edit').hide();
      $('#tip').hide();
    } else {
      open('index')
      $('#tip').show();
    }
  }
  if (name === 'detail') {
    $('#tip').hide();
    $('#view').show();
    $('#login').hide();
    $('#register').hide();
    $('#edit').hide();
    $('#header-view').html('');
    $.ajax({
      url: `/good/${id}`,
      method: 'get',
      success: function(res) {
        $.ajax({
          url: `/comment/${res.name}`,
          method: 'get',
          success: function(resource) {
            $('#list').html('');
            let result = ``;
            result += `
              <div class="good">
                <div class="thumbnail">
                  <img src="${res.image}">
                  <div class="caption">
                    <h3 style="overflow: hidden;text-overflow:ellipsis;">
                      <a href="javascript: open('detail', '${res._id}')">${res.name}</a>
                    </h3>
                    <p class="price">$ ${res.price}</p>
                  </div>
                </div>
              </div>
            `
            result += '<div style="display: flex;flex-direction: column;width: 200px;flex-grow: 1;margin-left: 10px;">'
            if (user.flag) {
              result += `<textarea id="comment"></textarea> <a href="javascript: comment('${res.name}', '${id}')" class="btn btn-default">submit</a>`;
            }
            result += `<h3>Comments<a class="btn" href="javascript: open('login')">Please Login</a></h3>`
            if (resource.length > 0) {
              resource.forEach(item => {
                result += `
                <div class="comment-item">
                  <span>username: </span>${item.username}
                  <p>${item.comment}</p>
                </div>
                `
              });
            } else {
              result += '<h1 style="text-align: center;">NOTHING</h1>'
            }
            result += '</div>'
            $('#list').html(result);
          }
        })
      }
    })
  }
  if (name === 'index' || name === '/') {
    $('#header-view').html('');
    $.ajax({
      url: '/good',
      method: 'get',
      success: function(res) {
        if (res.user) {
          user = {
            ...res.user,
            flag: true,
          }
        }
        $('#list').html('');
        let result = ``;
        res.list.forEach(item => {
          result += `
          <div class="good">
            <div class="thumbnail">
              <img src="${item.image}">
              <div class="caption">
                <h3 style="overflow: hidden;text-overflow:ellipsis;">
                  <a href="javascript: open('detail', '${item._id}')">${item.name}</a>
                </h3>
                <p class="price">$ ${item.price}</p>
                <p>
                  ${item.favorite ? `<a class="btn btn-default" role="button" style="color: red">
                    <i class="glyphicon glyphicon-heart"></i>
                  </a>` : `<a href="javascript:favorite('${item._id}')" class="btn btn-default" role="button">
                    <i class="glyphicon glyphicon-heart"></i>
                  </a>` }
                  <a href="javascript:addCart('${item._id}')" class="btn btn-default" role="button">
                    <i class="glyphicon glyphicon-shopping-cart"></i>
                  </a>
                </p>
              </div>
            </div>
          </div>
        `
        })
        $('#list').html(result);
        if (user.flag) {
          $('#showUsername').html(user.username);
          $('#logined').show();
          $('#loginout').hide();
        } else {
          $('#logined').hide();
          $('#loginout').show();
        }
        $('#tip').hide();
        $('#view').show();
        $('#login').hide();
        $('#register').hide();
        $('#edit').hide();
      },
    });
  }
}

function login() {
  const username = $('#login-username').val()
  const password = $('#login-password').val()
  if (!username || !password) {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    },
    success: result => {
      user = result.user;
      user.flag = true;
      open('index');
    },
    error: error => {
      user.flag = false;
      $('#login-tip').show();
    }
  })
}

function comment(name, id) {
  const comment = $('#comment').val();
  $.ajax({
    url: '/comment',
    method: 'post',
    data: {
      name,
      comment
    },
    success: function() {
      open('detail', id);
    }
  })
}

function register() {
  const username = $('#register-username').val()
  const password = $('#register-password').val()
  const password1 = $('#register-password').val()
  const email = $('#register-email').val()
  const phone = $('#register-phone').val()
  if (!username || !password || password !== password1) {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/register',
    method: 'post',
    data: {
      username,
      password,
      email,
      phone,
      password
    },
    success: result => {
      open('login')
    },
    error: error => {
      $('#register-tip').show();
    }
  })
}

function edit() {
  if (user.flag) {
    $('#tip').show();
    return;
  } else {
    $('#tip').hide();
  }
  $('#edit-tip').hide();
  const username = $('#edit-username').val()
  const password = $('#edit-password').val()
  const password1 = $('#edit-password').val()
  const email = $('#edit-email').val()
  const phone = $('#edit-phone').val()
  if (!username || !password || password !== password1) {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/edit',
    method: 'put',
    data: {
      username,
      password,
      email,
      phone,
      password
    },
    success: result => {
      open('login')
    },
    error: error => {
      $('#edit-tip').show();
    }
  })
}

function reset() {
  $('#username').val('')
  $('#password').val('')
  $('#password1').val('')
  $('#email').val('')
  $('#phone').val('')
}

function loginout() {
  $.ajax({
    url: '/loginout',
    method: 'post',
    success: result => {
      window.location.reload();
    }
  })
}

function favorite(id) {
  if (user.flag) {
    $('#tip').hide();
  } else {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/favorite',
    method: 'post',
    data: {
      id
    },
    success: result => {
      open('index')
    }
  })
}

function addCart(id) {
  if (user.flag) {
    $('#tip').hide();
  } else {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/cart',
    method: 'post',
    data: {
      id
    },
    success: result => {
      open('cart')
    }
  })
}

function buy() {
  if (user.flag) {
    $('#tip').hide();
  } else {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/buy',
    method: 'post',
    success: result => {
      open('order')
    }
  })
}

function deleteCart(id) {
  if (user.flag) {
    $('#tip').hide();
  } else {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/cart',
    method: 'delete',
    data: {
      id
    },
    success: result => {
      open('cart')
    }
  })
}

function deleteFavorite(id) {
  if (user.flag) {
    $('#tip').hide();
  } else {
    $('#tip').show();
    return;
  }
  $.ajax({
    url: '/favorite',
    method: 'delete',
    data: {
      id
    },
    success: result => {
      open('favorite')
    }
  })
}