
/*
    shortcuts.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains shortcuts for classes and methods
    (c) 2008-2011 Philippe Thomassigny

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

// core
var $ = WA.toDOM;
var $$ = WA.get;
var debug = WA.debug.explain;
nothing = function() {};
var browser = WA.browser;
var RGB = WA.RGB;
var JSONEncode = WA.JSON.encode;
var JSONDecode = WA.JSON.decode;

// events
if (WA.Managers.event)
{
  var eventManager = WA.Managers.event;
  var on = eventManager.addListener;
  var off = eventManager.removeListener;
  var key = eventManager.addKey;
  var keyon = eventManager.addKey;
  var keyoff = eventManager.removeKey;
}

// ajax
if (WA.Managers.ajax)
{
  var ajaxManager = WA.Managers.ajax;
  var ajax = ajaxManager.createRequest;
}

// sound
if (WA.Managers.sound)
{
  var soundManager = WA.Managers.sound;
  var addsound = soundManager.addSound;
  var sound = soundManager.startSound;
  var soundoff = soundManager.stopSound;
}

// anim
if (WA.Managers.anim)
{
  var animManager = WA.Managers.anim;
  var anim = animManager.createSprite;
  var sprite = animManager.createSprite;
}

// help
if (WA.Managers.help)
{
  var help = helpManager.addHelp;
  var offhelp = helpManager.removeHelp;
}

// draw
if (WA.Managers.draw)
{
  var line = drawManager.line;
  var erase = drawManager.erase;
}

// 4glmanager
if (WA.Managers.wa4gl)
{
  var $N = WA.$N;
}

