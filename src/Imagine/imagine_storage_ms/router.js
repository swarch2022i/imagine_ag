import KoaRouter from 'koa-router';
import multer from '@koa/multer'
import axios from 'axios'
const FormData = require('form-data');
// const axios = require('axios').default;
import { url, port, entryPoint } from './server'
// const multer = require('@koa/multer');

const upload = multer({
  storage: multer.memoryStorage()
})

const routerStorage = new KoaRouter();

const URL = `http://${url}:${port}/${entryPoint}`

export default () => {
  routerStorage.get('/', function(ctx) {
    ctx.body = 'Hello Koa';
  })
  routerStorage.post('/', upload.array('images'), async(ctx) => {
    if (!ctx.files) {
      ctx.body = 'nada';
    } else {

      let formData = new FormData()
      for (const key in ctx.request.body) {
        formData.append(key, ctx.request.body[key])
      }
      formData.append('images', JSON.stringify(ctx.files))

      let response = await axios.post(`${URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (response.status === 200) {
        console.log(response.data)
        ctx.body = response.data;
      } else {
        ctx.body = response.data
      }
    }
  })
  return routerStorage.middleware()
}