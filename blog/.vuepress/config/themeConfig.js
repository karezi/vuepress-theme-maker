module.exports = {
  siteName: 'Karezi\'s Blog',
  logo: '/logo.jpg',
  siteDesc: '90年代出产古早INTJ型程序员',
  nav: [
    { text: '🏠 Home', link: '/' },
    { text: '📖 Cheatsheet', link: '/categories/cheatsheet/' },
    { text: '🔥 Tutorial', link: '/categories/tutorial/' },
    { text: '🐉 Bug', link: '/categories/bug/' },
    // { text: '📽 Old Time', link: '/categories/oldtime/' },
    // { text: '🔗 friend-links', link: '/friend-links/' },
  ],
  searchPlaceholder: 'Search',
  searchMaxSuggestions: 10,
  social: [
    {
      type: 'email',
      link: 'karezi@163.com'
    },
    {
      type: 'github',
      link: 'karezi'
    },
    // {
    //   type: 'qq',
    //   link: '//qm.qq.com/cgi-bin/qm/qr?k=fknyQ434nkzVUWUmJ6rpIPctkS9eyQaZ&jump_from=webapi'
    // },
    {
      type: 'feed',
      link: '/rss.xml'
    }
  ],
  copyright: '© 2022 ❤️ <a target="_blank" href="https://karezi.cn/">Karezi</a>',
  blog: {
    directories: [
      {
        id: 'post',
        dirname: '_post',
        path: '/',
        itemPermalink: '/post/:year/:month/:day/:slug.html',
        frontmatter: { title: '' },
        pagination: {
          perPagePosts: 10,
          prevText: '',
          nextText: ''
        },
      }
    ],
    frontmatters: [
      {
        id: "tag",
        keys: ['tag', 'tags'],
        path: '/tags/',
        frontmatter: { title: 'Tag' },
        pagination: {
          lengthPerPage: 10,
          prevText: '',
          nextText: ''
        }
      },
      {
        id: "category",
        keys: ['category', 'categories'],
        path: '/categories/',
        frontmatter: { title: 'Category' },
        pagination: {
          lengthPerPage: 10,
          prevText: '',
          nextText: ''
        }
      }
    ],
    sitemap: {
      hostname: 'https://karezi.cn',
      exclude: ['/404.html']
    },
    feed: {
      canonical_base: 'http://karezi.cn',
    },
    palette: {},
    comment: {}
  }
}