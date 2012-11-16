/**
* Popups
* @author Carlos Vinicius
* @version 1.25
* @date 2012-10-18
*/
jQuery.fn.vtexPopUp2=function(opts)
{
	var body,log,popUpElem,$this,extTitle;
	
	$this=jQuery(this);
	if($this.length<1)return $this;
	
	body=jQuery("body");
	popUpElem=body.find(".boxPopUp2");
	extTitle="Vtex Popups";
	log=function(msg,type){
		if(typeof console=="object")
			console.log("["+extTitle+" - "+(type||"Erro")+"] "+msg);
	};
	
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
			quickViewClass:".quickViewLink", // (Opção Descontinuada) Classe do quickview caso use uma diferente do padrão "quickViewLink"
			contentUrl:null, // Url para ser exibida em um iframe no popup (válido apenas p/ o "freeContent")
			initCallback:function(popupElem){},
			showCallback:function(popupElem){},
			closeCallback:function(popupElem){}
		},
		options=jQuery.extend(defaults, opts),
		bntClose=popUpElem.find(".boxPopUp2-close"),
		popupContent=popUpElem.find(".boxPopUp2-content"),
		closeElems=body.find(".boxPopUp2-close, .boxPopUp2-overlay"),
		overlay=body.find(".boxPopUp2-overlay"),
		$document=jQuery(document);
	
	if(null!==options.closeContent)
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
        show:function(opts)
        {
            opts=opts||{};
            overlay.fadeTo("fast",0.5,function(){
				popUpElem.show().addClass("popupOpened");

                if("boolean"===typeof(opts.loading) && opts.loading===true)
					fns.showLoading();
                else
                    fns.hideLoading();

				if("function"===typeof(opts.callback)) 
					opts.callback();

				options.showCallback(popUpElem);
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
        close:function(opts)
        {
            opts=opts||{};
            var close=function()
            {
                overlay.fadeOut("fast");
                popUpElem.fadeOut("fast",function(){
					popupContent.empty();
				});
                popupContent.attr("class","boxPopUp2-content");
                popUpElem.attr("class","boxPopUp2");
            };

            if(typeof(opts.closeNow)=="boolean" && opts.closeNow===true)
                close(); 

            if(closeElems.filter(".boxPopUp2-clickActive").length<1)
			{
                closeElems.addClass("boxPopUp2-clickActive").bind("click",function(){
                    if("function"===typeof(opts.clickCallback)) 
                        opts.clickCallback();
					else
						options.closeCallback(popUpElem);
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
				if(isNaN(parseFloat(seconds))){log("O tempo informado (em segundos) não é um valor numérico: “"+seconds+"”"); return false;}
				setTimeout(function(){close();},seconds*1000);
			}
		},
		setType:function(elem)
		{
			if(elem.hasClass("quickViewLink"))
				fns.quickView(elem);
			else if(elem.hasClass("giftListWrap"))
				fns.giftList(elem);
			else if(elem.hasClass("installmentInfoTpl"))
				fns.paymentForms(elem);
			else if(elem.hasClass("shipping-value"))
				fns.calculateShipping(elem);
			else if(elem.hasClass("freeContent"))
				fns.freeContent(elem);
			else if(elem.hasClass("boxPopUp2"))
				fns.closeNow(elem);
			else if(elem.hasClass("referAFriendTpl"))
				fns.productReferAFriend(elem);
			else if(elem.filter("#btnReferAFriend").length>0)
				fns.giftListReferFriend(elem);
			else if(elem.filter("#lnkPubliqueResenha").length>0)
				fns.postRatingComment(elem);
			else if(elem.filter("#palerta").length>0)
				fns.cartCheckoutAlert(elem);
			else if(elem.hasClass("lnkAddPhoto"))
			{
				options.popupType="minhaContaFoto";
				fns.userAccount(elem);
			}
			else
				return false;
		},
		checkType:function(elem)
		{
			if("cadastroCliente"===options.popupType || "minhaContaFoto"===options.popupType)
				fns.userAccount(elem);
			else if("newsletter"===options.popupType)
				fns.newsletter(elem);
			else if("quickview"===options.popupType)
				fns.quickView(elem);
			else if("giftlist"===options.popupType)
				fns.giftList(elem);
			else if("paymentforms"===options.popupType)
				fns.paymentForms(elem);
			else if("shipping"===options.popupType)
				fns.calculateShipping(elem);
			else if(typeof options.popupType=="string" && "freecontent"===options.popupType.toLowerCase())
				fns.freeContent(elem);
			else if("closenow"===options.popupType)
				fns.closeNow(elem);
			else if("GiftListReferAFriend"===options.popupType)
				fns.giftListReferFriend(elem);
			else if("postRatingComment"===options.popupType)
				fns.postRatingComment(elem);
			else
				return false;
		},
		exec:function()
		{
			$this.each(function(){
				var elem=$(this),type;
				if(null===options.popupType)
					type=fns.setType(elem);
				else if(false===fns.checkType(elem))
					type=fns.setType(elem);
			
				if(type===false)
					fns.freeContent(elem);
			});
			
			options.initCallback();
		},
		// Tipos de popups
		userAccount:function(elem)
		{
			var newClass="";
			if("cadastroCliente"===options.popupType)
				newClass="signInPopups";
			else if("minhaContaFoto"===options.popupType)
				newClass="profilePhoto";

			elem.unbind().removeAttr("onclick");
			var url=elem.attr("href")||"";
			
			elem.bind("mouseenter",function(){
				elem.unbind().bind("click",function(){
					popUpElem.addClass(options.popupClass+" "+newClass+"Main");
					if(""===url) log("Não existe URL no atributo href");
					jQuery('<iframe src="'+url+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(popupContent.addClass(options.popupClass+" "+newClass));
					fns.show({"loading":true});
					fns.positioning();
					fns.close();
					return false;
				});
			});
		},
		newsletter:function(elem)
		{
			elem.clone().appendTo(popupContent.addClass(options.popupClass+" newsletterPopup"));
			popUpElem.addClass(options.popupClass+" newsletterMain");
			fns.show();
			fns.positioning();
			fns.close();
		},
		quickView:function(elem)
		{
			// var elem=body.find(options.quickViewClass);
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
		paymentForms:function(elem)
		{
			var url="";
			var setLink=function()
			{
				var link=body.find(".see-other-payment-method-link");
				if(link.length<1){log("Url das formas de pagamento não encontrado. \n Verifique se o controle esta na página.\n("+link.selector+")"); return false;}
				url=(/http:(.*?)(?=\&)/).exec(link[0].getAttribute("onclick").toString())[0]||"#onclickError";
			};
			setLink();

			elem.bind("click",function(){
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
		calculateShipping:function(elem)
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
		giftList:function(elem)
		{
			elem.appendTo(popupContent.addClass(options.popupClass+" giftListPopup"));
			popUpElem.addClass(options.popupClass+" giftListMain");
			fns.show();
			fns.positioning();
			fns.close({"clickCallback":options.closeCallback});
		},
		cartCheckoutAlert:function(elem)
		{
			elem.appendTo(popupContent.addClass(options.popupClass+" cartCheckoutAlertPopup"));
			popUpElem.addClass(options.popupClass+" cartCheckoutAlertMain");
			fns.show();
			fns.positioning();
			fns.close();
		},
		freeContent:function(elem)
		{
			var fn;
			
			fn=function()
			{
				popUpElem.addClass(options.popupClass+" freeContentMain");
				fns.show();
				fns.positioning();
				fns.close();
			};
		
			if(options.contentUrl===null)
			{
				elem.appendTo(popupContent.addClass(options.popupClass+" freeContentPopup"));
				fn();
			}
			else
				elem.bind("click",function(){
					jQuery('<iframe src="'+options.contentUrl+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(popupContent.addClass(options.popupClass+" freeContentPopup"));
					fn();
					return false;
				});
		},
		closeNow:function(elem)
		{
			fns.close({"closeNow":true});
		},
		giftListReferFriend:function(elem)
		{
			var func=function(e){
				var url=$(this).attr("href");
				if("undefined"===typeof url || ""===url){log("[Erro] Url do popup não encontrada."); return false;}
				
				popupContent.addClass(options.popupClass+" freeContentPopup").load(url);
				popUpElem.addClass(options.popupClass+" giftListReferFriendMain");
				fns.show({"loading":true});
				fns.positioning();
				fns.close();
				return false;
			};
			
			var action=function()
			{	
				elem.unbind().bind("mouseenter",function(){
					elem.unbind().bind("click",func);
				});
			};
			
			action();
			$document.ajaxStop(action);
		},
		productReferAFriend:function(elem)
		{
			var wrap=jQuery('<div class="referAFriendPopUpWrap"></div>');
			elem.bind("click",function(){
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
		},
		postRatingComment:function(elem)
		{
			var requestOn;
			elem=elem.filter(":not(.popUpPublishReviewActivated)");
			requestOn=false;
				
			if(elem.length<1)
				return false;

			elem.bind("click",function(){
				var $t=jQuery(this),
					href=$t.attr("href")||"";
				
				if(""===href)
				{
					log("Não foi possível obter os dados para abrir o popup de resenha.");
					return false;
				}
				
				var params=href.split(")").shift().split("(").pop().split(",");
				
				if(3!=params.length)
				{
					log("O array com os dados do cliente retornou um valor inesperado.");
					return false;
				}
				
				if(requestOn) return false;
				requestOn=true;
				
				jQuery.ajax({
					url:"/publishuserreviewcomment",
					type:"POST",
					data:{productId:params[1],clientId:params[0],categoryId:params[2]},
					success:function(data)
					{
						var $data=jQuery(data);

						popupContent.addClass(options.popupClass+" userReviewPopup").html($data);
						popUpElem.addClass(options.popupClass+" userReviewPopupMain");
						fns.show({
							callback:function(){
								$data.find("#txtTituloResenha:hidden").val("titulo_auto");
								
								var link=popupContent.find("a#rtAvaliacao_A0"),
									rating=function(){link.attr("title",(link.find(".filledRatingStar:last").index()+1)||0);};
								link.find("span").bind("mouseenter",rating);
								link.bind("mouseleave",rating);
							}
						});
						fns.positioning();
						fns.close();
						
						requestOn=false;
					},
					error:function()
					{
						requestOn=false;
					}
				});

				return false;
			}).addClass("popUpPublishReviewActivated");
			
			if(jQuery.fn.vtexPopUp2.data.userReviewCount===0)
				$document.ajaxStop(function(){
					if(popupContent.hasClass("userReviewPopup")&&popupContent.find('.formUserComment').children().length===0)
						fns.closeNow();
				});
			jQuery.fn.vtexPopUp2.data.userReviewCount++;
		}
	};
	
	fns.exec();
	return $this;
};
jQuery.fn.vtexPopUp2.data={userReviewCount:0};