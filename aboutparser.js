function getAbout(str) {
  let about = str.slice();
  let aboutText = about.replace(/<[^>]*>/g, '');
  return aboutText;
}

module.exports = {
  getAbout
}
