const asyncHandler = require('express-async-handler')
const ArticleModel = require('../models/article.model')


const getArticle = asyncHandler(async(req,res) => {
    ArticleModel.find({doctor:req.doctor.id})
                .then((article) => res.json(article))
                .catch((err) => res.status(400).json("Error: " + err))
})

const createArticle = asyncHandler(async(req, res) => {
    const {title, content} = req.body
    const newArticle = new ArticleModel({
        title,
        content
    })

    newArticle.save()
                .then((article) => res.json("New article added"))
                .catch((err) => res.status(400).json("Error: " + err))
})

const detailedArticle = asyncHandler(async(req, res) => {
    res.status(200).json({message: 'Get detailed articles'})
})

const updateArticle = asyncHandler(async(req, res) => {
    res.status(200).json({message: 'update articles'})
})

const deleteArticle = asyncHandler(async(req, res) => {
    res.status(200).json({message: 'delete articles'})
})

module.exports = {getArticle, createArticle, updateArticle,deleteArticle,detailedArticle}