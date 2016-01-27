<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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
}
