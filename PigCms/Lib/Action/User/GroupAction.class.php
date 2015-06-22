<?php
class GroupAction extends UserAction{
	public $token;
	public function _initialize() {
		parent::_initialize();
		$this->group=M('Group');
		$this->token=session('token');
	}


public  function index() {
	$group=$this->group->where(array("token"=>$this->token))->select();
	$this->assign('group',$group);
	$this->display();
}
	
public  function add() {
	if($this->isPost()){
		$_POST['token'] = session('token');
	 $this->all_insert();	
	}
	$this->display("set");
}
	
public  function edit() {
	if($this->isPost()){
		$this->all_save();
	}
	$set=$this->group->where(array("id"=>$_GET['id']))->find();
	$this->assign('set',$set);
	$this->display("set");
}

public  function del() {
	$del=$this->group->where(array("id"=>$_GET['id']))->delete();
	if($del){
		M("Front_user")->where(array("group_id"=>$_GET['id']))->delete();
		$this->success('操作成功');
		
	}
	
	
}


}


?>