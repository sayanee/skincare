var osmosis = require('osmosis')
var ingredientList = 'Galactomyces Ferment Filtrate, Aqua (Water), Butylene Glycol, Pentylene Glycol, Glycerin, 1,2-Hexanediol, Bifida Ferment Lysate, Ceramide NP, Althaea Rosea Root Extract, Aloe Barbadensis Leaf Extract, Betaine, Panthenol, Allantoin, Sodium Hyaluronate, sh-Oligopeptide-1, Zanthoxylum, Piperitum Fruit Extract, Pulsatilla Koreana Extract Usnea Barbata (Lichen) Extract, Adenosine, Arginine, Xanthan Gum, Hydrogenated Lecithin, Polysorbate 20, Lecithin'
var ingredientListArray = ingredientList.split(', ')
var ingredientListNotFound = []
var ingredientListHarmful = []
var count = 0

ingredientListArray.forEach(function(ingredient) {
  osmosis
  .get('https://www.ewg.org/skindeep/search.php?query=' + ingredient + '&h=Search')
  .find('.prodwrapperrightcol2012')
  .set({
      'empty': '.rightside_content2012 p',
      'ingredient': '#table-browse > tr[2] > td[2]',
      'score': '#table-browse > tr[2] >td[3] > div > div > a > img@src'
  })
  .data(function(listing) {
    if (listing.empty == 'There are no items in the database that match your request.') {
      ingredientListNotFound.push(ingredient)
    }

    if (listing.ingredient) {
      var ingredientName = listing.ingredient.substring(0, listing.ingredient.indexOf('('))
      var paragraph = listing.score
      var regex = /image\d/g
      var found = paragraph.match(regex)
      var score = found[0].replace(/image/g, '')
      score = parseInt(score, 10)

      if (score > 2) {
        console.log('For ' + ingredient + ', ' + ingredientName + ' score is ' + score + ' ❌')
        ingredientListHarmful.push(listing.ingredient)
      }
    }

    count++;
    if (count == ingredientListArray.length ) {
      console.log("---------------------------")
      console.log('Total number of ingredients: ' + ingredientListArray.length)
      console.log('Total number of ingredients harmful: ' + ingredientListHarmful.length)
      console.log('Total number of ingredients not found in EWG DB: ' + ingredientListNotFound.length)
      ingredientListNotFound.forEach(function(eachIngredient) {
        console.log('\t' + eachIngredient)
      })
      console.log("---------------------------")
    }

    setTimeout(function() { }, 1000)
  })
})
