const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', ejs);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res) {
    res.redirect("/articles");
});

///////// ALL ARTICLES ///////////

app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res) {
        const createArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        createArticle.save(function(err) {
            if (!err) {
                res.send("Created new article.");
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (!err) {
                res.send("Deleted all articles.")
            }
        });
    });

///////// SPECIFIC ARTICLES ///////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function(err, foundArticle) {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticle);
            }
        });
    })
    .put(function(req, res) {
        Article.update({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            function(err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })
    .patch(function(req, res) {
        Article.update({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function(err) {
                if (!err) {
                    res.send("Updated article succesfully.");
                } else {
                    res.send(err);
                }
            })
    })
    .delete(function(req, res) {
        Article.deleteOne({
            title: req.params.articleTitle
        }, function(err) {
            if (!err) {
                res.send("Deleted article");
            } else {
                res.send(err);
            }
        })
    });


app.listen(3000, function() {
    console.log("Server started on port 3000");
});
