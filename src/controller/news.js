const Mongoose = require('mongoose');
const News = require('../models/news');

/**
 * @swagger
 * /news/{id}:
 *    get:
 *      tags:
 *          - News
 *      summary: Get news information by ID
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            description: News id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Success
 */
const getNewsById = async ctx => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'Id property is required',
      };
      return;
    }
    const news = await News.findOne(new Mongoose.Types.ObjectId(id));
    ctx.status = 200;
    if (!news) {
      ctx.body = {
        code: 200,
        message: `No news found by id: ${id}`,
      };
      return;
    }
    ctx.body = {
      code: 200,
      message: 'Success',
      data: news,
    };
  } catch (error) {
    console.log(error);
    ctx.stats = 500;
  }
};

/**
 * @swagger
 * /news/author/{author}:
 *   get:
 *      tags:
 *          - News
 *      summary: Get news list by author
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: author
 *            description: Author of news
 *            in: path
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Success
 */
const getNewsByAuthor = async ctx => {
  try {
    const author = ctx.params.author;
    if (!author) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'Author property is required',
      };
      return;
    }
    const newsList = await News.find({ author }).sort({dateTime: -1});
    if (newsList) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Success',
        data: newsList,
      };
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
};

/**
 * @swagger
 * /news/latest/{type}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get latest news with type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: New type for want to get
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
const getLatestNewsList = async ctx => {
  try {
    let type = ctx.params.type;
    let now = new Date();
    now.setHours(now.getHours() - 5)
    let result = await News.find({type: type, dateTime: {$gte: now.getTime()}}).sort({dateTime: -1}).limit(20);
    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: 'Success',
      data: result
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
};

/**
 * @swagger
 * /news:
 *  post:
 *      tags:
 *          - News
 *      summary: Create new news
 *      produces:
 *          - application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#definitions/news"
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#definitions/apiResponse"
 */
const createNews = async ctx => {
  try {
    const { body } = ctx.request;
    ctx.status = 400;
    if (!body.author) {
      ctx.body = {
        code: 400,
        message: 'News author is required',
      };
      return;
    }
    if (!body.title) {
      ctx.body = {
        code: 400,
        message: 'News title is required',
      };
      return;
    }
    if (!body.dateTime) {
      ctx.body = {
        code: 400,
        message: 'News dateTime is required',
      };
      return;
    }
    if (!body.content) {
      ctx.body = {
        code: 400,
        message: 'News content is required',
      };
      return;
    }
    const newNews = new News(body);
    news = await newNews.save();
    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: 'Success',
      data: news,
    };
  } catch (error) {
    ctx.status = 500;
    console.log(error);
  }
};

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     tags:
 *       - News
 *     summary: Delete news by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: News id for delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *        description: Success
 * 
 */
const deleteNews = async ctx => {
  try {
    let id = ctx.params.id;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'Id field is required'
      }
      return;
    }
    let news = await News.findOne(new Mongoose.Types.ObjectId(id));
    if (news) {
      let result = await News.deleteOne({_id: new Mongoose.Types.ObjectId(id)});
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Success',
        data: result
      };
    } else {
      ctx.status = 406;
      ctx.body = {
        code: 406,
        message: `No news id: ${id}`,
      };
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
};

module.exports = {
  getNewsById,
  getNewsByAuthor,
  getLatestNewsList,
  createNews,
  deleteNews,
};
