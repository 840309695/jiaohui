//�������Ĳ˵�����
	
function fnInitMenu(){
	YAHOO.namespace('Menu');
	var sMenuId = "qMenu"; //������ID��
	var sMenu2ClassName = "qMenu2"; //�����˵���className
	var sMenu1ActiveClassName = "activeItem"; //��ǰ������һ���˵�className
	var oMenu = YAHOO.util.Dom.get(sMenuId);
	
	YAHOO.Menu.hide = function(obj){

		var menu2 = YAHOO.util.Dom.getElementsByClassName(sMenu2ClassName,"ul",oMenu);
		for(var i=0;i<menu2.length;i++){
			if(menu2[i].parentNode == obj) continue; 
			menu2[i].style.display="none";
			YAHOO.util.Dom.removeClass(menu2[i].parentNode,sMenu1ActiveClassName);	
		}

	}
	
	YAHOO.Menu.fold = function(ev){
		var a =YAHOO.util.Event.getTarget(ev);
		var b =YAHOO.util.Dom.getLastChild(a);	
		if(YAHOO.util.Dom.hasClass(a,sMenu1ActiveClassName)){							
			if(YAHOO.util.Dom.hasClass(b,sMenu2ClassName)){
				b.style.display = "none";
			}
			YAHOO.util.Dom.removeClass(a,sMenu1ActiveClassName);			
		}else{
		
		 	if(YAHOO.util.Dom.hasClass(b,sMenu2ClassName)){
				 YAHOO.Menu.hide();
				b.style.display = "block";
			}
			YAHOO.util.Dom.addClass(a,sMenu1ActiveClassName);
		}
	}
	
	YAHOO.Menu.init = new function(){		
		var c = YAHOO.util.Dom.getChildren(sMenuId);	
		for(var j=0;j<c.length;j++){
			YAHOO.util.Event.on(c[j],"click",YAHOO.Menu.fold);
			if(YAHOO.util.Dom.hasClass(c[j],sMenu1ActiveClassName)){
				var oNotHide =c[j];
			}	
		}
		YAHOO.Menu.hide(oNotHide);
	}	
}

function fnInitqqMenu(){
	YAHOO.namespace('MenuSH');
	var sMenuId = "qqMenu"; //������ID��
	var sMenu2ClassName = "qMenu2"; //�����˵���className
	var sMenu1ActiveClassName = "activeItem"; //��ǰ������һ���˵�className
	var oMenu = YAHOO.util.Dom.get(sMenuId);
	
	YAHOO.MenuSH.hide = function(obj){

		var menu2 = YAHOO.util.Dom.getElementsByClassName(sMenu2ClassName,"ul",oMenu);
		for(var i=0;i<menu2.length;i++){
			if(menu2[i].parentNode == obj) continue; 
			menu2[i].style.display="none";
			YAHOO.util.Dom.removeClass(menu2[i].parentNode,sMenu1ActiveClassName);	
		}

	}
	
	YAHOO.MenuSH.fold = function(ev){
		var a =YAHOO.util.Event.getTarget(ev);
		var b =YAHOO.util.Dom.getLastChild(a);	
		if(YAHOO.util.Dom.hasClass(a,sMenu1ActiveClassName)){							
			if(YAHOO.util.Dom.hasClass(b,sMenu2ClassName)){
				b.style.display = "none";
			}
			YAHOO.util.Dom.removeClass(a,sMenu1ActiveClassName);			
		}else{
		
		 	if(YAHOO.util.Dom.hasClass(b,sMenu2ClassName)){
				 YAHOO.MenuSH.hide();
				b.style.display = "block";
			}
			YAHOO.util.Dom.addClass(a,sMenu1ActiveClassName);
		}
	}
	
	YAHOO.MenuSH.init = new function(){		
		var c = YAHOO.util.Dom.getChildren(sMenuId);	
		for(var j=0;j<c.length;j++){
			YAHOO.util.Event.on(c[j],"click",YAHOO.MenuSH.fold);
			if(YAHOO.util.Dom.hasClass(c[j],sMenu1ActiveClassName)){
				var oNotHide =c[j];
			}	
		}
		YAHOO.MenuSH.hide(oNotHide);
	}	
}

YAHOO.util.Event.onDOMReady(fnInitMenu);
YAHOO.util.Event.onDOMReady(fnInitqqMenu);