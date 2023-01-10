const textElClasses = [
  'video-title',
  'video-description',
  'video-author',
  'video-website'
];

export default function createVideosEmbed(main, document) {

  // Youtube - AdobeTV
  main.querySelectorAll('.video').forEach((video) => {
    const vContainer = video.querySelector('.video-container');
    if (vContainer) {
      const iframe = vContainer.querySelector('iframe');
      if (iframe) {
        const link = document.createTextNode(iframe.src);
        // handle case where the iframe video url does not have the protocol set
        // (example: https://helpx-internal.corp.adobe.com/content/help/en/adobe-connect/using/meeting-basics.html)
        if (link.textContent.startsWith('//')) {
          link.textContent = 'https:' + link.textContent;
        }
          
        let cells = [
          ['helpx video'],
          ['url', link],
        ];
  
        textElClasses.forEach((textClass) => {
          const el = main.querySelector(`.${textClass}`);
          if (el && el.textContent !== '') {
            cells.push([textClass, el.textContent]);
          }
        });
  
        if (cells.length > 2) {
          // add a custom video block with metadata
          const table = WebImporter.DOMUtils.createTable(cells, document);
          video.insertAdjacentElement('beforebegin', table);
        } else {
          // just a video embed
          video.insertAdjacentElement('beforebegin', link);
        }

        // remove original video component
        video.remove();
      }
    }
  });

  // vidyard
  main.querySelectorAll('.vidyard-player-container').forEach((video) => {
    const iframe = video.querySelector('iframe');
    if (iframe) {
      let url = iframe.src;
      // handle case where the iframe video url does not have the protocol set
      // (example: https://helpx-internal.corp.adobe.com/content/help/en/adobe-connect/using/meeting-basics.html)
      if (url.startsWith('//')) {
        url = 'https:' + url;
      }

      let el = document.createElement('a');
      el.href = url;
      el.textContent = url;
    
      video.insertAdjacentElement('beforebegin', el);
    
      main.querySelectorAll('img').forEach((el) => { el.remove(); });

      // remove original video component
      video.remove();
  }
  });

  // Internal Videos - custom video service
  main.querySelectorAll('.video').forEach((video) => {
    const vContainer = video.querySelector('.videoContainer');
    if (vContainer) {
      const iframe = vContainer.querySelector('iframe');
      if (iframe && iframe.title === 'custom video service') {
        let url = iframe.src;
        // handle case where the iframe video url does not have the protocol set
        // (example: https://helpx-internal.corp.adobe.com/content/help/en/adobe-connect/using/meeting-basics.html)
        if (url.startsWith('//')) {
          url = 'https:' + url;
        }

        let el = document.createElement('a');
        el.href = url;
        el.textContent = url;
      
        video.insertAdjacentElement('beforebegin', el);
      
        main.querySelectorAll('img').forEach((el) => { el.remove(); });
  
        // remove original video component
        video.remove();
      }
    }
  });


}
