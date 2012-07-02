
readme.txt, WAJAF, the WebAbility(r) Javascript Application Framework
Contains multi purpose functions, browser and WA objects
(c) 2008-2010 Philippe Thomassigny

This file is part of WAJAF

WAJAF is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

WAJAF is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with WAJAF.  If not, see <http://www.gnu.org/licenses/>.

----

Welcome to WAJAF.

You need to install the wajaf directory into your published site.
You may also install the folder into a protected directory and use a PHP/Perl/ASP/etc wrapper.

Once the directory is installed, just call the needed scripts and build javascript !

Reference, manuals, examples: http://www.webability.info/?P=wajaf
Follow us on twitter: @webability5

Thank you !

----

This is the version 2, build 2

- To change the build:
  edit system/core.js at the beginning and change the version number
  change this file and add comments on new build.

To do:
- core browser get*width/height for IE calculating real sizes with %, em, etc. (only IE does not respect pixels measures with the DOM measures attributes reading)
- implement helpmanager.startHelp

- implement requests ajax from events in 4glnode
- remove events and requests ajax when stopping the node
- app.clone, detachNode, attachNode

- making lab for elements, lab for container in 4gl interfase, standalone and local 4gl
- make a simple classname for expandable, separator, tab containers

----

Implement a Manager:

WA.Managers.<name> = new function()
{
  var self = this;
  ...
  function destroy()
  {
    ...
    self = null;
  }

  WA.Managers.event.registerFlush(destroy);
}();

WA.Managers.<name>.<object> = function()
{}

WA.i18n.setEntry('<name>.<id>', '<message>');

----

4GL Manager:

Classes tree:

- 4glNode
  - Application
  - Container
    - simpleContainer
    - separatorContainer
  - Zone
  - Element
    - htmlElement

4glNode have:
  - ID       string
  - father   only main app have no father
  - supertype   application, container, zone, element
  - children    list of children registered
  - domNode  DOM correspondint node
  - state    0, 1, 2, 3, 4, 5, 6, 7, 10
  - code     {} of anything build the node

  appendChild()
  removeChild()
  getNode()


==============================================================================================
Implement a Container:
Container skeletton:
==============================================================================================

WA.Containers.<name> = function(fatherNode, domID, code, listener)
{
  var self = this;
  WA.Containers.<name>.sourceconstructor.call(this, fatherNode, domID, code, '<type of DOMNode>', { classname:'<class>' }, listener);
  ...
  addEvent('start', start);
  addEvent('resize', resize);
  addEvent('stop', stop);

  /* system methods */
  function resize()
  {
    WA.Containers.<name>.source.resize.call(self);
    ...
  }
  function start()
  {}
  function stop()
  {}
  this.createZone = createZone;
  function createZone(domID, code, listener)
  {}
  this.destroyZone = destroyZone;
  function destroyZone(id)
  {}
  this.destroy = destroy;
  function destroy(fast)
  {
    WA.Containers.<name>.source.destroy.call(self, fast);
    ...
    self = null;
  }
  /* User methods */
  this.newZone = newZone;
  function newZone(id, classname, style, ....)
  {}
  this.showZone = showZone;
  function showZone(id)
  {}
  this.hideZone = hideZone;
  function hideZone(id)
  {}
  this.deleteZone = deleteZone;
  function deleteZone(id)
  {}
  this.activateZone = activateZone;
  function activateZone(id)
  {}
  this.getValues = getValues;
  function getValues()
  {}
  this.setValues = setValues;
  function setValues(values)
  {}
}

WA.extend(WA.Containers.<name>, WA.Managers.wa4gl._container);

WA.Containers.<name>.<zone> = function(father, domID, code, listener, ....)
{
  WA.Containers.<name>.<zone>.sourceconstructor.call(this, father, domID, code, '<Type of DOMNode>', { classname:'zone' }, listener);
  ...
  addEvent('start', start);
  addEvent('resize', resize);
  addEvent('stop', stop);

  /* system methods */
  function resize()
  {
    WA.Containers.<name>.<zone>.source.resize.call(self);
    ...
  }
  function start()
  {}
  function stop()
  {}
  this.destroy = destroy;
  function destroy(fast)
  {
    WA.Containers.<name>.<zone>.source.destroy.call(self, fast);
    ...
    self = null;
  }
  /* User methods */
  ...
}

