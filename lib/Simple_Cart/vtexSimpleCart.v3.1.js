/**
* Vtex Simple Cart
* @author Carlos Vinicius [ QUATRO DIGITAL ]
* @version 3.1
* @license MIT <http://pt.wikipedia.org/wiki/Licen%C3%A7a_MIT>
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
(function($){
	$.fn.simpleCart=jQuery.fn.vtexCart=function(opts)
	{
		var _this,log,extTitle,defaults,$empty,options,getCartData,requestError,requestSuccess,singularPlural,fillHtml;

		extTitle="Simple Cart";
		log=function(b,a){"object"===typeof console&&("undefined"!==typeof a&&"alerta"===a.toLowerCase()?console.warn("["+extTitle+"] "+b):"undefined"!==typeof a&&"info"===a.toLowerCase()?console.info("["+extTitle+"] "+b):console.error("["+extTitle+"] "+b))};
		
		_this=jQuery(this);
		if(!_this.length) return _this;
		
		// Armazenando os elementos do carrinho
		$.fn.simpleCart.elements=$.fn.simpleCart.elements.add(_this);
		
		defaults={
			cartQtt:".vtex-cartQtt", // Elemento que exibirá a quantidade de itens no carrinho
			cartTotal:".vtex-cartTotal", // Elemento que exibirá o valor total do carrinho
			itemsText:".vtex-ItemsText", // Elemento que contém o texto "itens" no singular e plural (opcional)
			callback:function(){}
		};
		options=jQuery.extend(defaults, opts);
		$empty=jQuery("");
		
		// Adicionando as configurações aos elementos jQuery
		_this.data("qd_simpleCartOpts",options);
		
		// Função que faz a requisição Ajax
		getCartData=function(){
			$.ajax({
				url:"/no-cache/QuantidadeItensCarrinho.aspx",
				success:requestSuccess,
				error:requestError
			});
		};
		
		// erro na requisição Ajax
		requestError=function(){
			log("Não foi possível fazer a requisição p/ obter os dados do carrinho.");
			if(-1<document.location.host.indexOf("localhost"))
				_this.show();
		};
		
		// Função para alterar o textos "itens" entre singular e plural
		singularPlural=function(quantity,itemsTextE){
			var qtt=parseInt(quantity,10);
			if(!isNaN(qtt))
				if(qtt===1)
					itemsTextE.hide().filter(".singular").show();
				else
					itemsTextE.hide().filter(".plural").show();
			else
				log("O valor obtido para calcular o plural/singular não é um número!");
		};
		
		// Levar as informações para a página
		fillHtml=function($data,elems){
			var qtt;
			qtt=$data.find(".amount-items-em").html();
			
			if(1>$data.filter(".cartInfoWrapper").length)
				return;
			else
				elems.$this.show();
			
			elems.cartTotalE.html($data.find(".total-cart-em").html());
			elems.cartQttE.html(qtt);
			singularPlural(qtt,elems.itemsTextE);
		};
		
		// Função executada quando os dados são retornados com sucesso
		requestSuccess=function(data){
			_this.each(function(){
				var elems={},$this;
			
				$this=$(this);
				elems.$this=$this;
				elems.cartQttE=$this.find(options.cartQtt)||$empty;
				elems.cartTotalE=$this.find(options.cartTotal)||$empty;
				elems.itemsTextE=$this.find(options.itemsText)||$empty;
				
				fillHtml($(data),elems);
			});
		};
		

		getCartData();
		options.callback();
		return _this;
	};
	
	// Armazenando todos os carrinhos para fazer o update
	$.fn.simpleCart.elements=$("");
	
	// Adicionando callback na função nativa da VTEX
	(function(){
		var fnOrig;
		
		fnOrig=ajaxRequestbuyButtonAsynchronous;
	
		ajaxRequestbuyButtonAsynchronous=function(method, url, postData, target, callback){
			var myCallback;
		
			myCallback=function(){
				if(typeof callback === "function") callback();
				
				$.fn.simpleCart.elements.each(function(){
					var t;
					t=$(this);
					t.simpleCart(t.data("qd_simpleCartOpts"));
				});
			};
		
			fnOrig.call(this,method, url, postData, target, myCallback);
		}
	})();
	
	// Chamada automática
	$(function(){
		$(".qd-CartAuto").simpleCart();
	});
	
})(jQuery);