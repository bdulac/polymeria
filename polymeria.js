/**
 * Identifies the position of a DOM or Shadow DOM element.
 * @param element
 * Element to identify the position of.
 * @returns Object with two properties x and y (in CSS px).
 */
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
    var offset = $(element).offset();
    return { x: offset.left, y: offset.top };
}

/**
 * Fetches the Web component related to a Shadow DOM node.
 * @param shadowDomNode
 * Shadow DOM node.
 * @returns Related Web component.
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
 * Fetches the parent Polymeria component of a Web component.
 * @param webComponent
 * The Web component to fetch the parent for.
 * @returns Parent Polymeria component of the Web component.
 */
function getParentPolymeriaComponent(webComponent) {
	var parentNode = webComponent.parentNode;
	if(parentNode.nodeName) {
		if(parentNode.nodeName.startsWith("UML-")) {
			return parentNode;
		}
	}
	return getParentPolymeriaComponent(parentNode);
}

/** 
 * Generates a valid GUID.
 * (from http://stackoverflow.com/a/2117523/1207019)
 * @returns Generated GUID.
 */
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

/**
 * Identifies a style value given a CSS selector.
 * (from http://stackoverflow.com/a/16966533/1207019)
 * @param style
 * Style which value has to be identified.
 * @param selector
 * CSS selector to access the style.
 * @param sheet
 * Stylesheet to have a look at (optional: default looks in all the stylesheets)
 * @returns Value of the style found with the given selector.
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
 * Draws a relationship between two Polymeria web components.
 * @param webComponent
 * Web component representing the relationship.
 * @param sourceComponent
 * Web component source of the relationship.
 * @param targetComponent
 * Web component target of the relationship.
 */
