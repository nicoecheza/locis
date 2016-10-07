module.exports = function(obj) {

  switch (obj.type) {

    case 'string':
      return '<input type="text" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" />';

    case 'number':
      return '<input type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" />';

  }

};
