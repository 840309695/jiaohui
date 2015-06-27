<?php
class ActionAction extends WapAction{
	
	
	public  function index (){
		$this->assign('staticFilePath', str_replace('./', '/', THEME_PATH . 'common/css/action'));
		$this->display();
		
	}
	
}