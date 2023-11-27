const { getArticle, createArticle, updateArticle, deleteArticle, detailedArticle } = require("../controllers/articleController");

const router = require("express").Router();

//Get articles
router.get("/", getArticle);

//Post new article
router.post("/create", createArticle);

//Get detailed article
router.get('/:id', detailedArticle)

//Update article
router.put("/:id", updateArticle);

//Delete article
router.delete("/:id", deleteArticle);

module.exports = router;
