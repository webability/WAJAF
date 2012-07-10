
/*
    textfieldElement.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains element to control a simple text field
    (c) 2008-2012 Philippe Thomassigny

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

WA.Elements.textfieldElement = function(fatherNode, domID, code, listener)
{
  var self = this;
  WA.Elements.textfieldElement.sourceconstructor.call(this, fatherNode, domID, code, 'div', { classname:'textfield' }, listener);

  this.id = this.code.attributes.id; // name of field, to use to send to the server

  // by default the field is part of the record, used by container
  this.formtype = 'field';
  this.record = (this.code.attributes.record&&this.code.attributes.record=='no'?false:true);
  this.editable = true;  // it's a text field, so yes

  this.status = 0; // 0 = neutral, 1 = ok, 2 = error, 3 = r/o, 4 = disabled
  this.edition = false;
  this.focus = false;

  this.mode = 0;
  // Behaviour on modes
  this.isvisible = [];
  this.info = [];
  this.disabled = [];
  this.readonly = [];
  this.notnull = [];
  this.help = [];
  for (var i = 1; i < 5; i++)
  {
    this.isvisible[i] = (this.code.attributes.visible?this.code.attributes.visible.indexOf(''+i)!=-1:true);
    this.info[i] = (this.code.attributes.info?this.code.attributes.info.indexOf(''+i)!=-1:false);
    this.disabled[i] = (this.code.attributes.disabled?this.code.attributes.disabled.indexOf(''+i)!=-1:false);
    this.readonly[i] = (this.code.attributes.readonly?this.code.attributes.readonly.indexOf(''+i)!=-1:false);
    this.notnull[i] = (this.code.attributes.notnull?this.code.attributes.notnull.indexOf(''+i)!=-1:false);
    this.help[i] = (this.code.attributes.helpmode?this.code.attributes.helpmode.indexOf(''+i)!=-1:false);
  }

  // validity checks
  this.password = (this.code.attributes.password&&this.code.attributes.password=='yes'?true:false);
  this.format = (this.code.attributes.format?new RegExp(this.code.attributes.format):null);
  this.minlength = (this.code.attributes.minlength?this.code.attributes.minlength:'');
  this.maxlength = (this.code.attributes.maxlength?this.code.attributes.maxlength:'');
  this.size = (this.code.attributes.size?this.code.attributes.size:'');
  this.minwords = (this.code.attributes.minwords?this.code.attributes.minwords:null);
  this.maxwords = (this.code.attributes.maxwords?this.code.attributes.maxwords:null);
  // defaultvalue is the default for insert mode (code from the code, set below)
  // value is the value set in this mode by setValues, if we want to undo changes
  this.defaultvalue = this.value = '';

  // errors on checks
  this.errorexternal = false;  // true when set manually an error
  this.errors = {};
  this.errormessages = {};
  this.firstview = true; // set to false when the field has been touched/modified. Used to know if we put the errors

  for (var i in this.code)
  {
    switch (code[i].tag)
    {
      case 'defaultvalue': this.defaultvalue = code[i].data?code[i].data:''; break;
      case 'helpdescription': this.helpmessage = code[i].data; break;
      case 'statusnotnull': this.errormessages.statusnotnull = code[i].data; this.errors.statusnotnull = false; break;
      case 'statusbadformat': this.errormessages.statusbadformat = code[i].data; this.errors.statusbadformat = false; break;
      case 'statustooshort': this.errormessages.statustooshort = code[i].data; this.errors.statustooshort = false; break;
      case 'statustoolong': this.errormessages.statustoolong = code[i].data; this.errors.statustoolong = false; break;
      case 'statustoofewwords': this.errormessages.statustoofewwords = code[i].data; this.errors.statustoofewwords = false; break;
      case 'statustoomanywords': this.errormessages.statustoomanywords = code[i].data; this.errors.statustoomanywords = false; break;
      case 'statuscheck': this.errormessages.statuscheck = code[i].data; this.errors.statuscheck = false; break;
    }
  }
  // NODES
  this.domNodeLabel = WA.createDomNode('label', domID+'_label', this.classes.classname + 'label');
  this.father.domNode.insertBefore(this.domNodeLabel, this.domNode);
  if (self.code.data)
    this.domNodeLabel.innerHTML = self.code.data;

  this.domNodeValue = WA.createDomNode('div', domID+'_value', 'value');
  this.domNode.appendChild(this.domNodeValue);

  this.domNodeField = WA.createDomNode('input', domID+'_field', 'field');
  this.domNodeField.type = this.password?'password':'text';
  this.domNodeField.name = this.id;
  if (this.maxlength)
    this.domNodeField.maxLength = this.maxlength;
  if (this.size)
    this.domNodeField.style.width = this.size+'px';
  this.domNode.appendChild(this.domNodeField);

  this.domNodeCount = WA.createDomNode('span', domID+'_count', 'count');
  this.domNode.appendChild(this.domNodeCount);

  this.domNodeHelp = WA.createDomNode('p', domID+'_help', 'help');
  this.domNode.appendChild(this.domNodeHelp);
  if (self.helpmessage)
    this.domNodeHelp.innerHTML = self.helpmessage;

  this.domNodeError = WA.createDomNode('p', domID+'_error', 'error');
  this.domNode.appendChild(this.domNodeError);

  // responsive design based on container available size, is '', ' medium' or ' tiny'
  // Not activated for now
  this.sizemode = '';

  // we link with the group. first father is the zone, second father is the group
  this.group = null;
  if (this.father.father.code.attributes.type == "groupContainer")
  {
    this.group = this.father.father;
    this.group.registerField(this);
  }

  // If we control some other fields
  this.synchronizer = null;
  this.synchronizeelements = [];

  this.addEvent('resize', resize);
  this.addEvent('start', start);
  this.addEvent('stop', stop);

  function resize()
  {
    WA.Elements.textfieldElement.source.resize.call(self);
    // size mode for responsive design, not activated for now
/*
    var RW = WA.browser.getNodeOuterWidth(self.father.domNode);
    var W1 = WA.browser.getNodeOuterWidth(self.domNodeField); // should be always fixed by CSS or code. We consider fields as fixed size always
    if (RW > W1*2 + 180 && self.sizemode != '')
      self.sizemode = '';
    else if (RW > W1 + 180 && self.sizemode != ' medium')
      self.sizemode = ' medium';
    else if (self.sizemode != ' tiny')
      self.sizemode = ' tiny';
    checkClass();
*/
  }

  this.registerSynchronize = registerSynchronize;
  function registerSynchronize(element)
  {
    self.synchronizeelements.push(element);
  }

  this.unregisterSynchronize = unregisterSynchronize;
  function unregisterSynchronize(element)
  {
    for (var i=0, l=self.synchronizeelements.length; i < l; i++)
    {
      if (self.synchronizeelements[i] == element)
      {
        self.synchronizeelements.splice(i, 1);
        break;
      }
    }
    return;
  }

  this.checkStatus = checkStatus;
  function checkStatus()
  {
    for (var i in self.errors)
      self.errors[i] = false;

    if (self.mode == 0 || !self.edition)
    {
      self.status = 0;
      self.domNodeError.innerHTML = '';
      self.domNodeCount.innerHTML = '';
      return;
    }

    //  default = ok, status = 1 (ok), 2 (editing), 3 (error), 4 (r/o), 5 (disabled)
    if (self.synchronizer)
    {
      // we rebuild synchronizer
      self.synchronizer.checkStatus();
      self.status = self.synchronizer.status;
      return;
    }

    // we check anything based on the attributes of the field
    if (self.disabled[self.mode])
    {
      self.status = 4;
      return;
    }
    if (self.readonly[self.mode])
    {
      self.status = 3;
      return;
    }
    if (self.domNodeField.disabled == true)
      self.domNodeField.disabled == false;
    if (self.domNodeField.readOnly == true)
      self.domNodeField.readOnly == false;
    var value = self.domNodeField.value;
    if (self.value != undefined && value == self.value && self.mode != 1)
    {
      self.status = 0;
      self.domNodeError.innerHTML = '';
      self.domNodeCount.innerHTML = '';
      return;
    }

    self.status = 1;
    if (self.notnull[self.mode] && value == '')
    {
      self.status = 2;
      self.errors.statusnotnull = true;
    }

    if (self.format && value.match(self.format) == null)
    {
      self.status = 2;
      self.errors.statusbadformat = true;
    }
    if (self.minlength && value.length < self.minlength)
    {
      self.status = 2;
      self.errors.statustooshort = true;
    }
    if (self.maxlength && value.length > self.maxlength)
    {
      self.status = 2;
      self.errors.statustoolong = true;
    }
    if (self.maxwords || self.minwords)
    {
      var text = value;
      text = text.replace(/^[ ]+/, "");
      text = text.replace(/[ ]+$/, "");
      text = text.replace(/[ ]+/g, " ");
      text = text.replace(/[\n]+/g, " ");
      var numpalabras = (text.length>0?text.split(" ").length:0);
      if (numpalabras < self.minwords)
      {
        self.status = 2;
        self.errors.statustoofewwords = true;
      }
      if (numpalabras > self.maxwords)
      {
        self.status = 2;
        self.errors.statustoomanywords = true;
      }
      self.domNodeCount.innerHTML = numpalabras + '/' + value.length;
    }
    if (self.errorexternal)
      self.status = 2;
    // user own checks
    if (self.code[0] != undefined && self.code[0].tag != undefined && self.code[0].tag == 'check')
      eval(self.code[0].data);
  }

  this.checkClass = checkClass;
  function checkClass()
  {
    var extras = '';
    switch (self.status)
    {
      case 4: extras += ' disabled'; self.domNodeField.disabled = true; break;
      case 3: extras += ' readonly'; self.domNodeField.readOnly = true; break;
      case 2: extras += ' error'; self.father.setStatus(self.focus?1:(self.firstview?0:3)); break;
      case 1: extras += ' ok'; self.father.setStatus(self.focus?1:(self.firstview?0:2)); break;
      default: self.father.setStatus(self.focus?1:0); break;
    }
    if (self.focus)
      extras += ' edition';
    self.domNodeLabel.className = self.classes.classname + 'label' + extras + self.sizemode;
    self.domNode.className = self.classes.classname + extras + self.sizemode;
  }

  this.checkChildren = checkChildren;
  function checkChildren(onlylocal)
  {
    if (!onlylocal)
    {
      for (var i=0, l=self.synchronizeelements.length; i < l; i++)
      {
        self.synchronizeelements[i].status = self.status;
        self.synchronizeelements[i].checkClass();
        self.synchronizeelements[i].checkChildren();
      }
    }
  }

  this.checkAll = checkAll;
  function checkAll(notifygroup)
  {
    self.checkStatus();
    self.checkClass();
    self.checkChildren(false);

    if (!self.firstview)
    {
      if (!self.errorexternal)
      {
        var text = '';
        for (var i in self.errors)
        {
          if (self.errors[i])
            text += self.errormessages[i] + '<br />';
        }
        self.domNodeError.innerHTML = text;
      }
    }
    else
      self.domNodeError.innerHTML = '';
    if (self.group && notifygroup)
    {
      self.group.pleaseCheck();
    }
  }

  this.setError = setError;
  function setError(values)
  {
    self.domNodeError.innerHTML = values;
    self.errorexternal = true;
    checkAll();
  }

  this.setMode = setMode;
  function setMode(mode, keep)
  {
    self.mode = mode;

    // Set all the data based on the mode
    if (!self.isvisible[mode])
    {
      self.father.hide();
      return;
    }
    self.father.show();

    if (keep)
      self.domNodeValue.innerHTML = self.domNodeField.value;

    self.domNodeValue.style.display = (self.info[mode]?'':'none');

    self.domNodeHelp.style.display = (self.help[mode]?'':'none');
    self.domNodeField.style.display = (self.info[mode]?'none':'');
    self.domNodeCount.style.display = (self.info[mode]?'none':'');
    self.domNodeError.style.display = (self.info[mode]?'none':'');
    self.edition = !self.info[mode];
    if (mode == 1)
      reset();
    else
      checkAll();
  }

  this.reset = reset;
  function reset()
  {
    if (!self.edition)
      return;
    if (self.mode == 1)
    {
      self.value = self.domNodeField.value = self.domNodeValue.innerHTML = self.defaultvalue;
    }
    else if (self.mode == 2 || self.mode == 3)
    {
      self.domNodeValue.innerHTML = self.domNodeField.value = self.value;
    }
    checkAll();
  }

  function onchange()
  {
    self.firstview = false;
    self.errorexternal = false;
    if ((self.value == undefined || self.value == null || self.value == '') && self.domNodeField.value == '')
      self.firstview = true;
    else if (self.value != undefined && self.value != null && self.domNodeField.value == self.value)
      self.firstview = true;
    setTimeout( function() { checkAll(true); }, 0); // check and notify group
  }

  function onblur(e)
  {
    self.focus = false;
    checkAll(true); // check and notify group
  }

  function onfocus(e)
  {
    self.focus = true;
    checkAll(true); // check and notify group
    self.father.setStatus(1);
  }

  function start()
  {
    WA.Managers.event.on('keyup', self.domNodeField, onchange, true);
    WA.Managers.event.on('focus', self.domNodeField, onfocus, true);
    WA.Managers.event.on('blur', self.domNodeField, onblur, true);

    // If we are controled by another field
    if (self.code.attributes.synchronizer)
    {
      self.synchronizer = WA.$N(self.code.attributes.synchronizer);
      if (self.synchronizer)
        self.synchronizer.registerSynchronize(self);
    }
    // we do not check, there is still no value. the setMode will do the job
  }

  this.getValues = getValues;
  function getValues()
  {
    return self.domNodeField.value;
  }

  this.setValues = setValues;
  function setValues(values)
  {
    self.firstview = true;
    self.value = self.domNodeField.value = values;
    if (values != undefined && values != null)
      self.domNodeValue.innerHTML = values;
    else
      reset();
    checkAll();
  }

  this.stop = stop;
  function stop()
  {
    if (self.group)
      self.group.unregisterField(self);
    WA.Managers.event.off('keyup', self.domNode, self.onchange, true);
    WA.Managers.event.off('focus', self.domNode, self.onfocus, true);
    WA.Managers.event.off('blur', self.domNode, self.onblur, true);
  }

  this.destroy = destroy;
  function destroy(fast)
  {
    WA.Elements.textfieldElement.source.destroy.call(self, fast);

    self.synchronizer = null;
    self.synchronizeelements = [];
    self.group = null;
    self.domNodeError = null;
    self.domNodeHelp = null;
    self.domNodeValue = null;
    self.domNodeCount = null;
    self.domNodeField = null;
    self.domNodeLabel = null;
    self.errormessages = null;
    self.errors = null;
    self.isvisible = null;
    self.info = null;
    self.disabled = null;
    self.readonly = null;
    self.notnull = null;
    self.help = null;
    self = null;
  }
}

// Add basic element code
WA.extend(WA.Elements.textfieldElement, WA.Managers.wa4gl._element);
