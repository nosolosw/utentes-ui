window.nodeRequire = window.require ;
delete window.require;
delete window.exports;
delete window.module;

SIXHIARA = window.SIXHIARA || {
    center:[-12.5, 39.0],
    southWest:[-23, 31],
    northEast:[-9, 48],
    search: {
      zoom: 8,
    },
};

window.SIXHIARA.xlsFieldsToExport = [
    {'header': 'Nome', 'value': 'utente.nome'},
    {'header': 'Nuit', 'value': 'utente.nuit'},
    {'header': 'Tipo de utente', 'value': 'utente.uten_tipo'},
    {'header': 'Nro registro comercial', 'value': 'utente.reg_comerc'},
    {'header': 'Registrado em', 'value': 'utente.reg_zona'},
    {'header': 'Provincia', 'value': 'utente.loc_provin'},
    {'header': 'Distrito', 'value': 'utente.loc_distri'},
    {'header': 'Posto administrativo', 'value': 'utente.loc_posto'},
    {'header': 'Bairro', 'value': 'utente.loc_nucleo'},
    {'header': 'Observações', 'value': 'utente.observacio'},
    {'header': 'Nro da exploração', 'value': 'exp_id'},
    {'header': 'Nome da exploração', 'value': 'exp_name'},
    {'header': 'Consumo mensal licença Total', 'value': 'c_licencia'},
    {'header': 'Consumo mensal solicitado Total', 'value': 'c_soli'},
    {'header': 'Área de exploração (ha)', 'value': 'actividade.area_pisc'},
    {'header': 'Ano inicio da atividade', 'value': 'actividade.ano_i_ati'},
    {'header': 'Nro de tanques/gaiolas', 'value': 'actividade.n_tanques'},
    {'header': 'Volume total tanques/gaiolas (reservas)', 'value': 'actividade.vol_tot_t'},
    {'header': 'Nro de alevinos povoados', 'value': 'actividade.n_ale_pov'},
    {'header': 'Produção Anual (kg)', 'value': 'actividade.produc_pi'},
    {'header': 'Processamento do peixe', 'value': 'actividade.tipo_proc'},
    {'header': 'Durante a abertura dos tanques/gaiolas', 'value': 'actividade.asis_aber'},
    {'header': 'Na monitoria dos tanques/gaiolas', 'value': 'actividade.asis_moni'},
    {'header': 'Tratamento da água que entra nos tanques', 'value': 'actividade.trat_t_en'},
    {'header': 'Tratamento da água que sai dos tanques', 'value': 'actividade.trat_a_sa'},
    {'header': 'As gaiolas estão submersas em', 'value': 'actividade.gaio_subm'},
    {'header': 'A exploraçaõ tem problemas', 'value': 'actividade.problemas'},
    {'header': 'Principais problemas', 'value': 'actividade.prob_prin'},
];

window.SIXHIARA.shpFieldsToExport = [
    { 'header': 'exp_id', 'value': 'exp_id' },
    { 'header': 'exp_name', 'value': 'exp_name' },
    { 'header': 'loc_provin', 'value': 'loc_provin' },
    { 'header': 'loc_distri', 'value': 'loc_distri' },
    { 'header': 'loc_posto', 'value': 'loc_posto' },
    { 'header': 'loc_nucleo', 'value': 'loc_nucleo' },
    { 'header': 'loc_endere', 'value': 'loc_endere' },
    { 'header': 'loc_bacia', 'value': 'loc_bacia' },
    { 'header': 'loc_subaci', 'value': 'loc_subaci' },
    { 'header': 'loc_rio', 'value': 'loc_rio' },
    { 'header': 'utente', 'value': 'utente.nome' },
    { 'header': 'uten_nuit', 'value': 'utente.nuit' },
    { 'header': 'con_l_to', 'value': 'c_licencia' },
    { 'header': 'tipo_subt',
    'value': function (exp) {
        var lic = exp.licencias.filter( lic => lic.lic_tipo == 'Subterrânea' );
        return lic.length > 0;
    }
    },
    { 'header': 'con_l_sb',
    'value': function (exp) {
        var lic = exp.licencias.filter( lic => lic.lic_tipo == 'Subterrânea' );
        return (lic[0] && lic[0].c_licencia) || null;
    }
    },
    { 'header': 'tipo_supe',
    'value': function (exp) {
        var lic = exp.licencias.filter( lic => lic.lic_tipo == 'Superficial' );
        return lic.length > 0;
    }
    },
    { 'header': 'con_l_su',
    'value': function (exp) {
        var lic = exp.licencias.filter( lic => lic.lic_tipo == 'Superficial' );
        return (lic[0] && lic[0].c_licencia) || null;
    }
    },
    { 'header': 'observacio', 'value': 'observacio' },
    {'header': 'area_pisc', 'value': 'actividade.area_pisc'},
    {'header': 'ano_i_ati', 'value': 'actividade.ano_i_ati'},
    {'header': 'n_tanques', 'value': 'actividade.n_tanques'},
    {'header': 'vol_tot_t', 'value': 'actividade.vol_tot_t'},
    {'header': 'n_ale_pov', 'value': 'actividade.n_ale_pov'},
    {'header': 'produc_pi', 'value': 'actividade.produc_pi'},
    {'header': 'tipo_proc', 'value': 'actividade.tipo_proc'},
    {'header': 'asis_aber', 'value': 'actividade.asis_aber'},
    {'header': 'asis_moni', 'value': 'actividade.asis_moni'},
    {'header': 'trat_t_en', 'value': 'actividade.trat_t_en'},
    {'header': 'trat_a_sa', 'value': 'actividade.trat_a_sa'},
    {'header': 'gaio_subm', 'value': 'actividade.gaio_subm'},
    {'header': 'problemas', 'value': 'actividade.problemas'},
    {'header': 'prob_prin', 'value': 'actividade.prob_prin'},
]
