function stripHTML(str) {
  let htmlCopy = str.slice();
  let justText = htmlCopy.replace(/<[^>]*>/g, '');
  return justText;
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
