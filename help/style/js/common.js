//wwonline
var wangwangInstalled = false;
try {
	if (document.getElementById('clientCaps') && document.getElementById('clientCaps').isComponentInstalled("{99560E1D-E17E-44b5-90E4-5DE25BF6F7B1}", "componentID")) {
		wangwangInstalled = true;
	}
	if (!wangwangInstalled) {
		var obj = new ActiveXObject("WangWangX.WangWangObj");
		if (obj) {
			wangwangInstalled = true;
			delete obj;
		}
	}
}catch (e) {
	//alert(e.message);
}

var exitpop=false;
function PopPage(strURL, name, width, height, left, top)
{
    if(width==null) width=800;
    if(height==null) height=500;
    if(left==null) left = ( screen.width - width ) / 2;
    if(top==null) top  = ( screen.height - height ) / 2;
    temp = "width="+width+",height="+height+",left="+left+",top="+top+",scrollbars=1,toolbar=no,location=no,directories=no,status=no,resizable=no";
    w = window.open(strURL,name,temp);
    w.focus();
}
function openThisAbout()
{
    temp = "width=618,height=400,left=0,top=0,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,resizable=no";
    window.open("/home/about/about_taobao.html","",temp);
}
function GetCookie(cookiename)
{
    var thebigcookie = document.cookie;
    var firstchar = thebigcookie.indexOf(cookiename);
    if (firstchar != -1) {
        firstchar += cookiename.length + 1;
        lastchar = thebigcookie.indexOf(";",firstchar);
        if(lastchar == -1) lastchar = thebigcookie.length;
        return unescape(thebigcookie.substring(firstchar, lastchar));
    }
    return "";
}
function setCookie(cookiename,cookievalue,cookieexpdate,domainname)
{
    document.cookie = cookiename + "=" + cookievalue
    + "; domain=" + domainname
    + "; path=" + "/"
    + "; expires=" + cookieexpdate.toGMTString();

}
function unloadpopup(cookiename,popurl,popwidth,popheight,domainname,tr)
{
    //return;
    try {
        if (!tr)
            return;
        if( GetCookie(cookiename) == "" )
        {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + 1 * (24 * 60 * 60 * 1000)); //+1 day
            setCookie(cookiename,"yes",expdate,domainname);
            if( exitpop )
            {
                w = window.open(popurl,cookiename,"width="+popwidth+",height="+popheight+",scrollbars=1,toolbar=yes,location=yes,menubar=yes,status=yes,resizable=yes");
                w.focus;
            }
        }
    }catch (e) {}
}
function setCheckboxes(theForm, elementName, isChecked)
{
    var chkboxes = document.forms[theForm].elements[elementName];
    var count = chkboxes.length;

    if (count)
    {
        for (var i = 0; i < count; i++)
        {
            chkboxes[i].checked = isChecked;
        }
    }
    else
    {
        chkboxes.checked = isChecked;
    }
    return true;
}

var imageObject;
function ResizeImage(obj, MaxW, MaxH)
{
    if (obj != null) imageObject = obj;
    var state=imageObject.readyState;
    var oldImage = new Image();
    oldImage.src = imageObject.src;
    var dW=oldImage.width; var dH=oldImage.height;
    if(dW>MaxW || dH>MaxH) {
        a=dW/MaxW; b=dH/MaxH;
        if(b>a) a=b;
        dW=dW/a; dH=dH/a;
    }
    if(dW > 0 && dH > 0)
        imageObject.width=dW;imageObject.height=dH;
    if(state!='complete' || imageObject.width>MaxW || imageObject.height>MaxH) {
        setTimeout("ResizeImage(null,"+MaxW+","+MaxH+")",40);
    }
}
