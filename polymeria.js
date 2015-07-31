/**
 * Identifies the position of a DOM or Shadow DOM element
 * @param element
 * Element to identify the position of
 * @returns Object with two properties x and y (in CSS px)
 */
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

/**
 * Fetches the Web component related to a Shadow DOM node
 * @param shadowDomNode
 * Shadow DOM node
 * @returns Related Web component
 */
function getWebComponent(shadowDomNode) {
	var myNode = shadowDomNode;
	while(!myNode.host) {
		myNode = myNode.parentNode;
	}
	if(myNode.host) {
		var comp = myNode.host;
		return comp;
	}
}

/** 
 * Generates a valid GUID
 * (from http://stackoverflow.com/a/2117523/1207019)
 * @returns Generated GUID
 */
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

/**
 * Identifies a style value given a CSS selector
 * (from http://stackoverflow.com/a/16966533/1207019)
 * @param style
 * Style which value has to be identified
 * @param selector
 * CSS selector to access the style
 * @param sheet
 * Stylesheet to have a look at (optional: default looks in all the stylesheets)
 * @returns Value of the style found with the given selector
 */
function getStyleRuleValue(style, selector, sheet) {
    var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
    for (var i = 0, l = sheets.length; i < l; i++) {
        var sheet = sheets[i];
        if( !sheet.cssRules ) { continue; }
        for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
            var rule = sheet.cssRules[j];
            var ruleSelectorText = rule.selectorText;
            if (ruleSelectorText && ruleSelectorText.split(',').indexOf(selector) !== -1) {
                return rule.style[style];
            }
        }
    }
    return null;
}

/** 
 * Adaptation of a Web Component into an UML element
 * @param customElm
 * Web component to adapt
 */
function UmlElement(customElm) {
	// The adapted Web Component
	this.webComponent = customElm;
	// The UML element type is the Web Component element name 
	this.elementType = customElm.localName;
	// If we have a name attribute, 
	if(customElm.name) {
		// Then the simple name is the Web component name attribute
		this.simpleName = customElm.name;
	}
	else {
		// Else the simple name is a GUID
		this.simpleName = guid();
	}
	// If no ID is set on the Web Component, 
	if(!this.webComponent.id) {
		// Then the ID of the Web Component is the UML element qualified name
		this.webComponent.id = this.getQualifiedName();
		console.log("Default ID assigned [" + this.webComponent.id + "]");
	}
	// The UML element becomes an attribute of the Web Component
	this.webComponent.umlElement = this;
	this.moveListeners = [];
}
UmlElement.prototype = {
	notifyMoveListeners : function() {
		if(this.moveListeners) {
			// console.log(this.simpleName + " notifying " + this.moveListeners.length + " children...");
			for	(index = 0; index < this.moveListeners.length; index++) {
				var listener = this.moveListeners[index];
				if(listener.update) {
					listener.update();
				}
			}
		}
	},
	/** 
	 * Attaching another UML element as move listener of this UML element
	 * @param listener
	 * UML element to attach as move listener
	 */
	addMoveListener : function(listener) {
		// console.log( listener.simpleName + " listening to " + this.simpleName );
		if(this.moveListeners) {
			this.moveListeners[this.moveListeners.length] = listener; 
		}
		else {
			this.moveListeners = [listener];
		}
	},
	/** 
	 * Attaching another UML element as move listener of this UML element and 
	 * all the parent UML elements recursively
	 * @param listener
	 * UML element to attach as move listener
	 */
	addRecursiveMoveListener : function(listener) {
		// console.log( listener.simpleName + " listening to " + this.simpleName );
		if(this.moveListeners) {
			this.moveListeners[this.moveListeners.length] = listener; 
		}
		else {
			this.moveListeners = [listener];
		}
		// Attaching the parent as move listener
		var parentUmlElement = this.getParentElement();
		if(parentUmlElement) {
			parentUmlElement.addMoveListener(listener);
		}
	}, 
	/** 
	 * Resolves the parent UML element of the UML element
	 * @returns Parent UML element
	 */
	getParentElement : function() {
		var parentUmlElement;
		// Resolving the parent of the Web Component in the DOM
		var domParent = this.webComponent.parentNode;
		// The one we are looking for has an associated UML element
		while(
			(domParent)
			&& (!domParent.umlElement)
			&& (domParent.parentNode)
		) {
			domParent = domParent.parentNode;
		}
		if(
				(domParent)
				&&(domParent.name)
		) {
			parentUmlElement = domParent.umlElement;
		}
		return parentUmlElement;
	},
	initializePosition : function() {
		if(this.webComponent.y) {
			if(this.webComponent.$.element) {
				var elm = this.webComponent.$.element;
				var topPosition = this.webComponent.y;
				elm.style.position = "absolute";
				elm.style.top = topPosition;
			}
		}
		if(this.webComponent.x) {
			if(this.webComponent.$.element) {
				var elm = this.webComponent.$.element;
				var leftPosition = this.webComponent.x;
				elm.style.position = "absolute";
				elm.style.left = leftPosition;
			}
		}
	},
	/** 
	 * Resolves the qualified name of the UML element
	 * @returns Qualified name of the UML element. 
	 * This name is unique in the DOM because it is prefixed with the 
	 * model name.
	 */
	getQualifiedName : function() {
		var umlParent = this.getParentElement();
		if(umlParent) {
			// If the parent is the model itself,
			if(umlParent.elementType == 'uml-model') {
				// Then the model name is delimited in the qualified name
				return umlParent.simpleName + ':' + this.simpleName;
			}
			else {
				// Else we have the general case
				var parentQualified = umlParent.getQualifiedName();
				return parentQualified + '.' + this.simpleName;
			}
		}
		else {
			return this.simpleName;
		}
	}
}
/** 
 * Adaptation of a Web Component into an UML member element
 * @param customElm
 * Web component to adapt
 */
