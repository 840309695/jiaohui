<?php
class ActionModel extends Model{
	
	protected $_validate =array(
			array('name','require','标题不能为空',1),
			array('content','require','活动说明必须填写',1),
			array('start_time','require','活动时间必须选择',1),
			array('end_time','require','活动时间必须选择',1),
			array('imgurl','require','活动海报必须填写',1),
	);
	
	
}   