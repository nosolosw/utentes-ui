function validator(schemaValidateFrom){

  var validatorObj = new Object();

  var rules = {
    'NOT_NULL': isNotNull(),
    'IS_DATE':  isDate(),
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
      if((value instanceof Date) && !isNaN(date.valueOf())){
        return false;
      }
      return true;
    }

    ruleObj.fails = fails;
    return ruleObj;
  }

  validatorObj.validate = validate;
  validatorObj.getRule  = getRule;
  validatorObj.addRule  = addRule;

  return validatorObj;

};
