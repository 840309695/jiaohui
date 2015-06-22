<?php
class WapuserAction extends WapAction
{
	
	public function _initialize(){
		parent::_initialize();
		$this->userdb=M("Front_user");
	
	}
	
   public function login(){
   
   	if($this->isPost()){
   		 if(!empty($_POST)){
   		 	if($userinfo=$this->userdb->where(array("token"=>$this->token,"name"=>$_POST['name'],"password"=>md5($_POST['password'])))->find()){
   		 	    if(!$userinfo['status']) {$this->error("您的账号还没有通过管理员审核");}	
   		 	     session("wapuid",$userinfo['id']);
   		 	     $this->success("登录成功",U('Index/index',array("token"=>$this->token,"wecha_id"=>$this->wecha_id)));
   		 	     
   		 	}else{
   		 		$this->error("用户名或密码错误");
   		 		
   		 	}
   		 	
   		 }
   	
   		
   		
   	}
   	$this->display();
   }
  
   public  function register() {
   	$this->display();
   	
   }
   	
   
   }
?>