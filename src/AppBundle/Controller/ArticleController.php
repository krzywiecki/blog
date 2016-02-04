<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use Symfony\Component\HttpFoundation\JsonResponse;


class ArticleController extends Controller
{
	/**
	 * @Route("/api/article/show/{id}")
	 */
	 public function showAction($id)
	 {
		 $article = $this->getDoctrine()
        ->getRepository('AppBundle:Article')
        ->findOneBy(array('id' => $id, 'active' => 1));

      if ($article) {

        $data = array(
          'id' => $article->getId(),
          'title' => $article->getTitle(),
          'brief' => $article->getBrief(),
          'content' => $article->getContent(),
          'author' => $article->getAuthor()
        );

        return new JsonResponse($data, 200);
      }
      else {
        $data = array(
          'message' => 'Not found article with id: ' . $id
        );

        return new JsonResponse($data, 400);
      }
	 }

   /**
 	 * @Route("/api/article/list")
 	 */
   public function listAction()
   {
      $articles = $this->getDoctrine()
        ->getRepository('AppBundle:Article')
        ->findByActive(1);

      if($articles) {

        $response = array();
        foreach ($articles as $article) {
            $response[] = array(
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'brief' => $article->getBrief(),
                'content' => $article->getContent(),
                'author' => $article->getAuthor()
            );
        }

        return new JsonResponse(['articles' => $response], 200);
      }
      else {
        $data = array(
          'message' => 'Not found any articles'
        );

        return new JsonResponse($data, 400);
      }
   }
}
