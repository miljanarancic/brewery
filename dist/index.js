const cardWrapper = $('.shop-cards')
const cartList = $('.aside-cart-list')
const filterName = $('.filter-name')
const filterAbvSlider = $('.filter-abv-slider')
const filterBrewedAfter = $('.filter-brewed-after')
const filterBrewedBefore = $('.filter-brewed-before')
const foodRadio = $('.filter-radio [name=food]')
const navigationList = $('.navigation-list')
const paginationPrevious = $('.shop-pagination-previous')
const paginationNext = $('.shop-pagination-next')
const pageLoader = $('.page-loader')
const pageModal = $('.page-modal')
const pageModalImage = $('.page-modal-content-image')
const pageModalName = $('.page-modal-content-image')
const ingredientsHopsList = $('.ingredients-hops-list')
const ingredientsMaltList = $('.ingredients-malt-list')
const ingredientsYeast = $('.ingredients-yeast')
const pageModalFood = $('.page-modal-content-food')
const cart = []
let cardListStyle = false
let params = ''
let itemsPerPage = 10
let currentPage = 1

fetchCards()

function fetchCards (params) {
  cardWrapper.empty()

  $.ajax({
    url: `https://api.punkapi.com/v2/beers/?per_page=${itemsPerPage}${params || ''}`,
    method: 'GET',
    beforeSend: function () {
      pageLoader.addClass('show')
    },
    success: function (response) {
      if (currentPage === 1) {
        paginationPrevious.attr('disabled', 'disabled')
      }

      if (response.length < 10) {
        paginationNext.attr('disabled', 'disabled')
      }

      response.forEach(beer => {
        createCard(beer)
      })

      window.scrollTo(0, 0)
      pageLoader.removeClass('show')
    }
  })
}

$('.page-modal-content-close').on('click', function () {
  pageModal.removeClass('show')
})

function createCard (beer) {  
  const image = $('<img/>')
  image.addClass('card-image')
  image.attr('src', beer.image_url)
  image.attr('alt', beer.name)
  
  const imageWrapper = $('<div></div>')
  imageWrapper.addClass('card-image-wrapper')
  imageWrapper.append(image)
  imageWrapper.on('click', function () {
    pageModalImage.attr('src', beer.image_url)
    pageModalImage.attr('alt', beer.name)

    pageModalName.text(beer.name)

    ingredientsHopsList.empty()
    beer.ingredients.hops.forEach(hop => {
      const ingredientsListItem = $('<li></li>')
      ingredientsListItem.addClass('ingredients-list-item')
      ingredientsListItem.text(hop.name)

      ingredientsHopsList.append(ingredientsListItem)
    })
    ingredientsMaltList.empty()
    beer.ingredients.malt.forEach(maltItem => {
      const ingredientsListItem = $('<li></li>')
      ingredientsListItem.addClass('ingredients-list-item')
      ingredientsListItem.text(maltItem.name)

      ingredientsMaltList.append(ingredientsListItem)
    })
    $('.ingredients-yeast').text(beer.ingredients.yeast)

    pageModalFood.text(beer.food_pairing.join(', '))

    pageModal.addClass('show')
  })

  const name = $('<span></span>')
  name.addClass('card-name')
  name.text(beer.name)

  const description = $('<span></span>')
  description.addClass('card-description')
  description.text(beer.description)

  const button = $('<button></button>')
  button.addClass('card-button')
  button.text('ADD TO CART')
  button.on('click', function () {
    const cartItem = cart.find(item => item.beer.id === beer.id)

    if (cartItem) {
      cartItem.amount++
    } else {
      cart.push({
        beer,
        amount: 1,
      })
    }
    refreshCart()
  })

  const contentWrapper = $('<div></div>')
  contentWrapper.addClass('card-content-wrapper')
  contentWrapper.append(name, description, button)

  const card = $('<div></div>')
  card.addClass(`shop-cards-card ${cardListStyle ? 'list-style' : ''}`)

  card.append(imageWrapper, contentWrapper)

  cardWrapper.append(card)
}