WA.extend(WA.Containers.<name>.<zone>, WA.Managers.wa4gl._zone);

----

==============================================================================================
Implement an Element:
Element skeletton:
==============================================================================================

WA.Elements.<name> = function()
{}

WA.extend(WA.Elements.<name>, WA.Managers.wa4gl._element);

** Elements basic functions:

show() show the full element
hide() hide the full element
setSize() set size of the element
setPosition() set position of the element
getValues() get values of the element if apply
setValues() set values of the element if apply
destroy() called to destroy the element

----

V2, build 2 - 2012-06-21:
- The prototypes methods have been prepared to be in a non-invasive context but not released
- The prototypes methods have been added in the shortcuts file but not released
- buttonElement has been modified to work in both Group (form) and No group context
- textfieldElement has been modified to show error only when the value is different as the default one (cleaner screen)
- textareafieldElement has been modified to show error only when the value is different as the default one (cleaner screen)
- Some logical bugs corrected on textfieldElement and textareafieldElement
- groupContainer modified to manage sucess, failure, and messages from server
- lovfieldElement implemented
- _4glnode modified to register all events, not only the first one in list
- Error corrected in wajaf.lib in the classes delimiters
- Modified 'help' tag to 'helpdescription' tag for the group elements. Examples, javascript code and wajaf.lib adjusted for this change
- Modified 'help' attribute to 'helpmode' to avoid help conflicts, for the group elements. Examples, javascript code and wajaf.lib adjusted for this change
- Buttons classes recombined so confirm and cancel are now image based, and the sucess, warning and danger classes have been added to change the button color. Added the 'extra' attribute to the buttonElement tag to access the color class
- base class 'wajaf' modified in wajaf.lib to accept a protected method to compile specific class code

V2, build 1 - 2012-06-19:
- 4gl Manager rewritten, lighter, faster, event driven
- Tree 4glNode rewritten: 3 events implemented, propagation of events implemented
- application, container, zone, elements are extended from 4glNode
- Default control methods implemented into application
- application rewriten to be event-driven
- simpleContainer, groupContainer, separatorContainer, treeContainer, tabContainer implemented on V2 new 4gl tree
- buttonElement, codeElement, hiddenfieldElement, htmlElement, imageElement, linkElement, textareafieldElement, textElement, textfieldElement implemented on V2 new 4gl tree

Build 28:
- Elements rewritten to work with new core and 4gl manager
- Modified _zone, _element, _container to respect node position if it already exists
- Added event.key() as a synonym of event.addKey()
- modified soundManager to be able to wait for a new flash link while the page is loading, and separate the sounds in an object container to start, pause, stop, volume, pan
- Added WA.browser.isFirebug to detect if Firebug is installed and running
- All the 4GL examples have been rewritten to work with new core classes and be path independant
- All the tools* examples have been rewritten to work with new core classes and be path independant
- All the i18n* examples have been rewritten to work with new core classes and be path independant
- All the core* examples have been rewritten to work with new core classes and be path independant
- All the proto* examples have been rewritten to work with new core classes and be path independant
- All the ddManager examples have been rewritten to work with new core classes and be path independant
- Minor bugs corrected into Date.prototype.* and String.prototype.*
- add WA.get().* multipurpose DOMNodes access and functions, and examples
- separation into strict mode and compatible mode, with a shortcuts.js file to keep old compatibility
- strict parameter implemented in WA.sizeOf()
- WA.pushContext and WA.popContext functions added to 4glManager to use easily context change between applications
- Function.prototype.withContext function has been implemented to force a context upon a remote or delayed function call
- Modified default behaviour of a zone: it should always be hidden, its container will decide its visibility
- Corrected a bug in WA.callLibraries that kept wrongly the track of an application that did not need libraries
- the login=true on request now respect the parameters set of the required application after the login is successfull
- eventManager now also listen keyup events, so keydown and keyup are sent to the listener
- eventManager is now able to listen shift , control , alt without combination
- Modified shortcuts to add them only if the Manager has been loaded
- Added a test on WA.debug to send to the own console, was not working if the console was not defined
- A bug in wa4glManager has been corrected, the domID of the zone was not correctly set when creating the object.

