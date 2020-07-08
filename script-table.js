$(document).ready( function () {

  let columnNames = ["file", "text", "labels", "objects"];

  columnNames.forEach( c => {
    $("#table_id thead tr").append(`<th> ${c} </th>`);
  })

  data.forEach( d => {
    let str = '';
    columnNames.forEach( c => {
      str += `<td>  ${d[c]} </td>`;
    })
    $("#table_id tbody").append(`<tr> ${str} </tr>`);
  })

  let dtColumns = columnNames.map( c => {
    if(c=="file") {
      return {
        data: c,
        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html("<a href='"+oData.file+"'>"+oData.file+"</a>");
        }
      }
    } else {
      return { data: c };
    }

  });

  $('#table_id').DataTable({
    data: data,
    columns: dtColumns
  });

});


/*
Want to make the table in spanish: https://datatables.net/plug-ins/i18n/
this needs to be added: https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json
and then this inside the tabe_id:
"language": {
  "url": "dataTables.spanish.lang"
}
*/
