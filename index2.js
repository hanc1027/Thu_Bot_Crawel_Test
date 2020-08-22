const request = require('request')
const cheerio = require('cheerio')

const bus_search = () => {
    request({
        url: "http://bus.service.thu.edu.tw",
        method: "GET"
    }, (error, response, body) => {
        if (error || !body) {
            return
        }

        const $ = cheerio.load(body); // 載入 body
        const panelHeading = $(".panel-heading").children();
        const panelBody = $(".panel-body").children()

        let up_route = {
            title: "",
            sopts: [],
            url: ""
        }, down_route = {
            title: "",
            sopts: [],
            url: ""
        }
        // 上行
        up_route.title = panelHeading[0].prev.data + panelHeading[0].next.data

        for (var i = 1; i < panelBody[0].children.length - 1; i++) {
            up_route.sopts.push(panelBody[0].children[i].children[0].data);
        }
        up_route.url = panelBody[1].attribs.href

        //下行
        down_route.title = panelHeading[1].prev.data + panelHeading[1].next.data
        for (var i = 1; i < panelBody[2].children.length - 1; i++) {
            down_route.sopts.push(panelBody[2].children[i].children[0].data);
        }
        down_route.url = panelBody[3].attribs.href

        console.log(up_route)
        console.log(down_route)

    });
};



function time_query() {
    request({
        url: "http://bus.service.thu.edu.tw/timetable/3/zh_TW",
        method: "GET"
    }, (error, response, body) => {
        if (error || !body) {
            return
        }

        const $ = cheerio.load(body); // 載入 body
        const panelTitle = $(".table-striped tr");
        let bus_schedule = ['#編號\t發車時間\t\t#編號\t發車時間']
        for (let i = 1; i < panelTitle.length; i++) { // 走訪 tr
            const table_td = panelTitle.eq(i).find('td'); // 擷取每個欄位(td)
            const no1 = table_td.eq(0).text();
            const time1 = table_td.eq(1).text();
            const no2 = table_td.eq(2).text();
            const time2 = table_td.eq(3).text();
            bus_schedule.push(`${no1}\t${time1}\t\t${no2}\t${time2}`)
        }
        console.log(bus_schedule)
    })
}

function activity_query() {
    let baseurl = "https://tevent.thu.edu.tw/tEvent_front/"
    request({
        url: `${baseurl}index.php`,
        method: "GET"
    }, (error, response, body) => {
        if (error || !body) {
            return
        }
        const $ = cheerio.load(body); // 載入 body
/*
        const breadcrumb = $(".breadcrumb li");

        // 現在進行的活動
        let going_event = {
            title: "",
            href: ""
        }
        going_event.href = breadcrumb[1].children[0].attribs.href
        going_event.title = breadcrumb[1].children[0].children[0].data

        // console.log(going_event)
        //*/

        /*
        const categoryComponents = $(".nav--filter li a");
        let event_categories = []
        for (let index = 2; index < 7; index++) {
            event_categories.push({
                title:categoryComponents[index].children[0].data,
                url:categoryComponents[index].attribs.href
            })
        }
        console.log(event_categories)
        //*/

        //*
        const eventListComponents = $(".event-list .row .col-sm-12")
        console.log(typeof eventListComponents)
        const eventListComponentsTitle = $(".event-list .row .col-sm-12 h3 a")
        const eventListComponentsDate = $(".event-list .row .col-sm-12 h5")
        const eventListComponentsContent = $(".event-list .row .col-sm-12 p abbr")

        let eventsList = []
        let event = {
            title: "",
            date: "",
            url: "",
            main_point: "",
            content: ""
        }

        for (let index = 0; index < eventListComponents.length; index++) {

            event.url = baseurl + eventListComponentsTitle[index].attribs.href

            event.title = eventListComponentsTitle[index].children[0].data

            event.date = eventListComponentsDate[index].children[0].data

            event.content = eventListComponentsContent[index].attribs.title

            event.main_point = event.content.substr(0, 49) + '......'

            eventsList.push(event)
            event = {}
        }
        // console.log(eventsList)
        /*/

        const pagesComponents = $(".pagination li a")
        let pages = []

        for (let index = 0; index < pagesComponents.length - 1; index++) {
            pages.push({
                url: pagesComponents[index].attribs.href,
                index: pagesComponents[index].children[0].data
            })
        }
        // console.log(pages)
        //*/
    })
}

// bus_search();
// time_query();
activity_query()


// 每半小時爬一次資料
// setInterval(bus_search, 30 * 60 * 1000);

function crawl_Data(source_url,dom_param){
    request({
        url: source_url,
        method: "GET"
    }, (error, response, body) => {
        if (error || !body) {
            return
        }

        const $ = cheerio.load(body); // 載入 body
        const breadcrumb = $(dom_param);
        console.log(breadcrumb)
    })
}

// crawl_Data('https://tevent.thu.edu.tw/tEvent_front/index.php','.pagination li a')