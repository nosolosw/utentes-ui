window.nodeRequire = window.require ;
delete window.require;
delete window.exports;
delete window.module;

SIXHIARA = window.SIXHIARA || {
  center:[-12.338, 40.5709],
  southWest:[-23, 31],
  northEast:[-9, 54],
  search: {
    zoom: 8,
  },
};


