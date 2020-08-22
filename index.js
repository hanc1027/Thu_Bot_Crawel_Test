// 引入第三方套件
const request = require('request')
const cheerio = require('cheerio')
const { title } = require('process')

let newsWebList = [
{title: "東大新聞",url: "https://www.thu.edu.tw/web/news/news.php?cid=8"},
{ title: "榮譽榜", url: "https://www.thu.edu.tw/web/news/news.php?cid=9" },
{ title: "新聞影片", url: "https://www.thu.edu.tw/web/news/news.php?cid=18" },
    // {title:"東海人季刊",url:"http://cdc.thu.edu.tw/quarterly/web//news.php",
]


function getThuNews() {

    newsWebList.forEach((value, index) => {
        let news = []
        request({
            url: value.url,
            method: "GET"
        }, (error, response, body) => {
            if (error || !body) {
                return
            }

            const $ = cheerio.load(body); // 載入 body
            const newTitle = $(".row .clients-page .col-md-7 span")
            const newsDate = $(".row .clients-page .col-md-7 ul li .fa-calendar")
            const newsUnit = $(".row .clients-page .col-md-7 ul li .fa-briefcase")
            const newsMainPoint = $(".row .clients-page .col-md-7 ul")
            const newsUrl = $(".row .clients-page")

            let haveNews = false
            for (let i = 0; i < 2; i++) {
                let aNew = {
                    title: "",
                    date: "",
                    unit: "",
                    main_point: "",
                    url: ""
                }

                if (isTodayNews(newsDate[i].next.data)) {
                    let date = newsDate[i].next.data.split("\t")
                    aNew.date = date[6]

                    let main_point = newsMainPoint[i].next.data.split(" ")
                    let main_point2 = newsMainPoint[i].next.data.split("\n")
                    if(value.title == "新聞影片")aNew.main_point = main_point2[1]
                    else aNew.main_point = main_point[3]

                    aNew.unit = newsUnit[i].next.data
                    aNew.title = newTitle[i].children[0].data
                    aNew.url = newsUrl[i].parent.attribs.href

                    news.push(aNew)
                    haveNews = true
                }
            }
            if (!haveNews) console.log("今天沒有新聞")
        })
    })


}

function isTodayNews(newDate) {
    // 確認爬到的是今天的新聞，就不再爬了
    let date = newDate.split(" ")
    let today = new Date()
    let today_year = today.getFullYear(), today_month = today.getMonth() + 1, today_date = today.getDate()
    if (today_month < 10) today_month = `0${today_month}`
    return date[3] == `${today_year}-${today_month}-${today_date}`
}

getThuNews()