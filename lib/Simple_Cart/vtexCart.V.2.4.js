/**
* Vtex Cart v2
* @author Carlos Vinicius
* @version 2.4
* @date 2011-05-03
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexCart=function(opts)
{
	var _this=jQuery(this);
	if(_this.length<1) return _this;
    
	var defaults=
	{
		cartQtt:".vtex-cartQtt", // Elemento que exibirá a quantidade de itens no carrinho
		cartTotal:".vtex-cartTotal", // Elemento que exibirá o valor total do carrinho
		itemsText:".vtex-ItemsText", // Elemento que contém o texto "itens" no singular e plural (opcional)
		callback:function(){}
	},
		options=jQuery.extend(defaults, opts),
		$empty=jQuery(""),
		_console="object"===typeof(console),
		go=true;
	
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
					jQuery.ajax({
						url:"/no-cache/QuantidadeItensCarrinho.aspx",
						success:fns.cartInfoAjaxSuccess,
						error:fns.cartInfoAjaxError
					});
				},
				cartInfoAjaxSuccess:function(data){
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
					if(_console) console.log("Erro ao fazer a requisição p/ obter os dados do carrinho.");
					if(-1<document.location.host.indexOf("localhost")) $this.show();
				},
				singularPlural:function(quantity)
				{
					var qtt=parseInt(quantity);
					if(!isNaN(qtt))
						if(qtt===1)
							itemsTextE.hide().filter(".singular").show();
						else
							itemsTextE.hide().filter(".plural").show();
					else
						if(_console) console.log("[Error] o valor obtido para calcular o plural/singular não é um número!");
				}
			}
			
			fns.getCartInfo();
		});
	}
	
	if(0<jQuery("body").filter(".cadastro-cliente, .login, .email-mudou, .esqueci-senha, .esqueci-email").length)
	{
		go=false;
		_this.hide();
		jQuery.ajax({
			url:"/Control/TopBarAssincrono.aspx",
			success:function(data)
			{
				if(1>jQuery(data).filter("#MenuWelcomeDeslogado").length)
					exec();
			}
		});
	}	
	
	if(go)
		exec();
	
	options.callback();
	return _this;
};