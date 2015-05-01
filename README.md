*Polymeria* UML
========

*Polymeria* UML is a set of [Polymer](https://www.polymer-project.org/) [Web components](http://www.w3.org/TR/custom-elements/) inspired by the [Eclipse UML2](http://www.eclipse.org/modeling/mdt/?project=uml2) model file. 


Here is the source of an HTML document of a basic class diagram:

``<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="http://bdulac.github.io/polymeria/components/webcomponentsjs/webcomponents.js">
  </script>
  <link rel="import" href="http://bdulac.github.io/polymeria/components/polymeria-uml/uml-polymeria.html">
</head>
<body unresolved>
  <uml-model name="My model">
    <uml-packagedElement type="uml-Class" name="MyClass">
      <uml-ownedAttribute 
        name="myAttribute" 
        visibility="private"
        type="test">
      </uml-ownedAttribute>
      <uml-ownedOperation 
        name="myOperation" 
        visibility="protected"
        type="test">
      </uml-ownedOperation>
    </uml-packagedElement>
    <uml-packagedElement type="uml-Package" name="My package">
      <uml-packagedElement type="uml-Package" name="My nested package">
      </uml-packagedElement>
      <uml-packagedElement type="uml-Class" name="MyPackageClass">
        <uml-packagedElement type="uml-Class" name="MyNestedClass">
        </uml-packagedElement>
      </uml-packagedElement>
    </uml-packagedElement>
    <uml-packagedElement type="uml-Class" name="MyOtherClass" id="test">
      <uml-ownedOperation
        name="myOperationWithParameters" 
        visibility="public"
        type="My model:MyClass">
        <uml-ownedParameter name="myFirstParam" type="My model:MyClass">
        </uml-ownedParameter>
        <uml-ownedParameter name="mySecondParam" type="My model:MyClass">
        </uml-ownedParameter>
      </uml-ownedOperation>
    </uml-packagedElement>
    <uml-packagedElement type="uml-Class" name="MyAssociatedClass" id="test2">
    </uml-packagedElement>
    <uml-packagedElement 
      type="uml-Dependency" 
      client="test2"
      supplier="test">
    </uml-packagedElement>
  </uml-model>
</body>
</html>``

To get the result, you should [have a look here](http://bdulac.github.io/polymeria/sample/general/) as rendering web components in the *README* file is quite challenging.

The project is a work in progress but should evolve soon to provide a respectful support of classes diagrams.

[A variation of this sample](http://bdulac.github.io/sample/polymeria) is available and shows the modifications between the initial Eclipse UML2 model and the web components. If you want to play with the components, the [installation with Bower is documented](http://bdulac.github.io/polymeria/installation/) in the GitHub pages.

Because of custom elements compatibility constraints (dash needed), the model file cannot respect strictly the Eclipse UML element names. 

The project started following my [discovery of the Polymer project](http://bdulac.github.io/note/web-components-polymer). A [post on my blog](http://bdulac.github.io/note/web-components-adapation-xml-document) details my early problems.
