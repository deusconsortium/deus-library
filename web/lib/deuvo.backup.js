/* ----------- common init ----------------- */
jQuery.ajaxSetup({ traditional: true });

//javascript object used to store user selection (protocol id, simulation name, input parameter etc...
$(document).data("userSelection", {
	projectId:null,
	protocolId:null,
	cosmology:null,
	boxLength:null,
	phisicId:null,
	resolution:null,
	snapshotId:null,
	simulationId:null,
	simulationName:null,
	objectType:null,
	postProcessorId:null,
	linkingLength:null,
	postProcessingId:null,
	clientMail:null,
	displayPageSize:100,
	datasetSize:1000,
	sortOrder:'ASC',
	sortCriterion:null
});

$(document).data("extractFunction",null);

RsB = new ResultSetBrowser($(document).data("userSelection").displayPageSize,
		$(document).data("userSelection").datasetSize);

/* ---------------------- utils --------------------- */
function getRandomId(size){			
	size = size>16?16:size;
	randId='';
    for (var i = 0; i < size;) {
    	value = Math.floor(Math.random()*123);
    	if ((value >= 48 && value <= 57) || (value >= 65 && value <= 90)
          || (value >= 97 && value <= 122)) {
    		randId += String.fromCharCode(value);
    		i++;
    	}
    }
    
    return  randId;
}

function normalizeStr(str){
	var resStr = str.toLowerCase();
	resStr = resStr.replace(/\s+/g,"_");
	resStr = resStr.replace(/[^a-z]+/g,"");
	resStr = resStr.replace(/[^a-z0-9_\.]/g,"");
	return resStr;
}

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}

function beautifulNumber(value,precision){
	if(value < 1000){
		return toFixed(value,precision);
	}else{
		return value.toExponential(2);
	}
}


/* ------------- document ready -------------------- */

