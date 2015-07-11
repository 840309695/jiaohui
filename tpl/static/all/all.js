$(function () { 
    //调用全选插件
    $.fn.check({ checkall_name: "checkall", checkbox_name: "gid[]" })
});
//全选插件
//checkall_name   操作全选的复选框name
//checkbox_name   被操作的复选框的name  name值可不统一 设置包含值 以XXX开头 自己修改
(function ($) {
    $.fn.check = function (options) {
        var defaults = {
            checkall_name: "checkall_name", //全选框name
            checkbox_name: "checkbox_name" //被操作的复选框name
        },
        ops = $.extend(defaults, options);
        e = $("input[name='" + ops.checkall_name + "']"), //全选
        f = $("input[name='" + ops.checkbox_name + "']"), //单选
        g = f.length; //被操作的复选框数量
        f.click(function () {
           if( $("input[name ='" + ops.checkbox_name + "']:checked").length == $("input[name='" + ops.checkbox_name + "']").length) {
             e.attr("checked", !0);
             e[0].setAttribute("checked","checked")
             
           }else{
        	 e.attr("checked", !1);
        	 e.removeAttr("checked")
        	
           }
           
            if(this.checked){
            	this.setAttribute("checked","checked")
            }else{
            	$(this).removeAttr("checked")
            }
        }), e.click(function () {
        	 if(this.checked){
             	this.setAttribute("checked","checked")
             }else{
             	$(this).removeAttr("checked")
             }
            for (i = 0; g > i; i++){ 
            	f[i].checked = this.checked;
            	if(f[i].checked){
            	f[i].setAttribute("checked","checked")
            	}else{
            	$("#"+f[i].id).removeAttr("checked")
            	}
            }
        });
    };
})(jQuery);