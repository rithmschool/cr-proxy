const { stripHTML, getHeaderImg } = require("../../helpers/htmlParsers");

describe("stripHTML()", () => {
  it("should strip all html tags out of a string", function () {
    const testHTML = `
      <p class="lede">Our mission is to ensure the Internet is a global public resource, open and accessible to all. An Internet that truly puts people first, where individuals can shape their own experience and are empowered, safe and independent.</p>
      <p>At Mozilla, we’re a global community of technologists, thinkers and builders working together to keep the Internet alive and accessible, so people worldwide can be informed contributors and creators of the Web.
      We believe this act of human collaboration across an open platform is essential to individual growth and our collective future.</p>
      <p>Read the <a href="/en-US/about/manifesto/">Mozilla Manifesto</a> to learn even more about the values and principles that guide the pursuit of our mission.</p>`;

    const text = stripHTML(testHTML);

    expect(text).toEqual(`
      Our mission is to ensure the Internet is a global public resource, open and accessible to all. An Internet that truly puts people first, where individuals can shape their own experience and are empowered, safe and independent.
      At Mozilla, we’re a global community of technologists, thinkers and builders working together to keep the Internet alive and accessible, so people worldwide can be informed contributors and creators of the Web.
      We believe this act of human collaboration across an open platform is essential to individual growth and our collective future.
      Read the Mozilla Manifesto to learn even more about the values and principles that guide the pursuit of our mission.`);

    const textHTML2 = `<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\">\n<html><body>\n<p><img alt=\"\" data-rich-file-id=\"4845\" src=\"https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4845/original/learning-blockchain-infographic.png\"></p>\r\n\r\n<p><strong>So you’ve probably heard that Blockchain is taking over the world, but <a href=\"https://www.coursereport.com/blog/getting-started-blockchain-bootcamps\" rel=\"follow\" target=\"_blank\">what is Blockchain?</a> And how can you become a Blockchain developer? In this guide we look at the definition of blockchain, the growth of the blockchain industry, what sort of jobs exist in blockchain, how much you can earn on a blockchain salary, and which skills you’ll learn to become a blockchain developer. Plus, our picks for the best blockchain bootcamps, and coding bootcamps which cover blockchain in their curriculum.</strong></p>\r\n\r\n<h3><strong>What is Blockchain Development?</strong></h3>\r\n\r\n<p><a href=\"https://www.coursereport.com/blog/blockchain-a-primer-with-hack-reactor\" rel=\"follow\" target=\"_blank\">A blockchain is a distributed ledger system</a> with immutable data add-only functionality. Essentially, blockchain is a digitized, decentralized, and trustless database.`;

    const stripped2 = stripHTML(textHTML2);

    expect(stripped2).toEqual(`\n\n\r\n\r\nSo you’ve probably heard that Blockchain is taking over the world, but what is Blockchain? And how can you become a Blockchain developer? In this guide we look at the definition of blockchain, the growth of the blockchain industry, what sort of jobs exist in blockchain, how much you can earn on a blockchain salary, and which skills you’ll learn to become a blockchain developer. Plus, our picks for the best blockchain bootcamps, and coding bootcamps which cover blockchain in their curriculum.\r\n\r\nWhat is Blockchain Development?\r\n\r\nA blockchain is a distributed ledger system with immutable data add-only functionality. Essentially, blockchain is a digitized, decentralized, and trustless database.`)
  });
});

describe("getHeaderImg()", () => {
  it("should return the header image from the blog post html string", function () {

    const blogHTML = `<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\">\n<html><body>\n<p><img alt=\"\" data-rich-file-id=\"4845\" src=\"https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4845/original/learning-blockchain-infographic.png\"></p>\r\n\r\n<p><strong>So you’ve probably heard that Blockchain is taking over the world, but <a href=\"https://www.coursereport.com/blog/getting-started-blockchain-bootcamps\" rel=\"follow\" target=\"_blank\">what is Blockchain?</a> And how can you become a Blockchain developer? In this guide we look at the definition of blockchain, the growth of the blockchain industry, what sort of jobs exist in blockchain, how much you can earn on a blockchain salary, and which skills you’ll learn to become a blockchain developer. Plus, our picks for the best blockchain bootcamps, and coding bootcamps which cover blockchain in their curriculum.</strong></p>\r\n\r\n<h3><strong>What is Blockchain Development?</strong></h3>\r\n\r\n<p><a href=\"https://www.coursereport.com/blog/blockchain-a-primer-with-hack-reactor\" rel=\"follow\" target=\"_blank\">A blockchain is a distributed ledger system</a> with immutable data add-only functionality. Essentially, blockchain is a digitized, decentralized, and trustless database.`;

    const header_url = getHeaderImg(blogHTML);

    expect(header_url).toEqual('https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4845/original/learning-blockchain-infographic.png');

    const blogHTML2 = `<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\">\n<html><body>\n<p><img alt=\"\" data-rich-file-id=\"4832\" src=\"https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4832/original/learning-to-code-husband-wife-learningfuze.png\"></p>\r\n\r\n<p><strong>What’s it like to go through coding bootcamp with your spouse? A few months after their wedding in 2017, Brian and Alicia Evans enrolled at <a href=\"https://www.coursereport.com/schools/learningfuze\" rel=\"follow\">LearningFuze</a> in Orange County to learn to code together! With Alicia’s background in publishing and nonprofit work, and Brian’s background in music and data management, they came in with very different skill sets, but both ended up loving it and found great jobs. The pair </strong><strong>tell</strong><strong> us about the ups and downs of going through such an intense program with your partner, how they bonded with their <a href=\"https://learningfuze.com/`

    const header_url2 = getHeaderImg(blogHTML2);

    expect(header_url2).toEqual('https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4832/original/learning-to-code-husband-wife-learningfuze.png')
  });
});