var Action = require(path.join(__dirname, '/router/action'));
var action = new Action();

module.exports = function () {
  var Parts = new Object();
  
  Parts.favoriteButton = function (item, XFZ) {
    var container = document.createElement('div');
    var favorite = document.createElement('input');
    favorite.type = 'button';
    favorite.value = '收藏';
    favorite.classList.add('t-right-button');
    favorite.id = item.id + 'f';
    favorite.dataset.id = item.id;
    favorite.addEventListener('click', function(e){
      var item = XFZ.status.timeline.cache[e.target.dataset.id];
      var unfavoriteButton = document.getElementById(item.id + 'uf');
      if (!favorite.dataset.loading) {
        favorite.dataset.loading = 0
      }
      favorite.dataset.loading++;
      if (favorite.dataset.loading === 1) {
        action.favoriteStatus({msgId : e.target.dataset.id}, function (data) {
          if (data.success) {
            XFZ.setAlert('success', 'favorite');
            favorite.classList.toggle('t-hidden');
            unfavoriteButton.classList.toggle('t-hidden');
            favorite.dataset.loading = 0;
          }
        });
      }
    }, false);
    var unfavorite = document.createElement('input');
    unfavorite.type = 'button';
    unfavorite.value = '取消收藏';
    unfavorite.classList.add('t-right-button');
    unfavorite.id = item.id + 'uf';
    unfavorite.dataset.id = item.id;
    unfavorite.addEventListener('click', function (e) {
      var item = XFZ.status.timeline.cache[e.target.dataset.id];
      var favoriteButton = document.getElementById(item.id + 'f');
      if (!unfavorite.dataset.loading) {
        unfavorite.dataset.loading = 0;
      }
      unfavorite.dataset.loading++;
      if (unfavorite.dataset.loading === 1) {
        action.favoriteStatus({msgId : e.target.dataset.id, state: 'destroy'}, function (data) {
          if (data.success) {
            XFZ.setAlert('success', 'unfavorite');
            unfavorite.classList.toggle('t-hidden');
            favoriteButton.classList.toggle('t-hidden');
            unfavorite.dataset.loading = 0;
          }
        });
      }
    });
    if (item.favorited) {
      favorite.classList.toggle('t-hidden');
    } else {
      unfavorite.classList.toggle('t-hidden');
    }
    container.appendChild(favorite);
    container.appendChild(unfavorite);
    return container;
  } 
  return parts;
}