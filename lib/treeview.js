//Global state variables
var xmlDoc;
//var boxHeight = 30;
//var boxWidth = 80;
//var canvasHeight = window.innerHeight-25;
//var canvasWidth = window.innerWidth-25;
var treeWidths = new Array();
var allNodes = new Array();
var root = new Object();
var clickedNode;
var currentClickedNode;
var difx = 0;
var dify = 0;
var beingDragged = null;
var mouseMoved = false;

var zoomLevel = 1.0;

var canvas;
var p;
// for cursor type maintenance
//var oldCursor = "default";
var cursorState = 1;
	
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
	
	element.width = getNodeWidth();
	element.height = getNodeHeight();
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
function saveImage(filename) {
  	p.save(filename);
	alert(filename + " saved successfully.");
}

	
//Set the cursor based on mouse pointer location
function setCursor(state){	
	if (cursorState == 4) { // dragging now, do not change the cursor unless unlock entered
		if (state != 5)
			return;	
	}	

	if (state == 0)
		cursorState = 1;
	else
		cursorState = state;

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
		//canvas.style.cursor = "move";
	} else if (cursorState == 3) {
		canvas.style.cursor = "pointer";
	} else if (cursorState == 4) {		// enable dragging cursor lock
		canvas.style.cursor = "move";
	} else if (cursorState == 5) {		// disable dragging cursor lock
		canvas.style.cursor = "default";
	} 				
}
	
//Get appropriate text size for the current node	
function getTextSize(node){
	//node.x
	//node.y
	//node.width
	return (node.height / 2);
}
	
function zoom(){
	p.pushMatrix();

	// zooming only refers to the difference in y-axis 				
	zoomLevel = 1.0 + (p.mouseY - dify) / 1000.0;
	
	for(var i=0; i<allNodes.length; i++){
		allNodes[i].x = allNodes[i].oldx * zoomLevel;//p.mouseX - difx;
		allNodes[i].y = allNodes[i].oldy * zoomLevel;//p.mouseY - dify;
		allNodes[i].oldx = allNodes[i].x;
		allNodes[i].oldy = allNodes[i].y;					
		allNodes[i].width = allNodes[i].oldwidth * zoomLevel;
		allNodes[i].height = allNodes[i].oldheight * zoomLevel;		
		allNodes[i].oldwidth = allNodes[i].width;
		allNodes[i].oldheight = allNodes[i].height;								
	
		p.scale(zoomLevel);
		difx = p.mouseX;
		dify = p.mouseY;

	}	
	p.popMatrix();		
}	

//Main function - called from HTML
function displayTree(xmlFile, width, height){
	if (width != undefined)
		setCanvasWidth(width);
	if (height != undefined)
		setCanvasHeight(height);
	parseXML(xmlFile);
	root = xmlDoc.documentElement;
	
	//Build the object tree
	createObjects(root, 0);
	
	//Set root node visible
	root.visible = true;
	root.x = getCanvasWidth()/4;
	root.y = getCanvasHeight()/2;
	
	canvas = document.getElementById("canvas");
	p = Processing(canvas);
	
	//Processing init function
	p.setup = function(){
		p.size(width, height);
		p.colorMode(p.RGB, 256);
		//p.background(200, 255, 255);
		//p.background(getCanvasColor());
		p.stroke(0, 0, 0);
		p.rectMode(p.CENTER);
  		p.smooth();
  		//p.textSize(14);
		
		var myFont = p.loadFont(getNodeFontType(), 10);
  		p.textFont(myFont);
		p.textAlign(p.CENTER);		
	};
	
	//Main draw loop
	p.draw = function(){
		p.background(getCanvasColor());
		display(root);
		setCursor(0);
		//if (isExpanded())
		//	expandNode(root);
	}

	
	//Recursively called to display appropriate nodes and link them with lines
	//Also handles mouseover color change and dragging color change
	function display(node){
		if(node.visible){
			if(beingDragged != null && node == beingDragged){
				p.fill(getActiveColor());
			} else if(p.mouseX >= node.x-node.width/2 && p.mouseX <= node.x+node.width/2 
 				&& p.mouseY >= node.y-node.height/2 && p.mouseY <= node.y+node.height/2){
				if (currentClickedNode == node)
					p.fill(getSelectedColor());
				else
					p.fill(getHoverColor());	
					document.getElementById('show_label').innerHTML = node.label;
					document.getElementById('show_url').innerHTML = node.url;
					document.getElementById('show_url').href = node.url;
 			} else if (currentClickedNode == node){
				p.fill(getSelectedColor());		
				//document.getElementById('edit_label').value = node.label;
				//document.getElementById('edit_url').value = node.url;						
			} else{
 				p.fill(getNodeColor());
 			}
			
  			p.rect(node.x, node.y, node.width, node.height);
			p.fill(getNodeFontColor());
			
			// calculate text size based on the current size of the node
			var textSize = getTextSize(node);
			//alert(textSize);
			p.textSize(textSize);
			//var textWidth = p.textWidth(node.label);
			//alert(textWidth);
			p.text(node.label, node.x - node.width/2 + 5, node.y + 5);
  			//p.text(node.label, node.x-35, node.y+5);
  			
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
				currentClickedNode = clickedNode;
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
				
				setCursor(4);
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
  			} else {	// Zoom
				zoom();
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
				document.getElementById('edit_label').value = clickedNode.label;
				document.getElementById('edit_url').value = clickedNode.url;				
				document.getElementById('edit_label').removeAttribute("disabled");
				document.getElementById('edit_url').removeAttribute("disabled");
			} else if (p.mouseButton == p.RIGHT){	
				if (clickedNode != null){
					document.getElementById('edit_label').value = clickedNode.label;
					document.getElementById('edit_url').value = clickedNode.url;					
					document.getElementById('edit_label').removeAttribute("disabled");
					document.getElementById('edit_url').removeAttribute("disabled");
					//saveImage("file://localhost/E:/Documents%20and%20Settings/My%20Documents/Aptana%20Studio/InteractiveTreeview/test.png");
					//p.link(clickedNode.url, "_new");	
					openNewWindow(clickedNode.url); 													
				}
			}	
		} else if (mouseMoved){
			if (p.mouseButton == p.LEFT) {
				clickedNode = null;
				//Determine which node is clicked on
				for (var i = 0; i < allNodes.length; i++) {
					if (p.mouseX >= allNodes[i].x - allNodes[i].width / 2 && p.mouseX <= allNodes[i].x + allNodes[i].width / 2 &&
					p.mouseY >= allNodes[i].y - allNodes[i].height / 2 &&
					p.mouseY <= allNodes[i].y + allNodes[i].height / 2) {
						clickedNode = allNodes[i];
						break;
					}
				}
				if (clickedNode == null) {
					// dragging is finished, so back to default cursor
					setCursor(5);
					return;
				}
			}	
					
		}
		
		mouseMoved = false;
		beingDragged = null;
  		clickedNode = null;
	}
	
	p.init();
	
}

