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
ORDER BY
     b.value ASC,
     c.name ASC,
     r.value ASC
     "
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['boxlen']][$oneRow['cosmology']][$oneRow['resolution']] = $oneRow['simulation'];
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
ORDER BY
     b.value ASC,
     c.name ASC,
     r.value ASC
     "
        );

        foreach($rows as $oneRow) {
            $res[$oneRow['boxlen']][$oneRow['cosmology']][$oneRow['resolution']] = $oneRow['simulation'];
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
}