Build 27:
- Added all the example files for all containers (yet most of them are empty)
- Added reload function to treeContainer
- Dominion entries removed from 4gl.css
- Error corrected into core.js/browser.isBoxModel assignation
- Bug removed in buttonElement.js for IE browsers that does not support 'type' property
- 4gl.css changed for buttons to add a padding for ie and others that does not support rounded borders
- Added the error message itself to the ajaxManager error handler when an error happen

Build 26:
- helpManager modified to protect removehelp on page unload when the object is already destroyed
- ddManager modified to protect removehelp on page unload when the object is already destroyed
- Bug corrected in wa4glManager WA.librariesloaded to reinit the callers array once started.
- codeElement modified to really unload the DOM node when destroyed
- ondemandManager modified to really unload the DOM node of a script when destroyed
- wa4glManager._element modified to accept the 'fast' parameter and deletes the inner Node if fast is not true.
- tabManager coded
- wa4glManager._zone modified to use 'display' parameter
- expandableContainer modified to let _zone use the 'display' parameter
- separatorContainer modified to let _zone use the 'display' parameter
- Added the array zonesorder to the default wa4glManager._container object to keep the official order of zones
- Documentation structure for the 16 containers is now in the wiki
- Creation of all the missing containers files and classes
- Creation of all the classes into PHP library to link all the container objects

Build 25:
- Added ex_elementlab and ex_containerlab combined examples to analize and make a lab for elements and containers
- expandableContainer adjusted with only 1 class for each component in CSS to simplify. css fixed for it.
- separatorContainer adjusted with only 1 class for each component in CSS to simplify. css fixed for it.
- buttonElement is now an input/button instead of an 'a' html tag. The 4gl.css has been fixed also

Build 24:
- Modified wa4glManager.js to fix a bug while starting an inner application: the content of the container node was not cleaned up before
- Modified wa4glManager.js to fix a bug while unloading an application from a node, the application was not fully destroyed
- Added tabZone, treeTemplate, treeDataset classes to PHP wajaf.lib
- Modified imageElement class into PHP wajaf.lib, now the title is set into the CData and not into a property named title
- Moved WA.checkAvailability, WA.checkLibrary, WA.callLibraries to WA object instead of application object to fix a parallelism bug when more than one application is loading libraries at the same time
- Added code view into 4gl examples and into app.php to dispatch the code
- Application destructor modified to not generate error. This is a workaround and have to be well checked because of tabManager still not compliant
- Added prettify libraries to syntax highlight the XML code in XML and PHP 4gl examples: Prettify: Copyright (C) 2006 Google Inc. http://code.google.com/p/google-code-prettify/
- PHP viewport is fixed and working
- All examples renamed to ex_*: the examples classes cannot be named as wajaf classes
- ex_simpleContainer PHP example added

Build 23:
- Added parameter 'display' to expandableZone into php/wajaf.lib
- Added separatorContainer class into php/wajaf.lib
- Added separatorZone class into php/wajaf.lib
- Added linkElement.js, class into php/wajaf.lib, examples, 4gl.css fixed
- Added imageElement.js, class into php/wajaf.lib, examples, 4gl.css fixed
- sizer.png renamed to separator-sizer.png and 4gl.css fixed, 4gl.css fixed
- Added codeElement.js, class into php/wajaf.lib, examples, 4gl.css fixed
- Added buttonElement.js, class into php/wajaf.lib, examples, 4gl.css fixed, icons added, many types of buttons implemented
- Added tabContainer.js to 4gl examples
- Added 4glphpcode into examples, which is a replica of 4gl but with PHP classes instead of XML files
- Modified class wajaf in wajaf.lib to return $this on set variables to permit chain set. dimension() method renamed to size(), both position() and size() function made public
- ondemandManager.loadCSS now works also on MSIE that have no standard css nodes :S
- Removed from menu of main.xml the examples not yet released

