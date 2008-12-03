//Global state variables
var xmlDoc;
var boxHeight = 30;
var boxWidth = 80;
var canvasHeight = window.innerHeight-25;
var canvasWidth = window.innerWidth-25;
var treeWidths = new Array();
var allNodes = new Array();
var root = new Object();
var clickedNode;
var difx = 0;
var dify = 0;
var beingDragged = null;
var mouseMoved = false;

var zoomLevel = 1.0;

//Parse the XML file representing the tree
function parseXML(xmlFile){
	try {
   		xmlDoc=document.implementation.createDocument("","",null);
  	} catch(e) {
    	alert(e.message);
    	return;
    }
	xmlDoc.async=false;
	xmlDoc.load(xmlFile);
}

//Build the JavaScript objects representing the tree
function createObjects(element, depth){
	element.label = element.getElementsByTagName("label")[0].firstChild.nodeValue;
	element.url = element.getElementsByTagName("url")[0].firstChild.nodeValue;
	element.depth = depth;
	if(treeWidths[depth] == undefined){
		treeWidths[depth] = 1;
	} else {
		treeWidths[depth]++;
	}
	element.children = new Array();
	allNodes.push(element);
	
	var children = element.getElementsByTagName("children")[0].childNodes;
	for(var i=0; i<children.length; i++){
		if(children[i].nodeType != 3 && children[i].tagName == "node"){  //TextNode = type 3
			element.children.push(createObjects(children[i], depth+1));  //Recurse on children
		}
	}
	
	element.expanded = false;
	element.visible = false;
	element.moved = false;
	element.x = 0;
	element.y = 0;
	
	element.width = boxWidth;
	element.height = boxHeight;
	return element;
}

//Calculates the maximum depth of the tree
function maxDepth(){
	var max = 0;
	for(var i=0; i<allNodes.length; i++){
		if(allNodes[i].visible && allNodes[i].depth > max){
			max = allNodes[i].depth;
		}
	}
	return max;
}

//Expands a node
function expandNode(node){
	for(var i=0; i<node.children.length; i++){
		node.children[i].visible = true;
		if(node.children[i].expanded){
			expandNode(node.children[i]);
		}
	}
}

//Collapses a node
function collapseNode(node){
	for(var i=0; i<node.children.length; i++){
		node.children[i].visible = false;
		collapseNode(node.children[i]);
	}
}

//Open a new window
function openNewWindow(url) {
	// Change "_blank" to something like "newWindow" to load all links in the same new window
	var newWindow = window.open(url, '_blank');
	//newWindow.focus();
	return false;
}

//Save as an image
function saveImage() {
  	save("line.tif");
}

