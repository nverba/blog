__Production checks:__

  - Remove browserify debug
  - re-enable uglify


__ToDo:__

  - Create index builder with image base64 conversion & embedding with above the fold css.
  - Add full path to permalink

  - index-service: 

      - initialises with page0 index

      - exposes current index page, from page indexes or search results

        - generates standard object - time - link - tags, for pages & search results

      - exposes previous/next functions

      - exposes previous/next state (for button disabled state)

      - Accepts tags for search/filter

      - Paginates search results

      - Reverts back to origin page when search is cancelled
