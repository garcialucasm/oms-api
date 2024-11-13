<!-- TODO: improve this md file-->

``` bash
docker build -t oms-api .
docker run -d --name oms-api-container -p 3000:3000 oms-api
```