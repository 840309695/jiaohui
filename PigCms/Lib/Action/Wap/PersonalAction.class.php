<?php
class PersonalAction extends WapAction {
	function _initialize() {
		parent::_initialize ();
		if(!$this->islogin()){
		$this->error("请登录或者注册",U('Wapuser/login',array('token'=>
		
		$this->token)));
		}
		$this->assign ( 'staticFilePath', str_replace ( './', '/', THEME_PATH . 

		'common/css/action' ) );
		$this->action = M ( "Action" );
	}
	public function baoming() {
		// M()->startTrans();
		$data = $this->action->where ( array (
				'id' => $_GET ['id'] 
		) )->find ();
		
		
 
		if (time () < $data ['end_time']) {
			
			if ($data ['needs_nu'] > $data ['people_nu']) {
				if($_POST['myaction_id']){
					$data=M("myaction")->where(array("id"=>$_POST['myaction_id']))->setField('nu',$_POST['nu']);
					if($data){
						if($_POST['nu']==0){
							$this->action->where ("id={$_GET['id']}" )->setDec('people_nu',intval($_POST['nu']));
							$this->success ( '已经取消' );
							die;
						}else{
							$this->action->where ("id={$_GET['id']}" )->setInc ('people_nu',intval($_POST['nu']));
							$this->success ( '修改成功' );
							die;
								
						}
				
					}else{
						$this->error ( '修改失败' );
					}
				   //die;
				
				}
				
				
				if (M ( "Myaction" )->where ( array (
						"aid" => $_POST ['aid'],
						"uid" => cookie ( "wapuid" ) ,
						"nu"=>array('neq',0)
				) )->find ()) {
					$this->error ( "您已经报名了" );
				}
				
				$this->action->where ("id={$_GET['id']}" )->setInc ('people_nu',intval($_POST['nu']));
				// if(!$l){
				// M()->rollback();//回滚
				// $this->error('错误提示');
				// }
				
				$_POST ['info'] = serialize ( $data );
				$_POST ['uid'] = cookie ( "wapuid");
				$_POST ['token'] = $this->token;
				
				M ( "Myaction" )->add ( $_POST );
				// M()->commit();//
				
				$this->success ( '报名成功' );
			} else {
				
				$this->error ( "报名人数已满了" );
			}
		} else {
			$this->error ( "活动已结束" );
		}
	
		$this->display ();
	}
	public function myaction() {
		$user = cookie ( "wapuid" );
		$Model = new Model ();
		$sql = "SELECT
        myaction.uid,
		myaction.crate_time,
		myaction.aid,
		action.`name` AS title,
		action.`imgurl` AS url,
		action.start_time AS stime,
		action.end_time AS etime,
		`user`.`name` AS username,
		`user`.tel
		FROM
		pigcms_myaction AS myaction ,
		pigcms_action AS action ,
		pigcms_front_user AS `user`
		WHERE
		myaction.aid = action.id AND
		myaction.uid = `user`.id AND
		myaction.token='{$this->token}' AND
		myaction.nu  <> 0  AND
		myaction.uid =$user";
		$list = $Model->query ( $sql );
		$this->assign("list",$list);
		$this->display ();
	}
}



