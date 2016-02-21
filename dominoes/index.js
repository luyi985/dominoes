
 var dominos=(function(o){
 	//tile--------------------------
 	var tile=function(v){
 		this.value=v;
 		this.edge=v.map(function(tv){
 			return tv;
 		})
 	}
 	tile.prototype.merge=function(anotherTile){
 		if(anotherTile.edge.length<=0) return false; 
 		var thisTileLen=this.edge.length;
 		var ti=0;
 		var i;
 		while(ti<thisTileLen){
 			if((i=anotherTile.edge.indexOf(this.edge[ti]))!=-1){
 				this.edge.splice(ti,1);
 				anotherTile.edge.splice(i,1);
 				console.log(this.value.toString() + " has merged with "+ anotherTile.value.toString());
 				return true;
 			}
 			ti++;	
 		}
 		return false;
 	}
 	tile.prototype.calPoint=function(){
 		/*if( this.edge.length<=0 ) return 0;
 		if( this.edge.length>1 ){ return this.value[0]*2 } // for the tile with the same value
 		else return this.value[0]; // for the tile with different value*/
 		return this.edge.length===0? false:true; 
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
 		return this.playingPool.map(function(t){
 			if(t.calPoint()) return t;
 		})
 	}
 	dominoGame.prototype.putTile=function(player,cb){
 		t=player.put();
 		if(cb) cb(t);
 		this.playingPool.push(t);
 		return t;
 	}
 	dominoGame.prototype.pickTile=function(player){
 		var t=this.store.pop();
 		player.pick(t);
 	}
 	dominoGame.prototype.play=function(){
 		var _this=this;
 		var currentPlayerTile;
 		var isFirstRound=true;
 		var currentOpenEdge;
 		this.playerPool.map(function(currentPlayer){
 			var hasMerged=false;
 			if(isFirstRound){
 				_this.putTile(currentPlayer);
 				isFirstRound=false;
 			}
 			else{	
 				console.log("-----------"+currentPlayer.name+"--------------");
 				_this.putTile(currentPlayer,function(t){
					currentPlayerTile=t;
					currentOpenEdge=_this.getOpenEdge();
					console.log(currentOpenEdge.map(function(v){
 						return v.edge.toString();
 					}));
					currentOpenEdge.map(function(currentPoolTile){
		 				if(!hasMerged){
		 					if(currentPlayerTile.merge(currentPoolTile)) hasMerged=true;
		 				}
 					});
 					console.log(currentOpenEdge.map(function(v){
 						return v.edge.toString();
 					}));
 				});
 			}
 		})
 	}
 	//----------------------------------------
    var d=new dominoGame(o.set,o.players);
    d.buildGame();
    d.play();
    console.log(d.tilesPool.map(function(v){
    	return v.edge.toString();
    }))
 })({
 	players		: 	3,
 	set 		:  	6
 })





