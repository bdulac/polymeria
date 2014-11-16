<!doctype html>
<html>
<head>
  <script src="polymer/platform/platform.js">
  </script>
  <link rel="import" href="components/polymeria-packagedElement.html">
  <link rel="import" href="components/polymeria-ownedAttribute.html">
  <link rel="import" href="components/polymeria-ownedOperation.html">
  <style>
html,body {
  height: 100%;
  margin: 0;
  background-color: #E5E5E5;
}
  </style>
</head>
<body unresolved>
Polymeria
========

Polymeria is a set of [Polymer](https://www.polymer-project.org/) [Web components](http://www.w3.org/TR/custom-elements/) for rendering an [Eclipse UML2](http://www.eclipse.org/modeling/mdt/?project=uml2) model file. Because of custom elements compatibility constraints, the model file cannot be rendered without a transformation of names.
<pre>
<uml:Model xmi:version="20131001" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="_gajMIF7MEeSa4sJ83GIR5A" name="org.test">
  <polymeria-packagedElement type="uml:Class" xmi:id="_gajMIV7MEeSa4sJ83GIR5A" name="LudeImpl">
    <polymeria-ownedAttribute xmi:id="_gajMIl7MEeSa4sJ83GIR5A" name="myAttribute" visibility="private" type="_gajzMV7MEeSa4sJ83GIR5A"/>
    <polymeria-ownedOperation xmi:id="_gajMI17MEeSa4sJ83GIR5A" name="getMyAttribute" visibility="public">
      <ownedParameter xmi:id="_gajMJF7MEeSa4sJ83GIR5A" type="_gajzMV7MEeSa4sJ83GIR5A" direction="return"/>
    </polymeria-ownedOperation>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Package" xmi:id="_gajzMF7MEeSa4sJ83GIR5A" name="Primitive types" visibility="private">
    <polymeria-packagedElement type="uml:Class" xmi:id="_gajzMV7MEeSa4sJ83GIR5A" name="java.lang.String" visibility="package"/>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Class" xmi:id="_gajzMl7MEeSa4sJ83GIR5A" name="Interlude">
    <polymeria-ownedOperation xmi:id="_gajzM17MEeSa4sJ83GIR5A" name="getMyAttribute" visibility="public">
      <ownedParameter xmi:id="_gajzNF7MEeSa4sJ83GIR5A" type="_gajzMV7MEeSa4sJ83GIR5A" direction="return"/>
    </polymeria-ownedOperation>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Realization" xmi:id="_NP8jAF7NEeSa4sJ83GIR5A" client="_gajzMl7MEeSa4sJ83GIR5A _gajMIV7MEeSa4sJ83GIR5A"/>
</uml:Model>
</pre>
<p>
Here is the result:
</p>
<uml:Model xmi:version="20131001" xmlns:xmi="http://www.omg.org/spec/XMI/20131001" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="_gajMIF7MEeSa4sJ83GIR5A" name="org.test">
  <polymeria-packagedElement type="uml:Class" xmi:id="_gajMIV7MEeSa4sJ83GIR5A" name="LudeImpl">
    <polymeria-ownedAttribute xmi:id="_gajMIl7MEeSa4sJ83GIR5A" name="myAttribute" visibility="private" type="_gajzMV7MEeSa4sJ83GIR5A"/>
    <polymeria-ownedOperation xmi:id="_gajMI17MEeSa4sJ83GIR5A" name="getMyAttribute" visibility="public">
      <ownedParameter xmi:id="_gajMJF7MEeSa4sJ83GIR5A" type="_gajzMV7MEeSa4sJ83GIR5A" direction="return"/>
    </polymeria-ownedOperation>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Package" xmi:id="_gajzMF7MEeSa4sJ83GIR5A" name="Primitive types" visibility="private">
    <polymeria-packagedElement type="uml:Class" xmi:id="_gajzMV7MEeSa4sJ83GIR5A" name="java.lang.String" visibility="package"/>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Class" xmi:id="_gajzMl7MEeSa4sJ83GIR5A" name="Interlude">
    <polymeria-ownedOperation xmi:id="_gajzM17MEeSa4sJ83GIR5A" name="getMyAttribute" visibility="public">
      <ownedParameter xmi:id="_gajzNF7MEeSa4sJ83GIR5A" type="_gajzMV7MEeSa4sJ83GIR5A" direction="return"/>
    </polymeria-ownedOperation>
  </polymeria-packagedElement>
  <polymeria-packagedElement type="uml:Realization" xmi:id="_NP8jAF7NEeSa4sJ83GIR5A" client="_gajzMl7MEeSa4sJ83GIR5A _gajMIV7MEeSa4sJ83GIR5A"/>
</uml:Model>
</body>
</html>



