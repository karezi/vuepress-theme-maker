module.exports = {
  title: 'Karezi\'s Blog',
  description: '90年代出产古早INTJ型程序员',
  port: 8088,
  markdown: {
    lineNumbers: true,
    extractHeaders: [ 'h2', 'h3', 'h4' ],
    plugins: {
      'markdown-it-mark': true,
      'markdown-it-footnote': true,
      'markdown-it-abbr': true,
      'markdown-it-task-lists': true
    }
  },
  theme: require.resolve('../../index'), // 使用本地主题
  themeConfig: require('./config/themeConfig')
}