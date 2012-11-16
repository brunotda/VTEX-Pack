/**
* PopUps
* @author Carlos Vinicius
* @version 1.16
* @date 2012-04-13
*/
jQuery.fn.vtexPopUp2=function(opts)
{
	var $this=jQuery(this);
	if($this.length<1)return $this;
	
	var body=jQuery("body"),
		popUpElem=body.find(".boxPopUp2"),
		_console=("object"==typeof(console));
	
	// Checando se o html do popup já esta na página
	if(popUpElem.length<1)
	{
		popUpElem=jQuery('<div class="boxPopUp2"><div class="boxPopUp2-wrap"><span class="boxPopUp2-close"></span><div class="boxPopUp2-content"></div></div></div>');
		body.prepend(popUpElem);
		popUpElem.after('<div class="boxPopUp2-overlay"></div>');
	}
	
	var defaults=
		{
			popupType:null, // Tipo do pop up (newslleter, frete e etc)
			closeContent:null, // Conteúdo do elemento que tem a função de fechar o pop up (o "X")
			popupClass:"", // Classe para ser adicionada a div content do pop up
			quickViewClass:"", // Classe do quickview caso use uma diferente do padrão "quickViewLink"
			initCallback:function(){},
			closeCallback:function(){}
		},
		options=jQuery.extend(defaults, opts),
		bntClose=popUpElem.find(".boxPopUp2-close"),
		popupContent=popUpElem.find(".boxPopUp2-content"),
		closeElems=body.find(".boxPopUp2-close, .boxPopUp2-overlay"),
		overlay=body.find(".boxPopUp2-overlay"),
		$document=jQuery(document);
	
	if(null!=options.closeContent)
		bntClose.html(options.closeContent);
	
	var fns=
    {
        positioning:function()
        {
            var _document=$document.scrollTop(),
				_window=jQuery(window).height(),
				popUpSize=popUpElem.outerHeight(true),
				remainder=(popUpSize>=_window)?20:(_window-popUpSize)/2;
            
            popUpElem.css("top",(_document+remainder)+"px");
        },
        show:function(options)
        {
            options=options||{};
            overlay.fadeTo("fast",0.5,function(){
				popUpElem.show().addClass("popupOpened");
                if("boolean"===typeof(options.loading) && options.loading===true)
					fns.showLoading();
                else
                    fns.hideLoading();
            });
        },
        hideLoading:function()
        {
            popupContent.filter(":visible").css("background-image","none");
        },
        showLoading:function()
        {
            popupContent.filter(":visible").css("background-image",'url("/arquivos/ajax-loader.gif")');
        },
        close:function(options)
        {
            options=options||{};
            var close=function()
            {
                overlay.fadeOut("fast");
                popUpElem.fadeOut("fast",function(){
					popupContent.empty();
				});
                popupContent.attr("class","boxPopUp2-content");
                popUpElem.attr("class","boxPopUp2");
            };

            if(typeof(options.closeNow)=="boolean" && options.closeNow==true)
                close(); 

            if(closeElems.filter(".boxPopUp2-clickActive").length<1)
			{
                closeElems.addClass("boxPopUp2-clickActive").bind("click",function(){
                    if("function"===typeof(options.clickCallback)) 
                        options.clickCallback();
                    close();
                });
				$document.bind("keyup",function(e){
					if((e.keyCode?e.keyCode:e.which)==27)
						close();
				});
			}
			
			if($this.hasClass("autoClose"))
			{
				var seconds=($this.attr("class")||"").split("ac_").pop().split(" ").shift();
				if(isNaN(parseFloat(seconds))){if(_console) console.log("[Erro] O tempo informado (em segundos) não é um valor numérico: “"+seconds+"”"); return false;}
				setTimeout(function(){close();},seconds*1000);
			}
		},
		setType:function()
		{
			if($this.hasClass("quickViewLink"))
				fns.quickView();
			else if($this.hasClass("giftListWrap"))
				fns.giftList();
			else if($this.hasClass("installmentInfoTpl"))
				fns.paymentForms();
			else if($this.hasClass("shipping-value"))
				fns.calculateShipping();
			else if($this.hasClass("freeContent"))
				fns.freeContent();
			else if($this.hasClass("boxPopUp2"))
				fns.closeNow();
			else if($this.hasClass("referAFriendTpl"))
				fns.productReferAFriend();
			else if($this.filter("#btnReferAFriend").length>0)
				fns.giftListReferFriend();
			else if($this.hasClass("lnkAddPhoto"))
			{
				options.popupType="minhaContaFoto";
				fns.userAccount();
			}
			else
				return false;
		},
		checkType:function()
		{
			if("cadastroCliente"===options.popupType || "minhaContaFoto"===options.popupType)
				fns.userAccount();
			else if("newsletter"===options.popupType)
				fns.newsletter();
			else if("quickview"===options.popupType)
				fns.quickView();
			else if("giftlist"===options.popupType)
				fns.giftList();
			else if("paymentforms"===options.popupType)
				fns.paymentForms();
			else if("shipping"===options.popupType)
				fns.calculateShipping();
			else if("freecontent"===options.popupType)
				fns.freeContent();
			else if("closenow"===options.popupType)
				fns.closeNow();
			else if("GiftListReferAFriend"===options.popupType)
				fns.giftListReferFriend();
			else
				return false;
		},
		exec:function()
		{
			if(null===options.popupType)
				fns.setType()
			else if(false===fns.checkType())
				fns.setType()
			
			options.initCallback();
		},
		userAccount:function()
		{
			var newClass=""
			if("cadastroCliente"===options.popupType)
				newClass="signInPopups";
			else if("minhaContaFoto"===options.popupType)
				newClass="profilePhoto";

			$this.unbind().removeAttr("onclick");
			var url=$this.attr("href")||"";
			$this.bind("click",function(e){
				popUpElem.addClass(options.popupClass+" "+newClass+"Main");
				if(""===url && _console) console.log("Não existe URL no atributo href");
				jQuery('<iframe src="'+url+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(popupContent.addClass(options.popupClass+" "+newClass));
				fns.show({"loading":true});
				fns.positioning();
				fns.close();
				return false;
			});
		},
		newsletter:function()
		{
			$this.clone().appendTo(popupContent.addClass(options.popupClass+" newsletterPopup"));
			popUpElem.addClass(options.popupClass+" newsletterMain");
			fns.show();
			fns.positioning();
			fns.close();
		},
		quickView:function()
		{
			var elem=body.find((""!==options.quickViewClass)?options.quickViewClass:".quickViewLink");

			var fn=function(){
				elem.filter(":not(.quickViewLinkActivated)").addClass("quickViewLinkActivated").bind("click",function(){
					jQuery('<iframe src="'+jQuery(this).attr("href")+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(popupContent.addClass(options.popupClass+" productQuickView"));
					popUpElem.addClass(options.popupClass+" quickViewMain");
					fns.show({"loading":true});
					fns.positioning();
					fns.close();
					return false;
				});
			};
			
			fn();
			
			var i=0;
			if(0===i)
			{
				$document.ajaxStop(fn);
				i=1;
			}
		},
		paymentForms:function()
		{
			var url="";
			var setLink=function()
			{
				var link=body.find(".see-other-payment-method-link");
				if(link.length<1){if(_console) console.log("Url das formas de pagamento não encontrado. \n Verifique se o controle esta na página.\n("+link.selector+")"); return false;}
				url=(/http:[a-z.\/\?=0-9&]+/i).exec(link[0].onclick.toString())[0]||"#onclickError";
			};
			setLink();

			$this.bind("click",function(){
				jQuery("<iframe src='"+url+"' frameborder='0' allowtransparency='true'></iframe>").appendTo(popupContent.addClass(options.popupClass+" paymentFormsPopup"));
				popUpElem.addClass(options.popupClass+" paymentFormsMain");
				fns.show({"loading":true});
				fns.positioning();
				fns.close();
				return false;
			});
			
			var i=0;
			if(0===i)
			{
				$document.ajaxStop(setLink);
				i=1;
			}
		},
		calculateShipping:function()
		{
			var fn=function(){
				var children=body.find("#calculoFrete").children();
				if(children.length<1) return false;

				children.find("span.cep-busca a").attr("target","_blank");
				children.appendTo(popupContent.addClass(options.popupClass+" shippingCalculationPopup"));
				popUpElem.addClass(options.popupClass+" shippingCalculationMain");
				fns.show();
				fns.positioning();
				fns.close();
			};
			$document.ajaxStop(fn);
		},
		giftList:function()
		{
			$this.appendTo(popupContent.addClass(options.popupClass+" giftListPopup"));
			popUpElem.addClass(options.popupClass+" giftListMain");
			fns.show();
			fns.positioning();
			fns.close({"clickCallback":options.closeCallback});
		},
		freeContent:function()
		{
			$this.appendTo(popupContent.addClass(options.popupClass+" freeContentPopup"));
			popUpElem.addClass(options.popupClass+" freeContentMain");
			fns.show();
			fns.positioning();
			fns.close();
		},
		closeNow:function()
		{
			fns.close({"closeNow":true});
		},
		giftListReferFriend:function()
		{
			var func=function(e){
				var url=$(this).attr("href");
				if("undefined"===typeof url || ""===url){if(_console) console.log("[Erro] Url do popup não encontrada."); return false;}
				
				popupContent.addClass(options.popupClass+" freeContentPopup").load(url);
				popUpElem.addClass(options.popupClass+" giftListReferFriendMain");
				fns.show({"loading":true});
				fns.positioning();
				fns.close();
				return false;
			};
			
			var action=function()
			{	
				$this.unbind().bind("mouseenter",function(){
					$this.unbind().bind("click",func);
				});
			};
			
			action();
			$document.ajaxStop(action);
		},
		productReferAFriend:function()
		{
			var wrap=jQuery('<div class="referAFriendPopUpWrap"></div>');
			$this.bind("click",function(){
				var $t=jQuery(this),
					text=($t.parent().find("#div-referAFriend input").attr("onclick")||"").toString(),
					url=(/\/referAFriend\/Form\/[0-9]+\?/i).exec(text);
				
				if(null===url)
				{
					alert("Desculpe, não foi possível abrir o formulário.");
					return false;
				}
				
				wrap.empty().load(url[0],function(){
					fns.positioning();
				});
				wrap.appendTo(popupContent.addClass(options.popupClass+" freeContentPopup"));
				popUpElem.addClass(options.popupClass+" freeContentMain");
				fns.show();
				fns.positioning();
				fns.close();
				
				return false;
			});
			
			$document.ajaxStop(function(){
				if(popupContent.find(".referAFriendPopUpWrap #btnFechar").length>0)
					setTimeout(fns.closeNow,1500);
			});
		}
	};
	
	fns.exec();
	return $this;
};