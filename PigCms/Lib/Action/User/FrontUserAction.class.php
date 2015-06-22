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
		
		 $Model = new Model();
		 $sql = "SELECT u.id as uid ,u.`name`,u.tel,u.create_date,u.group_id,u.status,g.id as gid,g.group_name FROM pigcms_front_user AS u , pigcms_group AS g WHERE u.token='{$this->token}' AND u.group_id = g.id";
		 $user = $Model->query($sql);
		 $this->assign('user', $user);
		 $this->display();
		
	}
	
	public  function add(){
		if($this->isPost()){
			$_POST['token'] = session('token');
			$_POST['password']=md5($_POST['password']);
			$this->chckuser();
			$this->insert("Front_user");
		}
		$this->display("set");
	
	}
	
	
	public  function edit(){
		if($this->isPost()){
			$_POST['token'] = session('token');
			if(!empty($_POST['password'])){
			$_POST['password']=md5($_POST['password']);
			}else{
			 unset($_POST['password']);
			}
			$this->chckuser();
			$this->save("Front_user");
			
		}
	    $set=M("Front_user")->where(array("id"=>$_GET['id']))->find();
		$this->assign('set',$set);
		$this->display("set");
	
	}
	
	
	public  function  del(){
		$del=M("Front_user")->where(array("id"=>$_GET['id']))->delete();
		if($del){
			$this->success('操作成功');
		
		}else {
			
			$this->error('操作失败');
		}
		
		
		
		
		
		
	
	}
	
	private  function chckuser(){
		if(M("Front_user")->where(array("token"=>session('token'),"name"=>$_POST['name']))->find()){
			$this->error("用户名已经被注册了") ;
		}
		
		
	}
	
	
	
}