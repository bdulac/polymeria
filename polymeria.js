/* Adaptation of a Web Component into an UML element */
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
		console.log("Default ID assigned [" + this.webComponent.id + "]")
	}
	// The UML element becomes an attribute of the Web Component
	this.webComponent.umlElement = this;
	this.moveListeners = [];
}
UmlElement.prototype = {
	notifyMoveListeners : function() {
		if(this.moveListeners) {
			for	(index = 0; index < this.moveListeners.length; index++) {
				var listener = this.moveListeners[index];
				if(listener.update) {
					listener.update();
				}
			} 
		}
	},
	addMoveListener : function(listener) {
		if(this.moveListeners) {
			this.moveListeners[this.moveListeners.length] = listener; 
		}
		else {
			this.moveListeners = [listener];
		}
	}, 
	/* Resolves the parent UML element of the UML element */
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
	/* 
	 * Resolves the qualified name of the UML element
	 * This name is unique in the DOM because it contains the model name
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
/* Adaptation of a Web Component into an UML relationship element */
function UmlRelationship(customElm) {
	UmlElement.call(this, customElm);
}
UmlRelationship.prototype = Object.create(UmlElement.prototype, { 
	displayRelationship : {
		value : function() {
			if(this.webComponent.type == 'uml-Dependency') {
				if(!this.source) {
					this.source = document.getElementById(this.webComponent.supplier);
					this.source.umlElement.addMoveListener(this);
				}
				if(!this.target) {
					this.target = document.getElementById(this.webComponent.client);
					this.target.umlElement.addMoveListener(this);
				}
				$().dependency.drawRelationship(this.webComponent, this.source, this.target);
			}
		}
	},
	update : {
		value : function() {
			this.displayRelationship();
		}
	}
}
);
UmlRelationship.prototype.constructor = UmlRelationship;
/* Adaptation of a Web Component into an UML member element */
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

/** From http://stackoverflow.com/a/2117523/1207019 */
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

/** 
 * jQuery plug-in drawing a relationship between two Polymeria web components
 * @param webComponent
 * Relationship web component
 * @param sourceComponent
 * Source web component
 * @param targetComponent
 * Target web component
 */
$.fn.dependency = {
	drawRelationship: function (webComponent, sourceComponent, targetComponent) {
		console.log("Relationship = " + webComponent.id);
		console.log("$ Coordinates identification");
		console.log("-->Source: " + sourceComponent.umlElement.getQualifiedName());
		console.log("-->Target: " + targetComponent.umlElement.getQualifiedName());
		var sourceElement  = $(sourceComponent.$.element);
		var targetElement  = $(targetComponent.$.element);
		var sourcePosition = getPosition(sourceComponent.$.element);
		console.log(
				"-->Source offset ; left=" + sourcePosition.x
				+ " ; top=" + sourcePosition.y
				+ " ; width=" + sourceElement.width()
				+ " ; height=" + sourceElement.height()
		);
	    var targetPosition = getPosition(targetComponent.$.element);
	    console.log(
				"-->Target offset ; left=" + targetPosition.x
				+ " ; top=" + targetPosition.y
				+ " ; width=" + targetElement.width()
				+ " ; height=" + targetElement.height()
		);
		console.log("$ Setting the canvas dimensions");
		var canvasStartX;
		var canvasLineStartX;
		var canvasLineEndX;
    	// Source is on the left
    	if(targetPosition.x > sourcePosition.x) {	
    		canvasStartX = sourcePosition.x;
    		canvasLineStartX = sourceElement.width() / 2;
    		canvasLineEndX = (targetPosition.x - sourcePosition.x) + targetElement.width() / 2;
    	}
    	// Target is on the left
    	else {
    		canvasStartX = targetPosition.x;
    		canvasLineStartX = (sourcePosition.x - targetPosition.x) + targetElement.width() / 2;
    		canvasLineEndX = sourceElement.width() / 2;
    	}
		var canvasEndX;
		// Source lasts more on the right
    	if(
    			(targetPosition.x + targetElement.width()) 
    			> (sourcePosition.x + sourceElement.width())
    	) {
    		canvasEndX = targetPosition.x + targetElement.width();
    	}
    	// Target lasts more on the right
    	else {
    		canvasEndX = sourcePosition.x + sourceElement.width();
    	}
		var canvasStartY;
		var canvasLineStartY;
		var canvasLineEndy;
		// Source is at the top
		if(targetPosition.y > sourcePosition.y) {
			canvasStartY = (sourcePosition.y + sourceElement.height());
			canvasLineStartY = 0;
    		canvasLineEndY = targetPosition.y - canvasStartY;
		}
		// Target is at the top
		else {
			canvasStartY = (targetPosition.y + targetElement.height());
			canvasLineStartY = 0;
    		canvasLineEndY = sourcePosition.y - canvasStartY;
		}
		var canvasEndY;
		// Source goes lower
		if(
    			(targetPosition.y + targetElement.height()) 
    			> (sourcePosition.y + sourceElement.height())
    	) {	
			canvasEndY = targetPosition.y;
		}
		// Target goes lower
		else {
			canvasEndY = sourcePosition.y;
		}
    	
		////////////////////////
		
		var canvasTop = canvasStartY;
		var canvasLeft = canvasStartX;
		var canvasHeight = canvasEndY - canvasStartY;
		var canvasWidth = canvasEndX - canvasStartX;
		console.log("$ Drawing the canvas");
		console.log("-->Position = (left: " + canvasLeft + ", top: " + canvasTop + ")");
	    console.log("-->Dimensions = (width: " + canvasWidth + ", height: " + canvasHeight + ")");
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
        html5Canvas.style.width = canvasWidth + "px";
        html5Canvas.style.height = canvasHeight + "px";
        html5Canvas.style.zIndex   = 250;
        
        
        document.body.appendChild(canvasDiv);
        canvasDiv.appendChild(html5Canvas);
	    
        console.log("$ Drawing the line");
	    // var canvas = $('#html5CanvasId');
	    var canvas = html5Canvas;
    
	    //you need to draw relative to the canvas not the page
	    console.log("Line start: (left = " + canvasLineStartX + ", top: " + canvasLineStartY + ")");
	    console.log("Line end: (left = " + canvasLineEndX + ", top: " + canvasLineEndY + ")");
	    var context = html5Canvas.getContext('2d');
	    
	    //draw line
	    context.beginPath();
	    context.moveTo(canvasLineStartX, canvasLineStartY);
	    context.lineTo(canvasLineEndX, canvasLineEndY);
	    context.closePath();
	    //ink line
	    context.lineWidth = 2;
	    // context.strokeStyle = "#000"; //black
	    context.strokeStyle = "#00f"; //blue
	    context.stroke();
	}
}