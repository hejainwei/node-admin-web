const genSignData = function(jsonObject) {
	var content = "";
	var keys = []; //keys
	for(var target in jsonObject){
		keys.push(target);
	}
	keys = keys.sort(); //排序
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = jsonObject[key];
		var objectFlag = false;
		if(typeof(value)=='object'){
			var $keys=[];
			var $str = "{";
			for(var $k in value){
				$str+=$k+"="+value[$k]+", ";
				objectFlag = true;
			}
			if(objectFlag){
				value = $str.substring(0,$str.length-2)+"}"
			};
		}
		if ("sign" == key) {
			continue;
		}
		// 空串不参与签名
		if (value === null || value  === undefined || value === "" ) {
			continue;
		}
		if(typeof(value)!='object' || objectFlag) content += (i == 0 ? "" : "&") + key + "=" + value;
	}
	if (content != null && content != "" && content.substr(0, 1) == "&") {
		content = content.substr(1, content.length)
	}
	return content;
}
export default genSignData;