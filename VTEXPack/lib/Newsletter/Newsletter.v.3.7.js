/**
* Newslleter V2
* @author Carlos Vinicius
* @version 3.7
* @date 2013-01-27
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexNews2=function(opts)
{
	var _this,defaults,options,_console,animateField;
	
	_this=jQuery(this);
	if(_this.length<1) return _this;
	
	defaults={
		defaultName:"Digite seu nome...", // Mensagem que será exibida no input
		defaultEmail:"Digite seu e-mail...", // Mensagem que será exibida no input
		nameField:".vtexNewsName", // Seletor do campo de nome
		emailField:".vtexNewsEmail", // Seletor do campo de e-mail
		btn:".vtexNewsButton",  // Seletor do campo de botão enviar
		elementError:".nv2_messageError", // Seletor do elemento com a mensagem de erro
		elementSuccess:".nv2_messageSuccess", // Seletor do elemento com a mensagem de sucesso
		validationMethod:"popup", // opções: "animateField", "popup" e "div"
		getAttr:"alt", // Nome do atributo do qual será obtido o nome a ser enviado
		setDefaultName:true, // Exibir ou não o nome padrão antes do usuário digitar
		checkNameExist:true, // Exibir ou não o email padrão antes do usuário digitar
		showInPopup:true, // (Descontinuado)
		animateSpeed:100, // Tempo em milesungos quando usa-se o método de animação do input
		animateDistance:15, // Valor em pixels no qual o campo ira se mover quando usa-se o método de animação do input (necessita que o campo tenha no mínimo "position:relative")
		animateRepeat:3, // Quantidade de vezes em que a animação se repetirá (quando usa-se o método de animação do input)
		animateFieldSuccess:".vtexNewsAnimateFieldSuccess", // Classe do input que tem a mensagem de sucesso
		timeHideSuccessMsg:3000, // Tempo em milesegundos em que a mensagem permanecerá no campo de e-mail
		successCallback:function(){}
	};
	options=jQuery.extend(defaults, opts);
	_console=("object"===typeof(console));
	
		// Suporte as funcionalidades antigas
	if(!options.showInPopup)
		options.validationMethod="div";
	
	// Checando se o plugin de popUp2 esta na página
	if(options.validationMethod=="popup" && "function"!==typeof jQuery.fn.vtexPopUp2){if(_console) console.log("[vtexNews2 - Erro] O popUp2 não foi encontrado. Adicione o Plugin de PopUp2."); return _this;}
	
	animateField=function(element){
		var fn,i;
		i=0;
		fn=function(){
			element.animate({left:"-="+options.animateDistance},options.animateSpeed,function(){
				element.animate({left:"+="+options.animateDistance},options.animateSpeed,function(){
					if(i<options.animateRepeat)
						fn();
					i++;
				})
			});
		};
		fn();
	};

	_this.each(function(){
		var sendData,elem,nameField,emailField,btn,elemError,elemSuccess,legendName,legendEmail;
		
		elem=jQuery(this);
		nameField=elem.find(options.nameField);
		emailField=elem.find(options.emailField);
		btn=elem.find(options.btn);
		elemError=elem.find(options.elementError);
		elemSuccess=elem.find(options.elementSuccess);

		// Reportando erros
		if(nameField.length<1 && options.checkNameExist){if(_console) console.log("[vtexNews2] Campo de nome, não encontrado ("+nameField.selector+")"); return elem;}
		if(emailField.length<1){if(_console) console.log("[vtexNews2] Campo de e-mail, não encontrado ("+emailField.selector+")"); return elem;}
		if(btn.length<1){if(_console) console.log("[vtexNews2] Botão de envio, não encontrado ("+btn.selector+")"); return elem;}
		if(options.validationMethod!="animateField" && (elemSuccess.length<1 || elemError.length<1)){if(_console) console.log("[vtexNews2] A(s) mensagem(ns) de erro e/ou sucesso esta(m) faltando \n ("+elemSuccess.selector+", "+elemError.selector+")"); return elem;}
		
		if(options.setDefaultName && nameField.is("input[type=text], textarea"))
			nameField.val(options.defaultName);
		emailField.val(options.defaultEmail);
		
		// legend in the field
		legendName=function(){
			var legElem,tempVal;
		
			if(!options.checkNameExist) return;
			
			legElem=nameField.filter(":visible");
			
			if(!legElem.length) return;
			
			tempVal=legElem.val();
			if(nameField.is("input, textarea"))
				legElem.bind({
					"focus":function(){ if(legElem.val()==tempVal && (legElem.val().search(options.defaultName.substr(0,6))===0 || options.setDefaultName))legElem.val(""); },
					"blur":function(){ if(legElem.val()==="")legElem.val(tempVal); }
				});
		};
		
		legendEmail=function(){
			var tempVal;
			tempVal=emailField.val();
			emailField.bind({
				"focus":function(){ if(emailField.val()==tempVal && emailField.val().search(options.defaultEmail.substr(0,6))===0)emailField.val(""); },
				"blur":function(){ if(emailField.val()==="")emailField.val(tempVal); }
			});
		};
		legendName();
		legendEmail();
		
		sendData=function(){
			var tmp,name,email,nameFieldVisible,isInvalidName,isInvalidEmail;
			
			if(tmp=elem.find(options.nameField).filter("input[type=text],select,textarea").val())
				name=tmp;
			else if(tmp=elem.find(options.nameField).filter("input[type=radio]:checked, input[type=checkbox]:checked").val())
				name=tmp;
			else if(tmp=elem.find(options.nameField).attr(options.getAttr))
				name=tmp;
			else if(tmp=elem.find(options.nameField).text())
				name=tmp;
			else if(tmp=elem.find(options.nameField).find(".box-banner img:first").attr("alt"))
				name=tmp;
			else
				name="";
			
			email=(elem.find(options.emailField).val()||"").trim();
			nameFieldVisible=elem.find(options.nameField).is(":visible");
			isInvalidName=((name.length<1 || name.search(options.defaultName.substr(0,6))===0) && ((options.checkNameExist||nameFieldVisible)?nameFieldVisible:true));
			isInvalidEmail=email.search(/^[a-z0-9\_\-\.]+@[a-z0-9\_\-]+(\.[a-z0-9\_\-]{2,})+$/i)<0;
			
			if(isInvalidName || isInvalidEmail)
			{
				if(options.validationMethod=="animateField"){
					if(isInvalidName)
						animateField(elem.find(options.nameField));
					if(isInvalidEmail)
						animateField(elem.find(options.emailField));
				}				
				else if(options.validationMethod=="popup")
					elemError.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterError"});
				else
				{
					elemError.slideDown().bind("click",function(){$(this).slideUp();});
					setTimeout(function(){
						elemError.slideUp();
					},1800);
				}			
			}
			else
			{
				btn.attr("disabled","disabled");				
				jQuery.ajax({
					url:'/no-cache/Newsletter.aspx',
					type:'POST',
					data:{
						'newsletterClientEmail':email,
						'newsletterClientName':name,
						'newsInternalCampaign':'newsletter:opt-in',
						'newsInternalPage':(document.location.pathname||"/").replace(/\//g,"_"),
						'newsInternalPart':'newsletter'
					},
					success:function(data)
					{
						var resetEmail, msgTime, emailElem;
						
						btn.removeAttr("disabled");
						
						if(options.validationMethod=="popup")
							elemSuccess.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterSuccess"});
						else if(options.validationMethod!="animateField")
							elemSuccess.slideDown().bind("click",function(){$(this).slideUp();});

						// "resetando" o formulário para os valores padrões
						emailElem=elem.find(options.emailField);
						if(options.setDefaultName && elem.find(options.nameField).is("input, textarea"))
							elem.find(options.nameField).val(options.defaultName);
						resetEmail=function(){emailElem.val(options.defaultEmail);};
						if(options.validationMethod=="animateField")
						{
							emailElem.val(elem.find(options.animateFieldSuccess).val()||"Obrigado!!!");
							emailElem.addClass("vtexNewsSuccess");
							msgTime=setTimeout(function(){
								emailElem.removeClass("vtexNewsSuccess");
								resetEmail();
								emailElem.unbind("focus.vtexNews");
							},options.timeHideSuccessMsg);
							emailElem.bind("focus.vtexNews",function(){
								emailElem.removeClass("vtexNewsSuccess");
								clearTimeout(msgTime);
								$(this).val("");
								$(this).unbind("focus.vtexNews");
							});
						}	
						else
							resetEmail();

						options.successCallback();
					}
				});
			}
		};

		btn.bind("click",function(){sendData();});
		
		var keyFunction=function(e)
		{
			var code=(e.keyCode?e.keyCode:e.which);
			if(13==code)
			{
				e.preventDefault();
				sendData();
			}
		};
		
		nameField.filter("input, textarea").bind("keydown",keyFunction);
		emailField.bind("keydown",keyFunction);
	});
	
	return _this;
};