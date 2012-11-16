/**
* Vtex Gift List
* @author Carlos Vinicius
* @version 1.2
* @date 2012-03-15
*/
jQuery.fn.vtexGiftlist=function(opts)
{
	var $this=jQuery(this);
	if($this.length<1)return $this;
	
	var defaults=
		{
			giftListWrap:".giftListWrap", // Elemento pai do controle de lista
			callback:function(){},
			// Função que permite a formatação/ajuste do botão "comprar" e "add a lista" na lista de SKU (multiplos Skus)
			buyBtnFormat:function(btn, listBtn)
			{
				var wrapList=jQuery('<div class="giftListBtn"></div>');
				var wrapBtn=jQuery('<div class="skuTplButtonsWrap"></div>');
				btn.after(wrapBtn);
				btn.appendTo(wrapBtn);
				listBtn.appendTo(wrapList);
				wrapList.appendTo(wrapBtn);
			}
		},
		options=jQuery.extend(defaults, opts),
		$b=jQuery("body"),
		$empty=jQuery(""),
		giftListWrap=$b.find(options.giftListWrap),
		_console=("object"==typeof(console));
		
	// Reportando erros
	if(giftListWrap.length<1){if(_console) console.log("Elemento contendo o controle de lista não encontrado ("+giftListWrap.selector+")"); return false;}

	var listWrapParent=giftListWrap.parent(),
		skuList=$b.find("div.skuList");
	
	var fns=
	{
		actions:function(listBtn)
		{
			var buttom=listBtn||$this;
			buttom.bind("click",function(){
				var noUser=giftListWrap.find(".giftlistcreate-nouser");
				giftListWrap.find(".giftlistinsertsku").show();
				giftListWrap.find(".giftlistinsertsku-message").css("display","block").hide();

				if(buttom.hasClass("multipleSkus"))
				{
					giftListWrap.find(".giftlistinsertsku-button").each(function(){
						var link=jQuery(this);
						var val=link.attr("href")||"";
						var vals=val.split(",");
						vals[1]="'"+buttom.attr("rel")+"'";
						link.attr("href",vals.join(","));
					});
				}			
				
				if(noUser.length<1)
					giftListWrap.vtexPopUp2({closeCallback:function(){giftListWrap.appendTo(listWrapParent);}});
				else
				{
					document.location.href=(noUser.attr("href")||"");
					return false;
				}
			});
		},
		buyButton:function()
		{
			var buyBtn=skuList.find(".buy-button");
			if(buyBtn.length<1 || skuList.length<2) return false;
			
			var listBtn=$this.clone().addClass("multipleSkus");
			buyBtn.each(function(){
				var listLink=listBtn.clone();
				var btnBuy=jQuery(this);
				options.buyBtnFormat(btnBuy,listLink);
				listLink.attr("rel",
					(btnBuy.attr("href")||"").split("Sku=").pop()
				);
				fns.actions(listLink);
			});
			$this.hide();
		}
	}
	
	fns.actions();
	fns.buyButton();
	return $this;
};