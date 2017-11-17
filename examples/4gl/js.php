<?php

/*
    js.php, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains the wrapper to load, minimize and cache javascripts of WAJAF
    (c) 2008-2009 Philippe Thomassigny

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

class js
{
  function notFound()
  {
    if (substr(php_sapi_name(), 0, 3) == 'cgi')
      header('Status: 404 Not Found', TRUE);
    else
      header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
    return null;
  }

  function getJS($BASEDIR, $REPOSITORYDIR)
  {
    if (isset($_GET["js"]) && $_GET["js"])
    {
      if (strpos($_GET["js"], "/") !== false || strpos($_GET["js"], "\\") || strpos($_GET["js"], "%2F") || strpos($_GET["js"], "%5C"))  // No / \ or rawurlencoded allowed
        return $this->notFound();
      $dirs = array('/system/', '/managers/', '/containers/', '/elements/', '../dominion/js/containers/', '../dominion/js/elements/');
      $xF = explode(',', $_GET["js"]);
      if (!$xF)
        return null;
      $code = '';

      $usedF = array();
      $finalF = array();
      foreach ($xF as $k => $js)
      {
        if ($js == 'wajaf.js')
        {
          unset($xF[$k]);
          $usedF['core.js'] = $finalF[] = 'core.js';
          $usedF['eventManager.js'] = $finalF[] = 'eventManager.js';
          $usedF['ddManager.js'] = $finalF[] = 'ddManager.js';
          $usedF['soundManager.js'] = $finalF[] = 'soundManager.js';
          $usedF['animManager.js'] = $finalF[] = 'animManager.js';
          $usedF['helpManager.js'] = $finalF[] = 'helpManager.js';
          $usedF['ajaxManager.js'] = $finalF[] = 'ajaxManager.js';
          $usedF['ondemandManager.js'] = $finalF[] = 'ondemandManager.js';
          $usedF['messageManager.js'] = $finalF[] = 'messageManager.js';
          $usedF['wa4glManager.js'] = $finalF[] = 'wa4glManager.js';
        }
      }
      foreach ($xF as $k => $js)
      {
        if (!isset($usedF[$js]))
          $usedF[$js] = $finalF[] = $js;
      }
      foreach ($finalF as $k => $js)
      {
        $filename = null;
        foreach ($dirs as $d)
        {
          $fn = $BASEDIR.$d.$js;

          if (file_exists($fn))
          {
            $filename = $fn;
            break;
          }
        }
        if ($filename)
        {
          $code .= $this->minimizeJS($REPOSITORYDIR, $filename);
        }
      }
      header("Content-Type: text/javascript");
      header("Content-Length: " . strlen($code));
      print $code;
      return null;
    }
    elseif (isset($_GET["TEMP"]))
    {
      if (strpos("/", $_GET["TEMP"]) !== false || strpos("\\", $_GET["TEMP"]) || strpos("%2F", $_GET["TEMP"]) || strpos("%5C", $_GET["TEMP"]))  // No / \ or rawurlencoded allowed
        return $this->notFound();
      $filename = $BASEDIR."/components/js/templates/".$_GET["TEMP"];
      if (file_exists($filename))
      {
        header("Content-Type: text/html");
        header("Content-Length: " . filesize($filename));
        readfile($filename);
        return;
      }
      else
      {
        return $this->notFound();
      }
    }
    return $this->notFound();
  }

  function minimizeJS($REPOSITORYDIR, $filename)
  {
    $code = file_get_contents($filename);
    return $code;

    $cfilename = $REPOSITORYDIR.'jsmin/'.md5($filename);
    if (is_file($cfilename))
    {
      // check dates cache vs original to know if we use or invalidate the file
      if (filemtime($cfilename) > filemtime($filename))
        return file_get_contents($cfilename);
      unlink($cfilename);
    }

    $code = file_get_contents($filename);
    if (strpos($code, 'NO_MIN') !== false)
      return $code;

    $code = JSMin::minify($code);
    file_put_contents($cfilename, $code);
    return $code;
  }

}

$j = new js();
echo $j->getJS('../../','../../../temporal/');

// ==================================================================================================
// The class below is not part of WAJAF v1 and is (c) to its specific authors.
// ==================================================================================================

/**
 * jsmin.php - PHP implementation of Douglas Crockford's JSMin.
 *
 * This is pretty much a direct port of jsmin.c to PHP with just a few
 * PHP-specific performance tweaks. Also, whereas jsmin.c reads from stdin and
 * outputs to stdout, this library accepts a string as input and returns another
 * string as output.
 *
 * PHP 5 or higher is required.
 *
 * Permission is hereby granted to use this version of the library under the
 * same terms as jsmin.c, which has the following license:
 *
 * --
 * Copyright (c) 2002 Douglas Crockford  (www.crockford.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * The Software shall be used for Good, not Evil.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * --
 *
 * @package JSMin
 * @author Ryan Grove <ryan@wonko.com>
 * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c)
 * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port)
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @version 1.1.1 (2008-03-02)
 * @link http://code.google.com/p/jsmin-php/
 */

