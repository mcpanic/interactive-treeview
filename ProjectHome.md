We’ve all seen and become second-naturedly familiar with the typical DHTML tree-view navigation found in many existing web applications, exemplified by http://www.treeview.net/. This typical tree-view allows the user to expand and collapse nodes in a practical and familiar, but very limited manner. These traditional tree-views are used primarily for navigation around a website, whether it’s within a navigation sidebar or a site map, which hardly anybody uses. However, in today’s Web 2.0 world emphasizing dynamic and rich user interactions with web pages, the traditional 1990s rudimentary tree-view is well overdue for an upgrade.

Motivated by existing tree-view interactions, Highly Interactive Tree-view was designed to provide more interactions and direct manipulation features as well as on-the-fly editing of the tree (Screenshot shown on the right). In order to visualize the tree in more interactive way, pixel-level access to the HTML element is necessary, since we do not want any external plugins installed to interact with the tree. The tree-view is built on the HTML canvas element, which has recently become standardized. Traditional HTML rendering lacked support for pixel-level access, but the canvas changes that completely. With the help of canvas element, Highly Interactive Tree-view provides a means for advanced desktop-like drawing and animations inside your browser window without the need for plugins such as Flash or SilverLight.

Our tree provides the following features new to the realm of tree-views:

  * Fundamental expanding/collapsing of nodes
  * Parses an input XML file used to populate the data of the tree
  * Every node in the tree is draggable around the page arbitrarily.
  * Node size dynamically adjusted to fit the amount of the node label
  * Real-time connection line-rendering between parent and child nodes
  * Visual cues as to which nodes are expandable and which are leaves
  * Cursor changes depending on context - e.g. 4-way arrows for drag and drop, zooming indicator when tree is being zoomed, and hand on mouse hover
  * Zooming and panning of the entire tree
  * Overloaded mouse-click functionality
    * Static left-click expands and collapses a node.
    * Left-click and drag moves a node or pans the entire canvas.
    * Static right-click on the node opens a URL associated with the node.
    * Static right-click on the empty space fits the tree within the current canvas size.
    * Right-click and drag zooms in or out on the entire tree (up zooms in, down zooms out)
  * A supplementary section displays the relevant data from each node in the XML input file

This new style of a tree-view is very well suited for a novel way of navigation within a web application. The fact that each node can store any kind of text information as well as links or URL, it can replace lists and categories that are link-based. It is flexibly applicable for managing interactive bookmarks, a sitemap, or table of contents for HTML tutorials. Finally, it can certainly be used for generic tree displays of arbitrary data and linkage, such as DOM tree or hierarchical diagram.

http://interactive-treeview.googlecode.com/files/treeview.PNG