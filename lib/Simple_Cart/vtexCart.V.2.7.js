/**
* Vtex Cart v2
* @author Carlos Vinicius
* @version 2.7
* @date 2012-09-21
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexCart=function(opts)
{
	var _this=jQuery(this);
	if(_this.length<1) return _this;
    
	log=function(msg,type){
		if("object"===typeof(console))
			console.log("[Cart2 - "+(type||"Erro")+"] "+msg);
	};
	
	var defaults=
	{
		cartQtt:".vtex-cartQtt", // Elemento que exibirá a quantidade de itens no carrinho
		cartTotal:".vtex-cartTotal", // Elemento que exibirá o valor total do carrinho
		itemsText:".vtex-ItemsText", // Elemento que contém o texto "itens" no singular e plural (opcional)
		callback:function(){}
	},
		options=jQuery.extend(defaults, opts),
		$empty=jQuery("");
		// go=true;
	
	var exec=function()
	{
		_this.each(function(){
			var $this=jQuery(this),
				cartQttE=$this.find(options.cartQtt)||$empty,
				cartTotalE=$this.find(options.cartTotal)||$empty,
				itemsTextE=$this.find(options.itemsText)||$empty;
			
			var fns=
			{
				getCartInfo:function()
				{
					if(document.location.host.indexOf("localhost")===0)
						fns.localhost();
					
					jQuery.ajax({
						url:"/no-cache/QuantidadeItensCarrinho.aspx",
						success:fns.cartInfoAjaxSuccess,
						error:fns.cartInfoAjaxError
					});
				},
				localhost:function()
				{
					cartTotalE.html("998,75");
					cartQttE.html(12);
					fns.singularPlural(12);
				},
				cartInfoAjaxSuccess:function(data)
				{
					var $data=jQuery(data),
						qtt=$data.find(".amount-items-em").html();
					
					if(1>$data.filter(".cartInfoWrapper").length)
						return;
					else
						$this.show();
					
					cartTotalE.html($data.find(".total-cart-em").html());
					cartQttE.html(qtt);
					fns.singularPlural(qtt);
				},
				cartInfoAjaxError:function()
				{
					log("Não foi possível fazer a requisição p/ obter os dados do carrinho.");
					if(-1<document.location.host.indexOf("localhost")) $this.show();
				},
				singularPlural:function(quantity)
				{
					var qtt=parseInt(quantity,10);
					if(!isNaN(qtt))
						if(qtt===1)
							itemsTextE.hide().filter(".singular").show();
						else
							itemsTextE.hide().filter(".plural").show();
					else
						log("O valor obtido para calcular o plural/singular não é um número!");
				}
			};
			
			fns.getCartInfo();
		});
	};
	
	/* if(0<jQuery("body").filter(".cadastro-cliente, .login, .email-mudou, .esqueci-senha, .esqueci-email").length)
	{
		go=false;
		_this.hide();
		jQuery.ajax({
			url:"/Control/TopBarAssincrono.aspx",
			success:function(data)
			{
				if(jQuery(data).filter("#MenuWelcomeDeslogado").length<1)
					exec();
			}
		});
	}	
	
	if(go)
		exec(); */
		
	exec();
	
	options.callback();
	return _this;
};