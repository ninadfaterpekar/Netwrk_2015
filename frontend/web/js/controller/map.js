	var Map ={
	  	params:{
		    name:'',
		    zipcode:'',
		    lat:'',
		    lng:''
	  	},
	  	latLng: '',
	  	markers:[],
	  	data_map:'',
	  	infowindow:[],
	  	zoomIn: false,
	  	incre: 1,
	  	map:'',
	  	zoom: 7,
	  	// center: new google.maps.LatLng(39.7662195,-86.441277),
	  	center:'',
	  	zoom7: [],
	  	zoom12: [],
	  	timeout: '',
	  	initialize: function() {
	  		
	  		if(isMobile){
		  		if(sessionStorage.map_zoom){
		  			Map.zoom = parseInt(sessionStorage.map_zoom);
		  		} else {
		  			sessionStorage.map_zoom = Map.zoom;
		  		}
		  		if(sessionStorage.lat && sessionStorage.lng){
		  			Map.center = new google.maps.LatLng(sessionStorage.lat, sessionStorage.lng);
		  		} else {
		  			sessionStorage.lat = Map.center.lat();
		  			sessionStorage.lng = Map.center.lng();
		  		}
		  	}
		    var map_andiana  = {
		      center: Map.center,
		      zoom: Map.zoom,
		      // disableDoubleClickZoom: true,
		      disableDefaultUI: true,
		      streetViewControl: false,
		      scrollwheel: true,
		      mapTypeId:google.maps.MapTypeId.ROADMAP
		    };
		    var remove_poi = [
		        {
					stylers: [
						{ hue: "#00ffe6" },
						{ saturation: -20 }
					]
				},{
					featureType: "road",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
				},{
					featureType: "road",
					elementType: "geometry",
					stylers: [
						{ lightness: 100 }
					]
				},{
					featureType: "poi",
					stylers: [
						{ visibility: "off" }
					]
				}
		    ];

		    var styledMap = new google.maps.StyledMapType(remove_poi,{name: "Styled Map"});
		    Map.map = new google.maps.Map(document.getElementById("googleMap"),map_andiana);
		    if(isMobile){
		    	if(sessionStorage.map_zoom && sessionStorage.map_zoom < 18){
		    		Map.map.setOptions({zoomControl: false, scrollwheel: true, styles: remove_poi});
		    	} else {
		    		 Map.map.setOptions({zoomControl: false, scrollwheel: true, styles: null});
		    	}
		    }else{
		    	Map.map.setOptions({zoomControl: false, scrollwheel: true, styles: remove_poi});
		    }

		    Map.data_map = Map.map;
		    Map.min_max_zoom(Map.map);
		    // Map.eventOnclick(map);
		    google.maps.event.addListenerOnce(Map.map, 'idle', function(){
				Ajax.get_marker_default().then(function(data){
					var data_marker = $.parseJSON(data);
					$.each(data_marker,function(i,e){
				      	Map.initializeMarker(e, null, 7);
			    	});
				});
				Ajax.get_marker_zoom().then(function(data){
				 	var data_marker = $.parseJSON(data);
					$.each(data_marker,function(i,e){
				      	Map.initializeMarker(e, null, 12);
			    	});
				});
				Map.mapBoundaries(Map.map);
				Map.eventZoom(Map.map);
				Map.eventClickMyLocation(Map.map);
				Map.show_marker(Map.map);
				Map.showHeaderFooter();
			});
		    // Map.insertLocalUniversity();
		    // Map.insertLocalGovernment();
	  	},

	  	mapBoundaries:function(map){
		    var tskey = "b26fdd409c" ;
		    var imgMapType = new google.maps.ImageMapType({
		        getTileUrl: function(coord, zoom){
		          	if(zoom!=12){
		            	return null;
		          	}
		          	if(zoom==12){
			            var url = "http://storage.googleapis.com/zipmap/tiles/" + zoom + "/" + coord.x + "/" + coord.y + ".png" ;
			            return url;
		          	}
		          	var server = coord.x % 6;
		          	var url = "http://ts" + server + ".usnaviguide.com/tileserver.pl?X=" + coord.x + "&Y=" + coord.y + "&Z=" + zoom + "&T=" + tskey + "&S=Z1001";
		          	return url;
		        },
		        tileSize: new google.maps.Size(256,256),
		        opacity: .3,
		        name: 'ziphybrid'
		    });
		    map.overlayMapTypes.push(imgMapType);
	  	},

	  	main: function(){
	      	if (typeof google !== "undefined") {
	        	Map.center = new google.maps.LatLng(39.7662195,-86.441277);
	        	google.maps.event.addDomListener(window, 'load', Map.initialize());
	      	}
	  	},

	  	get_data_marker: function(){
		    var map = Map.data_map;
		    var current = map.getZoom();
		    $('.indiana_marker').find("li[num-city]").remove();
		    Map.deleteNetwrk(map);
		    Map.show_marker(map);//.trigger('idle');
	  	},

	  	get_netwrk: function(){
		    var cities = $('.indiana_marker').find("li[num-city]");
		    var data= [];
	    	$.each(cities,function(i,e){
		      	var city =[];
		      	city.push($(e).text());
		      	city.push($(e).attr('lat'));
		      	city.push($(e).attr('lng'));
		      	city.push($(e).attr('num-city'));
		      	data.push(city);
	    	});
	    	return data;
	  	},

	  	deleteNetwrk: function(map) {
		    Map.clearMarkers();
		    Map.markers = [];
	  	},

	  	clearMarkers: function() {
	    	Map.setMapOnAll(null);
	  	},

	  	setMapOnAll: function(map) {
		    for (var i = 0; i < Map.markers.length; i++) {
		    	Map.markers[i].setMap(map);
		    }
	  	},

	  	show_marker: function(map){
		    var json,data_marker;
		    var current_zoom = map.getZoom();

		    if (current_zoom < 12) {
			    data_marker = Map.zoom7;
		    } else if (current_zoom >= 12) {
			    data_marker = Map.zoom12;
				Map.loadMapLabel(0);
		    }

	    	$.each(data_marker,function(i,e){
		      	e.marker.setMap(Map.map);
		      	Map.markers.push(e.marker);
	    	});

	    	// Please don't delete code below
			//
			// if (map.getZoom() == 12) {
			// 	 ap.addListener('idle', function(){
			//         // radarSearch --------------------------------------------
			// 		var contentSearch = {
			// 			bounds: map.getBounds(),
			// 			keyword: 'school',
			// 			types: ['school','university']
			// 		};
			// 		Map.placeSearch(contentSearch, 'uni', 50);

			//         var contentSearch = {
			//        		bounds: map.getBounds(),
			//         	keyword: 'Town Hall', // City Government Hall/Center/Town hall
			//         	types: ['local_government_office', 'courthouse', 'city_hall']
			//         };
			//         Map.placeSearch(contentSearch, 'gov', 50);
			//     });
			// } else {
			//     google.maps.event.clearListeners(map, 'idle');
			// }
	  	},

	  	placeSearch: function(contentSearch, type, timeDeplay){
	  		var service = new google.maps.places.PlacesService(Map.map);
			service.radarSearch(contentSearch, function(results, status){
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					infowindow = new google.maps.InfoWindow();
					for (var i = 0; i < results.length; i++) {
						setTimeout(Map.getZipcodeAddress(service, results[i], Map.map, type, results[i].geometry.location.lat(), results[i].geometry.location.lng(), results[i].place_id), timeDeplay);
					}
				}
			});
		},
	  	//Custom arrow hover popup
	  	CustomArrowPopup: function(){
	  		var iwOuter = $('.gm-style-iw');
	  		var iwBackground = iwOuter.prev();
	        var arrow = iwBackground.children(':nth-child(3)');
	        var arrow_left = arrow.children(':nth-child(1)');
	        var arrow_right = arrow.children(':nth-child(2)');

	        iwBackground.children(':nth-child(1)').css({'top': 340}).hide();
	        arrow_left.find('div').css({'top':14,'left': 11,'height': 10, 'width': 5});
	        arrow_right.find('div').css({'top':14,'left': 0,'height': 10, 'width': 5});
	  	},

	  	initializeMarker: function(e, map, currentZoom){
	  		var text_below, marker;

	  		text_below = "<span>" + e.zip_code + " " + ((e.office != null) ? e.office : e.name) + "</span>";

	      	if(e.topic && e.topic.length > 0){
	      		text_below += "<br>" + e.topic[0].name + "<br>#" + e.trending_hashtag[0].hashtag_name;
	      	}

	      	marker = new google.maps.Marker({
		        position: new google.maps.LatLng(e.lat, e.lng),
		        map: map,
		        icon: baseUrl + e.mapicon,
		        city_id: parseInt(e.id),
		        // label: text_below
	      	});

	      	var label = new Label({
		       map: map,
		       text: text_below,
		       cid: parseInt(e.id)
		    });

		    label.bindTo('position', marker, 'position');

	      	if(!isMobile){

		        var infowindow = new google.maps.InfoWindow({
					content: '',
					city_id: e.id,
					maxWidth: 310,
		       		pixelOffset: new google.maps.Size(0,0),
		        });

	            var marker_template = _.template($( "#maker_popup" ).html());
	    		var content = marker_template({marker: e});
	          	infowindow.content = content;
	            Map.infowindow.push(infowindow);

		        google.maps.event.addListener(marker, 'mouseover', function() {
			        // infowindow.setContent(e[0]);
			        infowindow.open(Map.map, this);
			        Map.onhoverInfoWindow(e.id,marker);
			        Map.OnEventInfoWindow(e);
		        });

		        google.maps.event.addListener(marker, 'mouseout', function() {
		        	// infowindow.close();
		        });

	          	google.maps.event.addListener(infowindow, 'domready', function() {
		        	// Reference to the DIV that wraps the bottom of infowindow
		            var iwOuter = $('.gm-style-iw');
					// Since this div is in a position prior to .gm-div style-iw.
					// * We use jQuery and create a iwBackground variable,
					// * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
					iwOuter.parent().css({'max-width': 310});
		            var iwBackground = iwOuter.prev();
		            iwOuter.children(':nth-child(1)').css({'max-width' : '310px'});
		        	// Removes background shadow DIV
		            iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		        	// Removes white background DIV
		            iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		            //Custom arrow hover popup
		            Map.CustomArrowPopup();
		        	// Changes the desired tail shadow color.
		            iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': '#eee 0px 0px 0px 0px', 'z-index' : '2'});
		        	// Reference to the div that groups the close button elements.
		            var iwCloseBtn = iwOuter.next();
		            iwCloseBtn.hide();

		            var post = $("#iw-container .iw-content .iw-subTitle .post-title");
		            post.unbind();
		         	post.click(function(ev){
		            	var post_id = e.post.post_id;
			            if(post_id != -1) {
				            Post.params.city = e.id;
				            Post.params.city_name = e.name;
				            Post.params.topic = e.post.topic_id;
	                        PopupChat.params.post = post_id;
	                        PopupChat.initialize();
			            }
	          		});
	          	});
	      	}

			google.maps.event.addListener(marker, 'click', (function(marker){
		        return function(){
		        	sessionStorage.lat = marker.position.lat();
		        	sessionStorage.lng = marker.position.lng();
		        	if(!isMobile){
		            	infowindow.close();
		          	}
		          	Topic.initialize(marker.city_id);
		        };
		    })(marker));

			if (map == null) {
				// console.log(Map.map.getZoom());
				if (currentZoom < 12 ) {
					Map.zoom7.push({
						marker: marker
						// label: label
					});
				} else {
					Map.zoom12.push({
						marker: marker,
						label: label
					});
				}
			}
			else {
				Map.markers.push(marker);
			}
	  	},

	  	CustomArrowPopup: function(){
	  		var iwOuter = $('.gm-style-iw');
	  		var iwBackground = iwOuter.prev();
	        var arrow = iwBackground.children(':nth-child(3)');
	        var arrow_left = arrow.children(':nth-child(1)');
	        var arrow_right = arrow.children(':nth-child(2)');

	        iwBackground.children(':nth-child(1)').css({'top': 340}).hide();
	        arrow_left.find('div').css({'top':14,'left': 11,'height': 10, 'width': 5});
	        arrow_right.find('div').css({'top':14,'left': 0,'height': 10, 'width': 5});
	  	},

	  	update_marker: function(city){
		    var marker, json, data_marker, text_below;
		    var markerSize = {
				x: 32,
				y: 60
			};

			$(".cid-"+city).remove();
			for(i=0; i<Map.markers.length; i++){
				if(Map.markers[i].city_id == city){
					Map.markers[i].setMap(null);
				}
			}

	      	Ajax.get_marker_update(city).then(function(data){
		        data_marker = $.parseJSON(data);
	      	});

	      	Map.initializeMarker(data_marker, Map.map, Map.map.getZoom());
	  	},
	  	// Begin code for get university and government place
	  	// Please don't delete it
	  	checkPlaceZipcode: function(zipcode, place_name, place, service, map, type){
	    	var params = {'zipcode':zipcode, 'place_name':place_name, 'type': type};
	    	Ajax.place_check_zipcode_exist(params).then(function(data){
		        var json = $.parseJSON(data);
		        if (json.status == 0){
		        	Map.placeSave(zipcode, json.city_name, place.geometry.location.lat(), place.geometry.location.lng(), place_name, type, place, map, service);
		        }else{
		        	// console.log('existing......');
		        }
	      	});
	  	},

	  	placeSave: function(zipcode, netwrk_name, lat, lng, office, type, place, map, service){
		    var params;
		    if(type == 'gov'){
		    	params = {'zip_code':zipcode, 'netwrk_name':netwrk_name, 'lat':lat, 'lng':lng, 'office':office, 'office_type':'government'};
		    } else {
		    	params = {'zip_code':zipcode, 'netwrk_name':netwrk_name, 'lat':lat, 'lng':lng, 'office':office, 'office_type':'university'};
		    }
	    	Ajax.new_place(params).then(function(data){
				var js = $.parseJSON(data);
				if (type == 'gov') {
					Map.createMarker(service, place, map, zipcode, office, js, type);
				} else {
					Map.createMarker(service, place, map, zipcode, office, js, type);
				}
	    	});
	  	},

	  	createMarker: function(service, place, map, zipcode, name_of_place, cid, type) {
		    var placeLoc = place.geometry.location;
		    var img;

		    if (type == 'gov') {
				img = './img/icon/map_icon_government_v_2.png';
			} else {
				img = './img/icon/map_icon_university_v_2.png';
			}
		    
		    var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location,
				icon: img,
				city_id: cid,
				place_name: name_of_place,
	    	});

	      	var infowindow = new google.maps.InfoWindow({
		        content: '',
		        city_id: cid,
		        maxWidth: 350
	      	});

	      	google.maps.event.addListener(marker, 'click', (function(marker) {
				return function(){
					if(!isMobile){
						infowindow.close();
					}
					Topic.init(marker.city_id);
				};
		    })(marker));

	      	var content = '<div id="iw-container" >' +
	                '<div class="iw-title"><span class="toppost">Top Post</span><a class="info_zipcode" data-city="'+ cid +'" onclick="Map.eventOnClickZipcode('+ cid +')"><span class="zipcode">'+ zipcode + '</span></a></div>' +
	                '<div class="iw-content">' +
	                  '<div class="iw-subTitle">#'+''+'</div>' +
	                  '<p>'+''+'</p>'+
	                '</div>' +
	                '<div class="iw-bottom-gradient"></div>' +
	              '</div>';
	      	infowindow.content = content;
	        Map.infowindow.push(infowindow);

		    google.maps.event.addListener(marker, 'mouseover', function() {
				infowindow.open(map, this);
				Map.onhoverInfoWindow(cid,marker);
		    });

		    google.maps.event.addListener(marker, 'mouseout', function() {
		      // infowindow.close();
		    });

			google.maps.event.addListener(infowindow, 'domready', function() {
				var iwOuter = $('.gm-style-iw');

				var iwBackground = iwOuter.prev();
				iwOuter.children(':nth-child(1)').css({'max-width' : '400px'});
				// Removes background shadow DIV
				iwBackground.children(':nth-child(2)').css({'display' : 'none'});

				//   // Removes white background DIV
				iwBackground.children(':nth-child(4)').css({'display' : 'none'});

				//   // Moves the shadow of the arrow 76px to the left margin.
				iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'top: 174px !important;left: 192px !important;'});

				//   // Moves the arrow 76px to the left margin.
				iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'top: 174px !important;left: 192px !important;'});

				//   // Changes the desired tail shadow color.
				iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': '#477499 0px 1px 0px 2px', 'z-index' : '1'});

				//   // Reference to the div that groups the close button elements.
				var iwCloseBtn = iwOuter.next();

				//   // Apply the desired effect to the close button
				iwCloseBtn.css({opacity: '0', right: '135px', top: '15px', border: '0px solid #477499', 'border-radius': '13px', 'box-shadow': '0 0 0px 2px #477499','display':'none'});

				//   // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
				iwCloseBtn.mouseout(function(){
				  $(this).css({opacity: '0'});
				});
			});

	      	Map.markers.push(marker);
	  	},

	  	getZipcodeAddress: function(service, place, map, type, lat, lng, name_of_place){
	        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+','+lng ,function(data){
	          var len = data.results[0].address_components.length;
	          for(var i=0; i<len; i++) {
	          	if(data.results[0].address_components[i].types[0] == 'postal_code') {
	            	// console.log(data);
	            	var zip = data.results[0].address_components[i].long_name;
	            	console.log(zip);
	            	service.getDetails(place, function(_place, status) {
						if (status === google.maps.places.PlacesServiceStatus.OK) {
							// console.log(place);
							console.log(_place);
							Map.checkPlaceZipcode(zip, _place.name, place, service, map, type);
						}
					});
	            }
	          }
	        });
	  	},
	  	// End code for get university and government place
	  	OnEventInfoWindow: function(e){
	  		Map.OnCreateFirstTopic(e);
	  		Map.OnEventTopTopic(e);
	  		Map.OnEventTopPost(e);
	  	},

	  	OnEventTopPost: function(e){
	  		var parent = $('.container-popup').find('.top-post .post .name');
	  		parent.unbind();
	  		parent.on('click',function(d){
	            PopupChat.params.post = e.post.post_id;
	            PopupChat.params.chat_type = e.post.post_type;
	            PopupChat.params.post_name = e.post.name_post;
	            PopupChat.params.post_description = e.post.content;
	            ChatInbox.params.target_popup = $('.popup_chat_modal #popup-chat-'+PopupChat.params.post);
	            PopupChat.initialize();
	  		});
	  	},

	  	OnEventTopTopic: function(e){
	  		var parent = $('.container-popup').find('.top-topic .name-topic');
	  		// Topic.initialize(city);
	  		parent.unbind();
	  		parent.on('click',function(d){
	  			var topic = e.topic[$(d.currentTarget).attr('data-index')];
	            Post.params.topic = topic.id;
	            Post.params.topic_name = topic.name;
	            Post.params.city = topic.city;
	            Post.params.city_name = topic.city_name;
	            Post.initialize();
	  		});
	  	},

	  	OnCreateFirstTopic: function(e){
	  		var parent = $('.container-popup').find('.create-topic');

	  		parent.unbind();
	  		console.log(e);
	  		parent.on('click',function(){
	  			if(isGuest){
	  				Login.modal_callback = Create_Topic;
	  				Create_Topic.params.city = e.id;
	  				Create_Topic.params.city_name = e.zip_code;
	  				Create_Topic.initialize();
	  			}else{
	  				Create_Topic.initialize(e.id,e.zip_code);
	  			}
	  		});
	  	},

	  	eventClickMyLocation: function(map){
		    var btn = $('#btn_my_location');
		    btn.unbind();
		    btn.on('click',function(){
		      	if (isGuest) {
			        navigator.geolocation.getCurrentPosition(function(position) {
			        var pos = {
			            lat: position.coords.latitude,
			            lng: position.coords.longitude
			        	};
			            map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
			            if(map.getZoom() < 12) {
			            	map.setZoom(12);
			        	}else{
			        		map.setZoom(18);
			        	}
			        });
		      	} else {
			        var zoom_current = map.getZoom();
			        if (zoom_current < 12) {
				        Map.smoothZoom(map, 12, zoom_current, true);
				        map.zoom = 12;
			        }else{
			        	Map.smoothZoom(map, 18, zoom_current, true);
				        map.zoom = 18;
			        }

			        Ajax.get_position_user().then(function(data){
				        var json = $.parseJSON(data);
				        map.setCenter(new google.maps.LatLng(json.lat, json.lng));
			        });
		      	}
		    });
	  	},

	  	eventZoom: function(map){
		    var mode = true;
		    map.addListener('dblclick', function(event){
				if(map.getZoom() == 7 || (map.getZoom() > 7 && map.getZoom() < 12)){
					Map.smoothZoom(map, 12, map.getZoom() + 1, true);
					map.zoom = 12;
					if(isMobile){
						sessionStorage.map_zoom = 12;
					}
				} else if(map.getZoom() == 12 || (map.getZoom() > 12 && map.getZoom() < 18)){
					Map.smoothZoom(map, 18, map.getZoom() + 1, true);
					map.zoom = 18;
					if(isMobile){
					    sessionStorage.map_zoom = 18;
					}
				}
			});

			map.addListener('zoom_changed', function(){
				var data_marker;
				var currentZoom = map.getZoom();
				if(isMobile){
				    sessionStorage.map_zoom = currentZoom;
				}
				if(currentZoom == 18){
	    			Map.map.setOptions({zoomControl: false, scrollwheel: true, styles: null});
	    		} else {
	    			var remove_poi = [
				        {
							stylers: [
								{ hue: "#00ffe6" },
								{ saturation: -20 }
							]
						},{
							featureType: "road",
							elementType: "labels",
							stylers: [
								{ visibility: "off" }
							]
						},{
							featureType: "road",
							elementType: "geometry",
							stylers: [
								{ lightness: 100 }
							]
						},{
							featureType: "poi",
							stylers: [
								{ visibility: "off" }
							]
						}
					];
				    Map.map.setOptions({zoomControl: false, scrollwheel: true, styles: remove_poi});
	    		}
	    		if (currentZoom == 12 && Map.markers.length <= 10) {
	    			Map.deleteNetwrk(map);
				    Map.loadMapLabel(0);
					for (var i = 0; i < Map.zoom12.length; i++) {
						var m = Map.zoom12[i];
						m.marker.setMap(map);
					    Map.markers.push(m.marker);
				    }
	    		} else if (currentZoom == 11 && Map.markers.length > 10) {
	    			Map.deleteNetwrk(map);
					Map.hideMapLabel();		
					for (var i = 0; i < Map.zoom7.length; i++) {
						var m = Map.zoom7[i];	
						m.marker.setMap(map);
					    Map.markers.push(m.marker);
				    }
	    		}
			});
	  	},

	  	loadMapLabel: function(offset) {
	  		var endOffset = offset + 200;
	  		if (endOffset > Map.zoom12.length) {
	  			endOffset = Map.zoom12.length;
	  		}
	  		var m = {};
	  		for (i=offset; i<endOffset; i++) {
	  			m = Map.zoom12[i];
  				m.label.setMap(Map.map);
	  		}
	  		if (endOffset<Map.zoom12.length) {
	  			Map.timeout = setTimeout(Map.loadMapLabel, 200, endOffset);
	  		}
	  	},

	  	hideMapLabel: function() {
	  		clearTimeout(Map.timeout);
	  		for (i=0; i<Map.zoom12.length; i++) {
	  			m = Map.zoom12[i];
  				m.label.setMap(null);
	  		}
	  	},

	  	smoothZoom: function(map, level, cnt, mode) {
		    // If mode is zoom in
		    if(mode == true) {
			    if (cnt > level) {
			        Map.incre = 1;
			        return;
			    } else {
			        var z = google.maps.event.addListener(map, 'zoom_changed', function(event){
			          google.maps.event.removeListener(z);
			          Map.smoothZoom(map, level, cnt + 1, true);          
			        });
		        	setTimeout(function(){map.setZoom(cnt)}, 50);
					// if (Map.incre < 2) {
					// 	Map.incre++;
					// } else {
					// 	Map.incre = 2;
					// }
		      	}
		    } else {
			    if (cnt < level) {
			        Map.incre = 1;
			        return;
			    } else {
			        var z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
			        	google.maps.event.removeListener(z);
			         	Map.smoothZoom(map, level, cnt - 1, false);
			        });
		        	setTimeout(function(){map.setZoom(cnt)}, 110);
					// if (Map.incre < 2)
					// 	Map.incre++;
					// else {
					// 	Map.incre = 1;
					// }
		      	}
		    }
	  	},

	  	min_max_zoom: function(map){
		    google.maps.event.addListenerOnce(map, "projection_changed", function(){
		        map.setMapTypeId(google.maps.MapTypeId.HYBRID);  //Changes the MapTypeId in short time.
		        Map.setZoomLimit(map, google.maps.MapTypeId.ROADMAP);
		        Map.setZoomLimit(map, google.maps.MapTypeId.HYBRID);
		        Map.setZoomLimit(map, google.maps.MapTypeId.SATELLITE);
		        Map.setZoomLimit(map, google.maps.MapTypeId.TERRAIN);
		        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);  //Sets the MapTypeId to original.
		    });
	  	},

	  	setZoomLimit: function(map, mapTypeId){
		    //Gets MapTypeRegistry
		    var mapTypeRegistry = map.mapTypes;

		    //Gets the specified MapType
		    var mapType = mapTypeRegistry.get(mapTypeId);
		    //Sets limits to MapType
		    mapType.maxZoom = 18;  //It doesn't work with SATELLITE and HYBRID maptypes.
		    mapType.minZoom = 7;
	  	},

	  	reset_data: function(){
		    Map.params.name = null;
		    Map.params.zipcode = null;
		    Map.params.lat = null;
		    Map.params.lng = null;
	  	},

	  	eventOnclick: function(map){
			google.maps.event.addListener(map, 'click', function(e) {
				Map.closeInfoWindow();
				Map.reset_data();
				if (map.getZoom() == 12 ){
					Map.geocoder(e.latLng);
				}
				Map.latLng = e.latLng;
			});
	  	},

		eventOnclickMarker: function(){
		},

	  	eventOnClickZipcode: function(city){
			$.each(Map.infowindow,function(i,e){
				e.close();
				Map.infowindow=[];
			});
			Topic.initialize(city);
	  	},

	  	onhoverInfoWindow: function(city,marker){
		    $.each(Map.infowindow,function(i,e){
				if(e.open && e.city_id != city){
					e.close();
				}
		    });
	  	},

	  	closeInfoWindow:function(){
		    $.each(Map.infowindow,function(i,e){
		    	e.close();
		    });
	  	},

	  	geocoder: function(data){
		    var geo = new google.maps.Geocoder();

		    geo.geocode({'latLng': data},function(value,status){
				if(status == google.maps.GeocoderStatus.OK){
					Map.get_zipcode(value[0].address_components);
				}
		    });
	  	},

	  	get_zipcode: function(zipcode){
		    $.each(zipcode,function(i,e){
				if(e.types[0] == 'postal_code'){
					Map.checkzipcode(e.long_name);
				}
		    });
	  	},

	  	checkzipcode: function(zipcode){
	        $.getJSON("http://api.zippopotam.us/us/"+zipcode ,function(data){
	            if (data.places[0].state == "Indiana"){
	              Map.params.name = data.places[0]['place name'],
	              Map.params.zipcode = zipcode;
	              Map.params.lat = data.places[0].latitude;
	              Map.params.lng = data.places[0].longitude;
	              Create_Topic.params.zip_code = zipcode;
	              Create_Topic.params.lat = Map.latLng.lat();
	              Create_Topic.params.lng = Map.latLng.lng();
	              Create_Topic.params.netwrk_name = data.places[0]['place name'];

	              Ajax.check_zipcode_exist(Map.params).then(function(data){
	                var json = $.parseJSON(data);
	                if (json.status == 0){
	                  Topic.initialize($.now(),Map.params);
	                }else{
	                  Topic.initialize(json.city);
	                }
	              });
	            }
	        });
	  	},

	  	showHeaderFooter: function(){
	        $('.navbar-fixed-top').show();
	        $('.navbar-fixed-bottom').show();
	    },

	    insertLocalUniversity: function(){
	    	Ajax.insert_local_university().then(function(data){
	    		console.log('inserted');
	    	});
	    },

	    insertLocalGovernment: function(){
	    	Ajax.insert_local_government().then(function(data){
	    		console.log('local government is inserted');
	    	});
	    }
	}