//Main function - called from HTML
function displayTree(xmlFile, width, height){
	canvasWidth = width;
	canvasHeight = height;
	parseXML(xmlFile);
	root = xmlDoc.documentElement;
	
	//Build the object tree
	createObjects(root, 0);
	
	//Set root node visible
	root.visible = true;
	root.x = canvasWidth/4;
	root.y = canvasHeight/2;
	
	var canvas = document.getElementById("canvas");
	var p = Processing(canvas);
	// for cursor type maintenance
	var oldCursor = "default";
	var cursorState = 1;
	
	//Processing init function
	p.setup = function(){
		p.size(width, height);
		p.colorMode(p.RGB, 256);
		p.background(200, 255, 255);
		p.stroke(0, 0, 0);
		p.rectMode(p.CENTER);
  		p.smooth();
  		p.textSize(14);
	};
	
	//Main draw loop
	p.draw = function(){
		p.background(200, 255, 255);
		display(root);
		setCursor();
	}
	
	//Set the cursor based on mouse pointer location
	function setCursor(){
		cursorState = 1;
		for(var i=0; i<allNodes.length; i++){
			if(beingDragged != null && allNodes[i] == beingDragged){
				cursorState = 2;
			} else if(p.mouseX >= allNodes[i].x-allNodes[i].width/2 && p.mouseX <= allNodes[i].x+allNodes[i].width/2 
					&& p.mouseY >= allNodes[i].y-allNodes[i].height/2 && p.mouseY <= allNodes[i].y+allNodes[i].height/2){
				cursorState = 3;
			}
		}	
		
		// Cursor types: auto, crosshair, default, hand, help, move, pointer, text, wait, arrow-resize. 			
		if (cursorState == 1) {
			canvas.style.cursor = "default";
		} else if (cursorState == 2) {
			canvas.style.cursor = "move";
		} else if (cursorState == 3) {
			canvas.style.cursor = "pointer";
		}		
	}
	
	//Recursively called to display appropriate nodes and link them with lines
	//Also handles mouseover color change and dragging color change
	function display(node){
		if(node.visible){
			if(beingDragged != null && node == beingDragged){
				//p.fill(100, 255, 100);
				p.fill(200);
			} else if(p.mouseX >= node.x-node.width/2 && p.mouseX <= node.x+node.width/2 
 				&& p.mouseY >= node.y-node.height/2 && p.mouseY <= node.y+node.height/2 && node.children.length > 0){
 				//p.fill(255, 255, 0);
				p.fill(233);
 			} else {
 				p.fill(255, 255, 255);
 			}
  			p.rect(node.x, node.y, node.width, node.height);
  			p.fill(0, 0, 0);
  			p.text(node.label, node.x-35, node.y+5);
  			
  			//Used for drag/drop
  			var x_origin = node.x + node.width/2;
  			var y_origin = node.y;
  			
  			//Recurse on children and draw connecting lines
  			for(var i=0; i<node.children.length; i++){
  				if(node.children[i].visible){
  					display(node.children[i]);
  					p.line(x_origin, y_origin, node.children[i].x - node.children[i].width/2, node.children[i].y);
  				}
  			}
		}
	}
	
	//Mousedown callback
	p.mousePressed = function() {
		if(p.mouseButton == p.LEFT){
			clickedNode = null;
			
			//Determine which node is clicked on
 			for(var i=0; i<allNodes.length; i++){
 				if(p.mouseX >= allNodes[i].x-allNodes[i].width/2 && p.mouseX <= allNodes[i].x+allNodes[i].width/2 
 					&& p.mouseY >= allNodes[i].y-allNodes[i].height/2 && p.mouseY <= allNodes[i].y+allNodes[i].height/2){
 					clickedNode = allNodes[i];
 					break;
 				}
 			}
 		
 			//Set state vars for drag and drop of a node
 			if(clickedNode != null){
 				clickedNode.moved = true;
 				beingDragged = clickedNode;
 				difx = p.mouseX - clickedNode.x;
 				dify = p.mouseY - clickedNode.y;
 			} else {
 			//Set state vars for drag and drop of the whole tree (clicked on empty space)
 				for(var i=0; i<allNodes.length; i++){
 					allNodes[i].oldx = allNodes[i].x;
 					allNodes[i].oldy = allNodes[i].y;
 				}
 			 	difx = p.mouseX;
 				dify = p.mouseY;
 			}
 			
			return;
		} else if(p.mouseButton == p.RIGHT){
			//Handle right-clicking for links

			clickedNode = null;
			
			//Determine which node is clicked on
 			for(var i=0; i<allNodes.length; i++){
 				if(p.mouseX >= allNodes[i].x-allNodes[i].width/2 && p.mouseX <= allNodes[i].x+allNodes[i].width/2 
 					&& p.mouseY >= allNodes[i].y-allNodes[i].height/2 && p.mouseY <= allNodes[i].y+allNodes[i].height/2){
 					clickedNode = allNodes[i];
 					break;
 				}
 			}
			
			//Set state vars for drag and drop of a node
 			if(clickedNode != null){
 				clickedNode.moved = true;
 				beingDragged = clickedNode;
 				difx = p.mouseX - clickedNode.x;
 				dify = p.mouseY - clickedNode.y;
 			} else {
 			//Set state vars for drag and drop of the whole tree (clicked on empty space)
 				for(var i=0; i<allNodes.length; i++){
 					allNodes[i].oldx = allNodes[i].x;
 					allNodes[i].oldy = allNodes[i].y;
					allNodes[i].oldwidth = allNodes[i].width;
 					allNodes[i].oldheight = allNodes[i].height;
 				}
 			 	difx = p.mouseX;
 				dify = p.mouseY;
 			}
			return;		
		}
 		
	}
	
	//Handle dragging
	p.mouseDragged = function(){
  		if(p.mouseButton == p.LEFT){
  			mouseMoved = true;
  			if(clickedNode != null){	//dragging on the node - move the node
  				clickedNode.x = p.mouseX-difx; 
    			clickedNode.y = p.mouseY-dify;
  			} else {					//dragging on the empty space - panning
  				for(var i=0; i<allNodes.length; i++){
  					allNodes[i].x = allNodes[i].oldx + p.mouseX - difx;
  					allNodes[i].y = allNodes[i].oldy + p.mouseY - dify;
  				}
  			}
  		} else if(p.mouseButton == p.RIGHT){
  			mouseMoved = true;
  			if(clickedNode != null){
  				clickedNode.x = p.mouseX-difx; 
    			clickedNode.y = p.mouseY-dify;
  			} else {
				//p.pushMatrix();
				// zooming only refers to the difference in y-axis 				
				zoomLevel = 1.0 + (p.mouseY - dify) / 2000.0;
				
				//zoomLevel = p.constrain(zoomLevel, -2.5, 2.5);
				//alert(zoomLevel);
				
  				for(var i=0; i<allNodes.length; i++){
  					allNodes[i].x = allNodes[i].oldx * zoomLevel;//p.mouseX - difx;
  					allNodes[i].y = allNodes[i].oldy * zoomLevel;//p.mouseY - dify;
  					allNodes[i].oldx = allNodes[i].x;
  					allNodes[i].oldy = allNodes[i].y;					
					allNodes[i].width = allNodes[i].oldwidth * zoomLevel;
					allNodes[i].height = allNodes[i].oldheight * zoomLevel;		
  					allNodes[i].oldwidth = allNodes[i].width;
  					allNodes[i].oldheight = allNodes[i].height;								
					//p.rect(allNodes[i].x, allNodes[i].y, allNodes[i].width, allNodes[i].height);
					
					p.scale(zoomLevel);
					difx = p.mouseX;
					dify = p.mouseY;
					

					//p.translate(-zoomLevel, -zoomLevel);
  				}	
				//p.popMatrix();				
//				if(mousePressed) { 
//				  sval += 0.005; 
//				} 
//				else {
//				  sval -= 0.01; 
//				}
//				zoomLevel = p.mouseY - dify;	// zooming only refers to the difference in y-axis 				
//				zoomLevel = p.constrain(zoomLevel, 1.0, 2.5);
//				p.translate(width + zoomLevel, height + zoomLevel);
//				p.scale(zoomLevel);
				//alert(zoomLevel);
//				nmx = nmx + (mouseX-nmx)/20; 
//  			nmy += (mouseY-nmy)/20; 
//				translate(width/2 + nmx * zoomLevel-100, height/2 + nmy*zoomLevel - 200, -50);
				//p.translate(width/2 + zoomLevel-100, height/2 + zoomLevel - 200, -50);

  			}
  		}
	}


	p.mouseReleased = function(){
		//If mouse has not moved since mousedown, expand/collapse tree
		if(!mouseMoved){
			if (p.mouseButton == p.LEFT){
				clickedNode = null;
				//Determine which node is clicked on
	 			for(var i=0; i<allNodes.length; i++){
	 				if(p.mouseX >= allNodes[i].x-allNodes[i].width/2 && p.mouseX <= allNodes[i].x+allNodes[i].width/2 
	 					&& p.mouseY >= allNodes[i].y-allNodes[i].height/2 && p.mouseY <= allNodes[i].y+allNodes[i].height/2){
	 					clickedNode = allNodes[i];
	 					break;
	 				}
	 			}	 		
	 			if(clickedNode == null){
	 				return;
	 			}
	 		
	 			//Expand or collapse
	 			if(clickedNode.expanded){
	 				clickedNode.expanded = false;
	 				collapseNode(clickedNode);
	 			} else {
	 				clickedNode.expanded = true;
	 				expandNode(clickedNode);
	 			}
	 		
	 			//Calculate appropriate locations for newly expanded nodes
	 			var depth = maxDepth();
	 			var xpivot = depth/2;
	 			var ypivot = (clickedNode.children.length - 1) / 2;
	 			var yspacing = 200;
	 			for(var i=0; i<clickedNode.depth; i++){
	 				yspacing = yspacing / 1.5;
	 			}
	 		
	 			for(var i=0; i<clickedNode.children.length; i++){
	 				//Don't automatically position nodes if it's already been moved
	 				if(!clickedNode.children[i].moved){
	 					clickedNode.children[i].x = clickedNode.x + 140;
	 					clickedNode.children[i].y = clickedNode.y + ((i - ypivot) * yspacing);
	 					clickedNode.children[i].moved = true;
	 				}
	 			}
			} else if (p.mouseButton == p.RIGHT){
		
				//p.link(clickedNode.url, "_new");	
				openNewWindow(clickedNode.url); 								
			}	
		} else if (mouseMoved){
			
				
					
		}
		
		mouseMoved = false;
		beingDragged = null;
  		clickedNode = null;
	}
	
	p.init();
	
}