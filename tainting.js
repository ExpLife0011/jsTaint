function String(s){
  var __taint = false;
  var length = ("" + s).length;
  this.untaint = function(){
    __taint = false;
  }
  this.taint = function(){
    __taint = true;
  }
  this.isTainted = function(){
    if(__taint)
      return true;
    else
      return false;
  }
  this.concat = function(){
    var val = s;
    var taint = this.isTainted();
    for(var i = 0, l = arguments.length; i < l; i++){
      val = val + arguments[i];
       if(typeof arguments[i] == "string")
      taint = taint || arguments[i].isTainted();
    }
    val = new String(val);
    if(taint){
      val.taint();
    }
    return val;
  }
  this.toLowerCase = function(){
    var str = new String(("" + s).toLowerCase());
    if(this.isTainted()){
      str.taint();
    }
    return str;
  }
  this.toUpperCase = function(){
    var str = new String(("" + s).toUpperCase());
    if(this.isTainted()){
      str.taint();
    }
    return str;
  }
  this.charCodeAt = function(f){
    return (""+ s).charCodeAt(f);
  }
  this.fromCharCode = function(f){
    return ("" + s).fromCharCode(f);
  }
  this.toString = this.valueOf = function(){
    return s;
  }
  this.charAt = function(f){
    return ("" + s).charAt(f);
  }
  this.indexOf = function(searchstring, start){
    return ("" + s).indexOf(searchstring, start);
  }
  this.lastIndexOf = function(searchstring, start){
    return ("" + s).lastIndexOf(searchstring, start);
  }
  this.match = function(regexp){
    var a = ("" + s).match(regexp);
    if(this.isTainted() && a != null){
      for(var i = 0, l = a.length; i < l; i++){
        a[i] = new String(a[i]);
        a[i].taint();
      }
    }
    return a;
  }
  this.replace = function(regexp, newstr){
    var str = new String(("" + s).replace(regexp, newstr));
    if(this.isTainted() || newstr.isTainted()){
      str.taint();
    }
    return str;
  }
  this.search = function(regexp){
    return ("" + s).search(regexp);
  }
  this.slice = function(begin,end){
    var str = ("" + s).slice(begin, end);
    if(str != -1){
      str = new String(str);
      if(this.isTainted()){
        str.taint();
      }
    }
    return str;
  }
  this.split = function(separator, limit){
    var a = ("" + s).split(separator, limit);
    if(this.isTainted() && a != null){
      for(var i = 0, l = a.length; i < l; i++){
        a[i] = new String(a[i]);
        a[i].taint();
      }
    }
    return a;
  }
  this.substr = function(start,length){
    var str = new String(("" + s).substr(start,length));
    if(this.isTainted())
      str.taint();
    return str;
  }
  this.substring = function(from, to){
    var str = new String(("" + s).substring(from, to));
    if(this.isTainted())
      str.taint();
    return str;
  }
}
function Taint(idsn, validation_functionsn, sync_functionsn){
	var ids = idsn;
	var validation_functions = validation_functionsn;
	var sync_functions = sync_functionsn;
	this.get = function(idc){
	  var str = new String(document.getElementById(idc).value);
	  str.taint();
	  return str;
	}
	this.runValidation = function(idc, val){
	  for(var i = 0, l = ids.length; i < l; i++){
	    if(idc == ids[i]){
	      var valid = validation_functions[i](val);
	      valid.untaint();
	      return valid;
	    }
	  }
	  throw "Invalid ID in Validation.";
	}
	this.runOneValidation = function(vals){
	  if(typeof validation_functions == "function"){
	    var valid = validation_functions(vals);
	    switch(typeof valid){
	    case "array":
	      for(var i = 0, l = valid.length; i < l; i++){
	        valid[i].untaint();
	      }
	      break;
	    case "string":valid.untaint();break;
	    }
	    return valid;
	  }else{
	    throw "Not a function!";
	  }
	}
	this.runSync = function(idc, val){
	  if(val.isTainted())
	    throw "Value is Tainted!";
	  for(var i = 0, l = ids.length; i < l; i++){
	    if(idc == ids[i]){
	      var valid = sync_functions[i](val);
	      return valid;
	    }
	  }
	  throw "Invalid ID in Sync.";
	}
	this.runOneSync = function(vals){
	  for(var i = 0, l = vals.length; i < l; i++){
	    if(vals[i].isTainted())
	      throw "Value is Tainted!";
	  }
	  if(typeof sync_functions == "function")
	    return sync_functions(vals);
	  else
	    throw "Not a function!";
	}
}
