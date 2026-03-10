// Example usage of website-beian-checker skill

// Example 1: Check a single website
const singleCheck = {
  websites: [{
    url: "https://www.example.com",
    expectedName: "示例网站",
    filingNumber: "京ICP备12345678号"
  }]
};

// Example 2: Check multiple websites
const multipleChecks = {
  websites: [
    {
      url: "https://www.site1.com",
      expectedName: "网站一",
      filingNumber: "京ICP备11111111号"
    },
    {
      url: "https://www.site2.com",
      expectedName: "网站二",
      filingNumber: "沪ICP备22222222号"
    },
    {
      url: "https://www.site3.com",
      expectedName: "网站三",
      filingNumber: "粤ICP备33333333号"
    }
  ]
};

// Example 3: Force CSV output even for < 20 websites
const csvOutputExample = {
  websites: [
    {
      url: "https://www.site1.com",
      expectedName: "网站一",
      filingNumber: "京ICP备11111111号"
    },
    {
      url: "https://www.site2.com",
      expectedName: "网站二",
      filingNumber: "沪ICP备22222222号"
    }
  ],
  outputCsv: true
};

// Example 4: Large batch (will auto-generate CSV)
const largeBatch = {
  websites: Array.from({ length: 25 }, (_, i) => ({
    url: `https://www.site${i + 1}.com`,
    expectedName: `网站${i + 1}`,
    filingNumber: `京ICP备${(11111111 + i).toString().padStart(8, '0')}号`
  }))
};

// Example 5: Website with suffix filing numbers
const suffixExample = {
  websites: [
    {
      url: "https://www.mainsite.com",
      expectedName: "主站",
      filingNumber: "京ICP备12345678号" // Main filing number
    },
    {
      url: "https://sub1.mainsite.com",
      expectedName: "子站一",
      filingNumber: "京ICP备12345678号-1" // Website filing number with suffix
    },
    {
      url: "https://sub2.mainsite.com",
      expectedName: "子站二",
      filingNumber: "京ICP备12345678号-2" // Website filing number with suffix
    }
  ]
};

export {
  singleCheck,
  multipleChecks,
  csvOutputExample,
  largeBatch,
  suffixExample
};
