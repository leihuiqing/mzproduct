var myApp=angular.module("myApp",[]);
myApp.controller("myCtrl",function($scope,$http,$interval){
	$scope.class="jiantou";
	$scope.num=0;
	$interval(function(){
		if($scope.num==0){
			$scope.num=1
		}else{
			$scope.num=0
		}
	},2000);
	$scope.btn=function(){
		if($("#btn").hasClass("jiantou")){
			$("#content").animate({"width":"0"});
			$("#product-page").animate({"opacity":"1"})
			$scope.class="jiantou-two";
			$("#btn").animate({"left":"170px"});
			$("#pageNo").find("span").eq(0).addClass("curp");
		}else{
			$("#content").animate({"width":"1000px"});
			$("#product-page").animate({"opacity":"0"});
			$scope.class="jiantou";
			$("#btn").animate({"left":"966px"})
		}		
	};
	$scope.tab=function(index){
		$(".product-type").eq(index).addClass("cur-type").siblings().removeClass("cur-type");
		$("#scroll").css("top","0");
		nn=$("#pro"+(index*1+2)).children().length;
		$scope.arr1=new Array(nn);
		console.log($scope.arr1);

		
	};
	$scope.tab1=function(index){
		$("#content").animate({"width":"0"});
		$("#product-page").animate({"opacity":"1"})
		$scope.class="jiantou-two";
		$("#btn").animate({"left":"170px"})
		$(".product-type").eq(index).addClass("cur-type").siblings().removeClass("cur-type");		
	};
	$scope.square=function(index){	
		var height=$(".product-pic-box").outerHeight(),
			$scroll=$("#scroll");
			$scroll.animate({"top":-index*height},500);
			$("#pageNo").find("span").eq(index).addClass("curp").siblings().removeClass("curp");
	}
	$http.get("./data.json")
		 .then(function(response){

		 	$scope.data=response.data;	
			//$scope.products=$scope.data.products;

		 	for(var i=0;i<$scope.data.length;i++){

		 		$scope.arr=[];
		 		var len=$scope.data[i].products.length,
		 			temp=$scope.data[i].template_type,
		 			count=Math.ceil(len/temp);
		 			//console.log(count);
		 			for(var  j=0;j<count;j++){  //4	
		 				$scope.arr[j]=[];	 				
		 				for(var k=j*temp;k<=(j+1)*temp-1;k++){
		 					$scope.arr[j].push($scope.data[i].products[k]);
		 				}
		 			}
		 			for(n=0;n<$scope.arr.length;n++){
				 	 	for(m=0;m<$scope.arr[n].length;m++){
				 	 		if(typeof $scope.arr[n][m]==="undefined"){
				 	 			$scope.arr[n][m]={summary:"敬请期待"};
				 	 		}
				 	 	}
				 	 }
		 			$scope.data[i].products=$scope.arr;
		 			console.log($scope.arr.length);
		 			
		 			 		
		 	}
		 	 
		 	console.log($scope.data)
		 },function(){
		 	console.log("失败")
		 });
	
})