/**
* Newslleter V2
* @author Carlos Vinicius
* @version 3.1
* @date 2012-03-15
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexNews2=function(opts)
{
	var _this=jQuery(this);
	if(_this.length<1) return _this;
	
	var defaults={
		defaultName:"Digite seu nome...", // Mensagem que será exibida no input
		defaultEmail:"Digite seu e-mail...", // Mensagem que será exibida no input
		nameField:".vtexNewsName", // Seletor do campo de nome
		emailField:".vtexNewsEmail", // Seletor do campo de e-mail
		btn:".vtexNewsButton",  // Seletor do campo de botão enviar
		elementError:".nv2_messageError", // Seletor do elemento com a mensagem de erro
		elementSuccess:".nv2_messageSuccess", // Seletor do elemento com a mensagem de sucesso
		setDefaultName:true, // Exibir ou não o nome padrão antes do usuário digitar
		checkNameExist:true, // Exibir ou não o email padrão antes do usuário digitar
		getAttr:"alt" // Nome do atributo do qual será obtido o nome a ser enviado
	};
	var options=jQuery.extend(defaults, opts),
		_console=("object"===typeof(console));
	
	_this.each(function(){
		var elem=jQuery(this),
			nameField=elem.find(options.nameField),
			emailField=elem.find(options.emailField),
			btn=elem.find(options.btn),
			elemError=elem.find(options.elementError),
			elemSuccess=elem.find(options.elementSuccess);

		// Reportando erros
		if(nameField.length<1 && options.checkNameExist){if(_console) console.log("Campo de nome, não encontrado ("+nameField.selector+")"); return elem;}
		if(emailField.length<1){if(_console) console.log("Campo de e-mail, não encontrado ("+emailField.selector+")"); return elem;}
		if(btn.length<1){if(_console) console.log("Botão de envio, não encontrado ("+btn.selector+")"); return elem;}
		if(elemSuccess.length<1 || elemError.length<1){if(_console) console.log("A(s) mensagem(ns) de erro e/ou sucesso esta(m) faltando \n ("+elemSuccess.selector+", "+elemError.selector+")"); return elem;}
		
		if(options.setDefaultName && nameField.is("input, textarea"))
			nameField.val(options.defaultName);
		emailField.val(options.defaultEmail);
		
		// legend in the field
		if(options.checkNameExist) nameField.filter(":visible").queue(function(){
			var $this=jQuery(this);
			var tempVal=$this.val();
			if(nameField.is("input, textarea"))
				$this.bind({
					"focus":function(){ if($this.val()==tempVal && ($this.val().search(options.defaultName.substr(0,6))==0 || options.setDefaultName))$this.val(""); },
					"blur":function(){ if($this.val()=="")$this.val(tempVal); }
				});
		});
		emailField.queue(function(){
			var $this=jQuery(this);
			var tempVal=$this.val();
			$this.bind({
				"focus":function(){ if($this.val()==tempVal && $this.val().search(options.defaultEmail.substr(0,6))==0)$this.val(""); },
				"blur":function(){ if($this.val()=="")$this.val(tempVal); }
			});
		});

		var sendData=function(){
			var name=(elem.find(options.nameField).filter("input,select,textarea").val()||(elem.find(options.nameField).attr(options.getAttr)||(elem.find(options.nameField).text()||""))).trim();
			
			var email=(elem.find(options.emailField).val()||"").trim();
			var nameFieldVisible=elem.find(options.nameField).is(":visible");
			
			if(((name.length<1 || name.search(options.defaultName.substr(0,6))==0) && ((options.checkNameExist||nameFieldVisible)?nameFieldVisible:true)) || email.search(/^[a-z0-9\_\-\.]+@[a-z0-9\_\-]+(\.[a-z0-9\_\-]{2,})+$/i)<0)
				elemError.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterError"});
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
						'newsInternalPage':(document.location.pathname||"/").replace("/","_"),
						'newsInternalPart':'newsletter'
					},
					success:function(data)
					{
						btn.removeAttr("disabled");
						elemSuccess.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterSuccess"});
						if(options.setDefaultName && nameField.is("input, textarea"))
							elem.find(options.nameField).val(options.defaultName);
						elem.find(options.emailField).val(options.defaultEmail);
					}
				});
			}
		};

		btn.bind("click",sendData);
		
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