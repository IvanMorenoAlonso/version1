$(document).ready(function(){
	

	
		//Primero definimos el encabezado (la columna1 está oculta, contiene ID)
		var encabezado = '<thead><tr>'
									+'<th>Id</th>'
									+'<th>Nombre</th>'	
									+ '<th>Usuario</th>'
									+'<th>Email</th>'		
									+'<th>Ciudad</th>'		
									+'<th>Telefono</th>'		
									+'<th>Web</th>'
									+'<th>Empresa</th>'		
									+'<th></th>'
									+'<th></th>'
									+'<th><input type="checkbox" id="checkall" /></th>'
									+'</tr></thead>'; 
		
		$("#tabla1").append(encabezado);
		
		
		//Variables principales
		var usuario = [];
		var usuarioseleccionado;
		var data ;
		var iarray;
		var table;
		var filaselec;
		var idselec;
		
		//Obtengo datos JSON
        $.getJSON("http://jsonplaceholder.typicode.com/users", function(result){
			
            $.each(result, function(i, field){
				usuario[usuario.length] = {	id:field.id, 
															name:field.name, 
															username:field.username,
															email:field.email, 
															address_street:field.address.street, 
															address_suite:field.address.suite, 
															address_city:field.address.city, 
															address_zipcode:field.address.zipcode, 
															address_geo_lat:field.address.geo.lat, 
															address_geo_lng:field.address.geo.lng, 
															phone:field.phone, 
															website:field.website, 
															company_name:field.company.name,
															company_catchPhrase:field.company.catchPhrase, 
															company_bs:field.company.bs
															};
            });
			
			//Una vez creado el array dibujo la tabla
			for(var i=0;i<usuario.length;i++){
			dibujarTabla(i);
			}
        });

		//Defino la tabla con DataTable
		table = $("#tabla1").DataTable( {
			//3 filas por vista
			"pageLength": 3,
			//id oculto
			"columnDefs": [
					{
						"targets": [ 0 ],
						"visible": false,
						"searchable": false
					},
					{
            "targets": -1,
			"orderable": false,
			'width': '1%',
			defaultContent: '<input class="call-checkbox" type="checkbox"> '
			},	
			{
            "targets": -2,
			"orderable": false,
			defaultContent: '<button  class="btn btn-danger">eliminar</button>'
			},
					{
            "targets": -3,
			"orderable": false,
			defaultContent: '<button  class="btn btn-info">editar</button>'
			},
					{
            "targets": 1,
			className: 'texto'
			}
		]
		} );
		
		
		//Añade una fila a la tabla
		function dibujarTabla(i){
		table.row.add( [usuario[i]["id"],usuario[i]["name"],usuario[i]["username"] ,usuario[i]["email"],usuario[i]["address_city"],usuario[i]["phone"],usuario[i]["website"],usuario[i]["company_name"]] ).draw( false );
		};



			function eliminarFila(){
			var e;
			usuario = $.grep(usuario, function (element, index) {
				if(element.id == idselec){
				e = element.name;
				}
			return element.id != idselec;
			});
			// Borro la fila seleccionada
			        table.row(filaselec).remove().draw( false );
					alertify.error("El usuario " + e+ " se ha eliminado correctamente");
		};


		
		//Obtiene el maximo id +1
		function maxId(){
			var maxid = 0;
			 for(var i=0;i<usuario.length;i++){
				 if(maxid<=usuario[i]["id"]){
				maxid=usuario[i]["id"];
				}
			}
			maxid++;
			return maxid;
		};
		
		
		//Muestra el mapa
		function mostrarMapa(a,b){
		var myCenter=new google.maps.LatLng(a,b);

		var mapProp = {
		  center:myCenter,
		  zoom:17,
		  mapTypeId:google.maps.MapTypeId.ROADMAP
		  };
		var map=new google.maps.Map(document.getElementById("map"),mapProp);
		var marker=new google.maps.Marker({
		  position:myCenter,
		  });
		marker.setMap(map);
		return map;
};


		//Eventos click botón editar
		$("#tabla1").on("click", ".btn-info", function(){
			usuarioseleccionado = $.grep(usuario, function (element, index) {
				if(element.id == idselec){
				iarray = index;
				}
				return element.id == idselec;
			});
			
			var str = usuarioseleccionado[0]["company_bs"];
			var res = str.split(" ");
			var check =true;
			for(var i=0;i<res.length;i++){
			 if(res[i]=="applications"){
			alertify.alert("El usuario " + usuarioseleccionado[0]["name"] +  " no se puede modificar")
			check =false;
			 };
			};
			if(check){
		 $("#modal_editar_usuario").modal('show');
			 cargarPlantilla('editar_usuario','salidaeditar');
			};
		});
		
		
		//Eventos click botón editar usuario, en modal editar usuario
		$("#botoneditarusuario").on("click", function(){
			usuario[iarray]["address_street"]=document.getElementById('editarcalle').value;
			usuario[iarray]["address_suite"]=document.getElementById('editarnumero').value;
			usuario[iarray]["address_city"]=document.getElementById('editarciudad').value;
			usuario[iarray]["address_zipcode"]=document.getElementById('editarcp').value;
			usuario[iarray]["address_geo_lat"]=document.getElementById('editarlatitud').value;
			usuario[iarray]["address_geo_lng"]=document.getElementById('editarlongitud').value;
			usuario[iarray]["website"]=document.getElementById('editarweb').value;
			usuario[iarray]["company_name"]=document.getElementById('editarempresa').value;
			usuario[iarray]["company_catchPhrase"]=document.getElementById('editarslogan').value;
			usuario[iarray]["company_bs"]=document.getElementById('editardesc').value;
			
			table.row(filaselec).remove().draw( false );
			dibujarTabla(iarray);
			$("#modal_editar_usuario").modal('hide');
			alertify.success("El usuario " + usuario[iarray]["name"] + " se editado correctamente");
		});
		
				
		//Eventos click botón nuevo usuario
		$("#botonnuevousuario").on("click", function(){
		//para vaciar el formulario
		$('input[type=text]').each(function() {
        $(this).val('');
		});
		$("#modal_nuevo_usuario").modal('show');		
		});
		
		
		//Eventos click botón insertar usuario, en modal nuevo usuario
		$("#botoninsertarusuario").on("click", function(){
			var longitud = usuario.length;
			usuario[longitud] = {	id:maxId(), 
												name:document.getElementById('textonombre').value, 
												username:document.getElementById('textousuario').value,
												email:document.getElementById('textoemail').value, 
												address_street:document.getElementById('textocalle').value, 
												address_suite:document.getElementById('textonumero').value, 
												address_city:document.getElementById('textociudad').value, 
												address_zipcode:document.getElementById('textocp').value, 
												address_geo_lat:document.getElementById('textolatitud').value, 
												address_geo_lng:document.getElementById('textolongitud').value, 
												phone:document.getElementById('textotelefono').value, 
												website:document.getElementById('textoweb').value, 
												company_name:document.getElementById('textoempresa').value,
												company_catchPhrase:document.getElementById('textoslogan').value, 
												company_bs:document.getElementById('textodesc').value
												};
					dibujarTabla(longitud);	
					$("#modal_nuevo_usuario").modal('hide');	
					alertify.success("El usuario " + usuario[longitud]["name"] + " se ha creado correctamente");
		});
		
		
		//Eventos click botón eliminar
		$("#tabla1").on("click", ".btn-danger", function(){
			eliminarFila();
		});
		
		//Eventos click botón seleccionar todos
		$("#botonseleccionartodos").on("click", function(){
			table.$('.call-checkbox', {"page": "all"}).each(function () {
		   	$(this).prop("checked", true);
		   });
		});		


		//Eventos click botón eliminar seleccionados
		$("#botoneliminarseleccionados").on("click", function(){
			alertify.confirm("Se van eliminar los usuarios seleccionados",function (e) {
         	if (e) {
         		table.$('.call-checkbox', {"page": "all"}).each(function(index,elem) {
						filaselec = table.row( this.parentNode ).index() ;
						idselec = table.cell( filaselec,0 ).data();
						if(elem.checked){
							eliminarFila();
						};
					});
          	}
            else
            	return false;
			});
		});
		
		
		//Eventos click en tabla(botones no)
		$("#tabla1").on("click", ".texto", function(){
			usuarioseleccionado = $.grep(usuario, function (element, index) {
				return element.id == idselec;
			});
			cargarPlantilla('info_usuario','salidainfo');
			$("#modal_info_usuario").modal('show');
			
			var map = mostrarMapa(usuarioseleccionado[0]["address_geo_lat"], usuarioseleccionado[0]["address_geo_lng"]);
			setTimeout(function(){
				google.maps.event.trigger(map,"resize");
			},500);
		});	

		
		//Eventos en el check list superior
		$("#tabla1 #checkall").click(function () {
        if ($("#tabla1 #checkall").is(':checked')) {
            $("#tabla1 input[type=checkbox]").each(function () {
                $(this).prop("checked", true);
            });

        } else {
            $("#tabla1 input[type=checkbox]").each(function () {
                $(this).prop("checked", false);
            });
        }
		});		
		

		//Pasa las variables fila e id cada vez que se clickea en la tabla
		$('#tabla1 tbody').on( 'click', 'tr', function () {
		filaselec = table.row( this ).index() ;
		idselec = table.cell( filaselec,0 ).data();
		} );

		

		// Metodo para Handlebars
		function cargarPlantilla(a,b){
		 
		var templateSource = document.getElementById(a).innerHTML;

		var template = Handlebars.compile(templateSource);

		var resultsPlaceholder = document.getElementById(b);

		 
		resultsPlaceholder.innerHTML = template(usuarioseleccionado[0]);
		};




});
