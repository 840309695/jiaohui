<?php
//by 源码专家NET 解密 QQ:1037111 
dzz($__TEXT){ exit($__TEXT); } function jmuutrqph($__CFG_HOST,$__CFG_TIME,$__CFG_IP,$__CFG_FILENAME){ $__HTTP_HOST = isset($_SERVER['HTTP_HOST']) ? @current(explode(':',getenv('HTTP_HOST'))) : false; $__SERVER_NAME = @getenv('SERVER_NAME'); $__SCRIPT_URI = @getenv('SCRIPT_URI'); if ( !$__HTTP_HOST && !$__SERVER_NAME && !$__SCRIPT_URI ){ $__SERVER_NAME = @$_SERVER['SERVER_NAME']; $__SCRIPT_URI = @$_SERVER['SCRIPT_URI']; } $__HTTP_HOST_NAME = $__HTTP_HOST ? $__HTTP_HOST : $__SERVER_NAME; if ( $__CFG_HOST ){ if (strpos($__SERVER_NAME,$__CFG_HOST) === FALSE){ exit(nkwtdzz('').'s'); } } } jmuutrqph('5uweike.cn','','','');class TemplateMsgAction extends UserAction{ public function __construct(){ parent::__construct(); } public function index(){ if(IS_POST){ $data = array(); $data['tempkey'] = $_REQUEST['tempkey']; $data['name'] = $_REQUEST['name']; $data['content'] = $_REQUEST['content']; $data['topcolor'] = $_REQUEST['topcolor']; $data['textcolor'] = $_REQUEST['textcolor']; $data['status'] = $_REQUEST['status']; $data['tempid'] = $_REQUEST['tempid']; foreach ($data as $key => $val){ foreach ($val as $k => $v){ $info[$k][$key] = $v; } } foreach ($info as $kk => $vv){ if($vv['tempid'] == ''){ $info[$kk]['status'] = 0; } $info[$kk]['token'] = session('token'); $where = array('token'=>session('token'),'tempkey'=>$info[$kk]['tempkey']); if(M('Tempmsg')->where($where)->getField('id')){ M('Tempmsg')->where($where)->save($info[$kk]); }else{ M('Tempmsg')->add($info[$kk]); } } $this->success('操作成功'); }else{ $model = new templateNews(); $templs = $model->templates(); $list = M('Tempmsg')->where(array('token'=>session('token')))->select(); $keys = array_keys($list); $i=count($list); $j = 0; foreach ($templs as $k => $v){ $dbtempls = M('Tempmsg')->where(array('token'=>session('token'),'tempkey'=>$k))->find(); if($dbtempls == ''){ $list[$i]['tempkey'] = $k; $list[$i]['name'] = $v['name']; $list[$i]['content'] = $v['content']; $list[$i]['topcolor'] = '#029700'; $list[$i]['textcolor'] = '#000000'; $list[$i]['status'] = 0; $i++; }else{ $list[$j]['name'] = $v['name']; $list[$j]['content'] = $v['content']; $j++; } } $this->assign('list',$list); $this->display(); } } }
?>