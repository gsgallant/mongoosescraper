#App can be seen at
- http://ggmongoosescraper.herokuapp.com/

#Screenshots:
<p align="center">
<span>
<img src="https://github.com/gsgallant/screenshots/blob/master/mongoosescraper/Screen%20Shot%202016-06-03%20at%2010.25.29%20PM.png" width="48%" height="auto"/>

</span>
</p>

#Technologies used:
HTML, CSS, JQuery, MongoDB, Mongoose, Cheerio


#Comments

This app uses Cheerio (NPM package) to scrape the TOP STORIES off of the CNN homepage.
It then stores the data using Mongoose as a model into the MongoDB (cloud Mongo at MongoLab (ML)).  The app also allows the user to add comment (notes) to articls and then saves the notes in MongoDB.  To refresh the articles, click the CNN logo.  Only articles with notes will be kept persistent and other articles may be replaced by any new TOP STORIES on the CNN site if there are changes.

<p align="center">
&copy; Greg Gallant
</p>

