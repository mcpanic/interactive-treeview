This page is an API reference for Interactive Treeview.

# API Reference #

## Tree-related API ##
### displayTree ###
  * display the tree in the canvas
  * arguments: (XML file, canvas width, canvas height)
  * return: none
### isExpanded ###
  * see if the tree is fully expanded
  * arguments: none
  * return: true / false
### setIsExpanded ###
  * set the default view of tree (expanded or collapsed
  * arguments: true (expanded) / false (collapsed)
  * return: none

## Canvas-related API ##
### getCanvasWidth ###
  * get the canvas width
  * arguments: none
  * return: width value (in pixels)
### setCanvasWidth ###
  * set the canvas width
  * arguments: width value (in pixels)
  * return: none
### getCanvasHeight ###
  * get the canvas height
  * arguments: none
  * return: height value
### setCanvasHeight ###
  * set the canvas height
  * arguments: height value (in pixels)
  * return: none
### getCanvasColor ###
  * get the canvas color
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setCanvasColor ###
  * set the canvas color
  * arguments: color value in hex (#xxxxxx)
  * return: none

## Font-related API ##
### getFontColor ###
  * get the font color
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setFontColor ###
  * set the font color
  * arguments: color value in hex (#xxxxxx)
  * return: none
### getNodeFontType ###
  * get the font type
  * arguments: font name (ex: "Verdana", "Arial")
  * return: none
### setNodeFontType ###
  * set the font type
  * arguments: none
  * return: font name (ex: "Verdana", "Arial")

## Node-related API ##
### getNodeWidth ###
  * get the node width
  * arguments: none
  * return: width value (in pixels)
### setNodeWidth ###
  * set the node width
  * arguments: width value (in pixels)
  * return: none
### getNodeHeight ###
  * get the node height
  * arguments: none
  * return: height value (in pixels)
### setNodeHeight ###
  * set the node height
  * arguments: height value (in pixels)
  * return: none
### getNodeColor ###
  * get the node color
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setNodeColor ###
  * set the node color
  * arguments: color value in hex (#xxxxxx)
  * return: none
### getHoverColor ###
  * get the color for the mouse hover event on the node
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setHoverColor ###
  * set the color for the mouse hover event on the node
  * arguments: color value in hex (#xxxxxx)
  * return: none
### getActiveColor ###
  * get the color for the mouse active event on the node
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setActiveColor ###
  * set the color for the mouse active event on the node
  * arguments: color value in hex (#xxxxxx)
  * return: none
### getSelectedColor ###
  * get the color for the selected node
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setSelectedColor ###
  * set the color for the selected node
  * arguments: color value in hex (#xxxxxx)
  * return: none
### getLineColor ###
  * get the color for the tree line
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setLineColor ###
  * set the color for the tree line
  * arguments: color value in hex (#xxxxxx)
  * return: none
### hasBorder ###
  * if the node has a border or not
  * arguments: none
  * return: true / false
### setHasBorder ###
  * set if the node has a border or not
  * arguments: true / false
  * return: none
### getBorderColor ###
  * get the border color of the node
  * arguments: none
  * return: color value in hex (#xxxxxx)
### setBorderColor ###
  * set the border color of the node
  * arguments: color value in hex (#xxxxxx)
  * return: none