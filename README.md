# Honeycomb Ground Truth Coding

Internal tool for use by [Wildflower Schools](http://wildflowerschools.org) to code camera data. Interacts with Honeycomb to pull classroom information to code videos with Ground Truth.

### Development

* First configure .env file

#### Local
```
npm install
npm start
```

#### Docker
```
docker-compose down -v
docker-compose up --build
```

### Production

```
docker build . -t ground_truth_coding_prod
docker run --env-file ./.env -p 3000:80 ground_truth_coding_prod
```

## Commit tagged release

```
git tag -a v`date -u "+%Y-%m-%d-%H-%M-%S"` -m ""
git push origin `git describe --abbrev=0`
```