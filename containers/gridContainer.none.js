
/*
    gridContainer.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains container to control a grid of zones
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

// each zone is a COLUMN
// the zone itself contains the EDITOR and is not visible when loaded
function gridZone(maincontainer, domID, domNodeContainer, params, notify)
{
  var self = this;
  this.type = 'zone';
  this.maincontainer = maincontainer;
  this.domID = domID;
  this.xdomID = WA.parseID(domID);
  this.domNodeContainer = domNodeContainer;
  this.params = params;
  this.notify = notify;
  this.running = 0;

  this.visible = false;
  this.editable = params.attributes.editable=='yes'?true:false;
  this.editor = this.editable?params.attributes.editor:null;

  this.classnameeditor = params.attributes.classnameeditor!=undefined?params.attributes.classnameeditor:maincontainer.classes.classnameeditor;

  // EDITOR MAIN DIVISION
  this.domNode = WA.createDomNode('div', domID, this.classnameeditor);
  this.domNode.style.position = 'absolute';
  this.domNode.style.display = 'none';
  domNodeContainer.appendChild(this.domNode);

  this.callNotify = callNotify;
  function callNotify(type)
  {
    var result = true;
    // no notifications if the app is not started
    if (self.notify && self.running == 2)
      result = self.notify(type, self.domID, {id:self.xdomID[2]});
    return result;
  }

  this.setSize = setSize;
  function setSize(w, h)
  {
    if (w)
      self.domNode.style.width = w + 'px';
    if (h)
      self.domNode.style.height = h + 'px';
    // ask for inner zone resize
    self.resize();
  }

  this.setPosition = setPosition;
  function setPosition(l, t)
  {
    if (l)
      self.domNode.style.left = l + 'px';
    if (t)
      self.domNode.style.top = t + 'px';
  }

  this.setData = setData;
  function setData(data)
  {
    var e = WA.$E(self.maincontainer._4glNode.application.prependID + self.editor);
    if (e)
      e.setValues(data);


    // set the listener to get the blur, copy value and hide the zone



    // *****************************


  }

  this.setFocus = setFocus;
  function setFocus()
  {
    var e = WA.$E(self.maincontainer._4glNode.application.prependID + self.editor);
    if (e)
      e.domNode.focus();
  }

  this.getData = getData;
  function getData()
  {
    var e = WA.$E(self.maincontainer._4glNode.application.prependID + self.editor);
    if (e)
      return e.getValues();
    return null;
  }

  this.start = start;
  function start()
  {
    self.running = 2;
    // register 'blur' 4GL event on the editor to modify/send to the server

  }

  this.stop = stop;
  function stop()
  {
    self.running = 0;
  }

  this.resize = resize;
  function resize()
  {
    if (self.running == 2 && self.visible)
      self.callNotify('pleaseresize');
  }

  this.show = show;
  function show()
  {
    // we put the node over all
    self.domNodeContainer.appendChild(self.domNode);
    self.visible = true;
    self.domNode.style.display = '';
    self.resize();
  }

  this.hide = hide;
  function hide()
  {
    self.visible = false;
    self.domNode.style.display = 'none';
  }

  this.destroy = destroy;
  function destroy()
  {
    if (self.running)
      self.stop();
    self.domNode = null;
    self.notify = null;
    self.params = null;
    self.domNodeContainer = null;
    self.xdomID = null;
    self.domID = null;
    self.maincontainer = null;
    self = null;
  }
}

function gridColumn(maincontainer, domID, domNodeContainer, params, notify)
{
  var self = this;
  this.type = 'zone';
  this.maincontainer = maincontainer;
  this.domID = domID;
  this.xdomID = WA.parseID(domID);
  this.domNodeContainer = domNodeContainer;
  this.params = params;
  this.notify = notify;
  this.running = 0;

  this.id = params.attributes.id;

  this.visible = params.attributes.display?params.attributes.display!='none':true;
  this.maskable = params.attributes.maskable=='yes'?true:false;

  this.sortable = params.attributes.sortable=='yes'?true:false;
  this.order = 0;   // 0 = none, 1 = asc, 2 = desc

  this.render = params.attributes.render;
  this.format = params.attributes.format;

  this.sizeable = params.attributes.sizeable=='yes'?true:false;
  this.sizemin = params.attributes.sizemin!=undefined?params.attributes.sizemin:60;
  this.sizemax = params.attributes.sizemax!=undefined?params.attributes.sizemax:0;
  this.pleasenoclick = false;    // set to true if dragging size and no click for menu needed

  this.filtered = false;
  this.filterfrom = null;
  this.filterto = null;

  this.selectable = params.attributes.selectable=='yes'?true:false;
  self.maincontainer.isselectable |= this.selectable;

  this.editable = params.attributes.editable=='yes'?true:false;
  self.maincontainer.iseditable |= this.editable;

  this.classname = params.attributes.classname!=undefined?params.attributes.classname:maincontainer.classes.classnamecelltitle;
  this.classnamecell = params.attributes.classnamecell!=undefined?params.attributes.classnamecell:maincontainer.classes.classnamecell;
  this.classnamesizer = params.attributes.classnamesizer!=undefined?params.attributes.classnamesizer:maincontainer.classes.classnamecelltitlesizer;
  this.classnamezone = params.attributes.classnamezone!=undefined?params.attributes.classnamezone:maincontainer.classes.classnamezone;
  this.classnameasc = params.attributes.classnameasc!=undefined?params.attributes.classnameasc:maincontainer.classes.classnamecelltitleasc;
  this.classnamedesc = params.attributes.classnamedesc!=undefined?params.attributes.classnamedesc:maincontainer.classes.classnamecelltitledesc;
  this.classnamefiltered = params.attributes.classnamefiltered!=undefined?params.attributes.classnamefiltered:maincontainer.classes.classnamecelltitlefiltered;
  this.classnameempty = params.attributes.classnameempty!=undefined?params.attributes.classnameempty:maincontainer.classes.classnamecelltitleempty;

  this.domNode = WA.createDomNode('div', domID+'_title', this.classname);
  this.domNode.style.width = params.attributes.size + (params.attributes.size.indexOf('%') >= 0?'':'px');
  this.domNode.style.overflow = 'hidden';
  this.domNode.style.styleFloat = 'left';
  this.domNode.style.cssFloat = 'left';
  this.domNode.style.display = this.visible?'':'none';
  domNodeContainer.appendChild(this.domNode);

  this.size = WA.browser.getNodeWidth(this.domNode);

  // selector, selector pannel, sizer, all hidden
  this.domNodeSizer = WA.createDomNode('div', domID+'_sizer', this.classnamesizer);
  this.domNodeSizer.style.styleFloat = 'right';
  this.domNodeSizer.style.cssFloat = 'right';
  this.domNode.appendChild(this.domNodeSizer);

  this.domNodeTitle = WA.createDomNode('div', domID+'_title', null);
  this.domNodeTitle.style.overflow = 'hidden';
  this.domNode.appendChild(this.domNodeTitle);

  this.callNotify = callNotify;
  function callNotify(type)
  {
    var result = true;
    // no notifications if the app is not started
    if (self.notify && self.running == 2)
      result = self.notify(type, self.domID, {id:self.xdomID[2]});
    return result;
  }

  this.setTitle = setTitle;
  function setTitle()
  {
    var title = self.params.attributes.title;
    switch(self.order)
    {
      case 1: title = '<img src="/pics/dot.png" class="'+self.classnameasc+'" />' + title; break;
      case 2: title = '<img src="/pics/dot.png" class="'+self.classnamedesc+'" />' + title; break;
      default: title = '<img src="/pics/dot.png" class="'+self.classnameempty+'" />' + title; break;
    }
    if (self.filtered)
    {
      title = '<img src="/pics/dot.png" class="'+self.classnamefiltered+'" />' + title;
    }

    WA.browser.setInnerHTML(self.domNodeTitle, title);
  }

  this.setSize = setSize;
  function setSize(size)
  {
    if (size < self.sizemin)
      size = self.sizemin;
    if (self.sizemax != 0 && size > self.sizemax)
      size = self.sizemax;
    self.domNode.style.width = size + 'px';
    self.resize();
    self.size = size;
  }

  this.click = click;
  function click()
  {
    if (self.pleasenoclick)
    {
      self.pleasenoclick = false;
      return;
    }
    self.order ++;
    if (self.order > 2)
      self.order = 1;
    self.maincontainer.reorder(self.id, self.order==1?true:false);
    self.setTitle();
  }

  this.clicksizer = clicksizer;
  function clicksizer()
  {
    if (self.pleasenoclick)
    {
      self.pleasenoclick = false;
      return;
    }
//    alert('lista de campos y filtro');
  }

  this.move = move;
  function move(type, event, group, object, zone, data)
  {
    if (type == 'start')
    {
      self.pleasenoclick = true;
      var size = WA.browser.getNodeWidth(self.domNode);
      self.maincontainer.startdrag(self.id, size, event, group, object, zone, data);
    }
    else if (type == 'drag' || type == 'drop')
    {
      self.maincontainer.drag(event, group, object, zone, data);
    }
    if (type == 'drop')
    {
      self.maincontainer.drop(event, group, object, zone, data);
    }
  }

  this.start = start;
  function start()
  {
    WA.Managers.event.on('click', self.domNodeTitle, self.click, true);
    WA.Managers.event.on('click', self.domNodeSizer, self.clicksizer, true);

    if (self.sizeable)
    {
      WA.Managers.dd.registerGroup(self.domID+'_sizer', 'caller', false, null, self.move);
      WA.Managers.dd.registerObject(self.domID+'_sizer', self.domID+'_sizer', self.domID+'_sizer', null);
    }

    self.running = 2;
  }

  this.stop = stop;
  function stop()
  {
    WA.Managers.dd.unregisterObject(self.domID+'_sizer');
    WA.Managers.dd.unregisterGroup(self.domID+'_sizer');
    self.running = 0;
  }

  this.resize = resize;
  function resize()
  {
    // cannot resize if not visible or not running
    if (self.running != 2 || !self.visible || !self.maincontainer.visible)
      return;

    // repaint content
    var size = WA.browser.getNodeWidth(self.domNode);
    var disp = size - WA.browser.getNodeOuterWidth(self.domNodeSizer) - WA.browser.getNodeExtraWidth(self.domNodeTitle);
    self.domNodeTitle.width = disp + 'px';
    self.size = size;
  }

  this.show = show;
  function show()
  {
    self.visible = true;
    self.domNode.style.display = '';
  }

  this.hide = hide;
  function hide()
  {
    self.visible = false;
    self.domNode.style.display = 'none';
  }

  this.destroy = destroy;
  function destroy()
  {
    if (self.running)
      self.stop();
    self.domNode = null;
    self.domNodeTitle = null;
    self.domNodeSizer = null;
    self.domNodeContainer = null;
    self.params = null;
    self.notify = null;
    self.xdomID = null;
    self.domID = null;
    self.maincontainer = null;
    self = null;
  }

  this.setTitle();
}



// each line is a dataset of cells
function gridLine(maincontainer, domID, domNodeContainer, data, index)
{
  var self = this;
  this.maincontainer = maincontainer;
  this.domID = domID;
  this.domNodeContainer = domNodeContainer;
  this.data = data;
  this.running = 0;
  this.visible = false;
  this.cellcount = 1;
  this.cells = {};
  this.selected = false;

  this.domNode = WA.createDomNode('div', self.domID, self.maincontainer.classes.classnameline);
//  this.domNode.style.position = 'relative';
  this.domNode.style.width = '10000px';
  this.domNode.style.height = '18px';
  this.domNode.style.overflow = 'hidden';
  domNodeContainer.appendChild(this.domNode);
  this.key = data.key;
  this.index = index;

  this.start = start;
  function start()
  {
    for (var i in self.cells)
      WA.Managers.event.on('click', self.cells[i], self.click, true);
    self.running = 2;
  }

  this.stop = stop;
  function stop()
  {
    self.running = 0;
    for (var i in self.cells)
      WA.Managers.event.off('click', self.cells[i], self.click, true);
  }

  this.select = select;
  function select()
  {
    if (self.selected)
      return;
    self.selected = true;
    self.domNode.className = self.maincontainer.classes.classnamelineselected;
  }

  this.unselect = unselect;
  function unselect()
  {
    if (!self.selected)
      return;
    self.selected = false;
    self.domNode.className = self.maincontainer.classes.classnameline;
  }

  this.invert = invert;
  function invert()
  {
    if (self.selected)
      self.unselect();
    else
      self.select();
  }

  this.click = click;
  function click(e)
  {
    // we get the cell where the click happened and we edit it if editable
    var order = '';
    if (self.maincontainer.mode == 'view')
    {
      self.maincontainer.callNotify('click', {key:self.key,column:this.column,data:self.data});
      return;
    }
    else if (self.maincontainer.mode == 'select')
    {
      // columna seleccionable ? linea seleccionable ?
      if (self.maincontainer.isselectable)
      {
        order = 'invert';

        // ********************************* STILL HAVE TO IMPLEMENT CELL SELECT ???

      }
    }
    else if (self.maincontainer.mode == 'edit')
    {
      var ctrl = WA.browser.ifCtrl(e);
      if (ctrl)
        order = 'invert'
      else
        order = 'edit';
    }

    if (order == 'invert')
      self.invert();
    else if (order == 'edit')
    {
        // show the edit container
      self.maincontainer.zones[this.column].show();
      var l = WA.browser.getNodeNodeLeft(this, self.maincontainer.domNodeBodyContent);
      var t = WA.browser.getNodeNodeTop(this, self.maincontainer.domNodeBodyContent);
      var w = WA.browser.getNodeWidth(this);
      self.maincontainer.zones[this.column].setPosition(l, t);
      self.maincontainer.zones[this.column].setSize(w, null);
      self.maincontainer.zones[this.column].setData(this.data);
      self.maincontainer.zones[this.column].setFocus();
      // implements the blur to get feedback when goes outside of this component
      self.maincontainer.zones[this.column].domNode.column = this.column;
      self.maincontainer.zones[this.column].domNode.cell = this;
      WA.Managers.event.on('blur', self.maincontainer.zones[this.column].domNode, self.blur, true);
    }

  }

  this.blur = blur;
  function blur()
  {
    var data = self.maincontainer.zones[this.column].getData();
    self.maincontainer.zones[this.column].hide();

    // we have to pass by RENDER
    WA.browser.setInnerHTML(this.cell, data);

    this.cell.data = data;
    this.cell = null;

    WA.Managers.event.off('blur', self.maincontainer.zones[this.column].domNode, self.blur, true);
    // we set the class to modified

    // we send SAVE to server if realtime

  }

  this.createCell = createCell;
  function createCell(zone, content, data)
  {
    var domNodeCell = WA.createDomNode('div', self.domID+'_cell'+zone.id, zone.classnamecell);
    domNodeCell.style.styleFloat = 'left';
    domNodeCell.style.cssFloat = 'left';
    domNodeCell.style.width = zone.size + 'px';
    domNodeCell.style.height = '15px';
    domNodeCell.style.overflow = 'hidden';
    domNodeCell.style.whiteSpace = 'nowrap';
    domNodeCell.column = zone.id;
    domNodeCell.data = content;
    self.domNode.appendChild(domNodeCell);

    if (zone.render)
    {
      eval( 'var cdata = ' + zone.render+'(zone.format, content, data);' );
      WA.browser.setInnerHTML(domNodeCell, cdata);
    }
    else
      WA.browser.setInnerHTML(domNodeCell, content);

    return domNodeCell;
  }

  this.populate = populate;
  function populate()
  {
    for (var i in self.maincontainer.columns)
    {
      if (data[i] != undefined)
        self.cells[i] = self.createCell(self.maincontainer.columns[i], data[i], data);
      else
        self.cells[i] = self.createCell(self.maincontainer.columns[i], '', data);
    }
  }

  this.destroy = destroy;
  function destroy()
  {
    self.stop();
    domNodeContainer.removeChild(this.domNode);

    self.domNode = null;
    self.key = null;
    self.data = null;
    self.domNodeContainer = null;
    self.domID = null;
    self.maincontainer = null;
    self = null;
  }
}

// the footer manage mode, submodes, pagination
// modes are view, select, edit
// in view mode, nothing really happens, more than mouse over on line and click = event
// in select mode:
//   grid selectable only: click on line select line, other click unselect line
//   grid AND cell selectable: click on cell select cell, other click select line, other click unselect all
//   cell selectable only: click on cell select cell, other click unselect cell
//   some footer buttons: select all, unselect all, select inverse
// in edit mode:
//   click on cell edit cell, if editable
//   if deferred, put the cell modified and add a button "save" and "undo"
//   if deferred, put the new line and add a button "save" and "undo"
// if the grid has pagination: put the "Page: 1..2..3.....x-1..x..x+1....n-2..n-1..n  goto [..]> "
// if the dataset is incomplete, reload each page against server and order against server and filter against server
function gridFooter(maincontainer, domID, domNodeFather)
{
  var self = this;
  this.maincontainer = maincontainer;
  this.domID = domID;
  this.domNodeFather = domNodeFather;

  this.domNodeView = WA.createDomNode('div', domID+'_view');
  this.domNodeView.style.display = 'none';
  this.domNodeFather.appendChild(this.domNodeView);
  this.domNodeViewIcon = WA.createDomNode('img', domID+'_viewicon', maincontainer.classes.classnameviewicon);
  this.domNodeViewIcon.src = '/pics/dot.png';
  this.domNodeView.appendChild(this.domNodeViewIcon);
  WA.browser.setInnerHTML(this.domNodeViewIcon, '&nbsp;');

  this.domNodeSelect = WA.createDomNode('div', domID+'_view');
  this.domNodeSelect.style.display = 'none';
  this.domNodeFather.appendChild(this.domNodeSelect);
  this.domNodeSelectIcon = WA.createDomNode('img', domID+'_selecticon', maincontainer.classes.classnameselecticon);
  this.domNodeSelectIcon.src = '/pics/dot.png';
  this.domNodeSelect.appendChild(this.domNodeSelectIcon);
  this.domNodeSelectClear = WA.createDomNode('img', domID+'_selectclear', maincontainer.classes.classnameselectclear);
  this.domNodeSelectClear.src = '/pics/dot.png';
  this.domNodeSelect.appendChild(this.domNodeSelectClear);
  this.domNodeSelectAll = WA.createDomNode('img', domID+'_selectall', maincontainer.classes.classnameselectall);
  this.domNodeSelectAll.src = '/pics/dot.png';
  this.domNodeSelect.appendChild(this.domNodeSelectAll);
  this.domNodeSelectInverse = WA.createDomNode('img', domID+'_selectinverse', maincontainer.classes.classnameselectinverse);
  this.domNodeSelectInverse.src = '/pics/dot.png';
  this.domNodeSelect.appendChild(this.domNodeSelectInverse);

  this.domNodeEdit = WA.createDomNode('div', domID+'_view');
  this.domNodeEdit.style.display = 'none';
  this.domNodeFather.appendChild(this.domNodeEdit);
  this.domNodeEditIcon = WA.createDomNode('img', domID+'_editicon', maincontainer.classes.classnameediticon);
  this.domNodeEditIcon.src = '/pics/dot.png';
  this.domNodeEdit.appendChild(this.domNodeEditIcon);
  this.domNodeEditNew = WA.createDomNode('img', domID+'_editnew', maincontainer.classes.classnameeditnew);
  this.domNodeEditNew.src = '/pics/dot.png';
  this.domNodeEditNew.style.display = (maincontainer.insertable?'':'none');
  this.domNodeEdit.appendChild(this.domNodeEditNew);
  this.domNodeEditDelete = WA.createDomNode('img', domID+'_editdelete', maincontainer.classes.classnameeditdelete);
  this.domNodeEditDelete.src = '/pics/dot.png';
  this.domNodeEditDelete.style.display = (maincontainer.deletable?'':'none');
  this.domNodeEdit.appendChild(this.domNodeEditDelete);
  this.domNodeEditSave = WA.createDomNode('img', domID+'_editsave', maincontainer.classes.classnameeditsave);
  this.domNodeEditSave.src = '/pics/dot.png';
  this.domNodeEditSave.style.display = (maincontainer.changes?'':'none');
  this.domNodeEdit.appendChild(this.domNodeEditSave);

  this.setMode = setMode;
  function setMode()
  {
    self.domNodeView.style.display = 'none';
    self.domNodeSelect.style.display = 'none';
    self.domNodeEdit.style.display = 'none';
    if (self.maincontainer.mode == 'view')
      self.domNodeView.style.display = '';
    else if (self.maincontainer.mode == 'select')
      self.domNodeSelect.style.display = '';
    else if (self.maincontainer.mode == 'edit')
      self.domNodeEdit.style.display = '';

    // check various status of contained buttons
  }

  this.start = start;
  function start()
  {
    WA.Managers.event.on('click', self.domNodeViewIcon, self.clickviewicon, true);
    WA.Managers.event.on('click', self.domNodeSelectIcon, self.clickselecticon, true);
    WA.Managers.event.on('click', self.domNodeSelectClear, self.clickselectclear, true);
    WA.Managers.event.on('click', self.domNodeSelectAll, self.clickselectall, true);
    WA.Managers.event.on('click', self.domNodeSelectInverse, self.clickselectinverse, true);
    WA.Managers.event.on('click', self.domNodeEditIcon, self.clickediticon, true);
    WA.Managers.event.on('click', self.domNodeEditNew, self.clickeditnew, true);
    WA.Managers.event.on('click', self.domNodeEditDelete, self.clickeditdelete, true);
    WA.Managers.event.on('click', self.domNodeEditSave, self.clickeditsave, true);

    // add help too
    help(self.domNodeViewIcon, {title:'Estas en modo Ver. Click para cambiar el modo'});
    help(self.domNodeSelectIcon, {title:'Estas en modo Seleccionar. Click para cambiar el modo. (click en las lineas para seleccionar/deseleccionar)'});
    help(self.domNodeSelectClear, {title:'Deseleccionar todo'});
    help(self.domNodeSelectAll, {title:'Seleccionar todo'});
    help(self.domNodeSelectInverse, {title:'Invertir la seleccion'});
    help(self.domNodeEditIcon, {title:'Estas en modo Editar. Click para cambiar el modo'});
    help(self.domNodeEditNew, {title:'Insertar nuevo renglon'});
    help(self.domNodeEditDelete, {title:'Borrar los renglones seleccionados (shift-click en las lineas para seleccionar/deseleccionar)'});
    help(self.domNodeEditSave, {title:'Guardar los cambios realizados'});

  }

  this.stop = stop;
  function stop()
  {
    WA.Managers.event.off('click', self.domNodeViewIcon, self.clickviewicon, true);
    WA.Managers.event.off('click', self.domNodeSelectIcon, self.clickselecticon, true);
    WA.Managers.event.off('click', self.domNodeSelectClear, self.clickselectclear, true);
    WA.Managers.event.off('click', self.domNodeSelectAll, self.clickselectall, true);
    WA.Managers.event.off('click', self.domNodeSelectInverse, self.clickselectinverse, true);
    WA.Managers.event.off('click', self.domNodeEditIcon, self.clickediticon, true);
    WA.Managers.event.off('click', self.domNodeEditNew, self.clickeditnew, true);
    WA.Managers.event.off('click', self.domNodeEditDelete, self.clickeditdelete, true);
    WA.Managers.event.off('click', self.domNodeEditSave, self.clickeditsave, true);
  }

  this.clickviewicon = clickviewicon;
  function clickviewicon()
  {
    if (self.maincontainer.isselectable)
      self.maincontainer.mode = 'select';
    else if (self.maincontainer.iseditable)
      self.maincontainer.mode = 'edit';
    self.setMode();
  }

  this.clickselecticon = clickselecticon;
  function clickselecticon()
  {
    if (self.maincontainer.iseditable)
      self.maincontainer.mode = 'edit';
    else
      self.maincontainer.mode = 'view';
    self.setMode();
  }

  this.clickselectclear = clickselectclear;
  function clickselectclear()
  {
    self.maincontainer.selectmask('clear');
  }

  this.clickselectall = clickselectall;
  function clickselectall()
  {
    self.maincontainer.selectmask('all');
  }

  this.clickselectinverse = clickselectinverse;
  function clickselectinverse()
  {
    self.maincontainer.selectmask('inverse');
  }

  this.clickediticon = clickediticon;
  function clickediticon()
  {
    self.maincontainer.mode = 'view';
    self.setMode();
  }

  this.clickeditnew = clickeditnew;
  function clickeditnew(e)
  {
    self.maincontainer.newline();
  }

  this.clickeditdelete = clickeditdelete;
  function clickeditdelete()
  {
    self.maincontainer.deleteselected();
  }

  this.clickeditsave = clickeditsave;
  function clickeditsave()
  {
    self.maincontainer.saveall();
  }
}

function gridContainer(domNodeFather, domID, params, notify, _4glNode)
{
  var self = this;
  this.type = 'container';
  this._4glNode = _4glNode;
  this.domNodeFather = domNodeFather;
  this.domID = domID;
  this.xdomID = WA.parseID(domID);
  this.params = params;
  this.notify = notify;

  this.running = 0;
  this.visible = params.attributes.display?params.attributes.display!='none':true;
  this.zones = {};          // all the zones
  this.columns = {};       // all the columns
  this.renders = {};        // all the renders
  this.templates = {};      // all the templates
  this.data = null;         // all the data rows we can use for this grid

  this.lines = [];          // all the lines of data
  this.linecount = 0;       // the lines counter to add more lines

  this.haslistener = (params.attributes.haslistener==='yes');
  this.selectable = (params.attributes.selectable==='yes');
  this.changes = (params.attributes.changes==='deferred');  // true = deferred on user click, false: online changes (if haslistener obviously)
  this.mode = params.attributes.mode!=undefined?params.attributes.mode:'view';   // mode is one of view, select, edit
  if (this.mode != 'view' && this.mode != 'select' && this.mode != 'edit')
    this.mode = 'view';
  this.isselectable = this.selectable;   // global selectable indicator (row or any field selectable)
  this.iseditable = false;               // global editable indicator (any field editable)
  this.insertable = params.attributes.insertable=='yes'?true:false;
  this.deletable = params.attributes.deletable=='yes'?true:false;

  this.parameters = params.attributes.params!=undefined?params.attributes.params:'';   // params to send to sever with any request

  this.classes = WA.getClasses( params.attributes,
    { classname:'grid', classnameeditor:'grideditor',
      classnameheader:'gridheader', classnameheadercontent:'gridheadercontent',
      classnamebody:'gridbody', classnamebodycontent:'gridbodycontent',
      classnamefooter:'gridfooter', classnamefootercontent:'gridfootercontent',
      classnamecelltitle:'gridcelltitle', classnamecelltitleempty:'gridcelltitleempty',
      classnamecelltitleasc:'gridcelltitleasc', classnamecelltitledesc:'gridcelltitledesc', classnamecelltitlefiltered:'gridcelltitlefiltered',
      classnamecelltitlesizer:'gridcelltitlesizer',
      classnameline:'gridline',classnamelineselected:'gridlineselected',classnamelinenew:'gridlinenew',
      classnamecell:'gridcell',classnamecellmodified:'gridcellmodified',
      classnameviewicon:'gridviewicon', classnameselecticon:'gridselecticon', classnameediticon:'gridediticon',
      classnameselectclear:'gridselectclear', classnameselectall:'gridselectall', classnameselectinverse:'gridselectinverse',
      classnameeditnew:'grideditnew', classnameeditsave:'grideditsave', classnameeditdelete:'grideditdelete'

    } );

  // the grid is a division, then a table simulated into a division, then a division (status, etc)
  this.domNode = WA.createDomNode('div', domID, this.classes.classname);
  this.domNode.style.overflow = 'hidden';
  this.domNode.style.display = this.visible?'':'none';
  domNodeFather.appendChild(this.domNode);

  // header division
  this.domNodeHeader = WA.createDomNode('div', domID+'_header', this.classes.classnameheader);
  this.domNode.appendChild(this.domNodeHeader);
  this.domNodeHeaderContent = WA.createDomNode('div', domID+'_headercontent', this.classes.classnameheadercontent);
  this.domNodeHeaderContent.style.position = 'relative';
  this.domNodeHeaderContent.style.width = '10000px';
  this.domNodeHeader.appendChild(this.domNodeHeaderContent);

  // body
  this.domNodeBody = WA.createDomNode('div', domID+'_body', this.classes.classnamebody);
  this.domNodeBody.style.overflow = 'auto';
  this.domNode.appendChild(this.domNodeBody);
  this.domNodeBodyContent = WA.createDomNode('div', domID+'_bodycontent', this.classes.classnamebodycontent);
  this.domNodeBodyContent.style.overflow = 'hidden';
  this.domNodeBodyContent.style.position = 'relative';
  this.domNodeBody.appendChild(this.domNodeBodyContent);

  // footer
  this.domNodeFooter = WA.createDomNode('div', domID+'_footer', this.classes.classnamefooter);
  this.domNode.appendChild(this.domNodeFooter);
  this.domNodeFooterContent = WA.createDomNode('div', domID+'_footercontent', this.classes.classnamefootercontent);
  this.domNodeFooter.appendChild(this.domNodeFooterContent);

  this.footer = new gridFooter(this, domID+'_footer', this.domNodeFooterContent);
  this.footer.setMode();

  this.pagination = null;   // the pagination stuff
  this.maxperpage = 0;      // no pagination per default, controlled by paginationElement

  this.locali = false;
  this.localid = null;

  this.sendServer = sendServer;
  function sendServer(order, params, feedback)
  {
    if (!self.haslistener)
      return;
    // send information to server based on mode
    var request = WA.Managers.ajax.createRequest(WA.Managers.wa4gl.url+'?P='+self._4glNode.application.appID + '.' + self._4glNode.id + '.json', 'POST', 'Order='+order+(self.parameters?'&'+self.parameters:''), feedback, false);
    if (request)
    {
      for (var i in params)
      {
        request.addParameter(i, params[i]);
      }
      request.send();
    }
  }

  // local method to call global notify
  this.callNotify = callNotify;
  function callNotify(type, params)
  {
    var result = true;
    // no notifications if the app is not started
    if (self.notify && self.running == 2)
      result = self.notify(type, self.domID, params?params:{id:self.xdomID[2]});
    return result;
  }

  // each zone is a COLUMN
  this.createZone = createZone;
  function createZone(domID, params, notify)
  {
    var ldomID = WA.parseID(domID, self.xdomID);

    // 1. call event precreate
    if (!self.callNotify('precreate', {id:ldomID[2]}))
      return null;

    if (!params.attributes.id)
      throw 'Error: the id is missing in the tree construction of '+domID;

    // we create the column itself
    var z = new gridZone(this, domID, self.domNodeBodyContent, params, notify);
    var c = new gridColumn(this, domID+'_column', self.domNodeHeaderContent, params, notify);
    self.zones[params.attributes.id] = z;
    self.columns[params.attributes.id] = c;
    self.callNotify('postcreate', {id:ldomID[2]});

    if (self.running == 2)
    {
      z.start();
      c.start();
    }

    return z;
  }

  this.checkID = checkID;
  function checkID(id)
  {
    // 1. check zone is valid
    self.locali = false;
    self.localid = null;
    if (typeof id == 'number')
    {
      if (self.columns[id] == undefined)
        return false;
      self.locali = id;
      self.localid = self.columns[id].xdomID;
    }
    else
    {
      if (typeof id == 'string')
        self.localid = WA.parseID(id, self.xdomID);
      else
        self.localid = id;
      self.locali = WA.getIndexById(self.columns, self.localid[3], 'domID');
      if (self.locali === false)
      {
        self.localid = null;
        return false;
      }
    }
    return true;
  }

  this.destroyZone = destroyZone;
  function destroyZone(id)
  {
    if (!self.checkID(id))
      return;

    // 2. call event predestroy
    if (!self.callNotify('predestroy', {id:self.localid[2]}) )
      return;

    self.columns[self.locali].destroy();
    self.columns.splice(self.locali,1);
    self.callNotify('postdestroy', {id:self.localid[2]});
  }

  this.activateZone = activateZone;
  function activateZone(id)
  {
    self.showZone(id);
  }

  this.showZone = showZone;
  function showZone(id)
  {
    if (!self.checkID(id))
      return;

  }

  this.hideZone = hideZone;
  function hideZone(id)
  {
    if (!self.checkID(id))
      return;

  }

  this.show = show;
  function show()
  {
    if (self.visible)
      return;
    if (!self.callNotify('preshow'))
      return;
    self.domNode.style.display = '';
    self.visible = true;
    self.resize();
    self.callNotify('postshow');
  }

  this.hide = hide;
  function hide()
  {
    if (!self.visible)
      return;
    if (!self.callNotify('prehide'))
      return;
    self.visible = false;
    self.domNode.style.display = 'none';
    self.callNotify('posthide');
  }

  this.setSize = setSize;
  function setSize(w,h)
  {
    if (!self.callNotify('presize'))
      return;
    if (w !== null)
      self.params.attributes.width = w;
    if (h !== null)
      self.params.attributes.height = h;
    self.resize();
    self.callNotify('postsize');
  }

  this.setPosition = setPosition;
  function setPosition(l,t)
  {
    if (!self.callNotify('preposition'))
      return;
    if (l !== null)
      self.params.attributes.left = l;
    if (t !== null)
      self.params.attributes.top = t;
    self.resize();
    self.callNotify('postposition');
  }

  this.setAnchor = setAnchor;
  function setAnchor(l,t)
  {
    if (!self.callNotify('preanchor'))
      return;
    if (l !== null)
      self.params.attributes.anchorleft = l;
    if (t !== null)
      self.params.attributes.anchortop = t;
    self.resize();
    self.callNotify('postanchor');
  }

  this.getValues = getValues;
  function getValues()
  {
    return null;
  }

  this.setValues = setValues;
  function setValues(values)
  {

  }

  // ========================================================================================
  // system functions, called ONLY BY 4GL
  // constructor is called when creating the object.
  // start is called when the object is started, i.e. listeners activated.
  // resize is called when the object is transformed in any way.
  // stop is called when the object is stopped, i.e. listeners stopped.
  // destroy is called when the object is physically destroyed.

  this.start = start;
  function start()
  {
    if (self.running != 0)
      return;
    self.running = 1;
    // we start all children
    for (var i in self.zones)
      self.zones[i].start();
    for (var i in self.columns)
      self.columns[i].start();
    self.populate();
    WA.Managers.event.on('scroll', self.domNodeBody, self.scroll, true);

    self.footer.start();
    this.running = 2;
  }

  this.resize = resize;
  function resize()
  {
    if (self.running != 2 || !self.visible)
      return;

    // 1. resize main container
    self._4glNode.nodeResize(self.domNodeFather, self.domNode, self.params.attributes);

//    self.domNodeHeaderContent.style.width = self.calculateWidth() + 'px';
    var totalheight = WA.browser.getNodeInnerHeight(self.domNode) - WA.browser.getNodeOuterHeight(self.domNodeHeader) - WA.browser.getNodeOuterHeight(self.domNodeFooter) - WA.browser.getNodeExternalWidth(self.domNodeBody);

    WA.debug.explain('gridContainer['+self.domID+'].resize: '+WA.browser.getNodeInnerHeight(self.domNode) + ' ' + totalheight+'<br />');
    self.domNodeBody.style.height = totalheight + 'px';
  }

  this.stop = stop;
  function stop()
  {
    if (self.running != 1 && self.running != 2)
      return;
    self.running = 4;
    self.footer.stop();
    for (var i in self.columns)
      self.columns[i].stop();
    self.running = 0;
  }

  this.destroy = destroy;
  function destroy(fast)
  {
    if (self.running != 0)
      self.stop();

    // destroy all zones
    for (var i in self.columns)
      self.columns[i].destroy(fast);

    if (!fast)
      self.domNodeFather.removeChild(self.domNode);

    self.locali = null;
    self.localid = null;
    self.domNode = null;
    self.columns = null;
    self.templates = null;
    self.lines = null;
    self.data = null;
    self.notify = null;
    self.params = null;
    self.domID = null;
    self.xdomID = null;
    self.domNodeFather = null;
    self._4glNode = null;
    self = null;
  }


  // ================================================================
  // move divisions by program and mouse
  this.startdrag = startdrag;
  function startdrag(sizerID, size, event, group, object, zone, data)
  {

    self.movingsize = size;
    self.movingID = sizerID;
    //
  }

  this.drag = drag;
  function drag(event, group, object, zone, data)
  {
    // calculate all div sizes based on movement
    var remain = data.xrelativemouse;
    var size = self.movingsize + remain;
    self.columns[self.movingID].setSize(size);
    // resize the whole column
    self.resizecolumns();
  }

  this.drop = drop;
  function drop(event, group, object, zone, data)
  {
    self.movingsize = null;
    self.movingID = null;
  }

  this.resizecolumns = resizecolumns;
  function resizecolumns()
  {
    var finalsize = WA.browser.getNodeOuterWidth(self.columns[self.movingID].domNode);
    for (var i = 0; i < self.linecount; i++)
    {
      WA.toDOM(self.domID + '_line'+i+'_cell'+self.movingID).style.width = finalsize + 'px';
    }
    var size = self.calculateWidth();
    self.domNodeBodyContent.style.width = size + 'px';
  }





  this.scroll = scroll;
  function scroll(e)
  {
    var left = WA.browser.getNodeScrollLeft(self.domNodeBody);
    self.domNodeHeaderContent.style.left = -left + 'px';
  }

  this.calculateWidth = calculateWidth;
  function calculateWidth()
  {
    var size = 0;
    for (var i in self.columns)
    {
      size += WA.browser.getNodeOuterWidth(self.columns[i].domNode);
    }
    return size;
  }

  this.selectmask = selectmask;
  function selectmask(type)
  {
    for (var i in self.lines)
    {
      if (type == 'clear')
        self.lines[i].unselect();
      else if (type == 'all')
        self.lines[i].select();
      else
        self.lines[i].invert();
    }
  }

  this.newline = newline;
  function newline()
  {

  }

  this.deletemarkedlines = deletemarkedlines;
  function deletemarkedlines()
  {
    // 1. destroy the data

    for (var i=self.lines.length-1; i >= 0; i--)
    {
      if (self.lines[i].selected)
      {
        self.data.row.splice(self.lines[i].index,1);
        self.lines[i].destroy();
        self.lines.splice(i,1);
      }
    }
  }

  this.responsedeleted = responsedeleted;
  function responsedeleted(request)
  {
    var result = eval('(' + request.responseText + ')');
    if (result.success)
    {
      self.deletemarkedlines();
    }
    else
    {
      alert(result.message);
    }
  }

  this.deleteselected = deleteselected;
  function deleteselected()
  {
    var todelete = {};
    var item = 1;
    for (var i in self.lines)
    {
      if (self.lines[i].selected)
      {
        todelete['KEY_' + (item++)] = self.lines[i].key;
      }
    }
    self.sendServer('delete', todelete, self.responsedeleted)
  }

  this.saveall = saveall;
  function saveall()
  {

  }


  this.createLine = createLine;
  function createLine(data, index)
  {
  	// desplazar esto
    var size = self.calculateWidth();
    self.domNodeBodyContent.style.width = size + 'px';

    var line = new gridLine(this, self.domID+'_line'+self.linecount, self.domNodeBodyContent, data, index);
    line.populate();
    line.start();
    self.lines[self.linecount++] = line;
    return line;
  }

  this.populate = populate;
  function populate()
  {
    // do we populate data from here ?
    if (self.data && self.data.row)
    {
      // we fill the grid
      for (var i in self.data.row)
      {
        self.createLine(self.data.row[i], i);
      }
    }
  }

  this.unpopulate = unpopulate;
  function unpopulate()
  {
    for (var i in self.lines)
      self.lines[i].destroy();
    WA.browser.setInnerHTML(self.domNodeBodyContent, '');
    self.linecount = 0;
    self.lines = [];
  }

  // get the templates if any
  this.parseTemplates = parseTemplates;
  function parseTemplates(params)
  {
    for (var i in params)
    {
      if (params[i].tag == 'template')
      {
        self.templates[params[i].attributes.name] = params[i];
      }
    }
  }

  this.parseRenders = parseRenders;
  function parseRenders(params)
  {
    for (var i in params)
    {
      if (params[i].tag == 'render')
      {
        self.renders[params[i].attributes.name] = params[i];
      }
    }
  }

  this.parseData = parseData;
  function parseData(params)
  {
    for (var i in params)
    {
      if (params[i].tag == 'dataset')
      {
        self.data = WA.JSON.decode(params[i].data);
      }
    }

  }

  this.swap = swap;
  function swap(i, j)
  {
    var buf = self.data.row[i];
    self.data.row[i] = self.data.row[j];
    self.data.row[j] = buf;
  }

  this.compasc = compasc;
  function compasc(val1, val2)
  {
    if (val1 > val2)
      return 1;
    if (val1 < val2)
      return -1;
    return 0;
  }

  this.compdesc = compdesc;
  function compdesc(val1, val2)
  {
    if (val1 > val2)
      return -1;
    if (val1 < val2)
      return 1;
    return 0;
  }

  this.quickSort = quickSort;
  function quickSort(lo0, hi0, comp, field)
  {
    var lo = lo0;
    var hi = hi0;
    var value;

    if ( hi0 > lo0)
    {
      value = self.data.row[ Math.ceil((lo0 + hi0 ) / 2) ][field];
      while( lo <= hi )
      {
        while( ( lo < hi0 ) && ( comp(self.data.row[lo][field], value) == -1 ) )
          ++lo;

        while( ( hi > lo0 ) && ( comp(self.data.row[hi][field], value) == 1 ) )
          --hi;

        if( lo <= hi )
        {
          self.swap(lo, hi);
          ++lo;
          --hi;
        }
      }

      if( lo0 < hi )
        self.quickSort(lo0, hi, comp, field);
      if( lo < hi0 )
        self.quickSort( lo, hi0, comp, field);
    }
  }

  this.reorder = reorder;
  function reorder(field, asc)
  {
    for (var i in self.columns)
    {
      if (self.columns[i].id != field && self.columns[i].order != 0)
      {
        self.columns[i].order = 0;
        self.columns[i].setTitle();
      }
    }
    self.unpopulate();
    self.quickSort(0, self.data.row.length-1, (asc?self.compasc:self.compdesc), field);
    self.populate();
  }

  this.parseTemplates(params);
  this.parseData(params);
}

// Needed aliases
WA.Containers.gridContainer = gridContainer;
