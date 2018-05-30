yy=${1}
curl "localhost:3050/api/korea/league/update/20${yy}/kleague"
curl "localhost:3050/api/korea/league/update/20${yy}/kleague2"
#curl "localhost:3050/api/korea/cup/update/20${yy}"
curl "localhost:3050/api/korea/assemble/20${yy}"
curl "localhost:3050/api/cup/fetch/20${yy}"
curl "localhost:3050/api/korea/assemble/20${yy}"
#curl "localhost:3050/api/league/update/20${yy}?leagues=K-League-1_K-League-2"
