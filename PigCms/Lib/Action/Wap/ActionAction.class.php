<?php
class ActionAction extends WapAction{
	
	function _initialize() {
		parent::_initialize();
		$this->assign('staticFilePath', str_replace('./', '/', THEME_PATH . 'common/css/action'));
		$this->action=M("Action");
	}
	
	
	
	public  function index (){
		$hostlist=$this->action->where(array("token"=>$this->token))->order('create_date  desc')->limit(5)->select();
		$this->assign("hostlist",$hostlist);
		$this->display();
		
	}
	
	public  function  details(){
		$amap=new amap();
		$data=$this->action->where(array("token"=>$this->token,"id"=>$this->_get("id")))->order('create_date  desc')->find();
		$mapurl=$amap->getPointMapLink($data['lng'],$data['lat'],"name");
		$this->assign("mapurl",$mapurl);
		$this->assign("list",$data);
		$this->display();
	}
	
	public  function more(){
		$hostlist=$this->action->where(array("token"=>$this->token))->order('create_date  desc')->select();
		$this->assign("hostlist",$hostlist);
		$this->display("index");
		
		
		
	}
	
	
	
}