jQuery(document).ready(function(){
	
	/* -------------------- common ----------------------------------*/
	
	RsB.submitQueryProductFunc = submitQueryProducts;
	
	/* -------------------- qtip part ------------------------------ */

	$.fn.qtip.styles.deuvostyle = {
	   width : 240,
	   border: {
	      width: 1,
	      radius: 3
	  }
	};
	$.fn.qtip.defaults.show.delay = 0;
	$.fn.qtip.defaults.show.effect.type = 'grow';
	$.fn.qtip.defaults.hide.effect.length = 30;
	
	/* ----------------- Jquery UI part -------------- */
	
	
	$('.accordion').click(function() {
		$(this).next().toggle('slow');
		return false;
	});
	
	
	

/* -----------------------------  Util  ---------------------------- */
	
	function MM_openBrWindow(theURL,winName,features) { //v2.0
		window.open(theURL,winName,features);
	}

	
	function emptyElm(id){
		$("#"+id).empty();
	}
	
	function emptySelect(id){
		$("#"+id+" option").each(function (i,opt) {
            $(opt).remove();
            });		
	}
	
	function emptyBottomForm(){
		emptyElm("matchingSimulations");
	}
	
	
	
	function startLoad(){
		if($("#loading").css("display") == "none"){
			$("#loading").css("display","block");
			$(document).mousemove(function(e) {
				  milieu = $("#loading").width() / 2;
				  $("#loading").css({left: e.pageX, top: e.pageY-2*milieu});
			});
		}
	}
	
	function stopLoad(){
		$("#loading").css("display","none");
		$(document).unbind('mousemove');
	}
	
	

	
	/* -----------  loader gif ---------------- */
	$("#loading").ajaxStart(function() {
		startLoad();
	});
	
	$("#loading").ajaxStop(function() {
		
		stopLoad();
	});

	/* -------------- pop up jquery part ------------- */
	tips = $( ".validateTips" );
	
	function updateTips( t ) {
		tips
			.text( t )
			.addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
	}
	
	/* for mail popup (jquery-ui) */
	function checkLength( o, n, min, max ) {
		if ( o.val().length > max || o.val().length < min ) {
			o.addClass( "ui-state-error" );
			updateTips( "Length of " + n + " must be between " +
				min + " and " + max + "." );
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp( o, regexp, n ) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass( "ui-state-error" );
			updateTips( n );
			return false;
		} else {
			return true;
		}
	}
	
	$("#email-form").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Extract Halos' particles": function() {
				var email = $("#email");
				var bValid = true;
				bValid = bValid && checkLength( email, "email", 6, 80 );
				bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );

				if ( bValid ) {
					$(document).data("userSelection").clientMail=email.val();
					//alert($(document).data("userSelection").clientMail);
					//rest_generateHaloParticleFile2();
					$(document).data("extractFunction")();
					$( this ).dialog( "close" );
				}else{
					email.val('email not valid, retry');
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			//allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	
	$("#extraction-started").dialog({autoOpen : false});
	$("#extraction-error-selection").dialog({autoOpen : false});
	
	

	/* --------- Simulation queries (tab1) -------------*/
	

		
	$(document).data("userSelection").projectId=$("#project").val();
	
	updateProtocols();

	$("#protocol").ajaxSuccess(function(e, xhr, settings) {
		  if (settings.url.search("ajax\/availableSimulatorByProject") != -1) {
			  	updateCosmology();
				updatePhysics();
				//updateBoxLength();
				//updateResolution();
		  }
	});
	
	

	/* protocols */
	function updateProtocols() {
		emptyElm("protocol");
	    $.getJSON("ajax/availableSimulatorByProject", { projectId : $(document).data("userSelection").projectId }, 
	    		function(protocolsList) {
	    	var cnt = 0;
	    	jQuery.each(protocolsList, function(index,proto) {
	    		cnt=index;
	    		if(index == 0){
	    			$("#protocol").append("<option name='"+proto.name+"' value='"+proto.id+"' selected>"+proto.name+"</option>");
	    			$(document).data("userSelection").protocolId=proto.id;
	    		}else{
	    			$("#protocol").append("<option name='"+proto.name+"' value='"+proto.id+"' >"+proto.name+"</option>");
	    		}
	    		$("option[name='"+proto.name+"']").qtip({content : proto.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
	    	});
			if(cnt == 0){
				$("#protocol").attr("disabled","disabled");
			}
	    	
	    });
	}
	
	
	
    $('#protocol').change(function() {
    	updateCosmology();
    	updatePhysics();
    	//updateBoxLength();
    	//updateResolution();
    });
	
	
	/* cosmology */
	function updateCosmology() {
		var cosmologyName = [ "Lambda", "Ratra-Peebles", "Sugra"];
		
		emptyElm("cosmology");
		 $.getJSON('ajax/availableParameterSettingForInputParameterProtocolProject', { inputParameterName : 'Dark energy type', 
		   	protocolId : $(document).data("userSelection").protocolId,
			projectId : $(document).data("userSelection").projectId}, 
			function(cosmologyList) {
				var strToAppend = "";
				jQuery.each(cosmologyList, function(index,cosmology) {
					// if(index == 0){
					// 	strToAppend = strToAppend.concat("<option value='"+cosmology.numericvalue_value+"' selected>"+cosmologyName[cosmology.numericvalue_value-1]+"</option>");
					//	$(document).data("userSelection").cosmology=cosmology.numericvalue_value;
					// }else{
					strToAppend = strToAppend.concat("<option value='"+cosmology.numericvalue_value+"'>"+cosmologyName[cosmology.numericvalue_value-1]+"</option>");
					// }
				});
				$("#cosmology").append(strToAppend);
				
				//updateSnapshotsForProjectProtocolCosmology();
		   	}
		);
	}
	

    $('#cosmology').click(function() {
    	$(document).data("userSelection").cosmology=$('#cosmology').val();
    	updateBoxLength();
    });

	/*
	$(document).ready(function() {
	    $('#cosmology').change(function() {
			updateSnapshotsForProjectProtocolCosmology();
	    });
	});
	$/
	
	
	/* physics */
	function updatePhysics() {
		emptyElm("physic");
		 $.getJSON('ajax/availablePhysicsByProtocol', { protocolId : $(document).data("userSelection").protocolId }, function(physicList) {
		    	jQuery.each(physicList, function(index,physic) {
		    		if(index == 0){
		    			$("#physic").append("<option value='"+physic.id+"' name='"+physic.name+"' selected>"+physic.name+"</option>");
		    			$(document).data("userSelection").physicId=physic.id;
		    		}else{
		    			$("#physic").append("<option value='"+physic.id+"' name='"+physic.name+"'>"+physic.name+"</option>");
		    		}
		    		
		    		$("option[name='"+physic.name+"']").qtip({content : physic.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});
		    });
	}
	
	
    $('#physic').click(function() {
    	$(document).data("userSelection").physicId=$('#physic').val();
    });
	
	
	/* boxLength */
	function updateBoxLength() {
		emptyElm("boxLength");
		// $.getJSON('ajax/availableParameterSettingForInputParameterProtocolProject', { 
		$.getJSON('ajax/availableParameterSettingForInputParameterCosmologyProtocol', { 
			inputParameterName : 'Boxlength', 
	    	protocolId : $(document).data("userSelection").protocolId,
			projectId : $(document).data("userSelection").projectId,
			cosmology : $(document).data("userSelection").cosmology}, 
			function(boxLengthList) {
				jQuery.each(boxLengthList, function(index,boxLength) {
					if(boxLength.numericvalue_unit == 'dimensionless'){
						boxLength.numericvalue_unit = '';
		    		}
					if(index == 0){
						$("#boxLength").append("<option value='"+boxLength.numericvalue_value+"' selected>"+boxLength.numericvalue_value+" "+boxLength.numericvalue_unit+"</option>");
						$(document).data("userSelection").boxLength=boxLength.numericvalue_value;
					}else{
			    		$("#boxLength").append("<option value='"+boxLength.numericvalue_value+"'>"+boxLength.numericvalue_value+" "+boxLength.numericvalue_unit+"</option>");
					}
	 
				});
				updateResolution();
	    	}
		);
	}
	
	
    $('#boxLength').click(function() {
    	$(document).data("userSelection").boxLength=$('#boxLength').val();
    	updateResolution();
    });
	
	
	/* resolution */
	function updateResolution() {
		emptyElm("resolution");
		 $.getJSON('ajax/availableResolutionForCosmologyBoxlengthProtocol', {
			protocolId : $(document).data("userSelection").protocolId,
			cosmology : $(document).data("userSelection").cosmology,
			boxlength : $(document).data("userSelection").boxLength}, 
			function(resolutionList) {
				jQuery.each(resolutionList, function(index,resolution) {
					if(resolution.numericvalue_unit == 'dimensionless'){
						resolution.numericvalue_unit = '';
		    		}
					if(index == 0){
			    		$("#resolution").append("<option value='"+resolution.numericvalue_value+"' selected>"+resolution.numericvalue_value+" "+resolution.numericvalue_unit+"</option>");
			    		$(document).data("userSelection").resolution=resolution.numericvalue_value;
					}else{
			    		$("#resolution").append("<option value='"+resolution.numericvalue_value+"'>"+resolution.numericvalue_value+" "+resolution.numericvalue_unit+"</option>");
					}
				});
	    	}
		);
	}
	
	
    $('#resolution').click(function() {
    	$(document).data("userSelection").resolution=$('#resolution').val();
    });
	
	
	/* parametter settings for selected simulation */
	function updateParameterSettingForExp() {
		/* trick to avoid dirty div resizing when calling remove() then append() */
		var tabHeight = 0;
		if($("#simulationParameterSettings").height() > 0){
			tabHeight = $("#simulationParameterSettings").height();	
			$("#simulationParameterSettings").height(tabHeight);
		}
		//$("#simulationParameterSettings tr").remove();
		
		if($("#matchingSimulations").val()){
			//var paramStr='';
		    $.getJSON('ajax/parameterSettingForExperiment', { experimentId : $("#matchingSimulations").val() }, function(parameterSettingList) {
		    	jQuery.each(parameterSettingList, function(index,parameterSetting) {
		    		if(parameterSetting.numericvalue_unit == 'dimensionless'){
		    			parameterSetting.numericvalue_unit = '';
		    		}
		    		if(index % 2 == 1){
		    			//paramStr += '<tr><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+parameterSetting.numericvalue_value.toExponential(2)+' '+parameterSetting.numericvalue_unit+'</td></tr>';
		    			$("#simulationParameterSettings").append('<tr><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+beautifulNumber(parameterSetting.numericvalue_value,2)+' '+parameterSetting.numericvalue_unit+'</td></tr>');
		    		}else{
		    			//paramStr += '<tr style="background:none repeat scroll 0 0 #FDF5E6"><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+parameterSetting.numericvalue_value.toExponential(2)+' '+parameterSetting.numericvalue_unit+'</td></tr>';
		    			$("#simulationParameterSettings").append('<tr style="background:none repeat scroll 0 0 #ddf1ff"><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+beautifulNumber(parameterSetting.numericvalue_value,2)+' '+parameterSetting.numericvalue_unit+'</td></tr>');
		    		}
		    		$("div[name='"+parameterSetting.name+"']").qtip({content : parameterSetting.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});
		    	
		    	//$("#simulationParameterSettings").append(paramStr);
		    
		    	
		    });
		    
		    
		    
		}
		$("#simulationParameterSettings tr").remove();
	}
	
	/* -----------------------  Form submit part -------------------------- */
	
	
	$("#1FormButton").click(function(){
		//alert($(document).data("userSelection").physic+' '+$(document).data("userSelection").cosmology+' '+$(document).data("userSelection").protocol+' '+$(document).data("userSelection").boxLength+' '+$(document).data("userSelection").resolution);
		if($(document).data("userSelection").physicId && 
				$(document).data("userSelection").cosmology && 
				$(document).data("userSelection").protocolId && 
				$(document).data("userSelection").boxLength && 
				$(document).data("userSelection").resolution){
			submitQuerySimulations();
    		if($("#matchingSimulationsDiv").css("display") == "none"){
	    		$("#matchingSimulationsDiv").show();
	    	}
    	}
	});
	

	
	/* register event handler for select input of simulations */
	$('#matchingSimulations').live('click', function() {
		$(document).data("userSelection").simulationId=$("#matchingSimulations").val();
		
		/^(.+)_snapid_[0-9]+$/.exec($("#matchingSimulations option:selected").attr('name'));
		$(document).data("userSelection").simulationName=RegExp.$1;
		//alert($(document).data("userSelection").simulationName);
		
		/.+_snapid_([0-9]+)$/.exec($("#matchingSimulations option:selected").attr('name'));
		$(document).data("userSelection").snapshotId=RegExp.$1;
	});
	

	/* 1st part form (model,size...): get matching simulations */
	function submitQuerySimulations(){
		emptyElm("matchingSimulations");
		jQuery.post('querySimulations', { 
			cosmology : $(document).data("userSelection").cosmology ,
			physic : $(document).data("userSelection").physicId,
			protocol : $(document).data("userSelection").protocolId,
			//snapshot : $('#snapshot').val(),
			boxLength : $(document).data("userSelection").boxLength,
			resolution : $(document).data("userSelection").resolution},
			function(simulationList){
				jQuery.each(simulationList, function(index,simu) {
					var formattedRedshift = toFixed(simu.redshift,2);
					if(index == 0){
						//$("#matchingSimulations").append("<option value='"+simu.id+"' name='"+simu.name+"_snapid_"+simu.snapshotid+"' selected>"+simu.name+", z="+formattedRedshift+"</option>");
						$("#matchingSimulations").append("<option value='"+simu.id+"' name='"+simu.name+"_snapid_"+simu.snapshotid+"' selected>z = "+formattedRedshift+"</option>");
						
						$(document).data("userSelection").simulationId=simu.id;
						$(document).data("userSelection").simulationName=simu.name;
						/.+_snapid_([0-9]+)$/.exec($("#matchingSimulations option:selected").attr('name'));
						$(document).data("userSelection").snapshotId=RegExp.$1;
					}else{
						//$("#matchingSimulations").append("<option value='"+simu.id+"' name='"+simu.name+"_snapid_"+simu.snapshotid+"'>"+simu.name+", z="+formattedRedshift+"</option>");
						$("#matchingSimulations").append("<option value='"+simu.id+"' name='"+simu.name+"_snapid_"+simu.snapshotid+"'>z = "+formattedRedshift+"</option>");
						
					}
					$("option[name='"+simu.name+"']").qtip({content : simu.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});	
				updateParameterSettingForExp();
				updateObjectTypeForSimu();
 			}, 
 			"json");
	}
	
	
	/* --------- PostProc queries (tab2) -------------*/
	
	
	/* available objectType for selected simulation */
	/* TODO : see if it's possible to use protocol part of DM instread of Simulation one to (faster) retrieve this infos */
	function updateObjectTypeForSimu() {
		emptySelect("objectType");
		if($("#matchingSimulations").val()){
			$.getJSON('ajax/availableObjectTypeForExperiment', { 
		    	experimentId :$(document).data("userSelection").simulationId}, 
				function(objectTypeList) {
			    	jQuery.each(objectTypeList, function(index,objectType) {
						if(index == 0){
							$("#objectType").append("<option value='"+objectType.name+"' name='"+objectType.name+"' selected>"+objectType.name+"</option>");
							$(document).data("userSelection").objectType=objectType.name;
						}else{
							$("#objectType").append("<option value='"+objectType.name+"' name='"+objectType.name+"' >"+objectType.name+"</option>");
						}
						$("option[name='"+objectType.name+"']").qtip({content : objectType.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
			    		$("option[name='"+objectType.name+"']").qtip({content : objectType.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
			    	});
			    	
			    	//while($("#objectType").queue() > 0 );

			    	if(objectTypeList.length == 1)
			    		updatePostprocessorForObjectTypeSimu();
			    		
		    });
		}
	}
	
	
	/* register event handler for select input of objectype */
	$('#objectType').live('click', function() {
		$(document).data("userSelection").objectType=$("#objectType").val();
		updatePostprocessorForObjectTypeSimu();
	});
	

	/* available postprocessor for objectype and experiment(simulation) */
	function updatePostprocessorForObjectTypeSimu() {
		emptySelect("postprocessor");
	    $.getJSON('ajax/availablePostProcessorForExperimentObjectType', { 
	    	experimentId :$(document).data("userSelection").simulationId, 
	    	objectTypeName : $(document).data("userSelection").objectType}, 
			function(postprocessorList) {
		    	jQuery.each(postprocessorList, function(index,postprocessor) {
					
					if(index == 0){
						$("#postprocessor").append("<option value='"+postprocessor.id+"' name='"+postprocessor.name+"' selected>"+postprocessor.name+"</option>");
						$(document).data("userSelection").postProcessorId=postprocessor.id;
					}else{
						$("#postprocessor").append("<option value='"+postprocessor.id+"' name='"+postprocessor.name+"' >"+postprocessor.name+"</option>");
					}
					/*
					$("#postprocessor").append("<option value='"+postprocessor.id+"' name='"+postprocessor.name+"' >"+postprocessor.name+"</option>");
					*/
					$("option[name='"+postprocessor.name+"']").qtip({content : postprocessor.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});
		    	
		    	$(document).data("userSelection").postprocParamsSetting = new Array();
		    	
		    	while($("#postprocessor").queue().length > 0);
		    	
		    	if(postprocessorList.length == 1)
		    		updatePostprocessingParametersList();
	    });
	}
	
	/* register event handler for select input of objectype */
	$('#postprocessor').live('click', function() {
		$(document).data("userSelection").postProcessorId=$("#postprocessor").val();
		updatePostprocessingParametersList();
	});
	
	
	function getParametersForProtocol(protocolId){
		var paramsList = [];
		$.ajax({  
			  url: 'ajax/getAvailableInputParametersByProtocol',  
			  dataType: 'json',  
			  data: {protocolId : protocolId },  
			  async: false,  
			  success:
				    function(paramList) {
						jQuery.each(paramList, function(index,param) {
							var tmpParam = {};
							tmpParam.id=param.id;
							tmpParam.name=param.name;
							tmpParam.description=param.description;
							paramsList.push(tmpParam);
						});
		    		}
		});  
		return paramsList;
	}
	
	/* update parameters list for choosen postprocessing */
	function updatePostprocessingParametersList() {
		emptyElm("postprocParams");
		paramsList = getParametersForProtocol($(document).data("userSelection").postProcessorId);
		jQuery.each(paramsList, 
			function(index, param){
				if(index == 0){
					$("#postprocParams").append("<option name='"+param.name+"' value='"+param.id+"' selected>"+param.name+"</option>");
				}else{
					$("#postprocParams").append("<option name='"+param.name+"' value='"+param.id+"'>"+param.name+"</option>");
				}
				$("option[name='"+param.name+"']").qtip({content : param.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
			}
		);
		
		while($("#postprocParams").queue().length > 0);
    	
    	if(paramsList.length == 1)
    		updatePostprocessingParameterValuesList();
	}
	
	$('#postprocParams').live('click', function() {
		updatePostprocessingParameterValuesList();
	});
	
	/* update parameter values list for choosen postprocessing paramater */
	function updatePostprocessingParameterValuesList() {
		emptyElm("postprocParamValues");
		var parameterId = $("#postprocParams").val();
		$.ajax({  
			  url: 'ajax/availableParameterSettingForParameterPostprocessorParent',  
			  dataType: 'json',  
			  data: {inputParameterId : parameterId, 
				  protocolId : $(document).data("userSelection").postProcessorId,
				  snapshotId : $(document).data("userSelection").snapshotId},   
			  success:
				  	function(paramValuesList) {
						  jQuery.each(paramValuesList, 
								function(index, pvalue){
									if(index == 0){
										$("#postprocParamValues").append("<option  value='"+pvalue.numericvalue_value+"' selected>"+pvalue.numericvalue_value+"</option>");
										$(document).data("userSelection").postprocParamsSetting[parameterId]=pvalue.numericvalue_value;
									}else{
										$("#postprocParamValues").append("<option  value='"+pvalue.numericvalue_value+"'>"+pvalue.numericvalue_value+"</option>");
									}
								}
							);	
		    		}
		});
	}
	
	$('#postprocParamValues').live('click', function() {
		var parameterId = $("#postprocParams").val();
		$(document).data("userSelection").postprocParamsSetting[parameterId]=$("#postprocParamValues").val();
	});
	
	/* 2nd part form (object,finder...): get matching postprocessing 
	function submitQueryPostprocessing(){
		emptyElm("matchingPostprocessings");
		$(".objecttypeName").html('('+$(document).data("userSelection").objectType+')');
		
		jQuery.post('queryPostprocessing', { 
			experimentId : $(document).data("userSelection").simulationId,
			snapshotId : $(document).data("userSelection").snapshotId,
			postprocessorId : $(document).data("userSelection").postProcessorId,
			linkingLength : $(document).data("userSelection").linkingLength},
			function(postprocessingList){
				jQuery.each(postprocessingList, function(index,postprocessing) {
					if(index == 0){
						$("#matchingPostprocessings").append("<option value='"+postprocessing.id+"' name='"+postprocessing.name+"' selected>"+postprocessing.name+"</option>");
						$(document).data("userSelection").postProcessingId=postprocessing.id;
					}else{
						$("#matchingPostprocessings").append("<option value='"+postprocessing.id+"' name='"+postprocessing.name+"'>"+postprocessing.name+"</option>");
					}
					$("option[name='"+postprocessing.name+"']").qtip({content : postprocessing.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});	
				updateParameterSettingForPostpro();
				updatePropertiesStatsForObjecttype();
 			}, 
 			"json");
	}*/
	
	/* 2nd part form (object,finder...): get matching postprocessing */
	function submitQueryPostprocessing(){
		emptyElm("matchingPostprocessings");
		//$(".objecttypeName").html('('+$(document).data("userSelection").objectType+')');
		var paramSetting = 0;
		var paramsSettingList = $(document).data("userSelection").postprocParamsSetting;
		for(var parameterId in paramsSettingList){
			paramSetting = paramsSettingList[parameterId];
			break;
		}
		jQuery.post('queryPostprocessing', { 
			experimentId : $(document).data("userSelection").simulationId,
			snapshotId : $(document).data("userSelection").snapshotId,
			postprocessorId : $(document).data("userSelection").postProcessorId,
			inputParamId : parameterId,
			inputParamSetting : paramSetting},
			function(postprocessingList){
				jQuery.each(postprocessingList, function(index,postprocessing) {
					if(index == 0){
						$("#matchingPostprocessings").append("<option value='"+postprocessing.id+"' name='"+postprocessing.name+"' selected>"+postprocessing.name+"</option>");
						$(document).data("userSelection").postProcessingId=postprocessing.id;
					}else{
						$("#matchingPostprocessings").append("<option value='"+postprocessing.id+"' name='"+postprocessing.name+"'>"+postprocessing.name+"</option>");
					}
					$("option[name='"+postprocessing.name+"']").qtip({content : postprocessing.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
		    	});	
				if(postprocessingList.length == 0){
					$("#matchingPostprocessingTr").hide();
					$("#propertiesRangeQueryDiv").hide();
					$("#matchingProductsDiv").hide();
				}else{
					updateParameterSettingForPostpro();
					updatePropertiesStatsForObjecttype();
				}
 			}, 
 			"json");
	}
	
	/* register event handler for select input of simulations */
	$('#matchingPostprocessings').live('click', function() {
		$(document).data("userSelection").postProcessingId=$('#matchingPostprocessings').val();
    	updateParameterSettingForPostpro();
    	sortCriterion = $(document).data("userSelection").sortCriterion = null;
    	//$("#propertiesRangeQueryDiv > table").hide();
	});
	
	
	
    $('#2FormButton').click(function() {
    	if($(document).data("userSelection").objectType && $(document).data("userSelection").postProcessorId &&
    			$(document).data("userSelection").postprocParamsSetting){
    		submitQueryPostprocessing();
    		if($("#matchingPostprocessingTr").css("display") == "none"){
	    		$("#matchingPostprocessingTr").show();
	    	}
    	}
    });
	
	
	/* parametter settings for selected postprocessing */
	function updateParameterSettingForPostpro() {
		$("#postprocessingParameterSettings tr").remove();
	    $.getJSON('ajax/parameterSettingForExperiment', {
	    	experimentId : $(document).data("userSelection").postProcessingId }, 
	    	function(parameterSettingList) {
	    	jQuery.each(parameterSettingList, function(index,parameterSetting) {
	    		if(parameterSetting.numericvalue_unit == 'dimensionless'){
	    			parameterSetting.numericvalue_unit = '';
	    		}
	    		if(index % 2 == 1){
	    			$("#postprocessingParameterSettings").append('<tr><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+parameterSetting.numericvalue_value.toFixed(2)+' '+parameterSetting.numericvalue_unit+'</td></tr>');
	    		}else{
	    			$("#postprocessingParameterSettings").append('<tr style="background:none repeat scroll 0 0 #ddf1ff"><td><div name="'+parameterSetting.name+'">'+parameterSetting.name+'</div></td><td>'+beautifulNumber(parameterSetting.numericvalue_value,2)+' '+parameterSetting.numericvalue_unit+'</td></tr>');
	    		}
	    		$("div[name='"+parameterSetting.name+"']").qtip({content : parameterSetting.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
	    	
	    	});
	    });
	    // not very useful as we cannot know in advance which properties
	    // wil be selected by user (and thus cache them). Cache every properties
	    // seems to be too heavy....
	    $.getJSON('ajax/diskCacheExperimentData', {
	    	experimentId : $(document).data("userSelection").postProcessingId,
	    	normalizedObjecttype : normalizeStr($(document).data("userSelection").objectType)}, 
	    	function(rowCount) {
	    		//do nothing...
	    	}
	    );
	}
	
	
	
	/* -------------- Object Properties (tab3) -------------- */
	
	
	
	//Put here the stats you want to be printed on the interface (ordered)
	var statNameList = ["Min", "Mean","Max"];
	//Put here properties that must be printed (no choice is given to print them or not)
	var mandatoryOutputProperties = ["x","y","z"];
	/* available properties for objectype  (and in the futur for experiment(simulation), not done yet because of perf problem joining result/product tables) */
	function updatePropertiesStatsForObjecttype() {
		
	    $.getJSON('ajax/propertiesAndStatsExperimentObjecttype', { 
	    	objecttypeName :  $(document).data("userSelection").objectType, 
	    	experimentId : $(document).data("userSelection").postProcessingId }, 
			function(propertyStatList) {
	    		$("#propertiesRangeQueryTable").empty();
	    		
	    		// print header
	    		var tabPropHeaderStr = '<tr>\n<th>Property</th>\n<th>greater than</th>\n<th>lower than</th>\n';
            	
	    		for(var j=0;j<statNameList.length;j++){
	    			tabPropHeaderStr += '<th>'+statNameList[j]+'</th>\n';
	    		}
	    		tabPropHeaderStr += '<th>View in result</th>\n';
	    		$("#propertiesRangeQueryTable").append(tabPropHeaderStr+'</tr>'+'\n');
	    		
	    		// print values
		    	jQuery.each(propertyStatList, function(index,propertyStat) {
		    		var unit = (propertyStat.unit.search(/dimensionless/i))?"<i><small>("+propertyStat.unit+")</small></i>":"";
		    		var propRowStr = '<tr><td><div name="'+propertyStat.propName+'">'+propertyStat.propName+' '+unit+'</div></td>\n';
		    		propRowStr += '<td><input id="iptmin'+propertyStat.colName+'" type="text"/></td>\n';
		    		propRowStr += '<td><input id="iptmax'+propertyStat.colName+'" type="text"/></td>\n';
		    		//$("#propertiesRangeQueryTable").append(propRowStr);
		    		
	    			for(j=0;j<statNameList.length;j++){
	    				//var myRe = /$(statNameList[j])/i;
	    				var myRe = new RegExp(statNameList[j]+"\\s+.+", "i");
	    				var found=false;
	    				jQuery.each(propertyStat.statList, function(indexStat,pStat){ // COULD BE IMPROVED USING "IN_ARRAY" FROM JQUERY
		    				if (myRe.test(pStat.name)){
					    		found=true;
					    		//$("#propertiesRangeQueryTable > tbody").append('<td><div name="'+pStat.name+'">'+beautifulNumber(pStat.numericvalue_value,2)+'</div></td>\n');
					    		propRowStr += '<td><div="'+pStat.name+'">'+beautifulNumber(pStat.numericvalue_value,2)+'</div></td>\n';
					    		
					    		//$("div[name='"+pStat.name+"']").qtip({content : pStat.description,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
						    	
					    		return false;
		    				}
	    				});
	    				if(!found)
	    					propRowStr += '<td>n/a</td>\n';
	    			}
	    			
	    			if(jQuery.inArray(propertyStat.colName, mandatoryOutputProperties) < 0){
	    				propRowStr += '<td><input type="checkbox" value="'+propertyStat.colName+'"/></td>\n';
	    			}else{
	    				propRowStr += '<td>yes</td>\n';
	    			}
	    			
	    			propRowStr += '</tr>';
	    			$("#propertiesRangeQueryTable").append(propRowStr+'\n');
	    			$("div[name='"+propertyStat.propName+"']").qtip({content : propertyStat.propDescription,style: { name: 'deuvostyle' }, position : {target :'mouse'},show: { solo: true }});
			    	
	    			//selectPropOrderByStr += '<option value="'+propertyStat.colName+'">'+propertyStat.propName+'</option>\n';
		    	});
		    	//$("#productsOrderby").html(selectPropOrderByStr+'\n');
		    	
		    });
	}
	

/*		
		function generateParticlesFiles() {
			//which properties shall we print for matching products ? 
			var productIdList = [];
			if($('input:checkbox[name="downloadParticles"]:checked').length > 0){
				$('input:checkbox[name="downloadParticles"]:checked').each(function(idx){ 
					productIdList.push($(this).val());
				});
				 $.getJSON('ajax/generateParticlesFile', { objectIdList : productIdList}, 
						function(purl) {
				 			$("#downloadParticlesFile").html("<a href='"+purl.url+"'>particles file</a>");
				    	});
			}else{
				alert("at least one halo must be selected");
			}
			
		}
*/		
	
	function toggleSelectProduct(callingElm, checkboxName){
		var action = false;
		// if any selected, select all
		if($(callingElm).attr('name') =='none'){
			$(callingElm).attr('name','all');
			$(callingElm).html('<u>(deselect all)</u>');
			action = true;
		//else, if all selected, deselect all
		}else{
			$(callingElm).attr('name','none');
			$(callingElm).html('<u>(select all)</u>');
		}
			
		
		$('input:checkbox[name="'+checkboxName+'"]').each(function(idx){
			$(this).attr('checked', action);
		});
	}
	
	
	  $('button[name=searchMatchingObject]').click(function() {
		  submitQueryProducts();
	  });
	
	
	
	/* 3rd part form (object,finder...): get matching postprocessing */
	var globalProductList = [];
	var wantedPropertyNameList = mandatoryOutputProperties;//see above
	
	function submitQueryProducts(resultPageToDisplay){
		
		if(typeof(resultPageToDisplay) == 'undefined'){
			resultPageToDisplay=1;
		}
		
		wantedPropertyNameList = mandatoryOutputProperties;//see above
		var whereList = new Array();
		var selectList = new Array();
		
		
		/* which properties shall we print for matching products ? */
		var tmpWantedPropertyNameList = [];
		$("#propertiesRangeQueryDiv input:checkbox:checked").each(function(idx){ 
			tmpWantedPropertyNameList.push($(this).val());
		});
		
		
		//wantedPropertyNameList = tmpWantedPropertyNameList.slice();
		wantedPropertyNameList = wantedPropertyNameList.concat(tmpWantedPropertyNameList);
		
		
		
		/* at least one property must be selected !! */
		if(wantedPropertyNameList.length > 0){
			
			RsB.propertyNameToDisplayList = wantedPropertyNameList.slice();
			
			/*build select clause */
			selectList = wantedPropertyNameList;
			
			
			// build orderby clause 
			var sortCriterion = "";
			var sortOrder = "";
		
			
			if($(document).data("userSelection").sortCriterion != null){
				sortCriterion = $(document).data("userSelection").sortCriterion;
				sortOrder = $(document).data("userSelection").sortOrder;
			}
			
			RsB.sortCriterion = sortCriterion;
			RsB.sortOrder = sortOrder;
			
			
			/* build where clause */
			$('input[id^="ipt"]').each(function(i,propCond){
				var localWhere = "";
				var pCondName = $(propCond).attr("id");
				
				/* check filled input only */
	    		if($(propCond).val()){
	    			var inputval = $(propCond).val();
					var pname = pCondName.replace(/ipt(min|max)/,"");
	    			
	    			/* check if it is min or max condition and build sql clause*/
	    			if(pCondName.search("iptmin") != -1){
	    				localWhere = pname +" > "+ inputval;
	    			}
	    			if(pCondName.search("iptmax") != -1){
	    				localWhere = pname +" < "+ inputval;
	    			}
	    		}
				
	    		/* if any min/max clause are defined, ignore property, else append clause to main whereClause */
	    		if(localWhere != ""){
	    			whereList.push(localWhere);
	    		}
	    		
			});
			$(document).data("whereList",whereList);
			//whereClause = whereClause.replace(/^and\s/," ");
		
			/* retrieve matching products through ajax call (JSON data) and print them  */
			jQuery.post('queryProductsTAP', { 
				experimentId : $(document).data("userSelection").postProcessingId, //32,
				whereList : whereList, 
				selectList : selectList, 
				orderbyClause : sortCriterion, 
				orderClause : sortOrder,
				normalizedObjecttype : normalizeStr($(document).data("userSelection").objectType),
				pageNo : resultPageToDisplay,
				itemsPerPage : $(document).data("userSelection").datasetSize},
				function(res){
					//clean screen
					//$("#matchingProducts").css("display","none");
					$("#matchingProducts thead tr").remove();
					$("#matchingProducts tbody tr").remove();
					
					$("#productDownloadLink").html("");
					$("#productsPager").html("");
					
					if(res.resultCount == 0){
						$("#productsNumber").html("<br/>There is not any result for your request");
					}else{
						
						/*
						if(res.resultCount > 2000){
							$("#productsNumber").html("<br/>There are "+res.resultCount+" results, only the first 2000 are displayed ");//(sorted by "+orderCriterion+")");
							//$("#productDownloadLink").html('<a onclick="javascript:rest_ExtractHalosCheckmail(true);return false;">Extract all Halos found</a>');
							$("#productDownloadLink").append(' | <a onclick="javascript:rest_ExtractObjectsCheckmail();return false;">Extract selected Halos</a>');
							//$("#matchingProducts").css("display","none");
							//$("#productsPager").empty();
						}else{
						*/
						$("#productsNumber").html("There are "+res.resultCount+" matching objects ");//(sorted by "+orderCriterion+")");
						$("#productDownloadLink").html('<a name="launchExtraction" style="cursor:pointer;" >Extract selected Halos</a>');
						$("#productDownloadLink a[name='launchExtraction']").click(function(){rest_ExtractObjectsCheckmail();});//"javascript:rest_ExtractObjectsCheckmail();return false;"
						//}
						
						
						var productList = res.productList;
						
						
						// print header
						if(productList.length>0){
							var strToAppend = '<tr>';
							for(var i=0;i<wantedPropertyNameList.length;i++){
								strToAppend = strToAppend.concat('<th name="prod_list_header_'+wantedPropertyNameList[i]+'" style="cursor:pointer;"><u>'+wantedPropertyNameList[i]+'</u></th>');
								//strToAppend = strToAppend.concat('<th >'+wantedPropertyNameList[i]+'</th>');
							}
							strToAppend = strToAppend.concat('<th>extract particles from</th>');
							$("#matchingProducts thead").html(strToAppend.concat('</tr>'));
							
							RsB.resultSetList = productList.slice();
							//globalProductList = productList.slice();
							
							$("#matchingProducts tbody").empty();
							//showProductsPage(1,resultPageToDisplay);
							RsB.showProductsPage(1,resultPageToDisplay);
						}
						
						var rand = Math.random().toString();
						rand = rand.substring(rand.lastIndexOf(".")+1);
						/* ----------------- samp web connector part ----------- */
						var accessLinksStr = " | <img id=\"deuvoHubStatusIcon\" " +
								"src=\"resources/images/samp/disconnected.png\" " +
								"onclick=\"deuvoSamp.toggleConnection();\"/>";
						accessLinksStr += " <a name='broadcast2SampLink' title='samp' " +
								"href='javascript:void(0);' " +
								"onclick=\"javascript:WebSampConnector.sendMsg('table.load.votable','','','"+res.productListVotableURL+"','')\"';>Broadcast VOTable through SAMP</a>";
						
						
						if(res.productListTextURL != "")
							accessLinksStr += " | <a href='"+res.productListTextURL+"'>Download Text File</a>\n";
						if(res.productListVotableURL != "")
							accessLinksStr += " | <a href='"+res.productListVotableURL+"' target='_blank'>Download Votable</a>\n";
						
						accessLinksStr += "<br/>TopCat : <a href='http://www.star.bris.ac.uk/~mbt/topcat/' " +
								"onclick=\"MM_openBrWindow('http://www.star.bris.ac.uk/~mbt/topcat/','topcat download','scrollbars=yes,width=650,height=500'); return false;\">" +
								"Download</a>";
						accessLinksStr += " | <a href='http://www.star.bris.ac.uk/~mbt/topcat/topcat-lite.jnlp'>Launch</a>";
		
						$("#productDownloadLink").append(accessLinksStr);
						
						$("#deuvoHubStatusIcon").qtip({content : 
							"Click to connect/disconnect to Samp Bus. Samp is a protocol " +
							"to share data among VO applications. As an example, you can run " +
							"TopCat, then click this link to make Deuvo send data to TopCat",
							style: { name: 'deuvostyle' }, 
							position : {target :'mouse'},
							show: { solo: true, delay: 0, effect : {length : 0} }});
						
						$("a[name='broadcast2SampLink']").qtip({content : 
							"Send selected data to Samp enabled application. The " +
							"Samp enabled application (like Topcat) must be started " +
							"before broadcasting data",
							style: { name: 'deuvostyle' },
							position : {target :'mouse'},
							show: { solo: true, delay: 0, effect : {length : 0} }});

					}
	 			}, 
	 			"json");
			
		}else{
			alert("At least one property must be checked");
		}
	}
	
	/* register event handler for product list column click to sort */
	$('th[name^="prod_list_header_"]').live('click' ,function(event) {
		var propName = $(this).attr('name');
		sortProductsBy(propName.slice(17));
	});

	
	/*show product sorted */
	function sortProductsBy(prop){
		if($(document).data("userSelection").sortCriterion == prop){
			newSortOrder = $(document).data("userSelection").sortOrder == 'ASC'?'DESC':'ASC';
			$(document).data("userSelection").sortOrder = newSortOrder;
		}else{
			$(document).data("userSelection").sortCriterion = prop;
		}
		submitQueryProducts();
	}
	
	/* durty pager :-) for products */
	
	function showProductsPage(relativePageNumber, resultPageToDisplay){
		
		var perPage = $(document).data("userSelection").displayPageSize;
		var dsQueryPageSize = $(document).data("userSelection").datasetQueryPageSize;
		var Inf = dsQueryPageSize*(resultPageToDisplay-1)/perPage;
		var pageNumber = relativePageNumber + Inf;
		var Sup = Inf + globalProductList.length/perPage;
		if(globalProductList.length%perPage > 0){
			Sup++; 
		}
		
		/* first function call : print table */
		if($("#matchingProducts tbody tr").length == 0){
			
			
			/* print all data assigning page group to each one */
			for(var i=0;i<globalProductList.length;i++){
					var product = globalProductList[i];
					var relativePageNbr = (i==0?1:Math.ceil(i/perPage));
					var strToAppend = '<tr class="page'+relativePageNbr+'" style="display:none">';
					jQuery.each(wantedPropertyNameList, function(ind,prop){
						strToAppend = strToAppend.concat('<td>'+beautifulNumber(product[prop],2)+'</td>');
					});
					strToAppend = strToAppend.concat('<td><input type="checkbox" name="downloadParticles" value="'+product["x"]+'|#|'+product["y"]+'|#|'+product["z"]+'"></td>');
					//strToAppend = strToAppend.concat('<td><input type="checkbox" name="downloadParticles" value="'+product["idp"]+'"></td>');
					
					$("#matchingProducts tbody").append(strToAppend.concat('</tr>'));
			}
			/* show only queried page */
			showProductsPage(relativePageNumber, resultPageToDisplay);
		/* Data are already printed, we just want to change page show */
		}else{
			$("#matchingProducts tbody tr").css("display","none");
			$("#matchingProducts tbody tr.page"+relativePageNumber).css("display","");
		}
		
		/* print pages navigator */
		
		$("#productsPager").empty();
		strToAppend = "";
		
		
		if(Inf != 0){
			strToAppend = strToAppend.concat("<a href='javascript:submitQueryProducts("+(resultPageToDisplay-1)+")'> <b><u>previous...</u></b></a>,");
		}
		
		
		for(var j=Inf+1;j<=Sup;j++){
			if(j != pageNumber){
				strToAppend = strToAppend.concat("<a href='javascript:showProductsPage("+(j-Inf)+","+resultPageToDisplay+")'> "+j+"</a>,");
			}else{
				strToAppend = strToAppend.concat("<a href='javascript:showProductsPage("+(j-Inf)+","+resultPageToDisplay+")'> <b><u>"+j+"</u></b></a>,");
			}
		}
		if(globalProductList.length == dsQueryPageSize){
			strToAppend = strToAppend.concat("<a href='javascript:submitQueryProducts("+(resultPageToDisplay+1)+")'> <b><u>more...</u></b></a>,");
		}
		
		$("#productsPager").append(strToAppend.concat());
	}

	
	
	/* ----------------------- REST ---------------------- */
	
	/*
	function test_rest_joblist(){
		
		jQuery.post("get_halo_components/jobs", 
				
				{clientMail:"david.languignon@obspm.fr", jobsCount:1, groupId:getRandomId(16)},
				function(res){
					
					if(res == "0"){
						alert("error : res = 0");
					}else{
						setTimeout(function(){RestCheckStatus(res);}, 3000);
					}
				});
	}
	*/
	
	function rest_ExtractObjectsCheckmail(extractAll){
		// false by default.....
		// extract all objects that have been found given user query
		extractAll = typeof(extractAll) != 'undefined' ? extractAll : false;
		if(extractAll){
			$(document).data("extractFunction",rest_ExtractAllFoundObjects);
		}else{
			if($('input:checkbox[name="downloadParticles"]:checked').length > 0){
				$(document).data("extractFunction",rest_ExtractUserSelectedObjects);
				$( "#email-form" ).dialog( "open" );
			}else{
				$("#extraction-error-selection").dialog("open");
			}
		}
	}
	
	
	function rest_ExtractAllFoundObjects(){
			
			if(!$(document).data("userSelection").clientMail)
				$(document).data("userSelection").clientMail="david.languignon@obspm.fr";
	
			jQuery.post("ajax/extractAllFoundObjects", { 
					experimentId : $('#matchingPostprocessings').val(),
					whereClause : $(document).data("whereClause"),
					orderbyClause : $(document).data("orderbyClause"),
					normalizedObjecttype : normalizeStr($("#objectType").val()),
					snapshotId : $(document).data("userSelection").snapshotId,
					simulationName : $(document).data("userSelection").simulationName,
					clientMail : $(document).data("userSelection").clientMail}, 
					function(res){
						$("#job_group_id").html(res.groupId);
						$("#extraction-started").dialog('open');
			    	},"json");
		
	}	
	
	function rest_ExtractUserSelectedObjects(){
		
		if($('input:checkbox[name="downloadParticles"]:checked').length > 0){
			if(!$(document).data("userSelection").clientMail)
				$(document).data("userSelection").clientMail="david.languignon@obspm.fr";
			
			//var idp = 0;
			var coordsList = new Array();
			$('input:checkbox[name="downloadParticles"]:checked').each(function(idx,elm){ 
				/*
				var tmpCoordsArray = $(elm).val().split("|#|");
				var coordObject = new Object();
				coordObject['x']=tmpCoordsArray[0];
				coordObject['y']=tmpCoordsArray[1];
				coordObject['z']=tmpCoordsArray[2];
				coordsList.push(coordObject);
				*/
				//idp = $(elm).val();
				coordsList.push($(elm).val());
				
				//alert(coord);
			});
			
			jQuery.post("ajax/extractUserSelectedObjects", { 
					"coordsList" : coordsList,
					"experimentId" : $('#matchingPostprocessings').val(),
					"normalizedObjecttype" : normalizeStr($("#objectType").val()),
					"snapshotId" : $(document).data("userSelection").snapshotId,
					"simulationName" : $(document).data("userSelection").simulationName,
					"clientMail" : $(document).data("userSelection").clientMail}, 
					function(res){
						$("#job_group_id").html(res.groupId);
						$("#extraction-started").dialog('open');
			    	},"json");
		}else{
			alert("at least one object must be selected");
		}
	}		
	
	
	
	
	
	
	
	/* TODO */
	
	/*
	function rest_generateHaloParticleFile(){
		
		if($('input:checkbox[name="downloadParticles"]:checked').length > 0){
			
			if(!$(document).data("userSelection").clientMail)
				$(document).data("userSelection").clientMail="david.languignon@obspm.fr";
			if(!$(document).data("userSelection").jobGroup)
				$(document).data("userSelection").jobGroup=getRandomId(16);
			
			$(document).data("userSelection").jobsCount=$('input:checkbox[name="downloadParticles"]:checked').length;
			
			
			var isMonitored=0;
			$('input:checkbox[name="downloadParticles"]:checked').each(function(idx,elm){ 
				var coord = $(elm).val().split("|#|");
				//alert(coord);
				
				jQuery.post("get_halo_components/jobs_particles", { x : coord[0],
						y : coord[1],
						z : coord[2],
						snapshotId : $(document).data("userSelection").snapshotId,
						simulationName : $(document).data("userSelection").simulationName,
						clientMail : $(document).data("userSelection").clientMail,
						groupId : $(document).data("userSelection").jobGroup,
						jobsCount : $(document).data("userSelection").jobsCount}, 
						function(res){
							if( !isMonitored && res.groupId != "0" ){
								setTimeout(function(){RestCheckStatus(res.groupId);}, 3000);
								isMonitored=1;
							}
				    	},"json");
			});
		}else{
			alert("at least one halo must be selected");
		}
		
	}	
	*/
	
	/*
	function RestCheckStatus(jobid,oneShot){
		if(!oneShot) 
			var oneShot = 0;
		
		var url='get_halo_components/jobs/'+jobid;
		jQuery.get(url,function(jStatus) {
			alert("le job "+jobid+"est : "+jStatus);	
			statusMsg="Generating File...";
			if(jStatus != "COMPLETED" && jStatus != "ERROR"){
				setTimeout(function(){RestCheckStatus(jobid);},4000);
			}else{
				if(jStatus == "COMPLETED"){
					rest_getJobResult(jobid,rest_setDownloadResultLink);
				}		
					
				if(jStatus == "ERROR")
					statusMsg="Error Generating File";
						
				if(jStatus == "JOB DOES NOT EXIST"){
					if(oneShot)
						statusMsg="Error Generating File";
					else
						setTimeout(function(){RestCheckStatus(jobid,1);},5000);
				}
					
			}
			$("#productDownloadLink").html(statusMsg);
		});			
	}
	*/
	
	/*
	
	function rest_setDownloadResultLink(res){
		statusMsg="<a href='"+res.url+"'>Download Particles File</a>";
		$("#productDownloadLink").html(statusMsg);
	}
	
	function rest_getJobResult(jobid,callBack){
		$.getJSON('get_halo_components/jobs/'+jobid+'/results', 
				 function(res) {
			 		callBack(res);	
				});
	}
	
	*/
	
	
	
	/*
	
	function rest_getJobList(){
		 jQuery.get('get_halo_components/jobslist/10', 
					function(jList) {
						jQuery.each(jList, function(index,job) {
							$("#test").append(job.functional_id+ "\t "+job.start_date+"\t "+job.end_date+"\t "+job.groupid+"<br/>\n");
						});
		 });
	}
	
	*/
	
});

// Note : 
// * datasetSize = queried size of the data set returned by the sql query (defined
// by "limit" or constrained by the DAO adapter) and send back to the web browser
// to avoid memory buffer overflow in the client browser.... This is ths MAXIMUM
// size of the dataset (as the last page may be shorter...)
// * displayPageSize = size of a page displayed on the ui
// ex : select ... LIMIT 1000 => datasetSize = 1000
//      displayPageSize = 100 => the ui will display the 1000 results in pages 
//		of 100 results, that is 10 ui display pages per dataset
//
function ResultSetBrowser(displayPageSize, datasetSize){
	
	// ---- constructor
	
	/* By convention, we make a private that variable. This is used to make the 
	object available to the private methods. This is a workaround for an error 
	in the ECMAScript Language Specification which causes this to be set 
	incorrectly for inner functions.  src : Crockford */
	var that = (this === window) ? {} : this;

	that.domTableId = "#matchingProducts";
	that.domPagerId = "#productsPager";
	that.propertyNameToDisplayList = [];
	that.resultSetList = [];
	that.sortCriterion = '';
	that.sortOrder = 'ASC';
	
	that.submitQueryProductFunc = null;

	that.displayPageSize = (typeof displayPageSize == 'undefined') ? 100 : displayPageSize;
	that.datasetSize = datasetSize;
	
	// ---- privileged methods
	that.sortProductsBy = function(prop){
		if(that.sortCriterion == prop){
			var newSortOrder = that.sortOrder == 'ASC'?'DESC':'ASC';
			that.sortOrder = newSortOrder;
		}else{
			that.sortCriterion = prop;
		}
		that.submitQueryProductFunc();
	};
	
	//* relativePageNumber is the page number relative to the current retrieved 
	// sub dataset form server-side
	// * datasetPageToDisplay is the current retrieved sub dataset form server-side
	that.showProductsPage = function(relativePageNumber, datasetPageToDisplay){
		
		var perPage = that.displayPageSize;
		var dsSize = that.datasetSize;
		// effective datasetSize (must be <= datasetSize)
		var effectiveDsSize = that.resultSetList.length;

		var Inf = effectiveDsSize*(datasetPageToDisplay-1)/perPage;
		// absolute page number on the whole sql query result data set
		var pageNumber = relativePageNumber + Inf;
		var Sup = Inf + effectiveDsSize/perPage;

		// don't forget the last, possibly not full, page
		if(effectiveDsSize%perPage > 0){
			Sup++; 
		}
		
		/* if first function call : print table */
		if($(that.domTableId+" tbody tr").length == 0){
			
			
			/* print all data assigning page group to each one */
			for(var i=0;i<effectiveDsSize;i++){
					var object = that.resultSetList[i];
					// page number relative to the current resultSetPage
					var relativePageNbr = (i==0?1:Math.ceil(i/perPage));
					var strToAppend = '<tr class="page'+relativePageNbr +
						'" style="display:none">';
					jQuery.each(that.propertyNameToDisplayList, function(ind,prop){
						strToAppend = strToAppend.concat('<td>'+
								beautifulNumber(object[prop],2)+'</td>');
					});
					strToAppend = strToAppend.concat('<td><input type="checkbox"' + 
							'name="downloadParticles" value="'+object["x"]+'|#|'+
							object["y"]+'|#|'+object["z"]+'"></td>');
					//strToAppend = strToAppend.concat('<td><input type="checkbox" name="downloadParticles" value="'+product["idp"]+'"></td>');
					
					$(that.domTableId+" tbody").append(strToAppend.concat('</tr>'));
			}
			/* show only queried page */
			that.showProductsPage(relativePageNumber, datasetPageToDisplay);
		
		/* Data are already printed, we just want to change page show */
		}else{
			$(that.domTableId+" tbody tr").css("display","none");
			$(that.domTableId+" tbody tr.page"+relativePageNumber).css("display","");
		}
		
		/* print pages navigator */
		
		$(that.domPagerId).empty();
		strToAppend = "";
		
		
		if(Inf != 0){
			strToAppend = strToAppend.concat("<a href='javascript:RsB.submitQueryProductFunc("+
					(datasetPageToDisplay-1)+")'> <b><u>previous...</u></b></a>,");
		}
		
		
		for(var j=Inf+1;j<=Sup;j++){
			if(j != pageNumber){
				strToAppend = strToAppend.concat("<a href='javascript:RsB.showProductsPage("+
						(j-Inf)+","+datasetPageToDisplay+")'> "+j+"</a>,");
			}else{
				strToAppend = strToAppend.concat("<a href='javascript:RsB.showProductsPage("+
						(j-Inf)+","+datasetPageToDisplay+")'> <b><u>"+j+"</u></b></a>,");
			}
		}
		// display link to next datasetPage
		if(effectiveDsSize == dsSize){
			strToAppend = strToAppend.concat("<a href='javascript:RsB.submitQueryProductFunc("+
					(datasetPageToDisplay+1)+")'> <b><u>more...</u></b></a>,");
		}
		
		$(that.domPagerId).append(strToAppend.concat());
	};
	
}