function UmlMember(customElm) {
	UmlElement.call(this, customElm);
}
UmlMember.prototype = Object.create(UmlElement.prototype, { 
	getQualifiedName : {
		value: function() {
			var umlParent = this.getParentElement();
			if(umlParent) {
				// If the parent is a classifier,
				if(umlParent.elementType == 'uml-packagedelement') {
					// Then the simple name is introduced by a sharp
					var parentQualified = umlParent.getQualifiedName();
					return parentQualified + '#' + this.simpleName;
				}
				else {
					// Else we have the general case
					var parentQualified = umlParent.getQualifiedName();
					return parentQualified + '.' + this.simpleName;
				}
			}
			else {
				return this.simpleName;
			}
		}
	},
	displayType : {
		value : function() {
			if(this.webComponent.type) {
				$(this.webComponent.$.type).show();
				var typeComponent = document.getElementById(this.webComponent.type);
				if(typeComponent) {
					var typeUmlElement = typeComponent.umlElement;
					if(typeUmlElement) {
						$(this.webComponent.$.typeName).text(typeUmlElement.simpleName);
					}
					else {
						alert(
							"The element with ID '" + this.type 
							+ "' is not a Polymeria UML component"
						)
					}
				}
				else if(this.webComponent.type) {
					alert("ID '" + this.webComponent.type + "' not found in the DOM")
				}
			}
			else {
				$(this.webComponent.$.type).hide();
			}
		}
	}
}
);
UmlMember.prototype.constructor = UmlMember;

/** 
 * Adaptation of a Web Component into an UML relationship element
 * @param customElm
 * Web component to adapt
 */
function UmlRelationship(customElm) {
	UmlElement.call(this, customElm);
}
UmlRelationship.prototype = Object.create(UmlElement.prototype, { 
	displayRelationship : {
		value : function() {
				if(!this.source) {
					this.source = document.getElementById(this.webComponent.supplier);
					if(!this.source) {
						alert('Id ' + this.webComponent.supplier + 'not found')
					}
					this.source.umlElement.addRecursiveMoveListener(this);
					this.addRecursiveMoveListener(this.source.umlElement);
				}
				if(!this.target) {
					this.target = document.getElementById(this.webComponent.client);
					if(!this.target) {
						alert('Id ' + this.webComponent.client + 'not found')
					}
					this.target.umlElement.addRecursiveMoveListener(this);
					this.addRecursiveMoveListener(this.target.umlElement);
				}
				$().painter.drawRelationship(this.webComponent, this.source, this.target);
		}
	},
	update : {
		value : function() {
			this.displayRelationship();
			this.notifyMoveListeners();
			for	(index = 0; index < this.moveListeners.length; index++) {
				var listener = this.moveListeners[index];
				if(listener.update) {
					listener.update();
				}
			}
		}
	}, 
	drawRelationshipEnd: {
		value : function() {
			
		}
	}
}
);
UmlRelationship.prototype.constructor = UmlRelationship;

/** 
 * Adaptation of a Web Component into an UML association relationship
 * @param customElm
 * Web component to adapt
 */
