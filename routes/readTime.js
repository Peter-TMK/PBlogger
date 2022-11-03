const readTime = (post) => {
    const numWords = post.split(" ").length
    const wpm = numWords/200
    return Math.round(wpm) === 0 ? 1 : Math.round(wpm)
}
// console.log(Math.round(34.56))

module.exports = readTime;