function drawRelationship(webComponent, sourceComponent, targetComponent) {
	console.log("Relationship = " + webComponent.id);
	console.log("$ Coordinates identification");
	console.log("-->Source: " + sourceComponent.umlElement.getQualifiedName());
	console.log("-->Target: " + targetComponent.umlElement.getQualifiedName());
	var sourceElement  = $(sourceComponent.$$('#element'));
	var targetElement  = $(targetComponent.$$('#element'));
	var sourcePosition = getPosition(sourceElement[0]);
	console.log(
			"-->Source shadow element ; left=" + sourcePosition.x
			+ " ; top=" + sourcePosition.y
			+ " ; width=" + sourceElement.width()
			+ " ; height=" + sourceElement.height()
	);
	var targetPosition = getPosition(targetElement[0]);
    console.log(
			"-->Target shadow element ; left=" + targetPosition.x
			+ " ; top=" + targetPosition.y
			+ " ; width=" + targetElement.width()
			+ " ; height=" + targetElement.height()
	);
	console.log("$ Setting the canvas dimensions");
	var canvasStartX;
	var canvasEndX;
	var canvasLineStartX;
	var canvasLineEndX;
	// The source is aligned vertically on the target 
	if(
			(targetPosition.x <= sourcePosition.x)
			&&((targetPosition.x + targetElement.width()) >= sourcePosition.x)
	) {
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
			// Then the start X is the same as the end
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
			// Then the start X is the  same as the end
			canvasLineEndX = canvasLineStartX;
		}
		else {
			canvasLineEndX = sourceElement.width() / 2;
		}
	}
	// The source is on the left (target is on the right)
	else if(targetPosition.x > sourcePosition.x) {	
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
	var canvasStartY;
	var canvasEndY;	
	var canvasLineStartY;
	var canvasLineEndY;
	// Source aligned horizontally on the target 
	if(
			(targetPosition.y <= sourcePosition.y)
			&&((targetPosition.y + targetElement.height()) >= sourcePosition.y )
	) {
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
		if(
				(canvasLineStartY < targetElement.height()) 
				/*&& (!targetComponent.umlElement.connectOnMiddle)*/
		) {
			// Then the start Y is the same as the end
			canvasLineEndY = canvasLineStartY;
		}
		else {
			canvasLineEndY = (targetPosition.x + targetElement.height() / 2) - canvasStartY;
		}
	}
	// Target aligned horizontally on the source
	else if(
			(sourcePosition.y <= targetPosition.y)
			&&((sourcePosition.y + sourceElement.height()) >= targetPosition.y )
	) {
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
			// Then the start Y is the same as the end
			canvasLineEndY = canvasLineStartY;
		}
		else {
			canvasLineEndY = (sourcePosition.x + sourceElement.height() / 2) - canvasStartY;
		}
	}
	// Source at the top
	else if((targetPosition.y + targetElement.height()) > sourcePosition.y) {
		canvasStartY = sourcePosition.y + sourceElement.height();
		canvasEndY = targetPosition.y;
		canvasLineStartY = 0;
		canvasLineEndY = targetPosition.y - canvasStartY;
	}
	// Target at the top
	else {
		canvasStartY = targetPosition.y + targetElement.height();
		canvasEndY = sourcePosition.y;
		canvasLineStartY = sourcePosition.y - canvasStartY;
		canvasLineEndY = 0;
	}
	////////////////////////
	var canvasTop = canvasStartY;
	var canvasLeft = canvasStartX;
	var canvasHeight = canvasEndY - canvasStartY;
	var canvasWidth = canvasEndX - canvasStartX;
    // Trying to fetch an existing element
    var canvasDiv = document.getElementById("relationship[" + webComponent.id + "]");
    // If we have an existing element, 
    if(canvasDiv) {
    	// The we remove it
    	canvasDiv.parentNode.removeChild(canvasDiv);
    }
    canvasDiv = document.createElement( "div" );
    canvasDiv.id = "relationship[" + webComponent.id + "]";
    var html5Canvas = document.createElement( "canvas" );
    canvasDiv.style.borderWith = 0;
    canvasDiv.style.borderStyle = "none";
    canvasDiv.style.position = "absolute";
    canvasDiv.style.top = canvasTop + "px";
    canvasDiv.style.left = canvasLeft + "px";
    canvasDiv.style.margin   = 0;
    canvasDiv.style.padding   = 0;
    canvasDiv.style.width   =  (canvasWidth) + "px";
    canvasDiv.style.height   =  (canvasHeight) + "px";
    canvasDiv.style.zIndex   = 150;
    // With and height of the canvas must equal the CSS values in px
    // (canvas pixel / CSS px equivalence)
    html5Canvas.style.borderWith = 0;
    html5Canvas.style.borderStyle = "none";
    html5Canvas.width = canvasWidth;
    html5Canvas.height = canvasHeight;
    html5Canvas.style.width = (canvasWidth) + "px";
    html5Canvas.style.height = (canvasHeight) + "px";
    html5Canvas.style.margin   = 0;
    html5Canvas.style.padding   = 0;
    html5Canvas.style.zIndex   = 250;
    
    document.body.appendChild( canvasDiv );
    canvasDiv.appendChild( html5Canvas );
    
    var colorValue = getStyleRuleValue('color', '.accent-color');
    if(!colorValue) {
    	// Default is black
    	colorValue = "#000";
    }
    
    var canvas = html5Canvas;

    var context = html5Canvas.getContext( '2d' );
    
    context.lineWidth = 1;
    // Drawing  the line
    context.beginPath();

    // context.strokeStyle = colorValue;
    if(webComponent.umlElement.dashed) {
    	context.setLineDash([7, 8]);
    }
    
    // context.fillStyle = colorValue;
    
    context.moveTo( canvasLineStartX, canvasLineStartY );
    context.lineTo( canvasLineEndX, canvasLineEndY );
    //ink line
    
    
    context.closePath();
    context.stroke();
    
    if(webComponent.name) {
    	// Trying to fetch an existing element
    	var labelDiv = document.getElementById("label[" + webComponent.id + "]");
    	// If we have an existing element, 
    	if(labelDiv) {
    		// The we remove it
    		labelDiv.parentNode.removeChild(labelDiv);
    	}
    	labelDiv = document.createElement( "div" );
    	labelDiv.id = "label[" + webComponent.id + "]";
    	$(labelDiv).text(webComponent.name);
    	labelDiv.style.textAlign = "center";
    	labelDiv.style.position = "absolute";
    	var width = canvasLineEndX - canvasLineStartX;
    	var height = canvasLineEndY - canvasLineStartY;
    	// labelDiv.style.width = width;
    	// labelDiv.style.maxWidth = width;
    	document.body.appendChild( labelDiv );
    	var textTop = canvasTop + ( canvasHeight / 2  - 30 );
    	var textLeft = canvasLeft;
    	labelDiv.style.top = textTop + "px";
    	labelDiv.style.left = textLeft - (width / 2) + "px";
    }
    if(webComponent.stereotype) {
    	// Trying to fetch an existing element
    	var stereotypeDiv = document.getElementById("stereotype[" + webComponent.id + "]");
    	// If we have an existing element, 
    	if(stereotypeDiv) {
    		// The we remove it
    		stereotypeDiv.parentNode.removeChild(stereotypeDiv);
    	}
    	stereotypeDiv = document.createElement( "div" );
    	stereotypeDiv.id = "stereotype[" + webComponent.id + "]";
    	$(stereotypeDiv).html('&laquo;' + webComponent.stereotype + '&raquo;');
    	$(stereotypeDiv).addClass("accent-color");
    	$(stereotypeDiv).addClass("stereotype");
    	stereotypeDiv.style.textAlign = "center";
    	stereotypeDiv.style.position = "absolute";
    	var width = canvasLineEndX - canvasLineStartX;
    	var height = canvasLineEndY - canvasLineStartY;
    	stereotypeDiv.style.width = width;
    	stereotypeDiv.style.maxWidth = width;
    	stereotypeDiv.style.minWidth = width;
    	stereotypeDiv.style.margin = "0";
    	stereotypeDiv.style.padding = "0";
    	document.body.appendChild( stereotypeDiv );
    	var height = stereotypeDiv.style.fontSize + stereotypeDiv.style.fontSize;
    	var textTop = canvasTop + ( canvasHeight / 2  - 30 );
    	var textLeft = canvasLeft;
    	stereotypeDiv.style.top = textTop + "px";
    	stereotypeDiv.style.left = textLeft + "px";
    }
    
    webComponent.umlElement.relationshipCanvas = canvas;
    webComponent.umlElement.relationshipCanvasStartX = canvasLineStartX;
    webComponent.umlElement.relationshipCanvasStartY = canvasLineStartY;
    webComponent.umlElement.relationshipCanvasEndX = canvasLineEndX;
    webComponent.umlElement.relationshipCanvasEndY = canvasLineEndY;
    // Drawing the relationship end (different for each type of relationship)
    webComponent.umlElement.drawRelationshipEnd();
}