function UmlAssociation(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = null;
}
UmlAssociation.prototype = Object.create(UmlRelationship.prototype, { 
}
);
UmlAssociation.prototype.constructor = UmlAssociation;
/** 
 * Adaptation of a Web Component into an UML dependency relationship
 * @param customElm
 * Web component to adapt
 */
function UmlDependency(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
}
UmlDependency.prototype = Object.create(UmlRelationship.prototype, { 
	drawRelationshipEnd: {
		value : function() {
			if(this.relationshipCanvas) {
				var headlen = 17;   // length of head in pixels
				var fromX = this.relationshipCanvasStartX;
				var fromY = this.relationshipCanvasStartY;
				var toX = this.relationshipCanvasEndX;
				var toY = this.relationshipCanvasEndY;
				var angle = Math.atan2(toY-fromY,toX-fromX);
				
				var context = this.relationshipCanvas.getContext('2d');
				context.lineWidth = 2;
				context.beginPath();
				context.setLineDash([15, 0]);
				context.moveTo(toX, toY);
				context.lineTo(toX-headlen*Math.cos(angle-Math.PI/8),toY-headlen*Math.sin(angle-Math.PI/8));
				
				
				context.moveTo(toX, toY);
				context.lineTo(toX-headlen*Math.cos(angle+Math.PI/8),toY-headlen*Math.sin(angle+Math.PI/8));
				
				context.closePath();
				context.stroke();
			}
		}
	}
}
);
UmlDependency.prototype.constructor = UmlDependency;
/** 
 * Adaptation of a Web Component into an UML realization relationship
 * @param customElm
 * Web component to adapt
 */
function UmlRealization(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
}
UmlRealization.prototype = Object.create(UmlRelationship.prototype, { 
	drawRelationshipEnd: {
		value : function() {
			if(this.relationshipCanvas) {
				var headlen = 17;   // length of head in pixels
				var fromX = this.relationshipCanvasStartX;
				var fromY = this.relationshipCanvasStartY;
				var toX = this.relationshipCanvasEndX;
				var toY = this.relationshipCanvasEndY;
				var angle = Math.atan2(toY-fromY,toX-fromX);
				
				var context = this.relationshipCanvas.getContext('2d');
				
				context.lineWidth = 1;
				context.beginPath();
				context.setLineDash([15, 0]);
				
				context.moveTo(toX-headlen*Math.cos(angle-Math.PI/7),toY-headlen*Math.sin(angle-Math.PI/8));
				context.lineTo(toX, toY);
				context.lineTo(toX-headlen*Math.cos(angle+Math.PI/7),toY-headlen*Math.sin(angle+Math.PI/8));
				context.fillStyle="white";
				
				context.fill();
				
				
				context.closePath();
				
				
				
				context.stroke();
				
				
			}
		}
	}
}
);
UmlRealization.prototype.constructor = UmlRealization;

