
readme.txt, WAJAF, the WebAbility(r) Javascript Application Framework
Contains multi purpose functions, browser and WA objects
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

----

Welcome to WAJAF.

You need to install the wajaf directory into your published site.
You may also install the folder into a protected directory and use a PHP/Perl/ASP/etc wrapper.

Once the directory is installed, just call the needed scripts and build javascript !

Reference, manuals, examples: http://www.webability.info/?P=wajaf
Follow us on twitter: @webability5

Thank you !

----

This is the version 3, build 0.3

Please read the 4glstructure.txt document for a resumed 4GL programmation guide

----

v3.0.4
------
- tabContainer corrected: the tabSelector was not resizing correctly (broken code) in case of disable, enable, move, etc.
- groupContainer modified to support a listener called when the form changes its mode or viewed data.
- groupContainer modified to clear the currentkey in case of insert mode with posibility to cancel and return to last viewed key.
- groupContainer modified to load first record in case of cancel of first insert (does not stay blanck anymore if no currentkey was activated before going to insert mode).
- groupContainer does not need anymore UTF8 encoding of fields variables.
- eventManager modified to support passive events for mousewheels events. Bug corrected (do not setup anymore 2 events for mousewheel events).
- Attributes added to lib/PHP/buttonElement tu support different titles based on group mode.

v3.0.3
------
- Bug corrected in eventManager: if the key code is undefined, the key listener cannot be executed (keyup and keydown events may be called without real keys stokes)
- Bug corrected in lib/PHP/XDdataset: the dataset may include anything so need to be CDATA'ed

v3.0.2
------
- Lots of enhancements of all the JS libraries in general, new libraries, news functions, bugs corrected.

v3.0.1
------
- First build of V3
- Remove XML files, introduces JSON files
- Adds forms and lists as basic elements (fusion of domlist and dommask in wajaf)

