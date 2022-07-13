const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wikiDB");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        Article.create(
            {
                title: req.body.title,
                content: req.body.content,
            },
            (err) => {
                if (!err) {
                    res.send("Successfully added an article.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:title")
    .get((req, res) => {
        Article.findOne(
            {
                title: req.params.title,
            },
            (err, foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No article found.");
                }
            }
        );
    })
    .put((req, res) => {
        Article.replaceOne({ title: req.params.title },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("Successfully updated.");
                } else {
                    res.send(err);
                }
        });
    })
    .patch((req,res)=>{
        Article.findOneAndUpdate({
            title: req.params.title
        },{
            $set: req.body
        },(err)=>{
            if (!err) {
                res.send("Successfully updated the selected article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req,res)=>{
        Article.deleteOne({
            title: req.params.title
        },(err)=>{
            if (!err) {
                res.send("Successfully deleted the selected article.");
            } else {
                res.send(err);
            }
        });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started.");
});