function refreshCart () {
  cartList.empty()

  if (cart.length) {
    cart.forEach(item => {
      const image = $('<img/>')
      image.addClass('cart-image')
      image.attr('src', item.beer.image_url)
      image.attr('alt', item.beer.name)
      
      const imageWrapper = $('<div></div>')
      imageWrapper.addClass('cart-image-wrapper')
      imageWrapper.append(image)
  
      const name = $('<span></span>')
      name.addClass('cart-content-name')
      name.text(item.beer.name)
  
      const amount = $('<span></span>')
      amount.addClass('cart-content-amount')
      amount.text(`${item.amount}x`)

      const cartDelete = $('<i class="fas fa-times"></i>')
      cartDelete.addClass('cart-content-delete')
      cartDelete.on('click', function () {
        cart.splice(cart.findIndex((deleteItem => deleteItem.beer.id === item.beer.id)), 1)
        refreshCart()
      })
  
      const cartContent = $('<div></div>')
      cartContent.addClass('cart-content')
      cartContent.append(name, amount, cartDelete)
  
      const listItem = $('<li></li>')
      listItem.addClass('aside-cart-list-item')
      listItem.append(imageWrapper, cartContent)
  
      cartList.append(listItem)
    })
  } else {
    cartList.append('<li>No items in your cart</li>')
  }
}

filterAbvSlider.slider({
  range: true,
  min: 0,
  max: 20,
  values: [ 0, 20 ],
  slide: function( event, ui ) {
    $('.filter-abv').text(`${ui.values[ 0 ]}% - ${ui.values[ 1 ]}%`)
  }
})

$('.filter-abv').text(
  `${filterAbvSlider.slider('values', 0)}% - ${filterAbvSlider.slider('values', 1)}%`
)

const datepickerOptions = {
  dateFormat: 'mm-yy',
  changeMonth: true,
  changeYear: true,
  yearRange: "-50:+0",
  showButtonPanel: true,
  onClose: function (dateText, inst) {
    const isDonePressed = inst.dpDiv.find('.ui-datepicker-close').hasClass('ui-state-hover')
    if (isDonePressed) {
      const month = inst.dpDiv.find('.ui-datepicker-month').find(':selected').val()
      const year = inst.dpDiv.find('.ui-datepicker-year').find(':selected').val()
  
      $(this).datepicker('setDate', new Date(year, month, 1)).change()
    }
  },
  beforeShow: function (input, inst) {
    const dateFormat = 'dd-' + $(this).datepicker('option', 'dateFormat')
    let date

    inst.dpDiv.addClass('datepicker-month-year');
  
    try {
      date = $.datepicker.parseDate(dateFormat, '01-' + $(this).val());
    } catch (error) {
      console.log(error)
      return;
    }

    $(this).datepicker('option', 'defaultDate', date);
    $(this).datepicker('setDate', date);
  }
}

filterBrewedAfter.datepicker(datepickerOptions)
filterBrewedBefore.datepicker(datepickerOptions)

$('.filters-button').on('click', function () {
  const beerName = filterName.val()
  const abvGt = filterAbvSlider.slider('values', 0)
  const abvLt = filterAbvSlider.slider('values', 1)
  const brewedAfter = filterBrewedAfter.val()
  const brewedBefore = filterBrewedBefore.val()
  const food = $('.filter-radio [name=food]:checked').val()

  if (beerName) {
    params += `&beer_name=${beerName}`
  }
  if (abvGt) {
    params += `&abv_gt=${abvGt}`
  }
  if (abvLt) {
    params += `&abv_lt=${abvLt}`
  }
  if (brewedAfter) {
    params += `&brewed_after=${brewedAfter}`
  }
  if (brewedBefore) {
    params += `&brewed_before=${brewedBefore}`
  }
  if (food) {
    params += `&food=${food}`
  }

  currentPage = 1

  fetchCards(params)
})

$('.grid-button').on('click', function () {
  cardListStyle = false
  $('.shop-cards-card').each(function () {
    $(this).removeClass('list-style')
  })
})

$('.list-button').on('click', function () {
  cardListStyle = true
  $('.shop-cards-card').each(function () {
    $(this).addClass('list-style')
  })
})

$('.navigation-button').on('click', function () {
  navigationList.toggleClass('open')
})

paginationPrevious.on('click', function () {
  currentPage--
  fetchCards(`${params}&page=${currentPage}`)
  if (currentPage === 1) {
    $(this).attr('disabled', 'disabled')
  } else {
    if ($(this).attr('disabled')) {
      $(this).removeAttr('disabled')
    }
    if (paginationNext.attr('disabled')) {
      paginationNext.removeAttr('disabled')
    }
  }
})

paginationNext.on('click', function () {
  currentPage++
  fetchCards(`${params}&page=${currentPage}`)
  if ($(this).attr('disabled')) {
    $(this).removeAttr('disabled')
  }
  if (paginationPrevious.attr('disabled')) {
    paginationPrevious.removeAttr('disabled')
  }
})
