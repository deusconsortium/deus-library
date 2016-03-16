<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/index.html.twig', array(
        ));
    }

    /**
     * @Route("/credits", name="credits")
     */
    public function creditsAction(Request $request)
    {
        return $this->render('default/credits.html.twig', array(
        ));
    }

    /**
     * @Route("/doc", name="documentation")
     */
    public function docAction(Request $request)
    {
        return $this->render('default/doc.html.twig', array(
        ));
    }

    /**
     * @Route("/snapshot", name="snapshot")
     */
    public function snapshotAction(Request $request)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $snapshots = $SimulationRepository->getSnapshots();

        return $this->render('default/snapshot.html.twig', array(
            'snapshots' => $snapshots,
            'cosmologies' => $SimulationRepository->getDistinctCosmologies($snapshots)
        ));
    }

    /**
     * @Route("/snapshots/{id}", name="snapshots")
     */
    public function snapshotsAction(Request $request, $id)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $snapshots = $SimulationRepository->getSimulationSnapshots($id);
        $simulation = $SimulationRepository->getSimulationInfos($id);

        return $this->render('default/snapshots.html.twig', array(
            'snapshots' => $snapshots,
            'simulation' => $simulation
        ));
    }

    /**
     * @Route("/cones/{id}", name="cones")
     */
    public function conesAction(Request $request, $id)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $snapshots = $SimulationRepository->getSimulationCones($id);
        $simulation = $SimulationRepository->getSimulationInfos($id);

        return $this->render('default/cones.html.twig', array(
            'snapshots' => $snapshots,
            'simulation' => $simulation
        ));
    }

    /**
     * @Route("/objects/{id}", name="objects")
     */
    public function objectsAction(Request $request, $id)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $objects = $SimulationRepository->getGeometryObjects($id);

        return $this->render('default/objects.html.twig', array(
            'objects' => $objects
        ));
    }

    /**
     * @Route("/files/{id}", name="files")
     */
    public function filesAction(Request $request, $id)
    {
        $page =$request->get('page',1);

        $SimulationRepository = $this->get("simulation_repository");
        list($object, $files) = $SimulationRepository->getObjectFiles($id, $page);

        return $this->render('default/files.html.twig', array(
            'files' => $files,
            'page' => $page,
            'object' => $object,
            'id' => $id
        ));
    }

    /**
     * @Route("/filelist/{id}", name="file_list")
     */
    public function fileListAction(Request $request, $id)
    {
        $page =$request->get('page',1);

        $SimulationRepository = $this->get("simulation_repository");
        list($object, $files) = $SimulationRepository->getObjectFiles($id, null);

        $baseUrl = $request->getSchemeAndHttpHost().$request->getBasePath().'/';
        $list = "";
        foreach($files as $oneFile) {
            $list .= $baseUrl.$oneFile["url"]."\n";
        }

        $response = new Response($list);

        $d = $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            "deus_file_list_$id.txt"
        );

        $response->headers->set('Content-Disposition', $d);

        return $response;

    }

    /**
     * @Route("/cone", name="cone")
     */
    public function coneAction(Request $request)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $snapshots = $SimulationRepository->getCones();

        return $this->render('default/cone.html.twig', array(
            'snapshots' => $snapshots,
            'cosmologies' => $SimulationRepository->getDistinctCosmologies($snapshots)
        ));
    }

    /**
     * @Route("/geometry_properties/{id}", name="geometry_properties")
     */
    public function geometrySettingsAction(Request $request, $id)
    {
        $SimulationRepository = $this->get("simulation_repository");
        $geometry = $SimulationRepository->getGeometry($id);

        return $this->render('default/geometry_properties.html.twig', array(
            'geometry' => $geometry,
            'properties' => json_decode($geometry['properties'], true)
        ));
    }
}
