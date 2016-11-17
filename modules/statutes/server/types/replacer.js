module.exports = function(obj, society) {

  switch (obj.type) {

    case 'string':
      return '<input value="' + society[obj.name] + '" type="text" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" />';

    case 'number':
      return '<input value="' + society[obj.name] + '" type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" />';

    case 'day':
      return '<input value="' + society[obj.name] + '" type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" min="1" max="31"/>';

    case 'month':
      return '<select name="' + obj.name  + '" placeholder="' + obj.placeholder  + '"> <option value="Enero">Enero</option> <option value="Febrero">Febrero</option> <option value="Marzo">Marzo</option> <option value="Abril">Abril</option> <option value="Mayo">Mayo</option> <option value="Junio">Junio</option> <option value="Julio">Julio</option> <option value="Agosto">Agosto</option> <option value="Septiembre">Septiembre</option> <option value="Octubre">Octubre</option> <option value="Noviembre">Noviembre</option> <option value="Diciembre">Diciembre</option> </select>'
      return '<input type="submit" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" min="1" max="31"/>';

    case 'date':
      return '<input value="' + society[obj.name] + '" type="month" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" />';

    case 'year':
      return '<input value="' + society[obj.name] + '" type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" min="1900" max="2100"/>';

    case 'cuitPref':
      return '<input value="' + society[obj.name] + '" type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" min="20" max="27"/>';

    case 'cuitSu':
      return '<input value="' + society[obj.name] + '" type="number" name="' + obj.name  + '" placeholder="' + obj.placeholder  + '" min="1" max="12"/>';

  }

};
