<?php
class FrontUserAction extends UserAction{
	public function _initialize() {
		parent::_initialize();
		$this->token=session('token');
		if(!$this->GroupInfo=M('Group')->where(array("token"=>session('token')))->select()){
			$this->error("请先添加小组",U('Group/add',array("token"=>session('token'))));
		}
		
		
	}
	public  function index(){
		 //$user=M("")->where(array("token"=>session('token')))->select();
		 $Model = new Model();
		 $sql = "SELECT u.id,u.`name`,u.tel,u.create_date,u.group_id,g.id,g.group_name FROM pigcms_front_user AS u , pigcms_group AS g WHERE u.token='{$this->token}' AND u.group_id = g.id";
		 $user = $Model->query($sql);
		 $this->assign('user', $user);
		 $this->display();
		
	}
	
	public  function add(){
		if($this->isPost()){
			$_POST['token'] = session('token');
			$_POST['password']=md5($_POST['password']);
			$this->insert("Front_user");
		}
	    $this->assign('GroupInfo',$this->GroupInfo);
		$this->display("set");
	
	}
}