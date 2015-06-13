<?php
class subscribe {

	public $token;
	public $wecha_id;
	public $thisWxUser = array();

	public function __construct($token,$wecha_id,$data,$siteurl){
		
		$this->token      = $token;
		$this->wecha_id   = $wecha_id;
		$this->thisWxUser = M('Wxuser')->field('appid','appsecret')->where(array('token'=>$token))->find();
	}


	public function sub(){

		//	获取access_token  $json->access_token
			$url_get='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$this->thisWxUser['appid'].'&secret='.$this->thisWxUser['appsecret'];

			$json=json_decode($this->curlGet($url_get));

		$url='https://api.weixin.qq.com/cgi-bin/user/info?openid='.$this->wecha_id.'&access_token='.$json->access_token;
		$classData=json_decode($this->curlGet($url));
		if ($classData->subscribe==1){
			$data['nickname']=str_replace(array("'","\\"),array(''),$classData->nickname);
			$data['sex']=$classData->sex;
			$data['city']=$classData->city;
			$data['province']=$classData->province;
			$data['headimgurl']=$classData->headimgurl;
			$data['subscribe_time']=$classData->subscribe_time;

	}


	public function unsub(){
		
	}

	public function curlGet($url,$method='get',$data=''){
		$ch = curl_init();
		$header = "Accept-Charset: utf-8";
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$temp = curl_exec($ch);
		return $temp;
	}
}
