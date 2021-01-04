# PngShare
A Pinterest imitation 

In order to have the platform working we need to make sure that the infrastructure of the Database and the file storring is correctly setup

    1) The database need to be imported through the SQL querry in the ./db folder and needs to have the same name as the file: png_share
    ```
    ./db/png_share.sql
    ```

    2) A folder needs to be created in to store all the pictures the users upload:
    
    For windows:
    ```
    C:\png_share_data\
    ```

    For linux:
    ```
    /png_share_data
    ```

    3) A default.png images needs to be in the /png_share_data folder
    ```
    C:\png_share_data\default.png
    ```
    ```
    /png_share_data/default.png
    ```