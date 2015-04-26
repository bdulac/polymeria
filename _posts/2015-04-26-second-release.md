--- 
layout: post 
title: Second release
---
<p>
The second release is available. Here are the main features:
</p>
<ul>
  <li>A basic support of relationships with dependencies displayed as straight lines</li>
  <li>A display of attribute types, methods return types and parameters types</li>
  <li>An absolute positioning of classes and packages with two <em>x</em> and <em>y</em> attributes accepting css like values</li>
</ul>
<p>
The release is available via a <em>bower</em> install. To upgrade from the previous release, simply:
</p>
<pre>bower update</pre>
<p>
Here is a sample <em>html</em> file introducing the features:
</p>
<pre>&lt;!DOCTYPE html&gt;&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;script src="bower_components/webcomponentsjs/webcomponents.js"&gt;
  &lt;/script&gt;
  &lt;link rel="import" href="bower_components/polymeria-uml/uml-polymeria.html"&gt;
&lt;/head&gt;
&lt;body unresolved&gt;
  &lt;uml-model name="My model"&gt;
    &lt;uml-packagedElement type="uml-Class" name="MyClass" id="test"&gt;
      &lt;uml-ownedAttribute name="myAttribute" visibility="private" type="test2" x="25px" y="50px"&gt;
      &lt;/uml-ownedAttribute&gt;
      &lt;uml-ownedOperation name="myOperation" visibility="protected"&gt;
        &lt;uml-ownedParameter name="myFirstParam"&gt;
        &lt;/uml-ownedParameter&gt;
        &lt;uml-ownedParameter name="mySecondParam" type="test2"&gt;
        &lt;/uml-ownedParameter&gt;
      &lt;/uml-ownedOperation&gt;
    &lt;/uml-packagedElement&gt;
    &lt;uml-packagedElement type="uml-Class" name="MyAssociatedClass" id="test2" x="450px" y="350px"&gt;
    &lt;uml-packagedElement&gt;
    &lt;uml-packagedElement type="uml-Dependency" supplier="test" client="test2"&gt;
    &lt;uml-packagedElement&gt;
  &lt;/uml-model&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>