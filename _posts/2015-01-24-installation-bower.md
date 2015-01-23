--- 
layout: post 
title: Installation
--- 
<p>
As an introduction, to get bower, the first step is to install <a target="_blank" href="https://www.npmjs.com/">npm</a>, a Javascript package manager. For common environments, <a target="_blank" href="http://nodejs.org/download/">here</a> is the download page. With Ubuntu, a package is available:
</p>
<pre>sudo apt-get install npm</pre>
<p>
Installing bower with npm is done the following way:
</p>
<pre>npm install -g bower</pre>
<p>
When the bower command is available, here is the way to get <em>Polymeria</em> from the GitHub repository:
</p>
<pre>bower install https://github.com/bdulac/polymeria.git</pre>
<p>
To define only <em>Polymeria</em> elements, there is only the need to load the polyfill and to import the components: a single import helps to do so. The components depend on jQueryUI. As it is a dependency, if you wish to setup web components directly from there repository here is a sample code:
</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;script src="bower_components/webcomponentsjs/webcomponents.js"&gt;
  &lt;/script&gt;
  &lt;link rel="import" href="bower_components/polymeria/components/uml-polymeria.html"&gt;
&lt;/head&gt;
&lt;body unresolved&gt;
  &lt;uml-model name="My model"&gt;
    &lt;uml-packagedElement type="uml-Package" name="My package"&gt;
      &lt;uml-packagedElement type="uml-Class" name="MyClass"&gt;
        &lt;uml-ownedAttribute name="myAttribute" visibility="private"&gt;
        &lt;/uml-ownedAttribute&gt;
        &lt;uml-ownedOperation name="myOperation" visibility="protected"&gt;
          &lt;uml-ownedParameter name="myFirstParam"&gt;
          &lt;/uml-ownedParameter&gt;
          &lt;uml-ownedParameter name="mySecondParam"&gt;
          &lt;/uml-ownedParameter&gt;
        &lt;/uml-ownedOperation&gt;
      &lt;/uml-packagedElement&gt;
    &lt;/uml-packagedElement&gt;
  &lt;/uml-model&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>