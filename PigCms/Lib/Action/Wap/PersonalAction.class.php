<?php
class  PersonalAction extends  WapAction{
	
	function _initialize() {
		parent::_initialize();
// 		if(!$this->islogin()){
// 			$this->error("请登录或者注册",U('Wapuser/login',array('token'=>
	
// 					$this->token)));
// 		}
		$this->assign('staticFilePath', str_replace('./', '/', THEME_PATH .
	
				'common/css/action'));
		$this->action=M("Action");
	}
	
	
	public function baoming(){
	 //  M()->startTrans();
		$data=$this->action->where(array('id'=>$_GET['id']))->find();
	    if(time()<$data['end_time']){
	    	
	    	 if($data['needs_nu']>$data['people_nu']){
	    	   if(M("Myaction")->where(array("aid"=>$_POST['aid'],"uid"=>cookie("wapuid")))->find()){
	    	   	 $this->error("您已经报名了");
	    	   }
	    	
	    	 $this->action->where("id={$_GET['id']}")->setInc('people_nu');
// 	    	 if(!$l){
// 	    	 	M()->rollback();//回滚
// 	    	 	$this->error('错误提示');
//    	 }
	    	 
	    	 $_POST['info']=serialize($data);
	    	 $_POST['uid']=cookie("wapuid");
	    	
	    	 M("Myaction")->add( $_POST);
	    	// M()->commit();//
	    	 
	    	 $this->success('报名成功');
	    	 }else {
	    	 	
	    	 	$this->error("报名人数已满了");
	    	 	
	    	 }
	    	
	    	
	    }else {
	    	$this->error("活动已结束");
	    }
		
		$this->display();
	
	}
	
	
	public  function myaction(){
		
	 $data=M("Myaction")->where(array("token"=>$this->token,"uid"=>cookie("wapuid")))->select();
	 $this->display();
	}
	
	
}



