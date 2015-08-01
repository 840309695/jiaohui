<?php
class WapuserAction extends WapAction
{
	
	public function _initialize(){
		parent::_initialize();
		$this->userdb=M("Front_user");
		$tplinfo = M('Wxuser')->where("token = '{$this->token}'")->find();
		$this->assign("tpl",$tplinfo);
	
	}
	
   public function login(){
   
   	if($this->isPost()){
   		 if(!empty($_POST)){
   		 	if($userinfo=$this->userdb->where(array("token"=>$this->token,"name"=>$_POST['name'],"password"=>md5($_POST['password'])))->find()){
   		 		 cookie("wapuid",$userinfo['id'],time()+52*7*24*3600);
   		 		
   		 	    if(!$userinfo['status']) {$this->error("您的账号还没有通过管理员审核",U('Index/index',array("token"=>$this->token,"wecha_id"=>$this->wecha_id)));}	
   		 	     $this->success("登录成功",U('Index/index',array("token"=>$this->token,"wecha_id"=>$this->wecha_id)));
   		 	     
   		 	}else{
   		 		$this->error("用户名或密码错误");
   		 		
   		 	}
   		 	
   		 }
   	
   		
   		
   	}
  
   	$this->display();
   }
  
   public  function register() {
   	if($this->isPost()){
   		if(!empty($_POST)){
   			if($this->userdb->where(array("token"=>$this->token,"name"=>$_POST['name']))->find()){
   				$this->error("用户名已经被注册了");
   			}
   			$_POST['token'] = $this->token;
   			$_POST['password']=md5($_POST['password']);
   			if($this->userdb->create()===false){
   				$this->error($this->userdb->getError());
   			}else{
			 $id=$this->userdb->add();
			if($id==true){
				cookie("wapuid",$id,time()+52*7*24*3600);
				$this->success('注册成功等待管理审核',U('Index/index',array("token"=>$this->token,"wecha_id"=>$this->wecha_id)));
				
			}else{
				$this->error('操作失败');
			}
		}
   			
   		}

   	
   	 
   		
   	}
   	$Groupinfo=M('Group')->where(array("token"=>$this->token))->select();
   	$this->assign('Groupinfo',  $Groupinfo);
   	$this->display();
   	
   }
   	
   
   }
?>