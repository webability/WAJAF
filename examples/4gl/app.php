<?php

/*
    app.php, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains the interpreter XML to JSON to dispatch applications
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

$P = isset($_POST['P'])?$_POST['P']:(isset($_GET['P'])?$_GET['P']:null);
if (!$P)
  return;
// check validity
if (!preg_match('/^[a-zA-Z0-9_\.]{1,50}$/', $P))
  return;
$xpath = explode('.', $P);
if (count($xpath) != 3)
  return;

$library = $xpath[0];
$method = $xpath[1];
$type = $xpath[2];

if ($method == 'code')
{
  $Source = isset($_POST['Source'])?$_POST['Source']:(isset($_GET['Source'])?$_GET['Source']:null);
  if ($Source == 'true')
  {
    $filename = $library.'.xml';
    $xml = '<pre class="prettyprint lang-xml">' . str_replace('<', '&lt;', file_get_contents($filename)) . '</pre>';
    $tree = array('tag' => 'application', 'attributes' => array('id' => $library), 0 => array('tag' => 'element', 'attributes' => array('type' => 'htmlElement'), 'data' => $xml), 1 => array('tag' => 'event', 'attributes' => array('type' => 'start'), 0 => array('tag' => 'code', 'data' => 'function() {prettyPrint();}')));
    $code = json_encode($tree);
  }
  else
  {
    $filename = $library.'.xml';
    $xml = file_get_contents($filename);
    $tree = xmltoarray::parse($xml);
    $code = json_encode($tree);
  }
}
else
{
  $filename = $library.'.lib';
  include_once $filename;
  // we load the php library and call the method
  $instance = new $library();
  $code = $instance->$method($type);
}

echo $code;

// transform the XML to an array for WA4GL
class XMLtoArray
{
  private static function convert($xml)
  {
    if (!($xml instanceof SimpleXMLElement))
      return $xml;

    $nodename = $xml->getName();
    $node = array('tag' => $nodename);

    // 1. the attributes
    foreach ($xml->attributes() as $name => $value)
    {
      $node['attributes'][$name] = (string)$value;
    }

    // 2. the children
    foreach ($xml->children() as $name => $value)
    {
      $node[] = self::convert($value);
    }

    // 3. the content data
    $data = trim((string)$xml);
    if ($data)
      $node['data'] = $data;

    return $node;
  }

  static public function parse($xml)
  {
    $tree = simplexml_load_string($xml);
    return self::convert($tree);
  }

}

?>