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

$URI = null;
if (isset($_SERVER['REQUEST_URI']))
  $URI = ($_SERVER['REQUEST_URI']);  // strtolower
if ($URI)
{
  // Remove query part (already managed by PHP)
  if (strpos($URI, '?'))
  {
    $QUERY = substr($URI, strpos($URI, '?'));
    $URI = substr($URI, 0, strpos($URI, '?'));
  }
  if (substr($URI, -1) == '/' && strlen($URI) > 1)
  {
    // NO ACEPTAMOS URLS QUE TERMINAN CON /, REDIRECCIONAMOS !!
    $URI = substr($URI, 0, -1);
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . $URI . $QUERY);
    return;
  }
  if (strlen($URI) > 1)
    $P = $URI;
}

if (!$P)
{
  print 'Error: malformed URL';
  return;
}
$xP = explode('/', $P);
// at least 3 parts always starting with /
if (sizeof($xP) < 4)
{
  print 'Error: malformed URL';
  return;
}
// we only need the last 3 parts of the URL in this example case which are library, method and type
// check validity
$type = array_pop($xP);
$method = array_pop($xP);
$library = array_pop($xP);
$pagereg = '/^[a-zA-Z0-9_\.]{1,50}$/';
if (!preg_match($pagereg, $library) || !preg_match($pagereg, $method) || !preg_match($pagereg, $type))
{
  print 'Error: malformed URL';
  return;
}

if ($method == 'code')
{
  $Source = isset($_POST['Source'])?$_POST['Source']:(isset($_GET['Source'])?$_GET['Source']:null);
  if ($Source == 'true')
  {
    $filename = $library.'.xml';
    $xml = '<pre class="prettyprint lang-xml">' . str_replace('<', '&lt;', file_get_contents($filename)) . '</pre>';
    $tree = array('tag' => 'application', 'attributes' => array('id' => $library), 'children' => array(array('tag' => 'element', 'attributes' => array('type' => 'htmlElement'), 'data' => $xml), array('tag' => 'event', 'attributes' => array('type' => 'start'), 'children' => array(array('tag' => 'code', 'data' => 'function() {prettyPrint();}')))));
//    $tree = array('tag' => 'application', 'attributes' => array('id' => $library), 'children' => array(array('tag' => 'element', 'attributes' => array('type' => 'htmlElement'), 'data' => $xml)));
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
      $node['children'][] = self::convert($value);
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