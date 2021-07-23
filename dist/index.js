let beerList = []
let cardWrapper = $('.shop-cards')

$.ajax({
  url: 'https://api.punkapi.com/v2/beers',
  method: 'GET',
  success: function (response) {
    console.log(response)
    response.forEach(beer => {
      createCard(beer)
      beerList = response;
    })
  }
})

function createCard (beer) {
  let image = $('<img/>')
  image.attr('src', beer.image_url)
}