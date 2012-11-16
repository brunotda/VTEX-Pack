/**
* Vtex Cart v2
* @author Carlos Vinicius
* @version 2.0
* @date 2011-03-15
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
	};
    var options=jQuery.extend(defaults, opts),
		$empty=jQuery(""),
		_console="object"===typeof(console);
	
	_this.each(function(){
		var $this=jQuery(this);
	
		var cartQttE=$this.find(options.cartQtt)||$empty,
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
				var $data=jQuery(data);
				var qtt=$data.find(".amount-items-em").html();
				cartTotalE.html($data.find(".total-cart-em").html());
				cartQttE.html(qtt);
				fns.singularPlural(qtt);
			},
			cartInfoAjaxError:function(){
				if(_console) console.log("Erro ao fazer a requisição p/ obter os dados do carrinho.");
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
	
	options.callback();
	return _this;
};