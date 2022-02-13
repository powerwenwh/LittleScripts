const puppeteer = require('puppeteer');

//睡眠
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (p = 0; p < 1; p++) {
        //获取一页
        if (p===0) {
            await page.goto('http://www.gzcourt.gov.cn/wtzj/sxwt/yzjg/index.html');
            console.log('正在爬取：'+'http://www.gzcourt.gov.cn/wtzj/sxwt/yzjg/index.html');
        } else {
            await page.goto('http://www.gzcourt.gov.cn/wtzj/sxwt/yzjg/index'+p+'.html');
            console.log('正在爬取：'+'http://www.gzcourt.gov.cn/wtzj/sxwt/yzjg/index'+p+'.html');
        }

        //注释用
        //page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

        //选择一页中的所有链接和标题存到二维数组
        // Get the "viewport" of the page, as reported by the page.
        const links = await page.evaluate(() => {
            //console.log(document.querySelectorAll('.news_list'));
            const new_list = document.querySelectorAll('.news_list li')
            const links = []
            for (const i of new_list) {
                const a = i.getElementsByTagName('a')[0]
                links.push([a.href, a.innerText])//.innerText获取标题
            }
            return links
        });



        for (const i of links) {
            //获取数据页面
            await page.goto(i[0], {
                waitUntil: 'networkidle2',//等待网页加载完毕
            });
            //css去掉不需要的元素
            await page.addStyleTag({
                content: `.top_new {
        display: none;
    }
    .nav {
        display: none;
    }
    .position {
        display: none;
    }
    .yqLink2 {
        display: none;
    }
    .xg_link {
        display: none;
    }
    p {
        display: none;
    }
    .bottom {
        display: none;
    }`,
            })
            //根据内容设定页面长度
            let height = await page.evaluate(
                () => document.documentElement.offsetHeight
            );

            //转换为PDF
            await page.pdf({
                path: i[1] + ".pdf",
                printBackground: true,
                margin: "none",
                height: height + "px"
            });

            await sleep(10000);
        }
        //await page.pdf({ path: 'hn.pdf', format: 'a4' });
        
    }
    await browser.close();
})();