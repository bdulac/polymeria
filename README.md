*Polymeria* UML
========

*Polymeria* UML is a set of [Polymer](https://www.polymer-project.org/) [Web components](http://www.w3.org/TR/custom-elements/) inspired by the [Eclipse UML2](http://www.eclipse.org/modeling/mdt/?project=uml2) model file. 


Here is the source of an HTML document of a basic class diagram:

<code><!DOCTYPE html>
<html>
<head>
&nbsp;&nbsp;<meta charset="UTF-8">
&nbsp;&nbsp;<script src="http://bdulac.github.io/polymeria/components/webcomponentsjs/webcomponents.js">
&nbsp;&nbsp;</script>
&nbsp;&nbsp;<link rel="import" href="http://bdulac.github.io/polymeria/components/polymeria-uml/uml-polymeria.html">
</head>
<body unresolved>
&nbsp;&nbsp;<uml-model name="My model">
&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Class" name="MyClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-ownedAttribute 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name="myAttribute" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visibility="private"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="test">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-ownedAttribute>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-ownedOperation 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name="myOperation" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visibility="protected"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="test">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-ownedOperation>
&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Package" name="My package">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Package" name="My nested package">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Class" name="MyPackageClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Class" name="MyNestedClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Class" name="MyOtherClass" id="test">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-ownedOperation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name="myOperationWithParameters" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visibility="public"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="My model:MyClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-ownedParameter name="myFirstParam" type="My model:MyClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-ownedParameter>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<uml-ownedParameter name="mySecondParam" type="My model:MyClass">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-ownedParameter>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</uml-ownedOperation>
&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement type="uml-Class" name="MyAssociatedClass" id="test2">
&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;&nbsp;&nbsp;<uml-packagedElement 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type="uml-Dependency" 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;client="test2"
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;supplier="test">
&nbsp;&nbsp;&nbsp;&nbsp;</uml-packagedElement>
&nbsp;&nbsp;</uml-model>
</body>
</html></code>

To get the result, you should [have a look here](http://bdulac.github.io/polymeria/sample/general/) as rendering web components in the *README* file is quite challenging.

The project is a work in progress but should evolve soon to provide a respectful support of classes diagrams.

[A variation of this sample](http://bdulac.github.io/sample/polymeria) is available and shows the modifications between the initial Eclipse UML2 model and the web components. If you want to play with the components, the [installation with Bower is documented](http://bdulac.github.io/polymeria/installation/) in the GitHub pages.

Because of custom elements compatibility constraints (dash needed), the model file cannot respect strictly the Eclipse UML element names. 

The project started following my [discovery of the Polymer project](http://bdulac.github.io/note/web-components-polymer). A [post on my blog](http://bdulac.github.io/note/web-components-adapation-xml-document) details my early problems.