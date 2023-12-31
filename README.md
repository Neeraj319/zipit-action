# zipit

Github action that zips your source code and uploads it to remote server via HTTP.

## Example Usage
```
name: test
on: 
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run zipit action
        uses: Neeraj319/zipit-action@main # use the latest tag
        with:
          zip-file-name: "test.zip"
          username: ${{ secrets.SERVER_USERNAME }}
          password: ${{ secrets.SERVER_PASSWORD }}
          url: ${{ secrets.UPLOAD_ENDPOINT }}
          upload-file-filed-name: "file"
          query-params: "folder_name=test"
```


- Args that can be used:
```yaml
inputs:
  zip-file-name:
    required: true
    description: "name of zip file to be pushed"
  username:
    required: true
    description: "http basic auth username"
  password:
    required: true
    description: "http basic auth password"
  url:
    required: true
    description: "url endpoint to upload file"
  upload-file-filed-name:
    required: true
    description: "form field name when upload file"
  query-params:
    required: false
    description: "query params to be sent"
```