Build 22:
- Added WA.applyStyle(node, style) to WA into the wa4glManager.js to apply a string style to a node
- WA.applyStyle added to simpleContainer.js
- display and style parameters added to Xcontainer and Xelement classes in wajaf.lib
- wajaf.lib fixed for simpleContainer and htmlElement
- Added preg_match into app.php for security
- Added String.trim(value) prototype function
- WA.Extends renamed to WA.extend
- _zone, _container and _element basic classes to extend have been created into wa4glManager.js
- simpleContainer has been extended from _zone and _container and extra code removed
- htmlElement.js added and fixed, with examples standalone, in 4GL and in 4GL examples center
- expandableContainer.js has been added, with examples standalone, in 4GL and in 4GL examples center
- textElement.js added and fixed, with examples standalone, in 4GL and in 4GL examples center
- separatorContainer.js has been added, with examples standalone, in 4GL and in 4GL examples center
- 4gl.css adjusted for the new classes
- Bug corrected in ondemandManager.js: the 'force' parameter was ignored and the errorcount fixed to 3 tries only
- Functionality added in ondemandManager.js: the onload event does not exists for a link/css, we used a trick to call onload event

Build 21:
- Added WA.JSON.withalert = true to 4gl application _getJSON code to show how the JSON has not been decoded (generally a server error)
- All the containers and elements have been added to the Containers and Elements directories. (Most of them are not working yet)
- All the new containers and elements have been hooked in WA.Containers and WA.Elements
- The wajaf.lib for PHP has been integrated and all other libraries deleted
- dommask* libraries removed from elements since they belong to Dominion.
- simpleZone._callNotify is now private
- simpleContainer._callNotify is now private
- simpleContainer._checkID is now private
- simpleContainer.destroyZone now check the 4gl entry and call it if needed
- wa4glManager now call *Container.destroyZone with 4gl indicator to true as second parameter
- All the containers and elements now have the _4glNode parameter as the last one, the Manager has been modified as well. This is to use the standalone mode without the first parameter always to null
- dblistContainer has been moved to the Dominion project
- Copyrights fixed on the whole javascript libraries

Build 20:
- Removed a bug in newTree method so the new built tree is started if the app is started.
- _4glapplication._buildApp is now private
- _4glapplication._checkAvailability is now private
- _4glapplication._jsLoaded is now private
- _4glapplication._callLibraries is now private
- _4glapplication._buildNode is now private
- _4glapplication._buildTree is now private
- _4glapplication._buildApp is now private
- The construction logic of the 4gl nodes has been completely moved to _4glapplication
- Reading the templates code has been added into _buildTree so there is no need to enforce the scripts into the application headers anymore
- core.js has been modified into all the 'for' loops of objects to filter eventual proto functions that could have been added to the objects and break the loops
- wa4glManager.js has been modified into all the 'for' loops of objects to filter eventual proto functions that could have been added to the objects and break the loops
- _4glapplication._paintApp is now private
- _4glnode.createMain, createContainer, createZone, createElement are now private
- A test into _4glnode.paint has been added to check if the library to call has been loaded and throw an error if not
- All the containers and elements have been modified to hook into WA.Containers and WA.Elements
- _getMeasure has been removed from _4glnode
- All resize() and paint() has been removed from the start() method on all objects
- New state level added to the applications: now 4 is painting, 5 is running and 6 is stoped
- All the methods in _4glnode have been reordered in respective sections: builder, painter, starter, resizer, notifications, events, tools
- _4glnode.removeChild has been added, _4glnode.appendApplication has been removed
- Added helpManager.setMode(mode)

