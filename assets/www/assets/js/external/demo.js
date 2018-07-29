var _cdObj = _cdObj || {};

_cdObj.cf = {
  resetGoogle: (fileName, userName) => {
    document.title = fileName;
    document.getElementsByClassName('ndfHFb-c4YZDc-Wrql6b')[0].style.display = "none";
    document.getElementsByClassName('ndfHFb-c4YZDc-GSQQnc-LgbsSe')[0].style.display = "none";
    document.getElementsByClassName('ndfHFb-c4YZDc-K9a4Re')[0].insertAdjacentHTML('afterbegin', '<div class="watermark_bg"><div class="watermark_title">[' + userName + ']</div></div>');
  },
}