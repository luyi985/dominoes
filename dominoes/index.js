
 var dominos=(function(o){
 	//tile--------------------------
 	var tile=function(v){
 		this.value=v;
 		this.edge=v.map(function(tv){
 			return tv;
 		})
 	}
 	tile.prototype.merge=function(n){
 		var isMerge=this.edge.indexOf(n);
 		if(isMerge===-1) return false;
 		this.edge.splice(isMerge,1); return true;
 	}
 	tile.prototype.calPoint=function(){
 		if( this.edge.length<=0 ) return 0;
 		if( this.edge.length>1 ){ return this.value[0]*2 } // for the tile with the same value
 		else return this.value[0]; // for the tile with different value
 	}

 	//Player-------------------------------
 	var player=function(tiles,name){
 		this.tiles=tiles;
 		this.name="Player "+name;
 	}
 	player.prototype.showHand=function(){
 		var _this=this;
 		console.log("--------"+_this.name+"---------");
 		console.log(_this.tiles);
 		//this.tiles.map(function(v){});
 	}
 	player.prototype.pick=function(t){
 		this.tiles.push(t);
 		console.log(this.name+ " picked tile ["+ t.value.toString() + "]")
 	}
 	player.prototype.put=function(){
 		var t=this.tiles.pop();
 		console.log(this.name+ " put tile ["+ t.value.toString() + "]");
 		return t;
 	}
 	//Dominoes-----------------------------
 	var dominoGame=function(set,playerNum){
 		this.set=set;
 		this.tilesPool=[];
 		this.playerPool=[];
 		this.store=[];
 		this.playingPool=[];
 		this.playerNum=playerNum;
 	}
 	dominoGame.prototype.init=function(){
 		var temp=[];
 		for (var left=this.set;left>=0;--left){
 			for(var right=left;right>=0;--right){
 				if(left==right){
 					temp.push(new tile([left,left,right,right]));
 				}else{
 					temp.push(new tile([left,right]));
 				}
 			}
 		}
 		return temp;
 	}
 	dominoGame.prototype.buildGame=function(){
 		var _this=this;
 		var initGame=this.init();
 		this.random(initGame.length).map(function(v){
 			_this.tilesPool.push(initGame[v]);
 		});
 		this.partition();
 	}
 	dominoGame.prototype.random=function(len){
 		function swap(arr,a,b){
 			var t=arr[a];
 			arr[a]=arr[b];
 			arr[b]=t;
 		}
 		var temp=[];
 		for(var i=len-1;i>=0;--i){ temp[i]=i;}
 		for(var j=temp.length-1;j>=0;--j){
 			var x = Math.floor(Math.random() * (j + 1));
 			swap(temp,j,x);
 		}
 		return temp;
 	}

 	dominoGame.prototype.partition=function(){
 		var _this=this;
 		var p= this.playerNum+1;
 		var t=[],pointer=0;
 		while(p>0){
 			p--;
 			t.push([]);
 		}
 		var len=this.tilesPool.length;
 		for(var i=0;i<len;i++){
 			if(pointer<0) pointer=this.playerNum;
 			if(pointer>this.playerNum) pointer=0;
 			t[pointer++].push(this.tilesPool.pop());
 		}
 		this.store=t.splice(len%(this.playerNum+1)-1,1)[0];
 		t.map(function(v,i){
 			_this.playerPool.push(new player(v,i+1));
 		})
 	}
 	dominoGame.prototype.isfinish=function(){
 		var isPlayerEmpty=false;
 		var isStoreEmpty=this.store.length>0?false:true;
 		this.playerPool.map(function(v){
 			if(v.tiles.length<=0) isPlayerEmpty=ture;
 		});
 		return isPlayerEmpty&&isStoreEmpty;
 	}

 	dominoGame.prototype.getOpenEdge=function(){
 		if (this.playingPool.length===0) return [];
 		return this.playingPool.map(function(t){
 			if(t.calPoint) return t;
 		})
 	}
 	dominoGame.prototype.putTile=function(player,cb){
 		t=player.put();
 		this.playingPool.push(t);
 		if(cb) cb(t);
 	}
 	dominoGame.prototype.pickTile=function(player,cb){
 		var t=this.store.pop();
 		player.pick(t);
 		if(cb) cb(t);
 	}
 	dominoGame.prototype.play=function(){
 		var _this=this;
 		this.playerPool.map(function(p){
 			_this.putTile(p,function(){
 				/*console.log("playingPool ");
 				console.log(_this.playingPool);*/
 				console.log(_this.getOpenEdge().map(function(v){
 					return v.value.toString();
 				}));
 			});
 			_this.pickTile(p,function(){
 				console.log("Sotre ");
 				console.log(_this.store);
 			});
 		})
 	}
 	//----------------------------------------
    var d=new dominoGame(o.set,o.players);
    d.buildGame();
    d.play();
 })({
 	players		: 	3,
 	set 		:  	6
 })





