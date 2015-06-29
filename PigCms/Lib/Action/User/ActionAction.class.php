<?php
class ActionAction extends UserAction{
	public function _initialize() {
		parent::_initialize();
		$this->token=session('token');
		$this->db=M('Action');
		
		
	}
	

	 public function index(){
	 	$data=$this->db->where(array("token"=>$this->token))->select();
	 	$this->assign("list",$data);
	 	$this->display();
	 	
	 }
	 
	 public function record(){
	 	
	 	$this->display("index");
	 }
	 public function addnew(){ 
	 	if($this->isPost()){
	 		$_POST['token'] = session('token');
	 	    $this-> postset();
	        $this->insert();	
	 	}
	 	$this->display("set");
	 	 
	 }
	 
	 public function  edit(){
	 	if($this->isPost()){
	 		$this-> postset();	
	 		$this->save();
	 	}
	 	$data=$this->db->where(array("id"=>$this->_get("id")))->find();
	 	$this->assign("list",$data);
	 	$this->display("set");
	    
	 	
	 }
	 
	 private  function postset(){
	 	
	 	$_POST['start_time']=strtotime($this->_post('start_time'));
	 	$_POST['end_time']=strtotime($this->_post('end_time'));
	 	
	 }
	 
	
	
}