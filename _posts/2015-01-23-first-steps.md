--- 
layout: post 
title: First steps
--- 
<p>
Enabling drag'n drop wasn't obvious for a <em>Java</em> developer not really familiar with <em>Javascript</em>. The next step will be far more challenging: connecting UML elements to represent associations.
</p>
<p>
At first glance it seems simple: a few libraries do the job, <a target="_blank" href="https://jsplumbtoolkit.com/demo/flowchart/dom.html">one example</a> is really interesting. But all solutions require the assignation of <a target="_blank" href="http://www.w3.org/TR/html401/struct/global.html#h-7.5.2">HTML IDs</a> to UML elements.
</p>
<p>
These have to be <a target="_blank" href="http://www.w3.org/TR/WCAG20-TECHS/H93.html">unique in the Web page</a>. For such a result I choose to build a canonical name composed "recursively" by concatenation of the simple and the parent UML element canonical name: this seems a natural solution for a <em>Java</em> developer and could help further operations on the DOM.
</p>
<p>
I have <a href="https://pascalprecht.github.io/2014/07/14/inheritance-and-composition-with-polymer/">a few hints</a>, some developers seem to have <a href="http://stackoverflow.com/questions/23945122/accessing-the-parent-context-of-a-web-component-being-either-dom-or-shadow-dom">already faced the question</a>. But I guess things will not be as obvious as I would like... 
</p>