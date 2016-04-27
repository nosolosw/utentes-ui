var ActividadeSchema = {};

ActividadeSchema['Abastecimento'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'habitantes',
  'message':   'O nro de habitantes da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'dotacao',
  'message':   'A dotaçâo da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
}];

ActividadeSchema['Agricultura-Regadia'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
},{
  'fieldname': 'cultivos',
  'message':   'A actividade debe ter cultivos',
  'rules':     ['ARRAY_NOT_VOID']
}];

ActividadeSchema['Cultivos'] = [{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado do cultivo não tem o formato correto o está vazio',
  'rules':     ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'cultivo',
  'message':   'Tipo de cultivo não pode estar vazio',
  'rules':     ['NOT_NULL']
}, {
  'fieldname': 'rega',
  'message':   'Tipo de rega não pode estar vazio',
  'rules':     ['NOT_NULL']
}, {
  'fieldname': 'eficiencia',
  'message':   'Eficiencia não tem o formato correto',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'area',
  'message':   'Área não tem o formato correto',
  'rules':     ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}];

ActividadeSchema['Indústria'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'eval_impac',
  'message':   'Evaluação impacto não tem o formato correto',
  'rules':     ['IS_BOOLEAN']
}];

ActividadeSchema['Pecuária'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'NOT_NULL', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'reses',
  'message':   'A actividade debe ter reses',
  'rules':     ['ARRAY_NOT_VOID']
}];

ActividadeSchema['Reses'] = [{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'reses_tipo',
  'message':   'Tipo de reses não pode estar vazio',
  'rules':     ['NOT_NULL']
}, {
  'fieldname': 'reses_nro',
  'message':   'Nro de reses não tem o formato correto o está vazio',
  'rules':     ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'c_res',
  'message':   'Consumo por res não tem o formato correto o está vazio',
  'rules':     ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}];

ActividadeSchema['Piscicultura'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'area',
  'message':   'Área não pode estar vazio',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'v_reservas',
  'message':   'Reservas não tem o formato correto',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}];

ActividadeSchema['Producção de energia'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'alt_agua',
  'message':   'Altura de água não pode estar vazio',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'potencia',
  'message':   'Potência a instalar não tem o formato correto',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'eval_impac',
  'message':   'Evaluação impacto não tem o formato correto',
  'rules':     ['IS_BOOLEAN']
}];

ActividadeSchema['Saneamento'] = [{
  'fieldname': 'tipo',
  'message':   'Tipo de actividade não pode estar vazio',
  'rules':     ['NOT_NULL']
},{
  'fieldname': 'c_estimado',
  'message':   'Consumo estimado da actividade não tem o formato correto o está vazio',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
  'fieldname': 'habitantes',
  'message':   'O nro de habitantes da actividade não tem o formato correto',
  'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}];