class JSMin
{
  const ORD_LF    = 10;
  const ORD_SPACE = 32;

  protected $a           = '';
  protected $b           = '';
  protected $input       = '';
  protected $inputIndex  = 0;
  protected $inputLength = 0;
  protected $lookAhead   = null;
  protected $output      = '';

  // -- Public Static Methods --------------------------------------------------

  public static function minify($js)
  {
    $jsmin = new JSMin($js);
    return $jsmin->min();
  }

  // -- Public Instance Methods ------------------------------------------------

  public function __construct($input)
  {
    $this->input       = str_replace("\r\n", "\n", $input);
    $this->inputLength = strlen($this->input);
  }

  // -- Protected Instance Methods ---------------------------------------------

  protected function action($d)
  {
    switch($d)
    {
      case 1:
        $this->output .= $this->a;

      case 2:
        $this->a = $this->b;

        if ($this->a === "'" || $this->a === '"')
        {
          for (;;)
          {
            $this->output .= $this->a;
            $this->a       = $this->get();

            if ($this->a === $this->b)
            {
              break;
            }

            if (ord($this->a) <= self::ORD_LF)
            {
              throw new JSMinException('Unterminated string literal.');
            }

            if ($this->a === '\\')
            {
              $this->output .= $this->a;
              $this->a       = $this->get();
            }
          }
        }

      case 3:
        $this->b = $this->next();

        if ($this->b === '/' && (
            $this->a === '(' || $this->a === ',' || $this->a === '=' ||
            $this->a === ':' || $this->a === '[' || $this->a === '!' ||
            $this->a === '&' || $this->a === '|' || $this->a === '?'))
        {

          $this->output .= $this->a . $this->b;

          for (;;)
          {
            $this->a = $this->get();

            if ($this->a === '/')
            {
              break;
            }
            elseif ($this->a === '\\')
            {
              $this->output .= $this->a;
              $this->a       = $this->get();
            }
            elseif (ord($this->a) <= self::ORD_LF)
            {
              throw new JSMinException('Unterminated regular expression '.
                  'literal.');
            }

            $this->output .= $this->a;
          }

          $this->b = $this->next();
        }
    }
  }

  protected function get()
  {
    $c = $this->lookAhead;
    $this->lookAhead = null;

    if ($c === null)
    {
      if ($this->inputIndex < $this->inputLength)
      {
        $c = $this->input[$this->inputIndex];
        $this->inputIndex += 1;
      }
      else
      {
        $c = null;
      }
    }

    if ($c === "\r")
    {
      return "\n";
    }

    if ($c === null || $c === "\n" || ord($c) >= self::ORD_SPACE)
    {
      return $c;
    }

    return ' ';
  }

  protected function isAlphaNum($c)
  {
    return ord($c) > 126 || $c === '\\' || preg_match('/^[\w\$]$/', $c) === 1;
  }

  protected function min()
  {
    $this->a = "\n";
    $this->action(3);

    while ($this->a !== null)
    {
      switch ($this->a)
      {
        case ' ':
          if ($this->isAlphaNum($this->b))
          {
            $this->action(1);
          }
          else
          {
            $this->action(2);
          }
          break;

        case "\n":
          switch ($this->b)
          {
            case '{':
            case '[':
            case '(':
            case '+':
            case '-':
              $this->action(1);
              break;

            case ' ':
              $this->action(3);
              break;

            default:
              if ($this->isAlphaNum($this->b))
              {
                $this->action(1);
              }
              else
              {
                $this->action(2);
              }
            }
          break;

        default:
          switch ($this->b)
          {
            case ' ':
              if ($this->isAlphaNum($this->a))
              {
                $this->action(1);
                break;
              }

              $this->action(3);
              break;

            case "\n":
              switch ($this->a)
              {
                case '}':
                case ']':
                case ')':
                case '+':
                case '-':
                case '"':
                case "'":
                  $this->action(1);
                  break;

                default:
                  if ($this->isAlphaNum($this->a))
                  {
                    $this->action(1);
                  }
                  else
                  {
                    $this->action(3);
                  }
                }
              break;

            default:
              $this->action(1);
              break;
          }
      }
    }

    return $this->output;
  }

  protected function next()
  {
    $c = $this->get();

    if ($c === '/')
    {
      switch($this->peek())
      {
        case '/':
          for (;;)
          {
            $c = $this->get();

            if (ord($c) <= self::ORD_LF)
            {
              return $c;
            }
          }

        case '*':
          $this->get();

          for (;;) {
            switch($this->get())
            {
              case '*':
                if ($this->peek() === '/')
                {
                  $this->get();
                  return ' ';
                }
                break;

              case null:
                throw new JSMinException('Unterminated comment.');
            }
          }

        default:
          return $c;
      }
    }

    return $c;
  }

  protected function peek()
  {
    $this->lookAhead = $this->get();
    return $this->lookAhead;
  }
}

// -- Exceptions ---------------------------------------------------------------
class JSMinException extends Exception {}

?>