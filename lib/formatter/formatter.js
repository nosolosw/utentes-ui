function formatter(){

  // TODO: make formats configurable

  function isNumber(field){
    // http://stackoverflow.com/a/1830844/854308
    return !isNaN(parseFloat(field)) && isFinite(field);
  }

  function formatNumber(value){
    if(!isNumber(value)) return null;

    var NUMBER_FORMAT = '0[,]000[.]0';
    // load a language
    numeral.language('pt-mz', {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million:  'm',
        billion:  'b',
        trillion: 't'
      },
      ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
      },
      currency: {
        symbol: 'MZN'
      }
    });
    numeral.language('pt-mz');
    return numeral(value).format(NUMBER_FORMAT);
  }

  function unformatNumber(value){
    var val = $.trim(value.replace('\,', '\.'));
    if (isNumber(value)){
      return +val;
    }
    return null;
  }

  function formatDate(value){
    var FORMAT_DATE = 'DD/MM/YYYY';
    // moment(undefined) returns current day, ouch!
    if(moment(value).isValid() && value != undefined){
      return moment(value).format(FORMAT_DATE);
    }
    return null;
  }

  function formatBoolean(value){
    // TODO let user inject their own formatter
    // to cover use cases like this
    if(value) return "Existe";
    else if (value === false) return "Não existe";
    return "";
  }

  var formatterObj = new Object();
  formatterObj.formatNumber   = formatNumber;
  formatterObj.unformatNumber = unformatNumber;
  formatterObj.formatDate     = formatDate;
  formatterObj.formatBoolean  = formatBoolean;
  return formatterObj;

}