function updateNode (form) {
    alert(form.edit_label.value + " " + form.edit_url.value);
	if (currentClickedNode == null)
		return;
	currentClickedNode.label = form.edit_label.value;
	currentClickedNode.url = form.edit_url.value;
}


// CUSTOMIZATION ACCESSOR FUNCTIONS
// User-customizable variables all begin with 'user' prefix.
//	- expanded / collapsed
//	- Canvas size & background color
//	- Node color, Hover color, Active color, and Selected color
//	- Node size, node border, node font
	
// Default color scheme from Kuler
var user_isExpanded = true;	// true or false
var user_canvasColor = "#FCFAE1";
var user_canvasWidth = "600";
var user_canvasHeight = "400";
var user_nodeColor = "#FFC0A9";
var user_nodeFontColor = "#000000";
var user_hoverColor = "#C8D686";
var user_activeColor = "#7D8A2E";
var user_selectedColor = "#FF8598";
var user_nodeWidth = 80;
var user_nodeHeight = 30;
var user_nodeBorder = 0;
var user_nodeFontType = "Verdana";

function isExpanded(){
	return user_isExpanded;	
}

function setIsExpanded(input){
	user_isExpanded = input;
}

function getCanvasColor(){
	return user_canvasColor;
}

function setCanvasColor(input){
	return user_canvasColor = input;
}

function getCanvasWidth(){
	return user_canvasWidth;
}

function setCanvasWidth(input){
	return user_canvasWidth = input;
}

function getCanvasHeight(){
	return user_canvasHeight;
}

function setCanvasHeight(input){
	return user_canvasHeight = input;
}

function getNodeColor(){
	return user_nodeColor;
}

function setNodeColor(input){
	return user_nodeColor = input;
}

function getNodeFontColor(){
	return user_nodeFontColor;
}

function setNodeFontColor(input){
	return user_nodeFontColor = input;
}

function getHoverColor(){
	return user_hoverColor;
}

function setHoverColor(input){
	return user_hoverColor = input;
}
function getActiveColor(){
	return user_activeColor;
}

function setActiveColor(input){
	return user_activeColor = input;
}
function getSelectedColor(){
	return user_selectedColor;
}

function setSelectedColor(input){
	return user_selectedColor = input;
}

function getNodeWidth(){
	return user_nodeWidth;
}

function setNodeWidth(input){
	return user_nodeWidth = input;
}

function getNodeHeight(){
	return user_nodeHeight;
}

function setNodeHeight(input){
	return user_nodeHeight = input;
}

function getNodeBorder(){
	return user_nodeBorder;
}

function setNodeBorder(input){
	return user_nodeBorder = input;
}

function getNodeFontType(){
	return user_nodeFontType;
}

function setNodeFontType(input){
	return user_nodeFontType = input;
}