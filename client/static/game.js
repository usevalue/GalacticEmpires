// const getBlurb = function(type, id) {
//     $.ajax({
//         url: 'blurb/',
//         type: 'get',
//         data: {type, id},
//         success: (data)=>{
//             console.log(data);
//             let blurb='';
//             switch(type) {
//                 case 'planet':
//                     blurb='<h3 align="center">'+data.name+'</h3>';
//                     blurb+='The '+data.climate+' planet '+data.name+' is home to no one.';
//                     break;
//             }
//             $('#statspanel').html(blurb);
//         },
//         failure: (err)=>{
//             console.log(err.responseText);
//         }
//     });
// }

// $(()=>{
// getBlurb('planet','home');
// });