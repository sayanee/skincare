var osmosis = require('osmosis')
var ingredientList = 'Water, Propylen Glycol, Ascorbic Acid , Hydroxyethylcellulose, Centella Asiatica Extract, Citrus Junos Fruit Extract , IlliciumVerum(Anise) Fruit Extract, Citrus Paradisi (Grapefruit) Fruit Extract, Nelumbium Speciosum Flower Extract, Paeonia Suffruticosa Root Extract , Scutellaria Baicalensis Root Extract, Polysorbate60, Brassica OleraceaItalica (Broccoli) Extract, Chaenomeles Sinensis Fruit Extract, Orange Oil Brazil, Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Disodium EDTA, Lavandula Angustifolia (Lavender) Oil , Camellia SinensisCallus Culture Extract, LarixEuropaeaWood Extract, Chrysanthellum Indicum Extract, Rheum Palmatum Root Extract, Asarum Sieboldi Root Extract, Quercus Mongolia Leaf Extract, PersicariaHydropiperExtract, Corydalis Turtschaninovii Root Extract, Coptis Chinensis Root Extract, Magnolia Obovata Bark Extract, Lysine HCL, Proline, Sodium Ascorbyl Phosphate, Acetyl Methionine, Theanine, Lecithin, Acetyl Glutamine, SH-Olgopeptide-1, SH-Olgopeptide-2, SH-Polypeptide-1, SH-Polypeptide-9, SH-Polypeptide-11, Bacillus/Soybean/Folic Acid Ferment Extract, Sodium Hyaluronate, CaprylylGlycol , Butylene Glycol, 1,2-Hexanediol'
var ingredientListArray = ingredientList.split(',')

console.log("Total number of ingredients: " + ingredientListArray.length)

ingredientListArray.forEach(function(ingredient) {
  osmosis
  .get('https://www.ewg.org/skindeep/search.php?query=' + ingredient + '&h=Search')
  .find('#table-browse > tr[2]')
  .set({
      'ingredient':        'td[2]',
      'score':  'td[3] > div > div > a > img@src'
  })
  .data(function(listing) {
    var ingredientName = listing.ingredient.substring(0, listing.ingredient.indexOf('('))
    var paragraph = listing.score
    var regex = /image\d/g
    var found = paragraph.match(regex)
    var score = '\tSCORE: ' + found[0].replace(/image/g,'')

    if (parseInt(score, 10) > 2) {
      console.log(ingredientName + score)
    }
  })
  // .log(console.log)
  // .error(console.log)
  // .debug(console.log)
})
