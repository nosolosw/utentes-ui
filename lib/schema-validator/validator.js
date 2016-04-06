function validator(schemaValidateFrom){

  var validatorObj = new Object();

  var rules = {
    'NOT_NULL':       isNotNull(),
    'IS_DATE':        isDate(),
    'IS_NUMERIC':     isNumeric(),
    'IS_BOOLEAN':     isBoolean(),
    'ARRAY_NOT_VOID': isArrayNotVoid(),
  };

  var messages = [];
  var schema = schemaValidateFrom;

  function validate(model){
    messages = [];
    messages.length = 0;

    schema.forEach(function(def){
      def.rules.forEach(function(ruleName){
        var rule = getRule(ruleName);
        if(rule.fails(model[def.fieldname])){
          messages.push(def.message);
        }
      });
    });

    return messages;
  }

  function getRule(ruleName){
    return rules[ruleName];
  }

  function addRule(ruleName, ruleDef) {
    rules[ruleName] = ruleDef;
  }

  function isNotNull(){
    var ruleObj = new Object();
    function fails(value){
      if((value === '') || (value === undefined) || (value === null)) {
        return true;
      }
      return false;
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  function isDate(){
    var ruleObj = new Object();

    function fails(value){
      if((value instanceof Date) || (value === null)){
        return false;
      }
      return true;
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  // check if value is the representation of a number. So '5'
  // is considered valid
  function isNumeric() {
    var ruleObj = new Object();

    function fails(value){
      return value && ! (!isNaN(parseFloat(value)) && isFinite(value));
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  function isBoolean(){
    var ruleObj = new Object();

    function fails(value){
      return value != true && value != false && value != null;
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  function isArrayNotVoid(){
    var ruleObj = new Object();

    function fails(value){
      return !Array.isArray(value) || (value.length === 0);
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  validatorObj.validate = validate;
  validatorObj.getRule  = getRule;
  validatorObj.addRule  = addRule;

  return validatorObj;

};
