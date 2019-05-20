# skincare

> Web scrap [EWG](https://www.ewg.org/skindeep/) to find out about ingredient safety and hazard ratings for various skincare products and toiletries.

## Getting started

1. Install dependancies

    ```sh
    npm i
    ```
1. Query EWG

    ```sh
    node ewg.js -n "{NAME OF PRODUCT}" -b "{BRAND OF PRODUCT}" -c "{TYPE OF PRODUCT}" -i "{COMMA SEPARATED INGREDIENT LIST}"
    ```
