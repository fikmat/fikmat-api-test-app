## FIKMAT API Test App

This app should help you develop your Fikmat game, you can test controlling components via Fikmat API on your local machine.

- download & run the executable
- go to [localhost:8020](http://localhost:8020)
- test with curl, web page should react to your request
```
curl -d "{ \"led_left\": [[255,0,0],[0,255,0],[0,0,255]],
           \"led_right\": [[255,0,0],[0,255,0],[0,0,255]],
           \"vibrate\": 99 }" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:8020/api
```
