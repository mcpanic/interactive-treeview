#How can you use treeview in your web application?

# Introduction #
First, you need to download two Javascript files.
  * [processing.js](http://ejohn.org/apps/processing.js/processing.js)
  * [treeview.js](http://code.google.com/p/interactive-treeview/source/browse/trunk/lib/treeview.js)

# Adding Treeview #
This highly-interactive tree-view is very simple to reuse. All that is required is to include the required JavaScript files, the address of an input XML file with the appropriate schema, an empty canvas element inside an arbitrary HTML page, and make a call to the displayTree() method. For instance, the following complete HTML page displays the basic treeview:

```
<html>
<head>
<script type="text/javascript" src="lib/processing.js"></script>
<script type="text/javascript" src="lib/treeview.js"></script>
</head>

<body onload="displayTree('data.xml', window.innerWidth-200, window.innerHeight-200)">
	<canvas id="canvas"></canvas>
</body>
</html>
```

Because this interaction is entirely JavaScript based, essentially any existing web framework ranging from other JavaScript libraries to full web application frameworks such as Rails can use it right out of the box.

If you want to customize the tree, you can use the API functions to change the design of the tree.
```
function loadTree(){
        setActiveColor("#D1A925");
	setCanvasColor("#FFFAE4");
	setNodeColor("#40637D");
	setNodeFontType("Calibri");
	setFontColor("#FFFFFF");
	setSelectedColor("#26393D");
	setHoverColor("#D1A925");
	setLineColor("#26393D");
	setBorderColor("#26393D");
	setHasBorder(false);
	setIsExpanded(true);
	displayTree('data.xml', 900, 500);		
}
```

Then simply call this function on the onload event in the body of the HTML.
```
        <body onload="loadTree()">
```