/** jQuery plug-in drawing non-conventional features */
$.fn.painter = {
	/** 
	 * Draws a relationship between two Polymeria web components
	 * @param webComponent
	 * Web component representing the relationship
	 * @param sourceComponent
	 * Web component source of the relationship
	 * @param targetComponent
	 * Web component target of the relationship
	 */
	drawRelationship: function (webComponent, sourceComponent, targetComponent) {
		// console.log("Relationship = " + webComponent.id);
		// console.log("$ Coordinates identification");
		// console.log("-->Source: " + sourceComponent.umlElement.getQualifiedName());
		// console.log("-->Target: " + targetComponent.umlElement.getQualifiedName());
		var sourceElement  = $(sourceComponent.$.element);
		var targetElement  = $(targetComponent.$.element);
		var sourcePosition = getPosition(sourceComponent.$.element);
		/*
		console.log(
				"-->Source shadow element ; left=" + sourcePosition.x
				+ " ; top=" + sourcePosition.y
				+ " ; width=" + sourceElement.width()
				+ " ; height=" + sourceElement.height()
		);
		*/
	    var targetPosition = getPosition(targetComponent.$.element);
	    /*
	    console.log(
				"-->Target shadow element ; left=" + targetPosition.x
				+ " ; top=" + targetPosition.y
				+ " ; width=" + targetElement.width()
				+ " ; height=" + targetElement.height()
		);
		*/
		// console.log("$ Setting the canvas dimensions");
		var canvasStartX;
		var canvasEndX;
		var canvasLineStartX;
		var canvasLineEndX;
		// The source is aligned vertically on the target 
		if(
				(targetPosition.x <= sourcePosition.x)
				&&((targetPosition.x + targetElement.width()) >= sourcePosition.x)
		) {
			// console.log('1');
			canvasStartX = sourcePosition.x;
			if((targetPosition.x + targetElement.width()) < (sourcePosition.x + sourceElement.width())) {
				canvasEndX = targetPosition.x + targetElement.width();
			}
			else {
				canvasEndX = sourcePosition.x + sourceElement.width();
			}
			canvasLineStartX = (canvasEndX - canvasStartX) / 2;
			// If we can have a straight line, 
    		if(canvasLineStartX < targetElement.width()) {
    			// Then the start is the end
    			canvasLineEndX = canvasLineStartX;
    		}
    		else {
    			canvasLineEndX = targetElement.width() / 2;
    		}
		}
		// The target is aligned vertically on the source
		else if(
				(sourcePosition.x <= targetPosition.x)
				&&((sourcePosition.x + sourceElement.width()) >= targetPosition.x)
		) {
			// console.log('2');
			canvasStartX = targetPosition.x;
			if((targetPosition.x + targetElement.width()) < (sourcePosition.x + sourceElement.width())) {
				canvasEndX = targetPosition.x + targetElement.width();
			}
			else {
				canvasEndX = sourcePosition.x + sourceElement.width();
			}
			canvasLineStartX = (canvasEndX - canvasStartX) / 2;
			// If we can have a straight line, 
    		if(canvasLineStartX < targetElement.width()) {
    			// Then the start is the end
    			canvasLineEndX = canvasLineStartX;
    		}
    		else {
    			canvasLineEndX = sourceElement.width() / 2;
    		}
		}
    	// The source is on the left (target is on the right)
		else if(targetPosition.x > sourcePosition.x) {	
			// console.log('3');
    		canvasStartX = sourcePosition.x + sourceElement.width();
    		canvasEndX = targetPosition.x;
    		if(targetPosition.y < sourcePosition.y) {
    			canvasLineStartX = 0;
    			canvasLineEndX = targetPosition.x - canvasStartX;
    		}
    		else {
    			canvasLineStartX = 0;
    			canvasLineEndX = targetPosition.x - canvasStartX;
    		}
    	}
    	// The source is on the right (target is on the left)
    	else {
    		// console.log('4');
    		canvasStartX = targetPosition.x + targetElement.width();
    		canvasEndX = sourcePosition.x;
    		if(targetPosition.y > sourcePosition.y) {
    			canvasLineStartX = sourcePosition.x - canvasStartX;
    			canvasLineEndX = 0;
    		}
    		else {
    			canvasLineStartX = sourcePosition.x - canvasStartX;
    			canvasLineEndX = 0;
    		}
    	}
    	//console.log('Canvas X: ' + canvasStartX + " to " + canvasEndX);
		var canvasStartY;
		var canvasEndY;	
		var canvasLineStartY;
		var canvasLineEndY;
		// The source is aligned horizontally on the target 
		if(
				(targetPosition.y <= sourcePosition.y)
				&&((targetPosition.y + targetElement.height()) >= sourcePosition.y )
		) {
			// console.log('A');
			canvasStartY = sourcePosition.y;
			if((targetPosition.y + targetElement.height()) < (sourcePosition.y + sourceElement.height())) {
				canvasEndY = targetPosition.y + targetElement.height();
			}
			else {
				canvasEndY = sourcePosition.y + sourceElement.height();
			}
			// canvasLineStartY = (sourcePosition.y + sourceElement.height() / 2) - canvasStartY;
			canvasLineStartY = (canvasEndY - canvasStartY) / 2;
    		// If we can have a straight line, 
    		if(canvasLineStartY < targetElement.height()) {
    			// Then the start is the end
    			canvasLineEndY = canvasLineStartY;
    		}
    		else {
    			canvasLineEndY = (targetPosition.x + targetElement.height() / 2) - canvasStartY;
    		}
		}
		// The target is aligned horizontally on the source
		else if(
				(sourcePosition.y <= targetPosition.y)
				&&((sourcePosition.y + sourceElement.height()) >= targetPosition.y )
		) {
			// console.log('B');
			canvasStartY = targetPosition.y;
			if((targetPosition.y + targetElement.height()) < (sourcePosition.y + sourceElement.height())) {
				canvasEndY = targetPosition.y + targetElement.height();
			}
			else {
				canvasEndY = sourcePosition.y + sourceElement.height();
			}
			canvasLineStartY = (canvasEndY - canvasStartY) / 2;
			// If we can have a straight line, 
    		if(canvasLineStartY < sourceElement.height()) {
    			// Then the start is the end
    			canvasLineEndY = canvasLineStartY;
    		}
    		else {
    			canvasLineEndY = (sourcePosition.x + sourceElement.height() / 2) - canvasStartY;
    		}
		}
		// The source is at the top
		else if((targetPosition.y + targetElement.height()) > sourcePosition.y) {
			// console.log('C');
			canvasStartY = sourcePosition.y + sourceElement.height();
			canvasEndY = targetPosition.y;
			canvasLineStartY = 0;
			canvasLineEndY = targetPosition.y - canvasStartY;
		}
		// The target is at the top
		else {
			// console.log('D');
			canvasStartY = targetPosition.y + targetElement.height();
			canvasEndY = sourcePosition.y;
			canvasLineStartY = sourcePosition.y - canvasStartY;
    		canvasLineEndY = 0;
		}
		// console.log('Canvas Y: ' + canvasStartY + " to " + canvasEndY);
		////////////////////////
		
		var canvasTop = canvasStartY;
		var canvasLeft = canvasStartX;
		var canvasHeight = canvasEndY - canvasStartY;
		var canvasWidth = canvasEndX - canvasStartX;
		// console.log("$ Drawing the canvas");
		// console.log("-->Position = (left: " + canvasLeft + ", top: " + canvasTop + ")");
	    // console.log("-->Dimensions = (width: " + canvasWidth + ", height: " + canvasHeight + ")");
	    // Trying to fetch an existing element
	    var canvasDiv = document.getElementById("relationship[" + webComponent.id + "]");
	    // If we have an existing element, 
	    if(canvasDiv) {
	    	// The we remove it
	    	canvasDiv.parentNode.removeChild(canvasDiv);
	    }
	    canvasDiv = document.createElement("div");
	    canvasDiv.id = "relationship[" + webComponent.id + "]";
	    var html5Canvas = document.createElement("canvas");
	    
	    canvasDiv.style.position = "absolute";
	    canvasDiv.style.top = canvasTop + "px";
	    canvasDiv.style.left = canvasLeft + "px";
        canvasDiv.style.margin   = 0;
        canvasDiv.style.padding   = 0;
        canvasDiv.style.width   =  (canvasWidth + 5) + "px";
        canvasDiv.style.height   =  (canvasHeight + 5) + "px";
        canvasDiv.style.zIndex   = 150;
        // With and height of the canvas must equal the CSS values in px
        // (canvas pixel / CSS px equivalence)
        html5Canvas.width = canvasWidth;
        html5Canvas.height = canvasHeight;
        html5Canvas.style.width = (canvasWidth) + "px";
        html5Canvas.style.height = (canvasHeight) + "px";
        html5Canvas.style.zIndex   = 250;
        // html5Canvas.style.border   = "dotted";
        
        document.body.appendChild(canvasDiv);
        canvasDiv.appendChild(html5Canvas);
	    
        var colorValue = getStyleRuleValue('color', '.accent-color');
	    if(!colorValue) {
	    	// Default is black
	    	colorValue = "#000";
	    }
        
        var canvas = html5Canvas;
    
	    var context = html5Canvas.getContext('2d');
	    
	    context.lineWidth = 1;
	    // Draw  the line
	    // console.log("$ Drawing the line");
	    context.beginPath();

	    // context.strokeStyle = colorValue;
	    if(webComponent.umlElement.dashed) {
	    	context.setLineDash([7, 8]);
	    }
	    
	    // context.fillStyle = colorValue;
	    
	    context.moveTo(canvasLineStartX, canvasLineStartY);
	    context.lineTo(canvasLineEndX, canvasLineEndY);
	    //ink line
	    
	    
	    context.closePath();
	    context.stroke();
	    
	    webComponent.umlElement.relationshipCanvas = canvas;
	    webComponent.umlElement.relationshipCanvasStartX = canvasLineStartX;
	    webComponent.umlElement.relationshipCanvasStartY = canvasLineStartY;
	    webComponent.umlElement.relationshipCanvasEndX = canvasLineEndX;
	    webComponent.umlElement.relationshipCanvasEndY = canvasLineEndY;
	    webComponent.umlElement.drawRelationshipEnd();
	}
}