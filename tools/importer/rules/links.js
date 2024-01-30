export default (document, currentPage) => {
  // Matches if there are two or more hyphens
  const findExtraHyphens = /(\-{2,})/gm;
  // Explanation
  // 1st Capturing Group (\-{2,})
  // \- matches the character - with index 4510 (2D16 or 558)
  // literally (case sensitive)
  // {2,} matches the previous token between 2 and unlimited times,
  // as many times as possible, giving back as needed (greedy)

  document.querySelectorAll('a').forEach((a) => {
    let url;
    if (canParse(a)) { url = new URL(a); } else { url = new URL(a, 'https://helpx-internal.corp.adobe.com'); }

    if (!isInternalUrl(url)) return;

    const before = a.href;
    const p = url.pathname.startsWith('/content/help/en') ? '/content/help/en' : '/content/help';
    const after = url.pathname.replaceAll(findExtraHyphens, '-').replace(p, '');
    // assume any converted link should be relative
    a.href = after.slice(-5) === '.html' ? after.slice(0, -5) : after;

    console.info('LINK TRANSFORMATION: Replaced the link ', before, ' on the page ', transformCurrentPage(currentPage), ' with ', a.href);
  });
};

const isInternalUrl = (url) => url.pathname.includes('/content/help/')
  && url.hostname === 'localhost';

const canParse = (a) => {
  try {
    new URL(a);
    return true;
  } catch {
    return false;
  }
};

const transformCurrentPage = (s) => {
  const url = new URL(s);
  // assume that the first 6 characters will always
  // be: ?host=
  const hostname = convertHTMLEscape(url.search.slice(6));
  return `${hostname}${url.pathname}`;
};

const convertHTMLEscape = (s) => s.replaceAll('%3A', ':').replaceAll('%2F', '/');