/** 
 * Adaptation of a Web Component into an UML element.
 * @param customElm
 * Web component to adapt.
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
	this.childrenElements = [];
	this.connectOnMiddle = null;
	var children = this.webComponent.getEffectiveChildren();
	this.description = [];
	var descriptionIndex = 0;
	for	(index = 0; index < children.length; index++) {
		var childElement = children[index];
		if(childElement.nodeName == 'META') {
			var property = childElement.attributes['itemProp'];
			if(!property) {
				property = childElement.attributes['property'];
			}
			if(property) {
				property = property.value;
			}
			var desc = new Object();
			desc.name = property;
			desc.value = childElement.content;
			
			this.description[descriptionIndex] = desc;
			descriptionIndex = descriptionIndex + 1;
		}
	}
	if(this.description.length > 0) {
		var tableDiv = document.createElement( "div" );
    	tableDiv.id = "description-" + this.webComponent.id;
    	document.body.appendChild( tableDiv );
    	$( tableDiv).addClass( 'description' );
    	var table = document.createElement( "table");
    	tableDiv.appendChild( table );
    	$( table ).addClass( 'primary1-background' );
    	var tableHead = document.createElement( "thead" );    	
    	table.appendChild( tableHead );
    	var headRow = document.createElement( "tr" );
    	tableHead.appendChild( headRow );
    	var headCell = document.createElement( "th");
    	headCell.colSpan = 2;
    	$(headCell).text( this.simpleName );
    	headRow.appendChild(headCell);
    	var tableBody = document.createElement( "tbody" );
    	table.appendChild(tableBody);
    	for	(index = 0; index < this.description.length; index++) {
    		var row = document.createElement( "tr" );
    		var desc = this.description[index];
    		tableBody.appendChild( row );
    		var nameCell = document.createElement( "td" );
    		$(nameCell).text( desc.name );
    		var valueCell = document.createElement( "td" );
    		$(valueCell).text( desc.value );
    		row.appendChild( nameCell );
    		row.appendChild( valueCell );
    	}
	}
}
UmlElement.prototype = {
	notifyMoveListeners : function() {
		if(this.moveListeners) {
			// Notifying movement listeners
			for	(index = 0; index < this.moveListeners.length; index++) {
				var listener = this.moveListeners[index];
				if(listener.update) {
					listener.update();
				}
			}
		}
	},
	/** 
	 * Attaching another UML element as move listener of this UML element.
	 * @param listener
	 * UML element to attach as move listener.
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
	 * all the parent UML elements recursively.
	 * @param listener
	 * UML element to attach as move listener.
	 */
	addRecursiveMoveListener : function(listener) {
		if(this.moveListeners) {
			this.moveListeners[this.moveListeners.length] = listener; 
		}
		else {
			this.moveListeners = [listener];
		}
		// Attaching the parent as move listener
		var parentUmlElement = this.getParentElement();
		if(parentUmlElement) {
			parentUmlElement.addMoveListener( listener );
		}
	}, 
	/** 
	 * Resolves the parent UML element of the UML element.
	 * @returns Parent UML element.
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
		/*
		var elm = this.webComponent.$$( '#element' );
		var id = this.webComponent.id;
		var comp = document.getElementById( id );
		// Absolute positioning
		// var elPosition = $(this.webComponent).css( 'position' );
		var elPosition = comp.style.position;
		if(elPosition) {
			var elTop = $(this.webComponent).css( 'top' );
			var elLeft = $(this.webComponent).css('left');
			$(elm).css({ position: elPosition,
		        marginLeft: 0, marginTop: 0,
		        top: elTop, left: elLeft});
		}
		
		var elWidth = this.webComponent.style.width;
		if(elWidth) {
			$(elm).css({ width: elWidth});
		}
		var elMinWidth = this.webComponent.style.minWidth;
		if(elMinWidth) {
			$(elm).css({ minWidth: elMinWidth});
		}
		
		var elMaxWidth = $(this.webComponent).css( 'max-width' );
		if(elMaxWidth) {
			$(elm).css({ maxWidth: elMaxWidth});
		}
		var elHeight = $(this.webComponent).css( 'height' );
		if(elHeight) {
			$(elm).css({ height: elHeight});
		}
		var elMinHeight = $(this.webComponent).css('min-height');
		if(elMinHeight) {
			$(elm).css({ minHeight: elMinHeight});
		}
		var elMaxHeight = $(this.webComponent).css( 'max-height' );
		if(elMaxHeight) {
			$(elm).css({ maxHeight: elMaxHeight});
		}
		*/
	},
	/** 
	 * Resolves the qualified name of the UML element.
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
 * Adaptation of a Web Component into an UML actor.
 * @param customElm
 * Web component to adapt.
 */
