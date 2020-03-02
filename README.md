# load
 carregador de primeiro nível de micro serviço

### tutoriais

```
https://www.tutorialspoint.com/nodejs/nodejs_net_module.htm
```

### iniciar:
```
npm start
```

### iniciar com pm2
```
pm2 start npm -- start
```

### configuração para nginx
```
location ~ ^/(WS)/(.+)$ {
  include /var/nginx/node_apps;
}
```
- arquivo _node_apps_
```
set $_1 "$1/$2";

if ($request_method ~ (OPTIONS|GET) ) {
  add_header 'Access-Control-Allow-Origin' "$http_origin";
  add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, PUT, OPTIONS';
  add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type, Type, Authorization';
}

if ($request_method = "OPTIONS") {
  return 204;
}

proxy_http_version 1.1;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $host;
proxy_set_header X-NginX-Proxy true;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_pass http://127.0.0.1:3000/$_1$is_args$args;
proxy_redirect off;
proxy_cache_bypass $http_upgrade;
```

### acrescentar em rc.local
```
cd ~/node_apps/dist/load; pm2 start --name apps npm -- start
```

### preparar merge develop
```
git status
git checkout develop

```