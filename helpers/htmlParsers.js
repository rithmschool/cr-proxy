function stripHTML(str) {
  let htmlCopy = str.slice();
  let justText = htmlCopy.replace(/<[^>]*>/g, '');
  // lets trim escape characters off the front only
  let trimmedHead = justText.replace(/^\s+/, '');
  // now let's remove all \t
  const finalText = trimmedHead.replace(/\t/g, '');
  return finalText;
}

function getHeaderImg(str) {
  let htmlCopy = str.slice();
  let image_url = '';

  //find first image link
  let match = htmlCopy.match(/<img[^>]*src="([^"]*)">/);
  if (match !== null) {
    image_url = match[1];
  }

  return image_url;
}

module.exports = {
  stripHTML,
  getHeaderImg
}
