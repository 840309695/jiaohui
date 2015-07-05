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
	 
	 
	 public function del(){
	 	$this->del_id();
	 }
	 
	 public  function userlist(){
	 	$Model = new Model ();
	 	$sql="SELECT
myaction.nu AS nuber,
myaction.crate_time AS create_date,
action.`name` AS aname,
action.people_nu AS pe_nu,
action.start_time AS stime,
action.end_time AS etime,
`user`.`name` AS username,
`user`.`tel` AS phone,
groups.group_name AS groupname,
myaction.id AS id
FROM
pigcms_myaction AS myaction ,
pigcms_action AS action ,
pigcms_front_user AS `user` ,
pigcms_group AS groups
WHERE
myaction.aid ={$_GET['id']} AND
myaction.token = '{$this->token}' AND
myaction.aid = action.id AND
myaction.uid = `user`.id AND
`user`.group_id = groups.id";
	    
	 	$list = $Model->query ($sql );
	 	$title = $list[0]['aname'];
	 	$pe_nu =$list[0]['pe_nu'];
	 	$this->assign("pe_nu",$pe_nu);
	 	$this->assign("title",$title);
	 	$this->assign("list",$list);
	 	$this->display();
	 	
	 }
	 
	 private  function postset(){
	 	
	 	$_POST['start_time']=strtotime($this->_post('start_time'));
	 	$_POST['end_time']=strtotime($this->_post('end_time'));
	 	
	 }
	 
	
	
}