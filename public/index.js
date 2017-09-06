var app = function(){
  var url = "https://restcountries.eu/rest/v2";
  var countriesButton = document.querySelector( '#load-countries' );
  countriesButton.addEventListener( 'click', function(){
    makeRequest( url, requestComplete )  
  });
  var storedCountry = JSON.parse( localStorage.getItem( 'stored-country' ) )
  if ( storedCountry !== null ){
    var name = document.querySelector( '#name' );
    var population = document.querySelector( '#population' );
    var capital = document.querySelector( '#capital');
    name.innerText = storedCountry.name;
    population.innerText = storedCountry.population;
    capital.innerText = storedCountry.capital;
  }
}

//----------------------------------------------------------------------------------

var makeRequest = function( url, callback ) {
  //create a new XMLHttpRequest object
  var request = new XMLHttpRequest();
  //set the type of request we want to make (HINT: GET)
  request.open( 'GET', url );
  //tell the request which function to run when it has completed (callback)
  request.addEventListener( 'load', callback );
  //send request
  request.send();
}

//----------------------------------------------------------------------------------

var requestComplete = function() {
  if ( this.status !== 200 ) return;

  var jsonString = this.responseText;
  var countries = JSON.parse( jsonString );
  var regions = findUniqueRegions( countries );
  populateRegionSelect( regions, countries );
}

//----------------------------------------------------------------------------------

var findUniqueRegions = function( countries ) {
  var uniqueRegions = {};
  for ( country of countries ){
    if ( uniqueRegions[ country.region] === undefined ) uniqueRegions[ country.region ] = 1;
  }

  return Object.keys( uniqueRegions );

}

//----------------------------------------------------------------------------------

var populateRegionSelect = function( regions, countries ) {
  var select = document.querySelector( '#select-region' );

  select.addEventListener( 'change', function(){ populateCountrySelect( countries, select.value )})

  
  while( select.firstChild ) { select.removeChild( select.firstChild )}

  var option = document.createElement( 'option' );
  option.innerText = "Choose a region";
  select.appendChild( option );
  select.options[0].disabled = true;

  regions.forEach( function( region, index ) {

    var option = document.createElement( 'option' );
    option.value = region;
    option.innerText = region;
    select.appendChild( option );

  });

}

//----------------------------------------------------------------------------------

var populateCountrySelect = function( countries, region ) {
  var select = document.querySelector( '#select-country' );
  select.addEventListener( 'change', function(){ selectCountry( select.value, filteredCountries ) } );

  while( select.firstChild ) { select.removeChild( select.firstChild )}
  
  var option = document.createElement( 'option' );
  option.innerText = "Choose a country";
  select.appendChild( option );
  select.options[0].disabled = true;

  var filteredCountries = countries.filter( function( country){
    return ( country.region === region );
  })

  filteredCountries.forEach( function( country, index ) {

    var option = document.createElement( 'option' );
    option.innerText = country.name;
    option.value = index;
    select.appendChild( option );

  } );

}

//----------------------------------------------------------------------------------

var selectCountry = function( index, countries ) {
  console.log( index );
  console.log( countries[index] );
  var name = document.querySelector( '#name' );
  var population = document.querySelector( '#population' );
  var capital = document.querySelector( '#capital');
  name.innerText = countries[index].name;
  population.innerText = countries[index].population;
  capital.innerText = countries[index].capital;

  var jsonString = JSON.stringify( countries[index] );
  localStorage.setItem( 'stored-country', jsonString );

  var neighbours = document.querySelector( '#neighbours' );

  var neighboursArray = countries.filter( function( country ){
    return ( countries[index].borders.includes( country.alpha3Code ) )
  })

  console.log( neighboursArray );

  neighbours.innerText = "";
  for( country of neighboursArray ){
    neighbours.innerText += country.name + ", " + country.population + ", " + country.capital + "\n"
  }

}



window.addEventListener('load', app);