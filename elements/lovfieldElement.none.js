
/*
    lovfieldElement.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains element to control a list of values
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
*/

function lovfieldElement(domNodefather, domID, params, feedback, _4glNode)
{
  var self = this;
  this._4glNode = _4glNode;
  this.domNodefather = domNodefather;
  this.domID = domID;
  this.params = params;
  this.id = params.attributes.id;
  this.feedback = feedback;

  this.classname = params.attributes.classname?params.attributes.classname:'lovok';
  this.classnameerror = params.attributes.classnameerror?params.attributes.classnameerror:'loverror';
  this.classnamefocus = params.attributes.classnamefocus?params.attributes.classnamefocus:'lovfocus';
  this.classnamedisabled = params.attributes.classnamedisabled?params.attributes.classnamedisabled:'lovdisabled';
  this.classnamereadonly = params.attributes.classnamereadonly?params.attributes.classnamereadonly:'lovreadonly';
  this.classnameselected = params.attributes.classname?params.attributes.classname:'lovselected';

  this.status = 0; // field not validated yet
  this.editable = true;
  this.statuselement = null;
  this.titleelement = null;
  this.helpelement = null;
  this.extraelement = null;
  this.errorelement = null;
  this.notnull = (params.attributes.notnull&&params.attributes.notnull=='yes'?true:false);
  this.width = (params.attributes.width?params.attributes.width:'');
  this.height = (params.attributes.height?params.attributes.height:'');

  this.multiselect = (params.attributes.multiselect?params.attributes.multiselect:'');
  this.radiobutton = (params.attributes.radiobutton?params.attributes.radiobutton:'');

	  this.domNode = document.createElement('select');
	  if(this.multiselect)
	  {
		  this.classname = params.attributes.classname?params.attributes.classname:'lovmok';
		  this.classnameerror = params.attributes.classnameerror?params.attributes.classnameerror:'lovmerror';
		  this.classnamefocus = params.attributes.classnamefocus?params.attributes.classnamefocus:'lovmfocus';
		  this.classnamedisabled = params.attributes.classnamedisabled?params.attributes.classnamedisabled:'lovmdisabled';
		  this.classnamereadonly = params.attributes.classnamereadonly?params.attributes.classnamereadonly:'lovmreadonly';
		  this.classnameselected = params.attributes.classname?params.attributes.classname:'lovmselected';
	    this.domNode.setAttribute('multiple','1');
	  }
	  this.domNode.id = domID;
	  this.domNode.name = _4glNode.id;
	  if (this.width)
	    this.domNode.style.width = this.width+'px';
	  if (this.height)
	    this.domNode.style.height = this.height+'px';
	  domNodefather.appendChild(this.domNode);
  // we link with the group container if needed
  if (params.attributes.link)
  {
    this.group = _4glNode.getNode(params.attributes.link).icontainer;
    this.group.registerField(this);
  }

  if (params.attributes.synchronize)
  {
    this.synchronize = _4glNode.getNode(params.attributes.synchronize).ielement;
    this.synchronize.registerSynchronize(this);
  }

  this.record = true;
  if (params.attributes.record != undefined)
  {
    this.record = params.attributes.record=='false'?false:true;
  }

  this.registerSynchronize = registerSynchronize;
  function registerSynchronize(element)
  {
    self.synchronizeelement = element;
  }

  this.unregisterSynchronize = unregisterSynchronize;
  function unregisterSynchronize()
  {
    self.synchronizeelement = null;
  }

  this.registerTitle = registerTitle;
  function registerTitle(element)
  {
    self.titleelement = element;
  }

  this.unregisterTitle = unregisterTitle;
  function unregisterTitle()
  {
    self.titleelement = null;
  }

  this.registerStatus = registerStatus;
  function registerStatus(element)
  {
    self.statuselement = element;
  }

  this.unregisterStatus = unregisterStatus;
  function unregisterStatus()
  {
    self.statuselement = null;
  }

  this.registerHelp = registerHelp;
  function registerHelp(element)
  {
    self.helpelement = element;
  }

  this.unregisterHelp = unregisterHelp;
  function unregisterHelp()
  {
    self.helpelement = null;
  }

  this.registerExtra = registerExtra;
  function registerExtra(element)
  {
    self.extraelement = element;
  }

  this.unregisterExtra = unregisterExtra;
  function unregisterExtra()
  {
    self.extraelement = null;
  }

  this.registerError = registerError;
  function registerError(element)
  {
    self.errorelement = element;
  }

  this.unregisterError = unregisterError;
  function unregisterError()
  {
    self.errorelement = null;
  }

  this.checkStatus = checkStatus;
  function checkStatus()
  {
    if (self.synchronize)
    {
      // we rebuild synchronize
      self.synchronize.checkStatus();
      self.synchronize.checkChildren();
      self.synchronize.checkClass();
      self.status = self.synchronize.status;
      return;
    }

    // we check anything based on the attributes of the field
    if (self.domNode.disabled)
    {
      self.status = 4;
      return;
    }
    if (self.domNode.readonly)
    {
      self.status = 3;
      return;
    }
    self.status = 1;
    if (self.notnull && self.domNode.value == '')
      self.status = 2;
  }

  this.checkClass = checkClass;
  function checkClass()
  {
    switch (self.status)
    {
      case 4:
        if (self.classnamedisabled)
          self.domNode.className = self.classnamedisabled; break;
      case 3:
        if (self.classnamereadonly)
          self.domNode.className = self.classnamereadonly; break;
      case 2:
        if (self.classnameerror)
          self.domNode.className = self.classnameerror; break;
      case 1:
        if (self.classname)
          self.domNode.className = self.classname; break;
    }
  }

  this.checkChildren = checkChildren;
  function checkChildren()
  {
    if (self.statuselement)
      self.statuselement.setValues(self.status);
    if (self.titleelement)
      self.titleelement.setValues(self.status);
    if (self.helpelement)
      self.helpelement.setValues(self.status);
    if (self.extraelement)
      self.extraelement.setValues(self.status);
    if (self.errorelement)
      self.errorelement.setValues(self.status);
  }

  this.setError = setError;
  function setError(values)
  {
    if (self.errorelement)
      self.errorelement.setError(values);
  }

  this.setHelp = setHelp;
  function setHelp(values)
  {
    if (self.helpelement)
      self.helpelement.setHelp(values);
  }

  this.onchange = onchange;
  function onchange()
  {
    self.checkStatus();
    self.checkChildren();
    if (self.synchronizeelement)
    {
      self.synchronizeelement.status = self.status;
      self.synchronizeelement.checkChildren();
    }
//    self.Notify('change')
  }

  this.onblur = onblur;
  function onblur()
  {
    self.checkClass();
    if (self.synchronizeelement)
    {
      self.synchronizeelement.checkClass();
    }
  }

  this.onfocus = onfocus;
  function onfocus()
  {
    if (self.classnamefocus)
      self.domNode.className = self.classnamefocus;
  }

  this.start = start;
  function start()
  {

    self.domNode.onchange = self.onchange;
    self.domNode.onfocus = self.onfocus;
    self.domNode.onblur = self.onblur;

    // we fill the list if any
    var item = 0;
    if (!self.notnull)
    {
      var node = document.createElement('option');
      node.id = null;
      node.value = null;
      node.text = '';
      if(self.params[i].attributes.selected == 'yes')
        node.selected = true;
      self.domNode.options[item++] = node;
    }

    for (var i in self.params)
    {
      if (self.params[i].tag && self.params[i].tag == 'option')
      {

        var node = document.createElement('option');
        node.id = self.params[i].attributes.id;
        node.value = self.params[i].attributes.id;
        node.text = self.params[i].data;

        // Add Pau, esta bien phil ? para preseleccionar el combo desde un
        // dbmaskfieldloo
        if(self.params[i].attributes.selected == 'yes')
          node.selected = true;
        // End Add Pau

        //self.domNode.appendChild(node);
        // Add Pau, esta bien phil ? el appendChild no "pinta" a la
        // opción en el combo
        // el "options[]" sí
        self.domNode.options[item++] = node;
        // End Add Pau
      }
    }

    // we register to our group if needed
    self.checkStatus();
    self.checkChildren();
    self.checkClass();
    self.resize();
  }

  this.resize = resize;
  function resize()
  {
    self._4glNode.nodeResize(self.domNodefather, self.domNode, self.params.attributes);
  }

  this.show = show;
  function show()
  {
    self.domNode.style.display = "";
  }

  this.hide = hide;
  function hide()
  {
    self.domNode.style.display = "none";
  }

  this.getValues = getValues;
  function getValues()
  {
    return self.domNode.value;
  }

  this.setValues = setValues;
  function setValues(values)
  {
    self.domNode.value = values;
    self.checkStatus();
    self.checkChildren();
    self.checkClass();
  }

  this.stop = stop;
  function stop()
  {
    if (self.group)
      self.group.unregisterField(self);
    self.domNode.onfocus = null;
    self.domNode.onblur = null;
    self.domNode.onchange = null;
  }

  this.destroy = destroy;
  function destroy()
  {
    self.group = null;
    self.domNode = null;
    self.statuselement = null;
    self.regexp = null;
    self.classnamereadonly = null;
    self.classnamedisabled = null;
    self.classnamefocus = null;
    self.classnameerror = null;
    self.classname = null;
    self.feedback = feedback;
    self.params = params;
    self.domID = domID;
    self.domNodefather = domNodefather;
    self = null;
  }
}

// Needed aliases
WA.Elements.lovfieldElement = lovfieldElement;
