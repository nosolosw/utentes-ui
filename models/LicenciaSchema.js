var LICENCIA_SCHEMA = [{
  'fieldname': 'lic_tipo',
  'message':   'Tipo de licencia não pode estar vacío',
  'rules':     ['NOT_NULL']
}, {
  'fieldname': 'lic_nro',
  'message':   'Nro de licencia não tem o formato correcto',
  'rules':     ['LIC_NRO_FORMAT']
}, {
  'fieldname': 'estado',
  'message':   'A licencia debe ter un estado',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'd_emissao',
  'message':   'd_emissao não tem o formato correcto',
  'rules':     ['IS_DATE']
}, {
  'fieldname': 'd_validade',
  'message':   'd_validade não tem o formato correcto',
  'rules':     ['IS_DATE']
}, {
  'fieldname': 'c_soli_tot',
  'message':   'c_soli_tot não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_soli_int',
  'message':   'c_soli_int não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_soli_fon',
  'message':   'c_soli_fon não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_licencia',
  'message':   'c_licencia não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_real_tot',
  'message':   'c_real_tot não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_real_int',
  'message':   'c_real_int não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}, {
  'fieldname': 'c_real_fon',
  'message':   'c_real_fon não tem o formato correcto',
  'rules':     ['IS_NUMERIC']
}];
