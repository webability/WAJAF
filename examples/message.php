<?php

/*
    message.php, WAJAF, the WebAbility(r) Javascript Application Framework
    Contains the server side listener for the message Manager example
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

$Messages = $_POST['Messages'];
$data = json_decode($Messages);

$c1 = $c2 = $c3 = 0;
$queue = $data->queue;
foreach($queue as $events)
{
  if ($events->id == 'c1')
    $c1++;
  elseif ($events->id == 'c2')
    $c2++;
  elseif ($events->id == 'c3')
    $c3++;
}

$returndata = array('frame' => time(), 'queue' => array());
if ($c1 > 0)
{
  $returndata['queue'][] = array('id' => 'c2', 'message' => 'You have clicked '.$c1.' time into container 1');
  $returndata['queue'][] = array('id' => 'c3', 'message' => 'You have clicked '.$c1.' time into container 1');
}
if ($c2 > 0)
{
  $returndata['queue'][] = array('id' => 'c1', 'message' => 'You have clicked '.$c2.' time into container 2');
  $returndata['queue'][] = array('id' => 'c3', 'message' => 'You have clicked '.$c2.' time into container 2');
}
if ($c3 > 0)
{
  $returndata['queue'][] = array('id' => 'c1', 'message' => 'You have clicked '.$c3.' time into container 3');
  $returndata['queue'][] = array('id' => 'c2', 'message' => 'You have clicked '.$c3.' time into container 3');
}

echo json_encode($returndata);

?>