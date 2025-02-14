Franklin Sidekick
===

## Configure the Milo `Library` plugin

When editing a document, the library plugin exposes a list of samples of Blocks that authors can copy-paste directly into the documents (without having to deal with table manipulation)

https://user-images.githubusercontent.com/40354404/212114068-f222cb75-d1c8-403f-9708-7c0a21ba816b.webm

### 1. Sidekick code configuration in project

Added file
* [`tools/sidekick/config.json`](../tools/sidekick/config.json)

This will add the library button in the sidekick with all Milo blocks available by default

Commit these files and push the changes to the repository

### 2. Add custom blocks

1. In the sharepoint root, create folder structure `docs/library/blocks`



2. In `docs/library/blocks`, create a document for each of your custom block, here `note.docx`



3. In `docs/library/blocks/note.docx` add all the variations of the note block you want to expose to the authors  

   Here,
   ```
    +------------------------------------+
    | Note                               |
    +------------------------------------+
    | This is the text for a simple note |
    +------------------------------------+

    +---------------------------------------------+
    | Note (caution)                              |
    +---------------------------------------------+
    | This is the text for a caution/warning note |
    +---------------------------------------------+

    +------------------------------------------+
    | Note (alert)                             |
    +------------------------------------------+
    | This is the text for an alert/error note |
    +------------------------------------------+
   ```



4. Preview `note.docx`



5. Create `docs/library/library.xlsx` spreadsheet

   with following content

   ```
    +---------------------------------------------------------------------------------+
    | Name | path                                                                     |
    +---------------------------------------------------------------------------------+
    | Note | https://main--helpx-internal--adobecom.aem.page/docs/library/blocks/note |
    +---------------------------------------------------------------------------------+
   ```

   Rename the sheet `helix-blocks`



6. In `library.xlsx` create another sheet and name it `helix-placeholders`

   This sheet will not be used for the library but we need the spreadsheet to be a multi-sheet document so the json structure is compliant with the Library plugin



7. Preview and Publish `docs/library/library.xlsx`

   This will expose `https://main--helpx-internal--adobecom.aem.live/docs/library/library.json`

   The Library plugin will automatically load that json and know where to pick the samples for your custom blocks



8. Add CORS header to allow the Library plugin to fetch `library.json`

   From Sharepoint project root, create `.helix/headers.xlsx` spreadsheet with followin content  

   ```
    +-----------------------------------+
    | URL | access-control-allow-origin |
    +-----------------------------------+
    | /** | https://milo.adobe.com      |
    +-----------------------------------+
   ```

   Preview `headers.xlsx` (this will add the `access-control-allow-origin` header to all url requests)



9. If you are testing this feature in a branch, modify your Sidekick configuration (in your browser) and use  
   `https://github.com/adobecom/helpx-internal/tree/<YOUR_BRANCH_NAME>`

   (in case you did not install it yet, check https://www.aem.live/docs/sidekick)



10. Test it! Create (or open) a document, load the Sidekick, click the `Library` button

    In the bottom left dialog, click `Blocks`

    In the list, you should have a `Note` accordion item which contains the 3 variants mentioned above

    Copy-paste one of them in your document



> From this point, to add new samples to your library, add/modify sample documents `docs/library/blocks` and adapt the path list in `docs/library/library.xlsx`



### Appendix

* The Milo `Library` plugin uses convention for looking up at your custom blocks samples, it needs following URLs to exist:
  * `https://main--helpx-internal--adobecom.aem.live/docs/library/library.json`, the list of samples you want to expose
  * `https://main--helpx-internal--adobecom.aem.live/docs/library/blocks/<ONE_PER_CUSTOM_BLOCK_SAMPLE>.plain.html`, `.plain.html` is the, well, plain HTML rendition of a published document, it is used by the plugin to build the "Word block" to paste into your document

* The CORS header is needed because the content of the bottom left dialog is loaded in a iframe with a different origin, milo.adobe.com as origin. And the fetching of `library.json` and the custom blocks samples are done from this iframe.
