/**
 * 解析数据，将歌词字符串数据转换成歌词对象数组
 * [
 *  {
 *      time:n(秒),
 *      content:''
 *  }
 * ]
 */
function parseContent(data) {
    const res = [];
    const strArr = data.split('\n');
    for (let i = 0; i < strArr.length - 1; i++) {
        const contentArr = strArr[i].split(']');
        res.push({
            time: parseTime(contentArr[0]),
            content: contentArr[1]
        })
    }
    console.log(res)
    return res;
}

/**
 * 解析时间
 * @param {*} timeStr 
 * @returns 
 */
function parseTime(timeStr) {
    timeStr = String(timeStr).substring(1)
    timeArr = timeStr.split(':');
    return +timeArr[0] * 60 + +timeArr[1];
}

const contentObjArr = parseContent(lrc)

const doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul')
}

/**
 * 找到当前活跃的歌词
 * 通过比较时间的方式
 */
function findIndex() {
    const time = doms.audio.currentTime;
    for (let i = 0; i < contentObjArr.length; i++) {
        if (time < contentObjArr[i].time) {
            return i - 1 == -1 ? 0 : i - 1;
        }
    }
    return contentObjArr.length - 1;
}

/**
 * 初始化歌词
 */
function init() {
    // 创建一个片段，往里面添加内容的时候，不会直接修改dom
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < contentObjArr.length; i++) {
        let li = document.createElement('li');
        li.textContent = contentObjArr[i].content;
        // 此处相当于改变了dom n次（contentObjArr.lengt），
        // 如果是数量特别庞大的时候，可能会有性能问题
        // doms.ul.appendChild(li)
        // 优化方式
        fragment.appendChild(li)
    }
    doms.ul.appendChild(fragment);
}
init();
const liHeight = document.querySelector('li').clientHeight;
const containerHeight = document.getElementById('container').clientHeight;
const mexScroll = liHeight * (contentObjArr.length) - containerHeight;
/**
 * 计算滚动的距离
 * 希望把歌词尽量显示在显示区中间
 * 边界：开头的歌词+结尾的歌词
 */
function offset() {

    const index = findIndex();
    console.log("here", index)
    // 当前歌词的高度
    let scrollHeight = liHeight * index - containerHeight / 2;
    if (scrollHeight < 0) {
        scrollHeight = 0;
    } else if (scrollHeight > mexScroll) {
        scrollHeight = mexScroll;
    }
    let li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active')
    }
    li = doms.ul.children[index];
    if (li) {
        li.classList.add('active')
    }
    doms.ul.style.transform = `translateY(-${scrollHeight}px)`
}


doms.audio.addEventListener('timeupdate', offset);