function UmlActor(customElm) {
	UmlElement.call(this, customElm);
}
UmlActor.prototype = Object.create(UmlElement.prototype, { 
}
);
UmlActor.prototype.constructor = UmlActor;

/** 
 * Adaptation of a Web Component into an UML use case.
 * @param customElm
 * Web component to adapt.
 */
function UmlUseCase(customElm) {
	UmlElement.call(this, customElm);
}
UmlUseCase.prototype = Object.create(UmlElement.prototype, { 
}
);
UmlUseCase.prototype.constructor = UmlUseCase;

/** 
 * Adaptation of a Web Component into an UML member element.
 * @param customElm
 * Web component to adapt.
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
			var memberType = this.webComponent.type;
			if(memberType) {
				var typeComponent = document.getElementById( memberType );
				if(typeComponent) {
					var typeUmlElement = typeComponent.umlElement;
					if(typeUmlElement) {
						$(this.webComponent.$.typeName).text( typeUmlElement.simpleName );
					}
					else {
						console.error(
							"The element with ID '" + memberType
							+ "' is not a valid Polymeria UML component"
						)
					}
				}
				else if( this.webComponent.type ) {
					console.log(
							"ID '" + this.webComponent.type + "' not found in the DOM, "
							+ "diplaying the literal value...");
					$(this.webComponent.$.typeName).text( this.webComponent.type );
					$(this.webComponent.$.typeName).css( 'color', 'black' );
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
 * Adaptation of a Web Component into an UML relationship element.
 * @param customElm
 * Web component to adapt.
 */
