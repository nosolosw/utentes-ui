function formatter(){

  // TODO: make formats configurable

  function isNumber(field){
    // http://stackoverflow.com/a/1830844/854308
    return !isNaN(parseFloat(field)) && isFinite(field);
  }

  function formatNumber(value){
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
    if(val === ''){
      val = null;
    } else if (this.isNumber(value)){
      val = +val;
    }
    return val;
  }

  function formatDate(value){
    var FORMAT_DATE = 'DD/MM/YYYY';
    return moment(value).format(FORMAT_DATE);
  }

  var formatterObj = new Object();
  formatterObj.formatNumber   = formatNumber;
  formatterObj.unformatNumber = unformatNumber;
  formatterObj.formatDate     = formatDate;
  return formatterObj;

}
