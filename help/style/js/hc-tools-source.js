//������������ҳ���ߣ������ֺ�ѡ�񣬴�ӡ���ղ�

function fnInitTools(){
	var btnPrint = YAHOO.util.Dom.get("btnPrint");
	var btnFav = YAHOO.util.Dom.get("btnFav");
	var cmsContent = YAHOO.util.Dom.get("cmsContent");
	var btnFont = YAHOO.util.Dom.getElementsByClassName("fontSize","a","tools"); 
		
	YAHOO.namespace('Tools');
	
	YAHOO.Tools.fontSize = function(ev){
		var a =YAHOO.util.Event.getTarget(ev);
		if(a==btnFont[0]){
			YAHOO.util.Dom.setStyle(cmsContent,"fontSize","16px");//������
			YAHOO.util.Dom.removeClass(btnFont,"on");
			YAHOO.util.Dom.addClass(a,"on");
			return false;
		}
		if(a==btnFont[1]){
			YAHOO.util.Dom.setStyle(cmsContent,"fontSize","14px");//�к���
			YAHOO.util.Dom.removeClass(btnFont,"on");
			YAHOO.util.Dom.addClass(a,"on");
			return false;
		}
		if(a==btnFont[2]){
			YAHOO.util.Dom.setStyle(cmsContent,"fontSize","12px");//С����
			YAHOO.util.Dom.removeClass(btnFont,"on");
			YAHOO.util.Dom.addClass(a,"on");
			return false;
		}	
	}
	
	YAHOO.Tools.printf = function(){
		window.print();
		return false;
	}
	
	YAHOO.Tools.bookmark = function(ev){
		var a =YAHOO.util.Event.getTarget(ev);
		if(window.external){ 
		    window.external.AddFavorite(a.getAttribute('href'), a.getAttribute('title')); 
		    return false; 
		}
	}
	
	
	YAHOO.Tools.init = new function(){	 		
		YAHOO.util.Event.on(btnPrint,"click",YAHOO.Tools.printf);	
		YAHOO.util.Event.on(btnFav,"click",YAHOO.Tools.bookmark);
		YAHOO.util.Event.on(btnFont,"click",YAHOO.Tools.fontSize);
	}	

}

YAHOO.util.Event.onDOMReady(fnInitTools);
