
/*
    soundManager.js, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains the Manager singleton to manage sounds
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

    ---

    The flash manager soundManager2.swf is taken from:
    http://schillmania.com/projects/soundmanager2/

    Copyright (c) 2008, Scott Schiller. All rights reserved.
    Code licensed under the BSD License:
    http://schillmania.com/projects/soundmanager2/license.txt

    V2.95a.20090717
*/

WA.Managers.sound = new function()
{
  var self = this;
  this.sounds = {};
  this.volume = 100;
  this.on = true;
  this.domNode = null;
  this.flashmanager = null;
  this.flash = null;
  this.sounds = {};
  this.hook = null;

  this.running = false;

  this.ready = false;
  this.timer = null;     // timer to check readyness
  this.soundqueue = {};  // while not ready, we queue the needed sounds

  this.setFlashManager = setFlashManager;
  function setFlashManager(flashmanager)
  {
    self.flashmanager = flashmanager;
    reboot();
  }

  this.setHook = setHook;
  function setHook(hook)
  {
    self.hook = hook;
  }

  this.reboot = reboot;
  function reboot()
  {
    if (self.domNode)
    {
      self.domNode.parentNode.removeChild(self.domNode);
      self.domNode = null;
    }
    self.running = false;
    self.ready = false;

    if (self.hook)
      self.hook('reboot');

    create();
  }

  function isready()
  {
    self.timer = null;
    if (self.flash && self.flash._createSound)
    {
      self.ready = true;
      // call hook
      if (self.hook)
        self.hook('ready');
      // launch existing sounds
      for (var i in self.sounds)
        self.sounds[i].create();
      // put the queued sounds
      for (var i in self.soundqueue)
        self.addSound(self.soundqueue[i][0], self.soundqueue[i][1], self.soundqueue[i][2], self.soundqueue[i][3], self.soundqueue[i][4]);
      return;
    }
    self.timer = setTimeout(isready, 100);
  }

  function create()
  {
    if (!self.flashmanager)
      return;

    // create sound division
    self.domNode = document.createElement("div");
    // we CANT hide the division or the flash is NOT executed !!!!
    self.domNode.style.top = '-1000px';
    self.domNode.style.left = '-1000px';
    self.domNode.style.height = '8px';
    self.domNode.style.width = '8px';
    self.domNode.style.overflow = 'hidden';
    document.body.appendChild(self.domNode);

    if (WA.browser.isMSIE)
    {
      // IE is "special".
      var html = '<object id="soundManagerObject" data="'+self.flashmanager+'" type="application/x-shockwave-flash" width="0" height="0"><param name="movie" value="'+self.flashmanager+'" /><param name="AllowScriptAccess" value="always" /><param name="quality" value="high" /></object>';
    }
    else
    {
      var html = '<embed name="soundManagerObject" id="soundManagerObject" src="'+self.flashmanager+'" width="0" height="0" quality="high" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';
    }

    WA.browser.setInnerHTML(self.domNode, html);
    self.flash = WA.toDOM('soundManagerObject');
//    WA.Managers.event.off('load', window, create);

    self.running = true;
    self.timer = setTimeout(isready, 100);
  }

  this.addSound = addSound;
  function addSound(soundID, soundlink, autoplay, whileloading, hook)
  {
    if (!soundlink)
      return;
    // we wait for flash to load for security (many scripts adds the sounds at the beginning)
    if (!self.ready)
    {
      self.soundqueue[soundID] = [soundID, soundlink, autoplay, whileloading, hook];
      return null;
    }
    var s = new WA.Managers.sound.sound(self, soundID, soundlink, !!autoplay, whileloading?1:0, hook);
    self.sounds[soundID] = s;
    return s;
  }

  // must be the SAME PARAMETERS as addSound
  this.removeSound = removeSound;
  function removeSound(soundID)
  {
  }

  this.startSound = startSound;
  function startSound(soundID)
  {
    if (!self.ready || !self.sounds[soundID])
      return false;
    return self.sounds[soundID].start();
  }

  this.pauseSound = pauseSound;
  function pauseSound(soundID)
  {
    if (!self.ready || !self.sounds[soundID])
      return false;
    return self.sounds[soundID].pause();
  }

  this.stopSound = stopSound;
  function stopSound(soundID)
  {
    if (!self.ready || !self.sounds[soundID])
      return false;
    return self.sounds[soundID].stop();
  }

  // volume is 0 to 100%
  this.setVolume = setVolume;
  function setVolume(soundID, volume)
  {
    if (!self.ready || !self.sounds[soundID])
      return false;
    return self.sounds[soundID].volume(volume);
  }

  // volume is 0 to 100%
  this.setPan = setPan;
  function setPan(soundID, pan)
  {
    if (!self.ready || !self.sounds[soundID])
      return;
    return self.sounds[soundID].pan(pan);
  }

  // volume is 0 to 100%
  this.setGeneralVolume = setGeneralVolume;
  function setGeneralVolume(volume)
  {

  }

  // on is true/false to switch on/off the volume
  this.switchSound = switchSound;
  function switchSound(on)
  {
    self.on = on;
  }

  // flush
  function destroy()
  {
    self.flash = null;
    self.domNode = null;
    delete self.sounds;
    delete self.soundqueue;
    self = null;
  }

  // creates the flash holder to use
  // WA.Managers.event.addListener('load', window, create);
  WA.Managers.event.registerFlush(destroy);

}();

WA.Managers.sound.sound = function(m, id, l, a, w, h)
{
  var self = this;
  this.manager = m;
  this.id = id;
  this.link = l;
  this.autoplay = a;
  this.whileloading = w;
  this.hook = h;

  this.create = create;
  function create(firstload)
  {
    self.manager.flash._createSound(self.id, self.callback);
    self.manager.flash._load(self.id, self.link, true, firstload&&self.autoplay, firstload?self.whileloading:0);
  }

  this.callback = callback;
  function callback()
  {

  }

  this.start = start;
  function start()
  {
    self.manager.flash._start(self.id,1,0);
    return true;
  }

  this.pause = pause;
  function pause()
  {
    self.manager.flash._pause(self.id);
    return true;
  }

  this.stop = stop;
  function stop()
  {
    self.manager.flash._stop(self.id);
    return true;
  }

  this.volume = volume;
  function volume(v)
  {
    self.manager.flash._setVolume(self.id, v);
    return true;
  }

  this.pan = pan;
  function pan(p)
  {
    self.manager.flash._setPan(self.id, p);
    return true;
  }

  create(true);
}

