var express = require('express');
var app = express();
var axios = require('axios');
const { response } = require('express');
require('dotenv').config();
//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('static'));
//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Definir puerto
app.set('port', process.env.PORT || 5001);


//Define Variable Global Token
const access_token = process.env.ACCES_TOKEN;
console.log(access_token)
console.log(process.env.PORT)
//Ruta estatica 
app.use(express.static(__dirname + "/public"))

//Ruta Raiz
app.get('/', function(req, res){

	res.render("index" , {titulo : "mi titulo dinamico"});
			
});

app.post('/procesar', function(req, res){
	var id = req.body.codigo;
	console.log(id);
	
		
	var config = {
		method: 'get',
		url: 'https://api.mercadopago.com/v1/payments/'+id+'?access_token='+access_token
		,headers: { }
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(JSON.stringify(response.data));
		console.log (response.data.date_created.substring(0,10))
		
		res.render("procesarid" , {
			respuesta : "Resultado Api MercadoPago",
			FechaCreacion : `FechaCreacion : ${response.data.date_created.substring(0,10)}`,
			ID_Operacion : `ID_Operacion : ${response.data.id}`,
			Codigo_Autorizacion : `Codigo_Autorizacion : ${response.data.authorization_code}`,
			Status : `Status : ${response.data.status}`,
			Status_detalle : `Status_detalle : ${response.data.status_detail}`,
			Monto : `Monto : ${response.data.transaction_amount}`,
			Cod_Comercios : `Cod_Comercios : ${response.data.merchant_number}`,
			Primeros6_Digitos : `Primeros6_Digitos : ${response.data.card.first_six_digits}`,
			Ultimo4_Digitos : `Ultimo4_Digitos : ${response.data.card.last_four_digits}`
			
		  });
	  })
	  .catch(function (error) {
		console.log(error);
	  });
	  
});

app.post('/procesartodo', function(req, res){
	let id1 = req.body.codigos;
	id1.split(" ").join(" ");
	console.log("primero ."+id1);
	let id = id1.split(",");
	console.log("Ultimo .."+id);
	console.log("Largo de ID .."+id.length);

	var tagline = "No programming concept";

	for (let i = 0; i < id.length; i++) {	
		
	let config = {
		method: 'get',
		url: 'https://api.mercadopago.com/v1/payments/'+id[i]+'?access_token='+access_token
		,headers: { }
	  };
	  
	
			axios(config)
			.then(function (response) {
				
				
				res.render("procesatodo" , {
					respuesta : response.data,
					tagline: tagline					
				});
			})
	     
			.catch(function (error) {
				console.log(error);
			});
	}
});


app.use((req ,res , next) =>{
	res.status(404).render("404",{
		titulo : "404",
		Descripcion : "Pagina no Encontrada"
	})
});

app.listen(app.get('port'), function(){
  console.log( 'Express se ha iniciado en http://localhost:' +
    app.get('port') + '; presione Ctrl-C para cerrar el servidor.' );
}
);