Build 19:
- Removed debug in coords Node in space3dManager
- drawManager: ending line pixels adjusted;
- drawManager.erase coded
- _line.destroy and drawManager.destroy coded
- Added new example draw.clock.html
- Added buttonElement.js
- Coded part of simpleContainer.xml example into the 4GL control center
- PHP basic wajaf code renamed with an X (from XML): Xapplication, Xcontainer, Xelement, Xzone
- wajafError and wajaf classes coded
- All the PHP classes are now concentrated into wajaf.lib
- Added example for simpleContainer.standalone

Build 18:
- Coded functions for space3DManager
- Added drawManager.js
- Added a check point into animManager.suspend to not suspend twice
- Modified RGB into core.js to remove an error on the self variable
- Added example for drawManager

Build 17:
- Modified core.js to get the version number at the beginning (easier to maintain)
- Added attribute withalert(boolean) to WA.JSON, the function will be silent by default but throw an exception on error
- Added WA.i18n tools into core.js with 2 default messages for JSON error.
- Added i18n for ajaxManager.js
- Added debugManager.js, still empty
- Added space3dManager.js, still need to link with main Manager
- Modified example ajax.differed to free the request when received.
- Modified example ajax.periodic to down wait time to 3 seconds
- ajaxRequest.setTimeout renamed to setTimeoutAbort because of a conflict with window.setTimeout
- Added debug into eventManager for addListener, removeListener, addKey, removeKey
- Added debug into animManager for createSprite, destroySprite
- Added i18n for ondemandManager.js
- Added basic PHP object structure to interact directly with the wajaf by PHP object
- Added examples for i18n
- Added examples for space3d

Build 16:
- Function.prototype.buildCompact has been modified to accept ALSO the second call arguments concatenation
- Modified animManager to force a sprite id if the sprite is id-less

Build 15:
- Added codeElement.js
- Coded WA.analyze and WA.getCoords
- wa4glManager.js logic is working
- Main 4gl examples control center is working
- Modified core.js: all the days and months names with InitCap
- Modified event name 'move' to 'drag' into the ddManager.js
- 4GL Examples Control Center: Viewport integrated with the menu and index into same application
- 4GL Examples Control Center: ajaxManager and ddManager indicator flags moved, with help and working
- 4GL Examples Control Center: mounted with 6 basic containers and working
- Added tabContainer, treeContainer.js, expandableContainer.js, groupContainer.js
- Removed messageManager.setData since the attributes are public
- Modified example of messageManager to use the attributes
- Added 'return true' when the addHelp method is successfull in helpManager

Build 14:
- Coded messageManager.js
- Added example for messageManager
- Modified ajaxManager to be silent on errors by default (mainly because of unloading the page breaks the ajax request and then sends the error to the manager)
- Error corrected in ondemandManager.destroy()
- Added WA.Managers object to link all the loaded managers
- Removed WA.Applications, there is no use of it
- Removed WA.Containers and WA.Elements from core.js and added to wa4glManager.js
- Added link in WA.Managers into each Manager
- Sounds renamed with a - instead of a _
- Added skin/4gl for the 4GL images. Added the help images
- Coded helpManager.js
- Added example for helpManager
- Extended Node Id separator modified from - to | into wa4glManager
- Coded WA.analize into wa4glManager
- Coded $, $N, $A, $C, $E into wa4glManager
- Coded WA.parseID into wa4glManager
- Coded WA.replaceTemplate into wa4glManager
- Coded WA.getClasses into wa4glManager
- Created examples/4gl to put all the 4gl examples
- Moved js.php to examples/4gl
- Created examples/containers to put all the Containers standalone and wajaf examples
- Created examples/elements to put all the Elements standalone and wajaf examples
- Created examples/4gl/app.php to send json transformed applications
- Created containers/ and elements/ to put the libraries
- Added simpleContainer.js to containers
- Added separatorContainer.js to containers
- Added htmlElement.js to elements
- Added simpleContainer.standalone.html, simpleContainer.wajaf.html, separatorContainer.standalone.html,
    separatorContainer.wajaf.html, separatorContainerH.standalone.html, separatorContainerH.wajaf.html
    to examples/containers

