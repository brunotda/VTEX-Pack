/*
* Vtex Pack
* @version 1.1
* @date 2012-02-01
*/
"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
/*
* @author Carlos Vinicius
* @version 2.8
* @date 2012-02-01
*/
jQuery.fn.vtexNews2=function(c){var a=jQuery(this);if(1>a.length)return"object"==typeof console&&console.log("Elemento n\u00e3o encontrado ("+a.selector+")"),a;var b=jQuery.extend({defaultName:"Digite seu nome...",defaultEmail:"Digite seu e-mail...",nameField:"#newsletterClientName",emailField:"#newsletterClientEmail",bnt:"#newsletterButtonOK",elementError:".nv2_messageError",elementSuccess:".nv2_messageSuccess",setDefaultName:!0,checkNameExist:!0,getAttr:"alt"},c),c=a.find(b.nameField),e=a.find(b.emailField), f=a.find(b.bnt),g=a.find(b.elementError),h=a.find(b.elementSuccess);if(1>c.length&&b.checkNameExist)return"object"==typeof console&&console.log("Campo de nome, n\u00e3o encontrado ("+c.selector+")"),a;if(1>e.length)return"object"==typeof console&&console.log("Campo de e-mail, n\u00e3o encontrado ("+e.selector+")"),a;if(1>f.length)return"object"==typeof console&&console.log("Bot\u00e3o de envio, n\u00e3o encontrado ("+f.selector+")"),a;if(1>h.length||1>g.length)return"object"==typeof console&&console.log("A(s) mensagem(ns) de erro e/ou sucesso esta(m) faltando ("+ h.selector+", "+g.selector+")"),a;b.setDefaultName&&c.val(b.defaultName);e.val(b.defaultEmail);b.checkNameExist&&c.filter(":visible").queue(function(){var a=$(this),d=a.val();a.bind({focus:function(){a.val()==d&&(0==a.val().search(b.defaultName.substr(0,6))||b.setDefaultName)&&a.val("")},blur:function(){""==a.val()&&a.val(d)}})});e.queue(function(){var a=$(this),d=a.val();a.bind({focus:function(){a.val()==d&&0==a.val().search(b.defaultEmail.substr(0,6))&&a.val("")},blur:function(){""==a.val()&&a.val(d)}})}); f.bind("click",function(){var c=(a.find(b.nameField).filter("input,select,textarea").val()||a.find(b.nameField).attr(b.getAttr)||"").trim(),d=(a.find(b.emailField).val()||"").trim(),e=a.find(b.nameField).is(":visible");(1>c.length||0==c.search(b.defaultName.substr(0,6)))&&(b.checkNameExist||e?e:1)||0>d.search(/^[a-z0-9\_\-\.]+@[a-z0-9\_\-]+(\.[a-z0-9\_\-]{2,})+$/i)?g.vtexPopUp2({popupType:"newsletter",popupClass:"popUpNewsletter"}):(f.attr("disabled","disabled"),$.ajax({url:"/no-cache/Newsletter.aspx", type:"POST",data:{newsletterClientEmail:d,newsletterClientName:c,newsInternalCampaign:"newsletter:opt-in",newsInternalPage:(document.location.pathname||"/").replace("/","_"),newsInternalPart:"newsletter"},success:function(){f.removeAttr("disabled");h.vtexPopUp2({popupType:"newsletter",popupClass:"popUpNewsletter"});b.setDefaultName&&a.find(b.nameField).val(b.defaultName);a.find(b.emailField).val(b.defaultEmail)}}))});return a};
/*
* @author Carlos Vinicius
* @version 1.6
* @date 2012-02-01
*/
jQuery.fn.vtexPopUp2=function(h){var d=jQuery("body"),e=jQuery(this),g=d.find(".boxPopUp2"),i="object"==typeof console;if(1>e.length)return i&&console.log("Elemento n\u00e3o encontrado ("+e.selector+")"),e;1>g.length&&(g=jQuery('<div class="boxPopUp2"><div class="boxPopUp2-wrap"><span class="boxPopUp2-close"></span><div class="boxPopUp2-content"></div></div></div><div class="boxPopUp2-overlay"></div>'),d.prepend(g));var b=jQuery.extend({popupType:null,closeContent:null,initCallback:function(){},popupClass:""}, h),h=g.find(".boxPopUp2-close"),f=g.find(".boxPopUp2-content");null!=b.closeContent&&h.html(b.closeContent);var c={positioning:function(){var a=jQuery(document).scrollTop(),b=jQuery(window).height(),c=d.find(".boxPopUp2"),e=c.outerHeight(!0);c.css("top",a+(e>=b?20:(b-e)/2)+"px")},show:function(a){a=a||{};d.find(".boxPopUp2-overlay").fadeTo("fast",0.5,function(){d.find(".boxPopUp2").show();"boolean"==typeof a.clean&&!0==a.clean&&f.empty();"boolean"==typeof a.loading?!0!=a.loading?c.hideLoading():c.showLoading(): c.hideLoading();"function"==typeof a.openCallback&&a.openCallback()})},hideLoading:function(){f.filter(":visible").css("background-image","none")},showLoading:function(){f.filter(":visible").css("background-image",'url("/arquivos/ajax-loader.gif")')},close:function(a){var a=a||{},b=function(){d.find(".boxPopUp2,.boxPopUp2-overlay").fadeOut("fast");f.empty();f.attr("class","boxPopUp2-content")};"function"==typeof a.callback&&a.callback();"boolean"==typeof a.closeNow&&!0==a.closeNow&&b();1>d.find(".boxPopUp2-close.boxPopUp2-clickActive, .boxPopUp2-overlay.boxPopUp2-clickActive").length&& d.find(".boxPopUp2-close, .boxPopUp2-overlay").addClass("boxPopUp2-clickActive").bind("click",function(){"function"==typeof a.clickCallback&&a.clickCallback();b()})}};(function(){if("cadastroCliente"==b.popupType||"minhaContaFoto"==b.popupType){var a="";"cadastroCliente"==b.popupType?a="signInPopups":"minhaContaFoto"==b.popupType&&(a="profilePhoto");e.unbind().removeAttr("onclick");var d=e.attr("href")||"";e.bind("click",function(b){b.preventDefault();""==d&&i&&console.log("N\u00e3o existe URL no atributo href"); jQuery('<iframe src="'+d+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(f.addClass(a));c.show({loading:!0});c.positioning();c.close()})}else"newsletter"==b.popupType&&(e.clone().appendTo(f.addClass(b.popupClass)),c.show(),c.positioning(),c.close());b.initCallback()})();return e};