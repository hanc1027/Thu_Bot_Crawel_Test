// 引入第三方套件
const request = require('request')
const cheerio = require('cheerio')

function getDcard(url){
    request({
        url: url,
        method: "GET"
    }, (error, response, body) => {
        if (error || !body) {
            return
        }

        const $ = cheerio.load(body); // 載入 body
        const newTitle = $(".row .clients-page .col-md-7 span")
    })
}

getDcard("https://www.dcard.tw/f/thu?latest=true")