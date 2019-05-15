const program = require('commander')
var osmosis = require('osmosis')

program
  .option('-n, --name <type>', 'Real Ferment Micro Essence')
  .option('-b, --brand <type>', 'Neogen')
  .option('-c, --category <type>', 'essence')
  .option('-i, --ingredients <type>', 'Water, Propanediol, Glycerin, Betaine, Panthenol');
program.parse(process.argv)

var ingredientList = sanitize(program.ingredients)
var ingredientListArray = ingredientList
  .split(', ')
  .filter(Boolean)
var ingredientListNotFound = []
var ingredientListHarmful = []
var count = 0

// TODO:
// Append data to a CSV file
// Columns: Name, Brand, Category, Total number of ingredients, Total number of harmful ingredients, Harmless score, Harmful ingredient list with EWG score, Full ingredient list

console.log("\n\n---------------------------")
console.log("Name: " + program.name)
console.log("Brand: " + program.brand)
console.log("Category: " + program.category)
console.log("Ingredients: " + ingredientList)

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
      ingredientName = ingredientName.replace(/INGREDIENT:/g, '').trim()

      var paragraph = listing.score
      var regex = /image\d/g
      var found = paragraph.match(regex)
      var score = found[0].replace(/image/g, '')
      score = parseInt(score, 10)

      if (score > 2) {
        // console.log(ingredient + ': ' + ingredientName + '(' + score + ') ❌')
        console.log(ingredient + ' (' + score + ')')
        ingredientListHarmful.push(listing.ingredient)
      }
    }

    count++;
    if (count == ingredientListArray.length ) {
      console.log("---------------------------")
      console.log('Total score: ' + Math.floor(((ingredientListArray.length - ingredientListNotFound.length - ingredientListHarmful.length) / ingredientListArray.length) * 100) + '%')
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

function sanitize(input) {
  return input.toLowerCase()

    // Replace ingredient names
    .replace(/ceramide\snp/g, 'ceramide ')
    .replace(/galactomyces/g, 'saccharomyces')
    .replace(/sh\-oligopeptide-\d*/g, 'oligopeptide')
    .replace(/sh\-polypeptide-\d*/g, 'polypeptide')

    // Remove generic types of ingredients
    .replace(/leaf/g, '')
    .replace(/extract/g, '')
    .replace(/oil/g, '')
    .replace(/fruit/g, '')
    .replace(/flower/g, '')
    .replace(/root/g, '')
    .replace(/extract/g, '')
    .replace(/water/g, '')
    .replace(/aqua/g, '')
    .replace(/ferment/g, '')
    .replace(/filtrate/g, '')
    .replace(/juice/g, '')
    .replace(/seed/g, '')
    .replace(/stem/g, '')

    // Deal with spaces, brakcets and commas
    .replace(/[a-zA-Z]+,[a-zA-Z]+/g, ', ')   // replace  "word,word" with "word, word"
    .replace(/\([a-zA-Z\s]+\)/g, '') // remove all bracketted words
    .replace(/\(\)/g, '')      // remove all brackets
    .replace(/\s\//g, '')       // remove all forward slashes
    .replace(/\/\s/g, '')       // remove all forward slashes
    .replace(/\./g, '')       // remove all full stops
    .replace(/\s\s*/g, ' ')   // remove double spaces
    .replace(/\s,\s/g, ', ')  // replace " , " with ", "
    .replace(/\s,/g, ', ')    // replace " ," with ", "
    .replace(/,,\s/g, ', ')   // replace  ",," with ", "
}
