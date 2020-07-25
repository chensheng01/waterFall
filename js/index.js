let pblModule = (function () {
    let data = null;
    let $columns = $('.column');
    let $lazyImgBox = null;
    let $img = null;


    //获取数据
    let getData = function () {
        $.ajax({
            url: '../json/data.json',
            method: 'get',
            dataType: 'json',
            async: false,
            success: result => {
                data = result;

            }
        })

    }

    //绑定数据
    let bindHtml = function () {
        data = data.map(item => {
            /*  let height = item.height;
             let width = item.width;
             height = 230 / width * height;
             item.height = height;
             item.width = 230;
             return item */
            h = (230 / item.width) * item.height;
            item.width = 230;
            item.height = h;
            return item
        })


        //0 1 2  3 4 5
        for (let i = 0; i < data.length; i += 5) {
            //if (!i == 0) break
            let group = data.slice(i, i + 5);

            if (i != 0) {
                group.sort((a, b) => {
                    return a.height - b.height;
                });

                $columns.sort((a, b) => {
                    return b.offsetHeight - a.offsetHeight
                })
            }
            group.forEach((item, index) => {
                let str = ` <div class="card">
                    <a href="${item.link}">
                        <div class="lazyImgBox" style = 'height:${item.height}px'>
                            <img src="" alt="" data-img ='${item.pic}'>
                        </div>
                        <p> ${item.title}
                        </p>
                    </a>
                </div>`
                $columns.eq(index).append(str)
            })
        }



    }
    //懒加载图片
    //在没有给图片赋地址之前，获取图片的高度是0

    let lazyImg = function () {
        $lazyImgBox = $('.container .lazyImgBox');
        let H = document.documentElement.clientHeight + document.documentElement.scrollTop;
        $lazyImgBox.each((index, item) => {
            let T = $(item).offset().top,
                t = $(item).outerHeight();
            if (T + t / 2 < H) {
                let $img = $(item).find('img');
                $img[0].src = $img[0].getAttribute('data-img');
                $img.on('load', function () {
                    $img.css('opacity', 1)
                })
            }

        })
    }

    let loadMore = function () {
        //距离半屏的时候加载更多
        //一屏的高度+卷去的高度 = 整个网页的高度 说明加载到底了
        let H = document.documentElement.clientHeight + document.documentElement.scrollTop;
        let L = H + document.documentElement.clientHeight / 3;
        let M = document.documentElement.scrollHeight;
        if (L >= M) {
            console.log(1);
            getData();
            bindHtml();
            lazyImg();
        }
    }

    return {
        init() {
            getData();
            bindHtml();
            lazyImg();
            window.onscroll = function () {
                lazyImg();
                loadMore()
            }
        }
    }
})()
pblModule.init()