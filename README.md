*Polymeria* UML
========

*Polymeria* UML is a set of [Polymer](https://www.polymer-project.org/) [Web components](http://www.w3.org/TR/custom-elements/) inspired by the [Eclipse UML2](http://www.eclipse.org/modeling/mdt/?project=uml2) model file.


Here is the source of an HTML document of a basic class diagram:

    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="http://bdulac.github.io/polymeria/components/webcomponentsjs/webcomponents.js">
      </script>
      <link rel="import" href="http://bdulac.github.io/polymeria/components/polymeria-uml/uml-polymeria.html">
    </head>
    <body unresolved>
      <uml-model name="My model">
        <uml-packagedElement type="uml-Class" name="MyClass" id="my-class">
          <uml-ownedAttribute
            name="myAttribute"
            visibility="private"
            type="my-other-class">
          </uml-ownedAttribute>
          <uml-ownedOperation
            name="myOperation"
            visibility="protected"
            type="my-other-class">
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
        <uml-packagedElement type="uml-Class" name="MyOtherClass" id="my-other-class">
          <uml-ownedOperation
            name="myOperationWithParameters"
            visibility="public"
            type="my-class">
            <uml-ownedParameter name="myFirstParam" type="my-class">
            </uml-ownedParameter>
            <uml-ownedParameter name="mySecondParam" type="my-class">
            </uml-ownedParameter>
          </uml-ownedOperation>
        </uml-packagedElement>
        <uml-packagedElement type="uml-Class" name="MyAssociatedClass" id="my-associated-class">
        </uml-packagedElement>
        <uml-packagedElement
          type="uml-Dependency"
          client="my-associated-class"
          supplier="my-other-class">
        </uml-packagedElement>
      </uml-model>
    </body>
    </html>

To get the result, you should [have a look here](http://bdulac.github.io/polymeria/sample/general/) (sorry, but rendering web components in the *README* file is quite challenging).

The project is a work in progress but should evolve soon to provide a respectful support of the class diagram.

[A variation of this sample](http://bdulac.github.io/sample/polymeria) shows the modifications between the initial Eclipse UML2 model and the web components.

The project started following my [discovery of the Polymer project](http://bdulac.github.io/note/web-components-polymer). A [post on my blog](http://bdulac.github.io/note/web-components-adaptation-xml-document) details my early problems.

Because of custom elements compatibility constraints (dash needed), the model file cannot respect strictly the Eclipse UML element names. Another limitation is the use of namespaces in regular HTML documents. As a consequence, the *uml* namespace sequence using a colon is replaced with a prefix followed by a dash. As shown in the preceding example, this has a direct consequence on elements and attributes names.

Installation with bower
--------

If you want to play with the components, the installation with *[Bower](https://bower.io/)* is rather simple.

The first step is to install *[npm](https://www.npmjs.com/)*,  a *JavaScript* package manager. [Here](https://nodejs.org/en/download/) is the download page for common environments. A [debian package](https://packages.debian.org/sid/npm) is available, with *Ubuntu*:
```
sudo apt-get install npm
```

Then the install of *Bower* with *npm* is done the following way:
```
npm install -g bower
```

When the bower command is available, here is the way to get Polymeria from the GitHub repository:
```
bower install polymeria-uml
```

Download
--------

A directly usable *Zip* file including *Polymeria UML* and its *Bower* dependencies is available [here](http://bdulac.github.io/polymeria/polymeria_0.0.5.zip).

Components documentation
--------

The *Polymeria* components documentation is available [here](http://bdulac.github.io/polymeria/components/polymeria-uml/).