function UmlRelationship(customElm) {
	UmlElement.call(this, customElm);
}
UmlRelationship.prototype = Object.create(UmlElement.prototype, { 
	displayRelationship : {
		value : function() {
				if(!this.source) {
					// If we have a supplier (common case)
					if(this.webComponent.supplier) {
						this.source = document.getElementById( this.webComponent.supplier );
						if(!this.source) {
							console.error('Id ' + this.webComponent.supplier + ' not found in the DOM')
						}
					}
					// If we have an outgoing component
					else if(this.webComponent.outgoing) {
						// Then the source is the outgoing component itself
						this.source = document.getElementById(this.webComponent.outgoing);
					}
					// If we have a note component
					else if(this.webComponent.annotatedelement) {
						// Then the source is the note component itself
						this.source = document.getElementById(this.webComponent.id);
					}
					// Else the source is the parent component
					else {
						this.source = document.getElementById(getParentPolymeriaComponent(this.webComponent).id);
						if(!this.source) {
							console.error('Id ' + this.webComponent.parentNode.id + ' not found in the DOM')
						}
					}
					this.source.umlElement.addRecursiveMoveListener(this);
					this.addRecursiveMoveListener(this.source.umlElement);
				}
				if(!this.target) {
					if(this.webComponent.client) {
						this.target = document.getElementById(this.webComponent.client);
						if(!this.target) {
							console.error('Id ' + this.webComponent.client + ' not found in the DOM');
						}
					}
					// If we have an incoming component
					else if(this.webComponent.incoming) {
						// Then the source is the incoming component itself
						this.target = document.getElementById(this.webComponent.incoming);
					}
					else if(this.webComponent.general) {
						this.target = document.getElementById(this.webComponent.general);
						if(!this.target) {
							console.error('Id ' + this.webComponent.general + ' not found in the DOM');
						}
					}
					else if(this.webComponent.addition) {
						this.target = document.getElementById(this.webComponent.addition);
						if(!this.target) {
							console.error('Id ' + this.webComponent.addition + ' not found in the DOM');
						}
					}
					else if(this.webComponent.annotatedelement) {
						this.target = document.getElementById(this.webComponent.annotatedelement);
						if(!this.target) {
							console.error(
								'Id ' + this.webComponent.annotatedelement + 'not found in the DOM'
							);
						}
					}
					else if(this.webComponent.incoming) {
						this.target = document.getElementById(this.webComponent.incoming);
						if(!this.target) {
							console.error('Id ' + this.webComponent.incoming + ' not found in the DOM');
						}
					}
					else {
						throw "No target could be identified for component " + this.webComponent;
					}
					this.target.umlElement.addRecursiveMoveListener(this);
					this.addRecursiveMoveListener(this.target.umlElement);
				}
				drawRelationship(this.webComponent, this.source, this.target);
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
 * Adaptation of a Web Component into an UML association relationship.
 * @param customElm
 * Web component to adapt.
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
 * Adaptation of a Web Component into an UML dependency relationship.
 * @param customElm
 * Web component to adapt.
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
 * Adaptation of a Web Component into an UML dependency relationship.
 * @param customElm
 * Web component to adapt.
 */
function UmlControlFlow(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
}
UmlControlFlow.prototype = Object.create(UmlRelationship.prototype, { 
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
UmlControlFlow.prototype.constructor = UmlControlFlow;

/** 
 * Adaptation of a Web Component into an UML include relationship.
 * @param customElm
 * Web component to adapt.
 */
function UmlInclude(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
	this.webComponent.stereotype = "include";
}
UmlInclude.prototype = Object.create(UmlRelationship.prototype, { 
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
UmlInclude.prototype.constructor = UmlInclude;

/** 
 * Adaptation of a Web Component into an UML extends relationship.
 * @param customElm
 * Web component to adapt.
 */
function UmlExtend(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
	this.webComponent.stereotype = "extends";
}
UmlExtend.prototype = Object.create(UmlRelationship.prototype, { 
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
UmlExtend.prototype.constructor = UmlExtend;

/** 
 * Adaptation of a Web Component into an UML realization relationship.
 * @param customElm
 * Web component to adapt.
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

/** 
 * Adaptation of a Web Component into an UML generalization relationship.
 * @param customElm
 * Web component to adapt.
 */
function UmlGeneralization(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = false;
}
UmlGeneralization.prototype = Object.create(UmlRelationship.prototype, { 
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
UmlGeneralization.prototype.constructor = UmlGeneralization;

/** 
 * Adaptation of a Web Component into an UML owned comment.
 * @param customElm
 * Web component to adapt.
 */
function UmlOwnedComment(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = true;
}
UmlOwnedComment.prototype = Object.create(UmlRelationship.prototype, { 
}
);
UmlOwnedComment.prototype.constructor = UmlOwnedComment;

/** 
 * Adaptation of a Web Component into an UML control flow relationship.
 * @param customElm
 * Web component to adapt.
 */
function UmlControlFlow(customElm) {
	UmlRelationship.call(this, customElm);
	this.dashed = false;
}
UmlControlFlow.prototype = Object.create(UmlRelationship.prototype, { 
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
				context.fillStyle="black";
				
				context.fill();
				
				
				context.closePath();
				
				
				
				context.stroke();
			}
		}
	}
}
);
UmlControlFlow.prototype.constructor = UmlControlFlow;