<?php

namespace AppBundle\Service;

/**
 * Created by PhpStorm.
 * User: jpasdeloup
 * Date: 20/01/16
 * Time: 14:42
 */
use Doctrine\DBAL\Connection;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Service;

/**
 * Class SimulationRepository
 * @Service("simulation_repository")
 */
class SimulationRepository
{
    private $con;

    const PER_PAGE = 32;

    /**
     * SimulationRepository constructor.
     * @InjectParams({
     *   "con" = @Inject("doctrine.dbal.default_connection")
     * })
     */
    public function __construct(Connection $con)
    {
        $this->con = $con;
    }

    /**
     * @return array
     */
    public function getSnapshots()
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  s.id simulation,
                  s.particleMass mass,
                  b.value boxlen,
                  c.name cosmology,
                  r.value resolution
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
                 INNER JOIN Resolution r ON s.Resolution_id = r.id
                 INNER JOIN Cosmology c ON s.Cosmology_id = c.id
                 INNER JOIN Boxlen b ON s.Boxlen_id = b.id
            WHERE
                 g.GeometryType_id = 'snapshot'
                 AND og.public = 1
                 AND s.public = 1
            ORDER BY
                 b.value ASC,
                 c.name ASC,
                 r.value ASC
                 "
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['boxlen']][$oneRow['cosmology']][$oneRow['resolution']] = [
                'id' => $oneRow['simulation'],
                'mass' => $oneRow['mass'] ? sprintf("%.1E",$oneRow['mass']).'Msun/h' : ''
            ];
        }

        return $res;
    }

    /**
     * @return array
     */
    public function getCones()
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  s.id simulation,
                  s.particleMass mass,
                  b.value boxlen,
                  c.name cosmology,
                  r.value resolution
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
                 INNER JOIN Resolution r ON s.Resolution_id = r.id
                 INNER JOIN Cosmology c ON s.Cosmology_id = c.id
                 INNER JOIN Boxlen b ON s.Boxlen_id = b.id
            WHERE
                 g.GeometryType_id = 'cone'
                 AND og.public = 1
                 AND s.public = 1
            ORDER BY
                 b.value ASC,
                 c.name ASC,
                 r.value ASC
                 "
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['boxlen']][$oneRow['cosmology']][$oneRow['resolution']] =  [
                'id' => $oneRow['simulation'],
                'mass' => $oneRow['mass'] ? sprintf("%.1E",$oneRow['mass']).'Msun/h' : ''
            ];
        }

        return $res;
    }

    /**
     * @param $array
     * @return array
     */
    public function getDistinctCosmologies($array)
    {
        $cosmologies = [];
        foreach($array as $oneBoxlen) {
            foreach($oneBoxlen as $cosmology => $resolutions) {
                $cosmologies[$cosmology] = true;
            }
        }
        $cosmologies = array_keys($cosmologies);
        sort($cosmologies);
        return $cosmologies;
    }

    public function getSimulationSnapshots($id)
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  g.id,
                  g.formattedZ
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
            WHERE
                 g.GeometryType_id = 'snapshot'
                 AND og.public = 1
                 AND s.public = 1
                 AND s.id = :id
            ORDER BY
                 g.Z ASC
                 "
        ,
        ["id" => $id]
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['id']] = SimulationRepository::formatZ($oneRow['formattedZ']);
        }

        return $res;
    }

    public function getSimulationInfos($id)
    {
        $res = [];

        $rows = $this->con->fetchAll(
            "SELECT
                  s.properties,
                  s.particleMass
            FROM
                 Simulation s
            WHERE
                 s.public = 1
                 AND s.id = :id
            "
            ,
            ["id" => $id]
        );

        foreach($rows as $oneRow) {
            $res =json_decode($oneRow['properties'], true);
            $res["particle_mass"] = $oneRow["particleMass"];
        }

        return $res;
    }

    static public function formatZ($Z)
    {
        $Z = (float) $Z;
        if($Z < 1.0) {
            $Z = number_format($Z, 2);
        }
        elseif($Z < 10.0) {
            $Z = number_format($Z, 1);
        }
        else {
            $Z = number_format($Z, 0);
        }
        return $Z;
    }

    public function getGeometryObjects($id)
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  og.*, st.path path, ot.name type, of.name format
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
                 INNER JOIN Storage st ON og.Storage_id = st.id
                 INNER JOIN ObjectType ot ON og.ObjectType_id = ot.id
                 INNER JOIN ObjectFormat of ON og.ObjectFormat_id = of.id
            WHERE
                 og.public = 1
                 AND s.public = 1
                 AND g.id = :id
            ORDER BY
                 g.Z ASC
                 "
            ,
            ["id" => $id]
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['id']] = $oneRow;
            $res[$oneRow['id']]['formattedSize'] = SimulationRepository::formatSize($res[$oneRow['id']]['size']);
        }

        return $res;
    }

    public function getObjectFiles($id, $page = 1)
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  og.*, st.path path, ot.name type, of.name format
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
                 INNER JOIN Storage st ON og.Storage_id = st.id
                 INNER JOIN ObjectType ot ON og.ObjectType_id = ot.id
                 INNER JOIN ObjectFormat of ON og.ObjectFormat_id = of.id
            WHERE
                 og.public = 1
                 AND s.public = 1
                 AND og.id = :id
            ORDER BY
                 g.Z ASC
                 "
            ,
            ["id" => $id]
        );

        $object = $rows[0];

        $start  = SimulationRepository::PER_PAGE * ($page - 1);
        $end = min(SimulationRepository::PER_PAGE * $page, $object['nbFiles']);

        $object['more'] = $object['nbFiles'] > $end;

        $path = trim($object['path'],'/');

        if($object['filePattern'] && preg_match("/\((.*)\)/", $object['filePattern'], $match)) {
            $pattern = '('.$match[1].')';

            $nbDigit = 5;
            if(preg_match("/\{([0-9]+)\}/", $object['filePattern'], $match)) {
                $nbDigit = $match[1];
            }

            $filePerGroup = 1;
            if($object['nbGroups'] > 0) {
                $filePerGroup = $object['nbFiles'] / $object['nbGroups'];
            }

            for($i=$start; $i<$end; $i++) {
                $formattedNumber = str_pad($i,$nbDigit,'0',STR_PAD_LEFT);
                $file = stripslashes(trim(str_replace($pattern,$formattedNumber,$object['filePattern']),'/^$'));

                if($object['nbGroups'] > 0) {
                    $group = 1 + floor($i / $filePerGroup);
                    $group = str_pad($group,5,'0',STR_PAD_LEFT);
                    $file = 'group_'.$group.'/'.$file;
                }

                $res[] = [
                    'url' => $path.'/'.trim($object['localPath'],'/').'/'.$file,
                    'name' => $file
                ];
            }
        }
        elseif($object['filePattern'] && 1 == $object['nbFiles']) {
            $file = $object['filePattern'];
            $res[] = [
                'url' => $path.$object['localPath'].'/'.$file,
                'name' => $file
            ];
        }
        else {
            $res[] = [
                'url' => "",
                'name' => "File not found"
            ];
        }


        return [$object, $res];
    }

    public static function formatSize($size)
    {
        if($size < 1024) {
            $unit = 'Ko';
        }
        else {
            $size /= 1024;
            if($size < 1024) {
                $unit = 'Mo';
            }
            else {
                $size /= 1024;
                if($size < 1024) {
                    $unit = 'Go';
                }
                else {
                    $size /= 1024;
                    $unit = 'To';
                }
            }
        }
        return number_format($size, 2).' '.$unit;
    }

    public function getSimulationCones($id)
    {
        $res = [];
        $rows = $this->con->fetchAll(
            "SELECT DISTINCT
                  g.id,
                  g.formattedZ
            FROM
                 ObjectGroup og
                 INNER JOIN Geometry g ON og.Geometry_id = g.id
                 INNER JOIN Simulation s ON g.Simulation_id = s.id
            WHERE
                 g.GeometryType_id = 'cone'
                 AND og.public = 1
                 AND s.public = 1
                 AND s.id = :id
            ORDER BY
                 g.Z ASC
                 "
            ,
            ["id" => $id]
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['id']] = SimulationRepository::formatZ($oneRow['formattedZ']);
        }

        return $res;
    }
}