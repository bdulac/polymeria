---
layout: post
title: Installation
---
<p>
<em>Polymeria</em> UML is easy to install as a <em>Bower</em> package.
</p>
<p>
As an introduction, the first step to get <em>Bower</em> is to install <a target="_blank" href="https://www.npmjs.com/">npm</a>, a <em>Javascript</em> package manager. <a target="_blank" href="http://nodejs.org/download/">Here</a> is the download page for common environments. A <a href="https://packages.debian.org/sid/npm"><em>Debian</em> package</a> is available, with <em>Ubuntu</em>:
</p>
<pre>sudo apt-get install npm</pre>
<p>
Then the install of <em>Bower</em> with npm is done the following way:
</p>
<pre>npm install -g bower</pre>
<p>
When the bower command is available, here is the way to get <em>Polymeria</em> from the GitHub repository:
</p>
<pre>bower install polymeria-uml</pre>
<p>
To define <em>Polymeria</em> UML elements, there is only the need to load the polyfill and to import the components: a single import helps to do so. The components depend on jQueryUI. As it is a dependency, if you wish to setup web components directly from the <em>bower_components</em> directory, the head tag is quite concise. Here is a sample document including a simple model:
</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;script src="bower_components/webcomponentsjs/webcomponents.js"&gt;
  &lt;/script&gt;
  &lt;link rel="import" href="bower_components/polymeria-uml/uml-polymeria.html"&gt;
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
<p>
Using directly the  resources in the <em>bower_components</em> directory is easy and appropriate for development. If you wish to copy the dependencies in your project, these should be in a same folder to preserve the relative URIs. Here are the required sub-directories of <em>bower_components</em>:
</p>
<ul>
  <li>webcomponentsjs</li>
  <li>jquery</li>
  <li>jquery-ui</li>
  <li>polymer</li>
  <li>polymeria</li>
</ul>
<p>
<em>Polymeria</em> depends on <em>jQuery</em>, <em>jQueryUI</em> and <em>Polymer</em>. There is no need to add a direct reference to these frameworks in your HTML document.  The <em>Polymeria</em> import and the <em>webcomponents.js</em> script are the only requirements for the UML elements to be rendered. <em>webcomponents.js</em> is a polyfill providing support for Web Components in non-compliant browsers, it should become legacy with a better support of this growing standard.
</p>