Build 13:
- Removed the WA.* 4GL parts from core.js ($ with context, $N, $A, $C, $E, parseTemplate, getObjectByID, getClasses, getIndexById, parseId)
- Added the WA.* 4GL parts to wa4glManager.js
- Modified getDomNode without context in core.js
- Created unified ondemandManager.js instead of JSOD, CSSOD and POD Managers
- Modified and renamed examples of JSOD, CSSOD and POD Managers to use ondemandManager
- Modified js1.js and js2.js, there was a redaction message error
- Deleted JSOD, CSSOD and POD Managers

Build 12:
- Renamed ajaxRequest to _ajaxRequest into ajaxManager.js
- Renamed animSprite to _animSprite into animManager.js
- Coded JSODManager
- Added example for JSODManager
- Coded CSSODManager
- Added example for CSSODManager
- Coded PODManager
- Added example for PODManager

Build 11:
- ddManager remasterized and documented
- Added examples for ddManager

Build 10:
- soundManager.js working on all browser.
- ajaxRequest.getParameters added
- Private ajaxRequest.getParameters renamed to buildParameters
- ajaxRequest.doabort and ajaxRequest.timeabort are now private
- Replaced 'self' by 'this' in the ajaxRequest constructor.
- Added method addTimeout to ajaxRequest
- Added addStateFeedback to ajaxManager
- Added setTimeout to ajaxManager
- Added statefeedback and timeoutabort to the ajaxRequest constructor
- animSprite.getHex renamed to _getHex and made private
- animSprite.anim renamed to _anim and made private
- Added animSprite.suspended and animSprite.suspendtime attributes
- Coded animSprite.suspend/resume
- Coded animSprite.stop
- Modified animSprite.start to restart the animation when we call it again.
- Modified anim.combined example to reuse the sprite if it is not already destroyed, and remove the alert.

Build 9:
- Coded animManager.js
- Added examples of animManager
- Added soundmanager2.swf in skin/flash, removed soundmanager.swf
- Still coding soundManager.js (not working yet)
- Examples of soundManager
- Modified ajaxManager so destroy() in manager is now private
- Modified ajaxManager to control better the user abort vs timeout abort
- Added examples for ajaxManager: Differed ajax call, Indicator of ajax call, Notify ajax call, Catch errors on ajax call

Build 8:
- Added parameter 'field' on Array.prototype.remove: it was in the documentation but not implemented
- Coded eventManager.removeKey, and alias keyoff
- Renamed keyListener to addKey, and alias key and keyon
- Coded ajaxManager and examples
- Bug corrected on ajaxManager.createPeriodicRequest: the process was calling max+1 times the request instead of max times.
- Added examples of ajax simple and periodic
- eventManager private attributes and function made private (removed "this." to access them only to be in the object scope)
- ajaxManager private attributes and function made private (removed "this." to access them only to be in the object scope)

Build 7:
- Coded eventManager, registerFlush, registerBeforeFlush, flushing system, and some bugs removed.
- Added examples of event flush, mouse and keys

Build 6:
- Added examples of debug
- Added examples of UTF8
- Modified JSON.encode tu support is* functions, null, undefined, and filter functions on arrays
- Added examples of JSON
- Added examples of RGB
- Coded WA.render.Integer, WA.render.Fixed, WA.render.Money
- Added examples of render
- Coded Date.* to format the date based on PHP formats and Dominion 7 DB_Date object for functions.
- Added examples for string and dates

Build 5:
- browser.metrics and browser.size functions verified and corrected
- Attributes verified: isStandard renamed to isCompat, isFirefox added
- Added examples of browser.attributes
- Added examples of browser.metrics
- Added examples of browser.size
- Added all the managers (still not verified either)
- Added /skin/* to build the 4GL examples (still not working either)
- Added js.php to dispatch the javascript minified and cached

Build 4:
- Added examples for getNextZIndex
- Added examples for is* verification functions

Build 3:
- Corrected an error in Function.prototype.delay to return the timer.
- Examples slightly modified to be more presentable
- Prototypes documentation released (on documentation site)
- Added this file
- main directory renamed to wajaf instead of wajaf1

Build 2:
- Full WA object included
- Examples included

Build 1:
- Protype functions included.
