$(document).ready( function () {

  // let data = [
  //   {
  //       "name":       "Tiger Nixon",
  //       "position":   "System Architect",
  //       "salary":     "$3,120",
  //       "start_date": "2011/04/25",
  //       "office":     "Edinburgh",
  //       "extn":       "5421"
  //   },
  //   {
  //       "name":       "Garrett Winters",
  //       "position":   "Director",
  //       "salary":     "$5,300",
  //       "start_date": "2011/07/25",
  //       "office":     "Edinburgh",
  //       "extn":       "8422"
  //   }
  // ];
  //

  // https://storage.googleapis.com/chile-signs/01-signs/00001.jpg
  // let link = document.createElement(‘a’) link.href = ‘http://storage.googleapis.com/chile-signs'

  let columnNames = ["file", "text", "labels", "objects"];



  columnNames.forEach( c => {
    $("#table_id thead tr").append(`<th> ${c} </th>`);
  })

  data.forEach( d => {
    let str = '';
    columnNames.forEach( c => {
      str += `<td> ${d[c]} </td>`;
    })
    $("#table_id tbody").append(`<tr> ${str} </tr>`);
  })

  let dtColumns = columnNames.map( c => {
    return { data: c };
  } );

  $('#table_id').DataTable({
    data: data,
    columns: dtColumns
  });



});
