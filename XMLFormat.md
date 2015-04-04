#XML file format description

# Introduction #

Treeview is represented in an XML file. Each node in a tree is represented as a 'node' tag. Each node element consists of three tags.

  * label: node description (shown as the node text)
  * url: URL linked to the node
  * children: 0 or more nodes


# Example #

```
<?xml version="1.0" encoding="ISO-8859-1"?>
<node>
	<label><![CDATA[Stanford CS]]></label>
	<url><![CDATA[http://cs.stanford.edu/]]></url>
	<children>
		<node>
			<label><![CDATA[Courses]]></label>
			<url><![CDATA[http://cs.stanford.edu/courses/]]></url>
			<children>
				<node>
					<label><![CDATA[Autumn 2008-2009]]></label>
					<url><![CDATA[http://cs.stanford.edu/courses/schedules/2008-2009.autumn.php]]></url>
					<children></children>
				</node>		
			
			</children>
		</node>
	</children>
</node>
```