/**
* Vtex Pack
* @version 2.3
* @date 2012-04-13
*/

/**
* Vtex Cart v2
* @author Carlos Vinicius
* @version 2.0
* @date 2011-03-15
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
jQuery.fn.vtexCart=function(e){var a=jQuery(this);if(a.length<1)return a;var b=jQuery.extend({cartQtt:".vtex-cartQtt",cartTotal:".vtex-cartTotal",itemsText:".vtex-ItemsText",callback:function(){}},e),f=jQuery(""),g="object"===typeof console;a.each(function(){var a=jQuery(this),e=a.find(b.cartQtt)||f,i=a.find(b.cartTotal)||f,h=a.find(b.itemsText)||f,c={getCartInfo:function(){jQuery.ajax({url:"/no-cache/QuantidadeItensCarrinho.aspx",success:c.cartInfoAjaxSuccess,error:c.cartInfoAjaxError})},cartInfoAjaxSuccess:function(d){var d=
jQuery(d),a=d.find(".amount-items-em").html();i.html(d.find(".total-cart-em").html());e.html(a);c.singularPlural(a)},cartInfoAjaxError:function(){g&&console.log("Erro ao fazer a requisi\u00e7\u00e3o p/ obter os dados do carrinho.")},singularPlural:function(a){a=parseInt(a);isNaN(a)?g&&console.log("[Error] o valor obtido para calcular o plural/singular n\u00e3o \u00e9 um n\u00famero!"):a===1?h.hide().filter(".singular").show():h.hide().filter(".plural").show()}};c.getCartInfo()});b.callback();return a};
/**
* Newslleter V2
* @author Carlos Vinicius
* @version 3.2
* @date 2012-03-15
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
jQuery.fn.vtexNews2=function(l){var d=jQuery(this);if(d.length<1)return d;var b=jQuery.extend({defaultName:"Digite seu nome...",defaultEmail:"Digite seu e-mail...",nameField:".vtexNewsName",emailField:".vtexNewsEmail",btn:".vtexNewsButton",elementError:".nv2_messageError",elementSuccess:".nv2_messageSuccess",setDefaultName:true,checkNameExist:true,getAttr:"alt"},l),e="object"===typeof console;if("function"!==typeof jQuery.fn.vtexPopUp2){e&&console.log("[Erro] O popUp2 n\u00e3o foi encontrado. Adicione o Plugin de PopUp2.");
return d}d.each(function(){var c=jQuery(this),f=c.find(b.nameField),d=c.find(b.emailField),g=c.find(b.btn),h=c.find(b.elementError),i=c.find(b.elementSuccess);if(f.length<1&&b.checkNameExist){e&&console.log("Campo de nome, n\u00e3o encontrado ("+f.selector+")");return c}if(d.length<1){e&&console.log("Campo de e-mail, n\u00e3o encontrado ("+d.selector+")");return c}if(g.length<1){e&&console.log("Bot\u00e3o de envio, n\u00e3o encontrado ("+g.selector+")");return c}if(i.length<1||h.length<1){e&&console.log("A(s) mensagem(ns) de erro e/ou sucesso esta(m) faltando \n ("+
i.selector+", "+h.selector+")");return c}b.setDefaultName&&f.is("input[type=text], textarea")&&f.val(b.defaultName);d.val(b.defaultEmail);b.checkNameExist&&f.filter(":visible").queue(function(){var a=jQuery(this),c=a.val();f.is("input, textarea")&&a.bind({focus:function(){a.val()==c&&(a.val().search(b.defaultName.substr(0,6))==0||b.setDefaultName)&&a.val("")},blur:function(){a.val()==""&&a.val(c)}})});d.queue(function(){var a=jQuery(this),c=a.val();a.bind({focus:function(){a.val()==c&&a.val().search(b.defaultEmail.substr(0,
6))==0&&a.val("")},blur:function(){a.val()==""&&a.val(c)}})});var j=function(){var a,d;if(a=c.find(b.nameField).filter("input[type=text],select,textarea").val())d=a;d=(a=c.find(b.nameField).filter("input[type=radio]:checked, input[type=checkbox]:checked").val())?a:(a=c.find(b.nameField).attr(b.getAttr))?a:(a=c.find(b.nameField).text())?a:(a=c.find(b.nameField).find(".box-banner img:first").attr("alt"))?a:"";a=(c.find(b.emailField).val()||"").trim();var e=c.find(b.nameField).is(":visible");if((d.length<
1||d.search(b.defaultName.substr(0,6))==0)&&(b.checkNameExist||e?e:1)||a.search(/^[a-z0-9\_\-\.]+@[a-z0-9\_\-]+(\.[a-z0-9\_\-]{2,})+$/i)<0)h.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterError"});else{g.attr("disabled","disabled");jQuery.ajax({url:"/no-cache/Newsletter.aspx",type:"POST",data:{newsletterClientEmail:a,newsletterClientName:d,newsInternalCampaign:"newsletter:opt-in",newsInternalPage:(document.location.pathname||"/").replace("/","_"),newsInternalPart:"newsletter"},success:function(){g.removeAttr("disabled");
i.vtexPopUp2({popupType:"newsletter",popupClass:"popupNewsletterSuccess"});b.setDefaultName&&f.is("input, textarea")&&c.find(b.nameField).val(b.defaultName);c.find(b.emailField).val(b.defaultEmail)}})}};g.bind("click",j);var k=function(a){if(13==(a.keyCode?a.keyCode:a.which)){a.preventDefault();j()}};f.filter("input, textarea").bind("keydown",k);d.bind("keydown",k)});return d};
/**
* Vtex Gift List
* @author Carlos Vinicius
* @version 1.2
* @date 2012-03-15
*/
jQuery.fn.vtexGiftlist=function(b){var e=jQuery(this);if(1>e.length)return e;var h=jQuery.extend({giftListWrap:".giftListWrap",callback:function(){},buyBtnFormat:function(a,d){var c=jQuery('<div class="giftListBtn"></div>'),f=jQuery('<div class="skuTplButtonsWrap"></div>');a.after(f);a.appendTo(f);d.appendTo(c);c.appendTo(f)}},b),b=jQuery("body");jQuery("");var a=b.find(h.giftListWrap),j="object"==typeof console;if(1>a.length)return j&&console.log("Elemento contendo o controle de lista n\u00e3o encontrado ("+
a.selector+")"),!1;var k=a.parent(),i=b.find("div.skuList"),g={actions:function(b){var d=b||e;d.bind("click",function(){var c=a.find(".giftlistcreate-nouser");a.find(".giftlistinsertsku").show();a.find(".giftlistinsertsku-message").css("display","block").hide();d.hasClass("multipleSkus")&&a.find(".giftlistinsertsku-button").each(function(){var a=jQuery(this),c=(a.attr("href")||"").split(",");c[1]="'"+d.attr("rel")+"'";a.attr("href",c.join(","))});if(1>c.length)a.vtexPopUp2({closeCallback:function(){a.appendTo(k)}});
else return document.location.href=c.attr("href")||"",!1})},buyButton:function(){var a=i.find(".buy-button");if(1>a.length||2>i.length)return!1;var d=e.clone().addClass("multipleSkus");a.each(function(){var a=d.clone(),b=jQuery(this);h.buyBtnFormat(b,a);a.attr("rel",(b.attr("href")||"").split("Sku=").pop());g.actions(a)});e.hide()}};g.actions();g.buyButton();return e};
/**
* PopUps
* @author Carlos Vinicius
* @version 1.16
* @date 2012-04-13
*/
jQuery.fn.vtexPopUp2=function(k){var c=jQuery(this);if(1>c.length)return c;var h=jQuery("body"),d=h.find(".boxPopUp2"),j="object"==typeof console;1>d.length&&(d=jQuery('<div class="boxPopUp2"><div class="boxPopUp2-wrap"><span class="boxPopUp2-close"></span><div class="boxPopUp2-content"></div></div></div>'),h.prepend(d),d.after('<div class="boxPopUp2-overlay"></div>'));var b=jQuery.extend({popupType:null,closeContent:null,popupClass:"",quickViewClass:"",initCallback:function(){},closeCallback:function(){}},
k),k=d.find(".boxPopUp2-close"),e=d.find(".boxPopUp2-content"),m=h.find(".boxPopUp2-close, .boxPopUp2-overlay"),n=h.find(".boxPopUp2-overlay"),i=jQuery(document);null!=b.closeContent&&k.html(b.closeContent);var a={positioning:function(){var a=i.scrollTop(),b=jQuery(window).height(),c=d.outerHeight(true);d.css("top",a+(c>=b?20:(b-c)/2)+"px")},show:function(b){b=b||{};n.fadeTo("fast",0.5,function(){d.show().addClass("popupOpened");"boolean"===typeof b.loading&&b.loading===true?a.showLoading():a.hideLoading()})},
hideLoading:function(){e.filter(":visible").css("background-image","none")},showLoading:function(){e.filter(":visible").css("background-image",'url("/arquivos/ajax-loader.gif")')},close:function(a){var a=a||{},b=function(){n.fadeOut("fast");d.fadeOut("fast",function(){e.empty()});e.attr("class","boxPopUp2-content");d.attr("class","boxPopUp2")};typeof a.closeNow=="boolean"&&a.closeNow==true&&b();if(m.filter(".boxPopUp2-clickActive").length<1){m.addClass("boxPopUp2-clickActive").bind("click",function(){"function"===
typeof a.clickCallback&&a.clickCallback();b()});i.bind("keyup",function(a){(a.keyCode?a.keyCode:a.which)==27&&b()})}if(c.hasClass("autoClose")){var l=(c.attr("class")||"").split("ac_").pop().split(" ").shift();if(isNaN(parseFloat(l))){j&&console.log("[Erro] O tempo informado (em segundos) n\u00e3o \u00e9 um valor num\u00e9rico: \u201c"+l+"\u201d");return false}setTimeout(function(){b()},l*1E3)}},setType:function(){if(c.hasClass("quickViewLink"))a.quickView();else if(c.hasClass("giftListWrap"))a.giftList();
else if(c.hasClass("installmentInfoTpl"))a.paymentForms();else if(c.hasClass("shipping-value"))a.calculateShipping();else if(c.hasClass("freeContent"))a.freeContent();else if(c.hasClass("boxPopUp2"))a.closeNow();else if(c.hasClass("referAFriendTpl"))a.productReferAFriend();else if(c.filter("#btnReferAFriend").length>0)a.giftListReferFriend();else if(c.hasClass("lnkAddPhoto")){b.popupType="minhaContaFoto";a.userAccount()}else return false},checkType:function(){if("cadastroCliente"===b.popupType||"minhaContaFoto"===
b.popupType)a.userAccount();else if("newsletter"===b.popupType)a.newsletter();else if("quickview"===b.popupType)a.quickView();else if("giftlist"===b.popupType)a.giftList();else if("paymentforms"===b.popupType)a.paymentForms();else if("shipping"===b.popupType)a.calculateShipping();else if("freecontent"===b.popupType)a.freeContent();else if("closenow"===b.popupType)a.closeNow();else if("GiftListReferAFriend"===b.popupType)a.giftListReferFriend();else return false},exec:function(){null===b.popupType?
a.setType():false===a.checkType()&&a.setType();b.initCallback()},userAccount:function(){var f="";"cadastroCliente"===b.popupType?f="signInPopups":"minhaContaFoto"===b.popupType&&(f="profilePhoto");c.unbind().removeAttr("onclick");var g=c.attr("href")||"";c.bind("click",function(){d.addClass(b.popupClass+" "+f+"Main");""===g&&j&&console.log("N\u00e3o existe URL no atributo href");jQuery('<iframe src="'+g+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+" "+f));
a.show({loading:true});a.positioning();a.close();return false})},newsletter:function(){c.clone().appendTo(e.addClass(b.popupClass+" newsletterPopup"));d.addClass(b.popupClass+" newsletterMain");a.show();a.positioning();a.close()},quickView:function(){var c=h.find(""!==b.quickViewClass?b.quickViewClass:".quickViewLink"),g=function(){c.filter(":not(.quickViewLinkActivated)").addClass("quickViewLinkActivated").bind("click",function(){jQuery('<iframe src="'+jQuery(this).attr("href")+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+
" productQuickView"));d.addClass(b.popupClass+" quickViewMain");a.show({loading:true});a.positioning();a.close();return false})};g();i.ajaxStop(g)},paymentForms:function(){var f="",g=function(){var a=h.find(".see-other-payment-method-link");if(a.length<1){j&&console.log("Url das formas de pagamento n\u00e3o encontrado. \n Verifique se o controle esta na p\u00e1gina.\n("+a.selector+")");return false}f=/http:[a-z.\/\?=0-9&]+/i.exec(a[0].onclick.toString())[0]||"#onclickError"};g();c.bind("click",function(){jQuery("<iframe src='"+
f+"' frameborder='0' allowtransparency='true'></iframe>").appendTo(e.addClass(b.popupClass+" paymentFormsPopup"));d.addClass(b.popupClass+" paymentFormsMain");a.show({loading:true});a.positioning();a.close();return false});i.ajaxStop(g)},calculateShipping:function(){i.ajaxStop(function(){var c=h.find("#calculoFrete").children();if(c.length<1)return false;c.find("span.cep-busca a").attr("target","_blank");c.appendTo(e.addClass(b.popupClass+" shippingCalculationPopup"));d.addClass(b.popupClass+" shippingCalculationMain");
a.show();a.positioning();a.close()})},giftList:function(){c.appendTo(e.addClass(b.popupClass+" giftListPopup"));d.addClass(b.popupClass+" giftListMain");a.show();a.positioning();a.close({clickCallback:b.closeCallback})},freeContent:function(){c.appendTo(e.addClass(b.popupClass+" freeContentPopup"));d.addClass(b.popupClass+" freeContentMain");a.show();a.positioning();a.close()},closeNow:function(){a.close({closeNow:true})},giftListReferFriend:function(){var f=function(){var c=$(this).attr("href");
if("undefined"===typeof c||""===c){j&&console.log("[Erro] Url do popup n\u00e3o encontrada.");return false}e.addClass(b.popupClass+" freeContentPopup").load(c);d.addClass(b.popupClass+" giftListReferFriendMain");a.show({loading:true});a.positioning();a.close();return false},g=function(){c.unbind().bind("mouseenter",function(){c.unbind().bind("click",f)})};g();i.ajaxStop(g)},productReferAFriend:function(){var f=jQuery('<div class="referAFriendPopUpWrap"></div>');c.bind("click",function(){var c=/\/referAFriend\/Form\/[0-9]+\?/i.exec((jQuery(this).parent().find("#div-referAFriend input").attr("onclick")||
"").toString());if(null===c){alert("Desculpe, n\u00e3o foi poss\u00edvel abrir o formul\u00e1rio.");return false}f.empty().load(c[0],function(){a.positioning()});f.appendTo(e.addClass(b.popupClass+" freeContentPopup"));d.addClass(b.popupClass+" freeContentMain");a.show();a.positioning();a.close();return false});i.ajaxStop(function(){e.find(".referAFriendPopUpWrap #btnFechar").length>0&&setTimeout(a.closeNow,1500)})}};a.exec();return c};

// AUTOLOADS
$(function(){
	var b=$("body");
	/* Carriho */ b.find(".cartWrapper:visible").vtexCart();
	/* Gift List */ b.find(".giftListButtonTpl").vtexGiftlist();
	/* Newsletter */ b.find(".vtexNewsWrap").vtexNews2();
	/* Quickview */ b.find(".quickViewLink").vtexPopUp2();
	/* Formas de pagamento */ b.find(".installmentInfoTpl").vtexPopUp2();
	/* Cálculo de frete */ b.find(".shipping-value").vtexPopUp2();
	/* Inidcar a um amigo (Listas Gerenciar) */ b.find("td.giftlist-body-action-sendfriend #btnReferAFriend").vtexPopUp2();
	/* Minha conta - alterar foto */ b.filter(".minha-conta").find(".lnkAddPhoto").vtexPopUp2();
	/* cadastro */ b.filter(".cadastro-cliente").find(".thickbox").vtexPopUp2({"popupType":"cadastroCliente"});
	/* Indicar à um amigo (pg. Produto) */ b.find(".referAFriendTpl").vtexPopUp2();
});