/*
function getMP_ID()
{
	
	//const access_token = process.env.ACCES_TOKEN;
	//mensaje.innerHTML=' ';
	//console.log('Limpia Div'+mensaje.innerHTML);
	var id = document.getElementById("cod").value;
	//console.log(id);

		var loading = document.getElementById('loading');
		var mensaje = document.getElementById('mensaje');
		console.log(access_token);

		var boton = document.getElementById('carga_ajax');
		boton.addEventListener('click', function() {
		loading.style.display = 'block';
	
	axios.get('https://api.mercadopago.com/v1/payments/'+id+'?access_token='+access_token, {
		responseType: 'json'
	  })
	  .then(function(res) {
		if(res.status==200) {
		  console.log(res.data);
		  mensaje.innerHTML ='<b>FechaCreacion :</b> '+ res.data.date_created.substring(0,10) + ' <b>ID_Operacion :</b>'+ res.data.id+' <b>Codigo_Autorizacion :</b>'+ res.data.authorization_code+ 
		  '  '+'<b>Status :</b> '+ res.data.status_detail  +' '+'<b>Status_detalle :</b> '+ res.data.status  +' '+ ' <b>Monto :</b>'+ res.data.transaction_amount+' '+ ' <b>Cod_Comercios :</b>'+ res.data.merchant_number
		  +' '+ ' <b>Tarjeta :</b>'+ res.data.payment_method_id+' '+ ' <b>Primeros6_Digitos :</b>'+ res.data.card.first_six_digits+' '+ ' <b>Ultimo4_Digitos :</b>'+ res.data.card.last_four_digits;
		}
		console.log(res);
	  })
	  .catch(function(err) {
		console.log(err);
	  })
	  .then(function () {
	  });
} 
		)}

function getMP_AllID()
{
	mensaje.innerHTML=' ';
	console.log('Limpia Div'+mensaje.innerHTML);
	var datosToSplit = document.getElementById("codigos").value;
	datosToSplit.split(" ").join(" ");
	console.log('DatosSplit : '+datosToSplit);
	
	var idsToCancel = datosToSplit.split(",");
	console.log('idsToCancel : '+idsToCancel);
	
	//var access_token = process.env.ACCES_TOKEN || 'acces_token';
	for (var i = 0; i < idsToCancel.length; i++) {
			axios.get('https://api.mercadopago.com/v1/payments/'+idsToCancel[i]+'?access_token='+access_token, {
				responseType: 'json'
			})
			.then(function(res) {
				if(res.status==200) {
				console.log(res.data);
				mensaje.innerHTML = mensaje.innerHTML + '<b>FechaCreacion :</b> '+  res.data.date_created.substring(0,10) + '<b>Tarjeta :</b> '+  res.data.payment_method_id +' <b>ID_Operacion :</b>'+
				res.data.id+' <b>Codigo_Autorizacion :</b>'+ res.data.authorization_code+ '  '+'<b>Status_Detalle :</b> '+ res.data.status_detail  +' '+'<b>Status :</b> '+ res.data.status  + ' '+
				' <b>Monto :</b>'+ res.data.transaction_amount +'<br> ';
				}
				console.log(res);
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function () {
			});
	}
}

function getByFechaMP()
{
	
	mensaje.innerHTML=' ';
	console.log('Limpia Div'+mensaje.innerHTML);
	//var access_token = process.env.NODE_ENV || 'acces_token';
	var FechaIni = document.getElementById("start").value;
	var fechaInicio = FechaIni+'T00:00:00.001-04:00';
	console.log(fechaInicio)
	var Fechafin = document.getElementById("end").value;
	var fechaFinal = Fechafin+'T23:59:59.999-04:00';
	console.log(fechaFinal)
	
	axios.get('https://api.mercadopago.com/v1/payments/search?range=date_created&begin_date=' + fechaInicio +'&end_date='
	+fechaFinal+'&access_token='+access_token+'&status=cancelled&limit=150' , {
		responseType: 'json'
	  })
	  .then(function(res) {
		if(res.status==200) {
		  console.log(res.data);
		  for (var i = 0; i < res.data.results.length; i++) {
				mensaje.innerHTML =mensaje.innerHTML+'<b>FechaCreacion :</b> '+ res.data.results[i].date_created.substring(0,10)+ ' <b>ID_Operacion :</b>'+ res.data.results[i].id+'  '+'<b>Status :</b> '+ res.data.results[i].status_detail +
				+' '+'<b>Status_detalle :</b> '+ res.data.results[i].status +' '+ ' <b>Monto :</b>'+ res.data.results[i].transaction_amount+' '+ ' <b>Cod_Comercios :</b>'+ res.data.results[i].merchant_number
				+' '+ ' <b>Tarjeta :</b>'+ res.data.results[i].payment_method_id+' '+ ' <b>Primeros6_Digitos :</b>'+ res.data.results[i].card.first_six_digits+' '+ ' <b>Ultimo4_Digitos :</b>'+ res.data.results[i].card.last_four_digits+ ' <b>Cant_Cuotas :</b>'+ res.data.results[i].installments+'<br> ';
				//+'<b>Email:</b> '+res.data.results.payer.email + ' '+ '<b>Identificacion: </b>'+res.data.results.payer.identification.number;
		  }
		}
		console.log(res);
	  })
	  .catch(function(err) {
		console.log(err);
	  })
	  .then(function () {
	  });
}

function putCancelMP()
{

	var datosToSplit = document.getElementById("codCancel").value;
	console.log(datosToSplit);
	
	var idsToCancel = datosToSplit.split(",");
	console.log(idsToCancel);
	var access_token = 'APP_USR-3044414591158237-041620-d1fe63a01d638d8db41818c3fe524312-547957838';
	var data = '{"status":"cancelled"}';
	
	for (var i = 0; i < idsToCancel.length; i++) {
				var config = {
				method: 'put',
				url: 'https://api.mercadopago.com/v1/payments/'+idsToCancel[i]+'?access_token='+access_token,
				headers: { 
					'Content-Type': 'text/plain'
				},
				data : data
				};
				axios(config)
				.then(function (response) {
						if(response.status==200) {
							console.log(response.data);
							
									mensaje.innerHTML =mensaje.innerHTML +'<b>FechaCreacion :</b> '+ response.date_created +  '<b>Tarjeta :</b> '+ 
									response.payment_metho_id+' <b>ID_Operacion :</b>'+ response.id+'  '+'<b>Status :</b> '+ response.status  +'<br> ';
						}
						
					console.log(JSON.stringify(response.data));

					})
					.catch(function (error) {
					console.log(error);
					});
		}
	}


if (typeof window !== 'undefined') {
    window.mygetMP_ID = function() {
        return getMP_ID();
    }
}
if (typeof window !== 'undefined') {
    window.mygetMP_ALLID = function() {
        return getMP_AllID();
    }
}
if (typeof window !== 'undefined') {
    window.mygetByFechaMP = function() {
        return getByFechaMP();
    }
}
if (typeof window !== 'undefined') {
    window.myputCancelMP = function() {
        return putCancelMP();
    }
}*/
