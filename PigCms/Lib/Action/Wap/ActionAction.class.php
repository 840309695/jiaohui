<?php
class ActionAction extends WapAction{
	
	function _initialize() {
		parent::_initialize();
		$this->assign('staticFilePath', str_replace('./', '/', THEME_PATH . 'common/css/action'));
		$this->action=M("Action");
		$this->groupid=M("Front_user")->field('group_id')->where(array("id"=>cookie("wapuid")))->find();
	}
	
	
	
	public  function index (){
		$hostlist=$this->action->where(array("token"=>$this->token))->order('create_date  desc')->limit(5)->select();
		$list=array();
		foreach ($hostlist as $k => $v) {
			if(in_array($this->groupid['group_id'],unserialize($v['gid']))){
				$list[$k]=$v;
			}
		
		}
		$hostlist=$list;
		$this->assign("hostlist",$hostlist);
		$this->display();
		
	}
	
	public  function  details(){
		$amap=new amap();
		$data=$this->action->where(array("token"=>$this->token,"id"=>$this->_get("id")))->order('create_date  desc')->find();
		
		if(!in_array($this->groupid['group_id'],unserialize($data['gid']))){
			$data="";
		}
		
		$mapurl=$amap->getPointMapLink($data['lng'],$data['lat'],"name");
		$actionlog = unserialize ( $_COOKIE ["actionlog"] );
		if (! $actionlog[$data ['id']]) {
				
			$actionlog [$data ['id']] = array (
					"id" => $data ['id']
			);
			setCookie ( "actionlog", serialize ( $actionlog ), time () + 52 * 7 * 24 * 3600 );
		}
		
		$user = cookie ( "wapuid" );
		$Model = new Model ();
		$sql = "SELECT
		myaction.id,
		myaction.uid,
		myaction.crate_time,
		myaction.aid,
		myaction.nu,
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
		myaction.aid = '{$this->_get("id")}'  AND
		myaction.nu  <> 0  AND
		myaction.uid =$user";
		$myacton = $Model->query ( $sql );
		$this->assign("mapurl",$mapurl);
		$this->assign("myacton",$myacton[0]);
		$this->assign("list",$data);
		$this->display();
	}
	
	public  function more(){
		$hostlist=$this->action->where(array("token"=>$this->token))->order('create_date  desc')->select();
		$list=array();
		foreach ($hostlist as $k => $v) {
			if(in_array($this->groupid['group_id'],unserialize($v['gid']))){
				$list[$k]=$v;
			}
		
		}
		$hostlist=$list;
		$this->assign("hostlist",$hostlist);
		$this->display("index");
		
		
		
	}
	
	
	
}