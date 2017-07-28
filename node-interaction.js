window.nodeRequire = window.require ;
delete window.require;
delete window.exports;
delete window.module;

SIXHIARA = window.SIXHIARA || {
  center:[-13, 38.5050],
  southWest:[-23, 31],
  northEast:[-9, 43],
  search: {
    zoom: 8,
  },
};

window.SIXHIARA.xlsFieldsToExport = [
    {'header': 'Nome', 'value': 'utente.nome'},
    {'header': 'Nuit', 'value': 'utente.nuit'},
    {'header': 'Tipo de entidade', 'value': 'utente.entidade'},
    {'header': 'Nº Registro comercial', 'value': 'utente.reg_comerc'},
    {'header': 'Registrado em', 'value': 'utente.reg_zona'},
    {'header': 'Provincia', 'value': 'utente.loc_provin'},
    {'header': 'Distrito', 'value': 'utente.loc_distri'},
    {'header': 'Posto', 'value': 'utente.loc_posto'},
    {'header': 'Bairro', 'value': 'utente.loc_nucleo'},
    {'header': 'Observações', 'value': 'utente.observacio'},
    {'header': 'Id Exp', 'value': 'exp_id'},
    {'header': 'Nome exploraçõe', 'value': 'exp_name'},
    {'header': 'Actividade', 'value': 'actividade.tipo'},
    {'header': 'C. licenciado', 'value': 'c_licencia'},
    {'header': 'C. solicitado', 'value': 'c_soli'},
    {'header': 'C. real', 'value': 'c_real'},
    {'header': 'C. estimado', 'value': 'c_estimado'},
];

