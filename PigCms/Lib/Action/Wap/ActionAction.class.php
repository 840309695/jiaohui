<?php
class ActionAction extends WapAction{
	
	function _initialize() {
		parent::_initialize();
		$this->assign('staticFilePath', str_replace('./', '/', THEME_PATH . 'common/css/action'));
		$this->action=M("Action");
	}
	
	
	
	public  function index (){
		$hostlist=$this->action->where(array("tokn"=>$this->token))->order('create_date  desc')->limit(5)->select();
		$this->assign("hostlist",$hostlist);
		$this->display();
		
	}
	
}