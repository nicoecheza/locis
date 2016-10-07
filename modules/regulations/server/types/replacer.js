module.exports = function(obj) {

  switch (obj.type) {

    case 'string':
      return '<input type="text" placeholder="' + obj.placeholder  + '" />';

    case 'number':
      return '<input type="number" placeholder="' + obj.placeholder  + '" />';

  }

};
