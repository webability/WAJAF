
/*
    linkElement.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains element to control an HTML link element (<a>)
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

/* Known params.attributes of element:
   * type, id
   * left, top, anchorleft, anchortop, width, height
   * display           default display: ''
   * style
   * classname         default class: link
*/

WA.Elements.linkElement = function(domNodeFather, domID, params, notify, _4glNode)
{
  var self = this;
  WA.Elements.linkElement.sourceconstructor.call(this, domNodeFather, domID, params, notify, _4glNode, { classname:'link' }, 'a');
  if (this.params.data)
    WA.browser.setInnerHTML(this.domNode, this.params.data);

  // ========================================================================================
  // private functions

  function click(e)
  {
    self._callNotify('click', null);
  }

  // ========================================================================================
  // standard system functions

  this.start = start;
  function start()
  {
    WA.Elements.linkElement.source.start.call(self);
    WA.Managers.event.on('click', self.domNode, click, true);
  }

  this.stop = stop;
  function stop()
  {
    WA.Elements.linkElement.source.stop.call(self);
    WA.Managers.event.off('click', self.domNode, click, true);
  }

  this.destroy = destroy;
  function destroy(fast)
  {
    WA.Elements.linkElement.source.destroy.call(self, fast);
    self = null;
  }

  if (!_4glNode)
  {
    // we call all to setup things and start the node, since there is no 4gl node calling this.
    this.start();
    this.resize();
  }
}

// Add basic element code
WA.extend(WA.Elements.linkElement, WA.Managers.wa4gl._element);
